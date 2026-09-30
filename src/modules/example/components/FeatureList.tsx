import { StyleSheet, Text, View } from 'react-native';
import { colors, moderateScale, scale, verticalScale } from '@shared/theme';
import { FEATURES } from '../constants';

export function FeatureList() {
  return (
    <View style={styles.card}>
      {FEATURES.map((feature, index) => (
        <View key={feature.title} style={[styles.row, index > 0 ? styles.divider : null]}>
          <Text style={styles.index}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={styles.body}>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
  },
  row: {
    flexDirection: 'row',
    gap: scale(14),
    paddingVertical: verticalScale(14),
  },
  divider: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
  index: {
    color: colors.primary,
    fontSize: moderateScale(13),
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    paddingTop: verticalScale(2),
  },
  body: { flex: 1, gap: verticalScale(2) },
  title: { color: colors.text, fontSize: moderateScale(15), fontWeight: '600' },
  description: {
    color: colors.textMuted,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
  },
});
