import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {
  fetchProducts,
  toggleWishlist,
  Product,
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import { SearchBar, Button, Icon } from '@rneui/themed';
import { Header, Image, Text } from '@rneui/base';
import { appColors } from '../theme/appColors';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const { products, loading, hasMore, wishlist } = useSelector((state: RootState) => state.products);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts(1));
  }, [dispatch]);

  const handleAddToCart = (product: Product) => {
    const alreadyInCart = cartItems.some((item) => item.id === product.id);
    if (!alreadyInCart) {
      dispatch(addToCart(product));
      Snackbar.show({
        text: `${product.title} added to cart`,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const handleToggleWishlist = (productId: number) => {
    dispatch(toggleWishlist(productId));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchProducts(1));
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchProducts(products.length / 10 + 1));
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isWishlisted = wishlist.includes(item.id);
    const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

    return (
      <View style={styles.productCard}>
        <View style={styles.weightTag}>
          <Text style={styles.weightText}>500gm</Text>
        </View>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50, resizeMode: 'contain' }}
          />
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>₹{(item.price * 1.2).toFixed(0)}</Text>
          <Text style={styles.newPrice}>₹{item.price.toFixed(0)}</Text>
        </View>
        <View style={styles.actionRow}>
          <Button
            title={isInCart ? 'Already Added' : '+ ADD'}
            disabled={isInCart}
            buttonStyle={styles.addButton}
            titleStyle={{ fontSize: 12 }}
            onPress={() => handleAddToCart(item)}
          />
          <Icon
            name={isWishlisted ? 'heart' : 'heart-o'}
            type="font-awesome"
            color={isWishlisted ? appColors.secondary : appColors.accent}
            size={18}
            onPress={() => handleToggleWishlist(item.id)}
          />
        </View>
        <Text style={styles.deliveryText}>Standard Delivery (Tomorrow)</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        size="large"
        color={appColors.primary}
        style={styles.loader}
      />
    );
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header
        placement="left"
        leftComponent={{ text: '', style: { color: 'white' } }}
        centerComponent={{
          text: 'Product List',
          style: { fontSize: 18, textAlign: 'center', color: 'black' },
        }}
        rightComponent={
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Icon
              name="user"
              type="font-awesome"
              color="black"
              size={22}
              onPress={() => navigation.navigate('Profile')}
            />
            <Icon
              name="shopping-cart"
              type="font-awesome"
              color="black"
              size={22}
              onPress={() => navigation.navigate('Cart')}
            />
          </View>
        }
        backgroundColor={appColors.primary}
        containerStyle={{ backgroundColor: 'white' }}
      />
      <SearchBar
        placeholder="Search products..."
        onChangeText={setSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
        inputStyle={styles.searchText}
        lightTheme
        round
      />
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.light },
  searchContainer: {
    backgroundColor: appColors.light,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  searchInput: { backgroundColor: '#f0f0f0' },
  searchText: { color: appColors.text },
  productCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    margin: '1.5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  weightTag: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#f3f3f3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  weightText: {
    fontSize: 10,
    color: appColors.text,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: appColors.text,
    marginVertical: 4,
    minHeight: 32,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  oldPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  deliveryText: {
    fontSize: 10,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },
  loader: { marginVertical: 20 },
});

export default ProductList;
