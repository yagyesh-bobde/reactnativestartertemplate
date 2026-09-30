import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleScreen } from '@/modules/example';
import { Routes, type AppParamList } from './types';

const Stack = createNativeStackNavigator<AppParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Example} component={ExampleScreen} />
    </Stack.Navigator>
  );
}
