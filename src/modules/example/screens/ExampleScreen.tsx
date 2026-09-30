import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, moderateScale, scale, verticalScale } from '@shared/theme';
import { FeatureList } from '../components/FeatureList';
import { GithubCard } from '../components/GithubCard';
import { useGreetingQuery } from '../queries/greeting-queries';

export function ExampleScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useGreetingQuery();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + verticalScale(24),
            paddingBottom: insets.bottom + verticalScale(32),
          },
        ]}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>React Native 0.87 · Bare CLI</Text>
          </View>
          <Text style={styles.title}>React Native{'\n'}Starter Template</Text>
          {data ? <Text style={styles.subtitle}>{data.message}</Text> : null}
        </View>

        <GithubCard />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's inside</Text>
          <FeatureList />
        </View>

        <Text style={styles.footer}>
          Start editing in <Text style={styles.code}>src/modules/example</Text>
        </Text>
      </ScrollView>
      {/* Keeps scrolled content from showing through the translucent status bar. */}
      <View style={[styles.statusBar, { height: insets.top }]} />
    </View>
  );
}

const mono = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statusBar: { ...StyleSheet.absoluteFill, bottom: undefined, backgroundColor: colors.background },
  content: { paddingHorizontal: scale(20), gap: verticalScale(28) },
  hero: { gap: verticalScale(14) },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    backgroundColor: colors.surface,
    borderRadius: moderateScale(999),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
  },
  badgeDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.primary,
  },
  badgeText: { color: colors.textMuted, fontSize: moderateScale(12), fontWeight: '600' },
  title: {
    color: colors.text,
    fontSize: moderateScale(34),
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: moderateScale(40),
  },
  subtitle: { color: colors.textMuted, fontSize: moderateScale(16), lineHeight: moderateScale(24) },
  section: { gap: verticalScale(12) },
  sectionTitle: { color: colors.text, fontSize: moderateScale(18), fontWeight: '700' },
  footer: { color: colors.textMuted, fontSize: moderateScale(13), textAlign: 'center' },
  code: { color: colors.text, fontFamily: mono, fontSize: moderateScale(12) },
});
