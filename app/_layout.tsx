// app/_layout.tsx
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          // You can add custom fonts here if you have them
          // 'Georgia': require('../assets/fonts/Georgia.ttf'),
          // 'Georgia-Bold': require('../assets/fonts/Georgia-Bold.ttf'),
        });

        // Artificially delay for demo purposes (remove in production)
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#2E8B57"
          translucent={false}
        />
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <Stack 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: '#2E8B57' }
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{
                title: 'Voyager Game',
              }}
            />
            {/* Add other screens here if needed */}
            <Stack.Screen 
              name="voyagergame" 
              options={{
                title: 'Game Board',
              }}
            />
          </Stack>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8B57',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#2E8B57',
  },
});