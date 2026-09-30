import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, moderateScale, scale, verticalScale } from '@shared/theme';
import { GreetingCard } from '../components/GreetingCard';
import { useGreetingQuery } from '../queries/greeting-queries';
import { useCount, useIncrement } from '../stores/counter-store';

export function ExampleScreen() {
  const insets = useSafeAreaInsets();
  const { data } = useGreetingQuery();
  const count = useCount();
  const increment = useIncrement();

  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(16) }]}>
      {data ? <GreetingCard message={data.message} /> : null}
      <Pressable style={styles.button} onPress={increment}>
        <Text style={styles.buttonText}>Pressed {count} times</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scale(16),
    gap: verticalScale(16),
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  buttonText: { color: colors.onPrimary, fontSize: moderateScale(16) },
});
