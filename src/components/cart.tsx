import React from 'react';
import {
  View,
  Alert,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { appColors } from '../theme/appColors';
import { appFonts } from '../theme/appFonts';
import { useNavigation } from '@react-navigation/native';
import { Header, Icon } from '@rneui/base';

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

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

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const renderCartItem = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.cartItem} key={index}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>
          ₹{item.price.toFixed(2)} x {item.quantity}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add some products to get started!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        backgroundColor={appColors.primary}
        leftComponent={
          <Icon
            name="arrow-left"
            type="font-awesome"
            color="#fff"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: 'Cart',
          style: { color: '#fff', fontSize: 18, fontFamily: appFonts.bold },
        }}
      />
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ₹{totalAmount.toFixed(2)}
            </Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backText: {
    fontSize: 39,
    color: appColors.text,
    fontFamily: appFonts.bold,
  },
  headerTitle: {
    fontSize: 18,
    color: appColors.text,
    fontFamily: appFonts.bold,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: appFonts.bold,
    color: appColors.text,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: appFonts.medium,
    color: appColors.accent,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: appFonts.medium,
    color: appColors.text,
  },
  quantityButton: {
    backgroundColor: appColors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quantityBtnText: {
    fontSize: 16,
    fontFamily: appFonts.bold,
    color: '#fff',
  },
  deleteText: {
    color: appColors.secondary,
    fontSize: 14,
    fontFamily: appFonts.medium,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontFamily: appFonts.bold,
    color: appColors.text,
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: appFonts.medium,
    color: appColors.accent,
    marginTop: 8,
    textAlign: 'center',
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
    fontFamily: appFonts.bold,
    color: appColors.text,
    marginBottom: 10,
  },
  checkoutButton: {
    backgroundColor: appColors.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontFamily: appFonts.bold,
    color: '#fff',
  },
});

export default Cart;
