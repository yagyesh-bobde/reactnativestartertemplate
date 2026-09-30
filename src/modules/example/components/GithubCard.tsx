import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { logger } from '@core/logger';
import { colors, moderateScale, scale, verticalScale } from '@shared/theme';
import { REPO_SLUG, REPO_URL } from '../constants';

function openRepo() {
  Linking.openURL(REPO_URL).catch((error: unknown) => logger.warn('Could not open repo', error));
}

export function GithubCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Open source on GitHub</Text>
      <Text style={styles.slug}>{REPO_SLUG}</Text>
      <Text style={styles.copy}>
        If this saved you a setup day, a star helps other people find it.
      </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityHint="Opens the repository on GitHub"
        onPress={openRepo}
        style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}>
        <Text style={styles.star}>☆</Text>
        <Text style={styles.buttonText}>Star on GitHub</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderRadius: moderateScale(20),
    padding: scale(20),
    gap: verticalScale(6),
  },
  eyebrow: {
    color: colors.primary,
    fontSize: moderateScale(12),
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  slug: { color: colors.text, fontSize: moderateScale(16), fontWeight: '700' },
  copy: { color: colors.textMuted, fontSize: moderateScale(14), lineHeight: moderateScale(20) },
  // GitHub's Star button styling, sized up to a comfortable touch target.
  button: {
    marginTop: verticalScale(10),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    minHeight: moderateScale(44),
    backgroundColor: colors.github.button,
    borderColor: colors.github.border,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
  },
  buttonPressed: { backgroundColor: colors.github.buttonPressed },
  star: { color: colors.github.icon, fontSize: moderateScale(18) },
  buttonText: { color: colors.github.text, fontSize: moderateScale(15), fontWeight: '600' },
});
