import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * SplashScreen Component
 * 
 * Displays a welcome screen when the app is launched.
 * Typically shown for a few seconds before navigating to the main app content.
 */
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* App welcome title */}
      <Text style={styles.title}>Welcome to ShopApp</Text>
    </View>
  );
};

// Styles for the SplashScreen layout
const styles = StyleSheet.create({
  container: {
    flex: 1,                        
    justifyContent: 'center',      
    alignItems: 'center',         
    backgroundColor: '#fff',     
  },
  title: {
    fontSize: 24,                 
    fontWeight: 'bold',         
  },
});

export default SplashScreen;
