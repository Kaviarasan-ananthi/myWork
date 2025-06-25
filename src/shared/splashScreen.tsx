import React from 'react';
import { StatusBar, View, StyleSheet, Text, Image } from 'react-native';
import { appColors } from '../theme/appColors';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={appColors.light} barStyle="dark-content" />
            <Image source={require('../assets/image.png')} style={styles.image} resizeMode='contain' />
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: appColors.light,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
});
