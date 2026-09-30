import { StatusBar } from 'react-native';
import { AppProviders } from '@app/AppProviders';
import { RootNavigator } from '@navigation/RootNavigator';

function App() {
  return (
    <AppProviders>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
