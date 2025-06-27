import React, { useEffect } from 'react';

// React Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Redux imports
import { Provider } from 'react-redux';
import { store } from './src/store/store';

// Screens
import SplashScreen from './src/shared/splashScreen';
import ProductList from './src/components/productList';
import Cart from './src/components/cart';
import Profile from './src/components/myAccount';

// Create a stack navigator instance
const Stack = createStackNavigator();

const App = () => {
  // State to manage splash screen visibility
  const [loading, setLoading] = React.useState(true);

  // Show splash screen for 3 seconds on app start
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }, []);

  // Render splash screen while loading
  if (loading) {
    return <SplashScreen />;
  }

  // App entry point wrapped in Redux Provider and NavigationContainer
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProductList">
          {/* Product List Screen - Main home screen */}
          <Stack.Screen
            name="ProductList"
            component={ProductList}
            options={{ headerShown: false }}
          />

          {/* Cart Screen */}
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{ headerShown: false }}
          />

          {/* Profile/My Account Screen */}
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
