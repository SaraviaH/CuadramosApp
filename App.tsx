import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { JornadaProvider } from './src/context';
import { AppNavigator } from './src/navigation';
import { Colors } from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <JornadaProvider>
        <AppNavigator />
      </JornadaProvider>
    </SafeAreaProvider>
  );
}

export default App;

