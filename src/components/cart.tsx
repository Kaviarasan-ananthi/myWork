import React from 'react';
import {
  View,
  Alert,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { ListItem, Button, Icon, Header } from '@rneui/themed';
import { Text } from '@rneui/base';
import { appColors } from '../theme/appColors';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  // Get cart items and total amount from Redux store
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  // Show confirmation before removing an item
  const handleRemoveItem = (id: number) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeFromCart(id)) },
      ]
    );
  };

  // Update quantity (or remove item if quantity <= 0)
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  // Render each item in the cart
  const renderCartItem = ({ item }: { item: any }) => (
    <ListItem.Swipeable
      rightContent={
        <Button
          title="Delete"
          buttonStyle={{
            backgroundColor: appColors.secondary,
            minHeight: '100%',
          }}
          onPress={() => handleRemoveItem(item.id)}
        />
      }
      bottomDivider
    >
      <ListItem.Content>
        <ListItem.Title style={{ color: appColors.text }}>
          {item.title}
        </ListItem.Title>
        <ListItem.Subtitle style={{ color: appColors.accent }}>
          ₹{item.price.toFixed(2)} x {item.quantity}
        </ListItem.Subtitle>
      </ListItem.Content>

      {/* Quantity Control */}
      <View style={styles.quantityContainer}>
        <Button
          title="-"
          buttonStyle={styles.quantityButton}
          titleStyle={{ fontSize: 16 }}
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        />
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <Button
          title="+"
          buttonStyle={styles.quantityButton}
          titleStyle={{ fontSize: 16 }}
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        />
      </View>
    </ListItem.Swipeable>
  );

  // Render when cart is empty
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add some products to get started!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <Header
        leftComponent={
          <Icon
            name="arrow-back"
            type="material"
            color="black"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'My Cart',
          style: { color: 'black', fontSize: 18, fontWeight: 'bold' },
        }}
        backgroundColor="white"
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#ddd' }}
      />

      {/* Show empty state or cart items */}
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {/* Cart item list */}
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {/* Total section with checkout button */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ₹{totalAmount.toFixed(2)}
            </Text>
            <Button
              title="Proceed to Checkout"
              buttonStyle={styles.checkoutButton}
              titleStyle={{ fontSize: 16, fontWeight: 'bold' }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.light,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: appColors.text,
  },
  quantityButton: {
    backgroundColor: appColors.primary,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.text,
  },
  emptySubtext: {
    fontSize: 16,
    color: appColors.accent,
    textAlign: 'center',
    marginTop: 8,
  },
  totalContainer: {
    backgroundColor: appColors.light,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.text,
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: appColors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
  },
});

export default Cart;
