import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { Card, Button, Image, Header, Icon } from '@rneui/base';
import LinearGradient from 'react-native-linear-gradient';
import { appColors } from '../theme/appColors';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      launchCamera({ mediaType: 'photo', quality: 0.8 }, handleImageResponse);
    }
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) return;
    const uri = response.assets?.[0]?.uri;
    if (uri) {
      simulateUpload(uri);
    }
  };

  const simulateUpload = (uri: string) => {
    setUploading(true);
    setTimeout(() => {
      setAvatar(uri);
      setUploading(false);
      Alert.alert('Success', 'Avatar updated!');
    }, 1500);
  };

  return (
    <View style={styles.container}>
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
          text: 'Profile',
          style: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
        }}
      />

      <Card containerStyle={{ borderRadius: 10, elevation: 3 }}>
        <LinearGradient
          colors={[appColors.gradientStart, appColors.gradientEnd]}
          style={styles.gradient}
        >
          <TouchableOpacity onPress={handleImagePicker} style={styles.avatarButton}>
            {uploading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>Add Photo</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
        <Card.Divider />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={appColors.placeholder}
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={appColors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          title="Save Profile"
          buttonStyle={{ backgroundColor: appColors.primary, marginVertical: 10 }}
          onPress={handleSaveProfile}
        />
        <Button
          title="Logout"
          type="clear"
          titleStyle={{ color: appColors.accent }}
          onPress={() => Alert.alert('Logged out')}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: appColors.light },
  gradient: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  avatarButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 35,
  },
  input: {
    backgroundColor: appColors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: appColors.border,
    color: appColors.text,
  },
});

export default Profile;
