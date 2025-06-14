import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';

const UpdateProduct = ({ visible, onClose, product, onUpdate }) => {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    quantity: '',
    price: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        brand: product.brand || '',
        description: product.description || '',
        quantity: product.quantity || '',
        price: product.price || '',
      });
    }
  }, [product]);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/product/update/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updated = await response.json();
      Alert.alert("Success", "Product updated successfully");
      onUpdate(updated);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Could not update product");
      console.log(error);
    }
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View style={styles.modal}>
        <Text style={styles.title}>Update Product</Text>

        {['name', 'brand', 'description', 'quantity', 'price'].map((field) => (
          <TextInput
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChangeText={(val) => handleInputChange(field, val)}
            style={styles.input}
            keyboardType={field === 'quantity' || field === 'price' ? 'numeric' : 'default'}
          />
        ))}

        <Button title="Update" onPress={handleSubmit} color="#4F46E5" />
      </View>
    </Modal>
  );
};

export default UpdateProduct;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  }
});