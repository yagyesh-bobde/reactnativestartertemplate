import { StyleSheet, Text, View } from 'react-native';
import { colors, moderateScale, scale, verticalScale } from '@shared/theme';

interface GreetingCardProps {
  message: string;
}

export function GreetingCard({ message }: GreetingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  text: { color: colors.text, fontSize: moderateScale(16) },
});
