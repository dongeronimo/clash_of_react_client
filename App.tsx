import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Hello3d from './src/Hello3d';

export default function App() {
  return (
    <Hello3d/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
