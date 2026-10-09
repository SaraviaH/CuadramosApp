import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, JornadaProvider, TextScaleProvider } from './src/context';
import { AppNavigator } from './src/navigation';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TextScaleProvider>
        <AuthProvider>
          <JornadaProvider>
            <AppNavigator />
          </JornadaProvider>
        </AuthProvider>
      </TextScaleProvider>
    </SafeAreaProvider>
  );
}

export default App;
