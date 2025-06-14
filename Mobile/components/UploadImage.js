import React, { useState } from 'react';
import { View, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UploadImage = ({ onUpload }) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadToCloudinary(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("upload_preset", "inventoryapp");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      Alert.alert("Success", "Image uploaded successfully!");
      onUpload(data.url);
    } catch (error) {
      Alert.alert("Error", "Failed to upload image.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
      <Button title="Pick an Image" onPress={pickImage} color="#4F46E5" />
    </View>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    alignItems: "center",
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
});