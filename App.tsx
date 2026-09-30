import { AppProviders } from '@app/AppProviders';
import { RootNavigator } from '@navigation/RootNavigator';

function App() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

export default App;
