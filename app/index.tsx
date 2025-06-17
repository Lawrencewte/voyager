// app/index.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import VoyagerGame from './js/components/VoyagerGame';

export default function Index() {
  return (
    <View style={styles.container}>
      <VoyagerGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E8B57',
  },
});