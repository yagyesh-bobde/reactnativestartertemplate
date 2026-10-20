import type { PropsWithChildren } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './query-client';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider preload statusBarTranslucent navigationBarTranslucent>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>{children}</NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });
