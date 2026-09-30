#!/usr/bin/env node
/**
 * Pre-commit RN footgun scanner. Flags known-bad patterns on added lines of staged
 * .ts/.tsx/.js/.jsx files.
 *
 * Usage: node scripts/check-rn-footguns.js [--strict] [file...]
 *   --strict  treat warnings as failures
 *   file...   scan whole files instead of the staged diff
 */

const { execSync } = require('child_process');
const fs = require('fs');

const STRICT = process.argv.includes('--strict');
const CLI_FILES = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const DOC = {
  workletRules: 'CLAUDE.md > React Native Rules',
  leakedRender: 'CLAUDE.md > React Native Rules',
  touchable: 'CLAUDE.md > React Native Rules',
  nativeStack: 'CLAUDE.md > React Native Rules',
  lists: 'CLAUDE.md > React Native Rules',
};

const errors = [];
const warnings = [];

function getStagedFiles() {
  const out = execSync('git diff --cached --name-only --diff-filter=ACMR', { encoding: 'utf8' });
  return out
    .trim()
    .split('\n')
    .filter((f) => f && /\.(tsx?|jsx?)$/.test(f));
}

function getAddedLines(file) {
  let diff;
  try {
    diff = execSync(`git diff --cached -U0 -- "${file.replace(/"/g, '\\"')}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch {
    return [];
  }

  if (!diff.trim()) {
    return [];
  }

  const added = [];
  let newLine = 0;

  for (const raw of diff.split('\n')) {
    if (raw.startsWith('@@')) {
      const match = raw.match(/\+(\d+)(?:,(\d+))?/);
      if (match) {
        newLine = parseInt(match[1], 10);
        if (match[2] === '0') {
          newLine = 0;
        }
      }
      continue;
    }

    if (raw.startsWith('+++') || raw.startsWith('---')) {
      continue;
    }

    if (raw.startsWith('+')) {
      if (newLine > 0) {
        added.push({ lineNum: newLine, content: raw.slice(1) });
      }
      newLine += 1;
      continue;
    }

    if (raw.startsWith('-')) {
      continue;
    }

    if (raw.startsWith(' ')) {
      newLine += 1;
    }
  }

  return added;
}

function flag(severity, file, lineNum, ruleId, message, doc) {
  const entry = { file, lineNum, ruleId, message, doc };
  if (severity === 'error') {
    errors.push(entry);
  } else {
    warnings.push(entry);
  }
}

function isTypeOnlyImport(line) {
  return /^\s*import\s+type\b/.test(line);
}

function isBooleanGuardIdent(ident) {
  const base = ident.split('.').pop() ?? ident;
  if (/^(is|has|show|can|should|will|did)[A-Z_]/i.test(base)) {
    return true;
  }
  if (/^(open|visible|enabled|disabled|loading|active|selected|pressed)$/i.test(base)) {
    return true;
  }
  return /(Visible|Open|Enabled|Loading|Active|Selected|Pressed)$/.test(base);
}

function checkLeakedRender(file, lineNum, line) {
  if (/\{\s*!!/.test(line) || /\?\s*[^:]+\s*:\s*null/.test(line)) {
    return;
  }

  if (!/\{\s*[a-zA-Z_$][\w.$]*\s*&&\s*</.test(line)) {
    return;
  }

  const highRisk =
    /\{\s*\w+\.length\s*&&\s*</.test(line) ||
    /\{\s*\w+[Cc]ount\s*&&\s*</.test(line) ||
    /\{\s*(count|total|index|size|amount|num|qty|quantity|offset|page|step|rating|unread|badge)\s*&&\s*</i.test(
      line,
    );

  if (highRisk) {
    flag(
      'error',
      file,
      lineNum,
      'jsx-leaked-render',
      'Use `count > 0 ? … : null` or `!!` — 0 / empty length renders outside <Text> and crashes',
      DOC.leakedRender,
    );
    return;
  }

  const identMatch = line.match(/\{\s*([a-zA-Z_$][\w.$]*)\s*&&\s*</);
  const ident = identMatch?.[1];
  if (!ident || isBooleanGuardIdent(ident)) {
    return;
  }

  const stringLike =
    /(name|title|text|label|message|query|search|error|description|subtitle|caption|body|value|string|slug|url|uri|token)$/i.test(
      ident.split('.').pop() ?? ident,
    );

  if (stringLike) {
    flag(
      'warn',
      file,
      lineNum,
      'jsx-leaked-render-string',
      'Empty string in `{value && <…>}` can leak — prefer ternary or `!!value`',
      DOC.leakedRender,
    );
  }
}

function checkFile(file, addedLines) {
  if (!addedLines.length) {
    return;
  }

  const addedText = addedLines.map((l) => l.content).join('\n');
  const normalized = file.replace(/\\/g, '/');

  // Skip tests and this script itself (its rule regexes would flag their own source).
  if (
    /\.(test|spec)\.(tsx?|jsx?)$/.test(normalized) ||
    normalized === 'scripts/check-rn-footguns.js'
  ) {
    return;
  }

  for (const { lineNum, content: line } of addedLines) {
    if (/scheduleOnRN\s*\(\s*(\(|function\b)/.test(line)) {
      flag(
        'error',
        file,
        lineNum,
        'scheduleOnRN-inline-fn',
        'Do not pass inline functions to scheduleOnRN — use a stable JS reference',
        DOC.workletRules,
      );
    }

    if (/runOnJS\s*\(/.test(line)) {
      flag(
        'error',
        file,
        lineNum,
        'runOnJS-deprecated',
        'runOnJS is deprecated — use scheduleOnRN',
        DOC.workletRules,
      );
    }

    if (/\bsetTimeout\s*\(/.test(line) && /withTiming|withSpring|withDelay/.test(addedText)) {
      const looksLikeFallback = /setTimeout\s*\([^,]+,\s*(\w*(?:DURATION|ANIM|MS)\w*|\d{3,})/i.test(
        line,
      );
      flag(
        looksLikeFallback ? 'error' : 'warn',
        file,
        lineNum,
        looksLikeFallback ? 'setTimeout-animation-fallback' : 'setTimeout-near-animation',
        looksLikeFallback
          ? 'Avoid setTimeout as an animation completion callback — use the Reanimated completion callback with scheduleOnRN'
          : 'setTimeout near Reanimated animation — confirm this is not a completion fallback',
        DOC.workletRules,
      );
    }

    if (/\bentering\s*=|\bexiting\s*=/.test(line)) {
      flag(
        'warn',
        file,
        lineNum,
        'layout-anim-new',
        'New layout entering/exiting — verify Fabric safety, especially on recycled list items',
        DOC.workletRules,
      );
    }

    checkLeakedRender(file, lineNum, line);

    if (
      /TouchableOpacity\b/.test(line) &&
      /from\s+['"]react-native['"]/.test(line) &&
      !isTypeOnlyImport(line)
    ) {
      flag('warn', file, lineNum, 'raw-touchable-opacity', 'Use Pressable', DOC.touchable);
    }

    if (/@react-navigation\/stack/.test(line)) {
      flag(
        'warn',
        file,
        lineNum,
        'js-stack-navigator',
        'Use @react-navigation/native-stack, not the JS stack navigator',
        DOC.nativeStack,
      );
    }

    if (/createStackNavigator/.test(line)) {
      flag(
        'warn',
        file,
        lineNum,
        'create-stack-navigator',
        'Use createNativeStackNavigator',
        DOC.nativeStack,
      );
    }
  }

  const addedHasScrollView = addedLines.some((l) => /<ScrollView\b/.test(l.content));
  const addedHasMap = addedLines.some((l) => /\.map\s*\(/.test(l.content));
  if (addedHasScrollView && addedHasMap) {
    flag(
      'warn',
      file,
      addedLines[0]?.lineNum ?? 1,
      'scrollview-map',
      'Prefer a virtualized list (FlatList/FlashList) over ScrollView + .map()',
      DOC.lists,
    );
  }

  const addedHasUseState = addedLines.some((l) => /\buseState\s*\(/.test(l.content));
  const addedScrollState = addedLines.some(
    (l) => /onScroll/.test(l.content) && /set[A-Z]\w*\(/.test(l.content),
  );
  if (addedHasUseState && addedScrollState) {
    flag(
      'warn',
      file,
      addedLines[0]?.lineNum ?? 1,
      'scroll-in-usestate',
      'Do not track scroll position in useState — use a Reanimated shared value or a ref',
      DOC.lists,
    );
  }
}

function printResults() {
  const print = (items, label) => {
    if (!items.length) {
      return;
    }
    console.error(`\n${label}:`);
    for (const { file, lineNum, ruleId, message, doc } of items) {
      console.error(`  ${file}:${lineNum}  [${ruleId}] ${message}`);
      console.error(`    → ${doc}`);
    }
  };

  print(errors, '❌ RN footgun errors');
  print(warnings, '⚠️  RN footgun warnings');
}

function main() {
  const files = CLI_FILES.length ? CLI_FILES : getStagedFiles();

  if (!files.length) {
    process.exit(0);
  }

  for (const file of files) {
    const addedLines = CLI_FILES.length
      ? fs
          .readFileSync(file, 'utf8')
          .split('\n')
          .map((content, i) => ({ lineNum: i + 1, content }))
      : getAddedLines(file);

    checkFile(file, addedLines);
  }

  printResults();

  if (errors.length) {
    console.error(`\n${errors.length} error(s) — commit blocked.`);
    process.exit(1);
  }

  if (warnings.length) {
    console.error(`\n${warnings.length} warning(s) — review before merge.`);
    if (STRICT) {
      process.exit(1);
    }
  }

  if (!errors.length && !warnings.length) {
    console.log('RN footgun check passed.');
  }
}

main();
