import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import SplashScreen from './src/shared/splashScreen';
import ProductList from './src/components/productList';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      {loading ? <SplashScreen /> : <ProductList />}
    </>
  );
};

export default App;
