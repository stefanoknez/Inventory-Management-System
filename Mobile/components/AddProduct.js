import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    storeId: ''
  });

  const [stores, setStores] = useState([]);
  const [userId, setUserId] = useState('');

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    const fetchStores = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id);

      const res = await fetch(`http://localhost:4000/api/store/get/${parsed._id}`);
      const data = await res.json();
      setStores(data);
    };

    fetchStores();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.stock || !form.storeId) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      ...form,
      userID: userId,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    try {
      const res = await fetch("http://localhost:4000/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to add product");

      Alert.alert("Success", "Product added successfully!");
      setForm({ name: '', description: '', price: '', stock: '', imageUrl: '', storeId: '' });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not add product");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add Product</Text>

      <TextInput placeholder="Name" value={form.name} onChangeText={(v) => handleChange('name', v)} style={styles.input} />
      <TextInput placeholder="Description" value={form.description} onChangeText={(v) => handleChange('description', v)} style={styles.input} />
      <TextInput placeholder="Price (€)" value={form.price} onChangeText={(v) => handleChange('price', v)} keyboardType="decimal-pad" style={styles.input} />
      <TextInput placeholder="Stock" value={form.stock} onChangeText={(v) => handleChange('stock', v)} keyboardType="number-pad" style={styles.input} />
      <TextInput placeholder="Image URL (optional)" value={form.imageUrl} onChangeText={(v) => handleChange('imageUrl', v)} style={styles.input} />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Store:</Text>
        <Picker selectedValue={form.storeId} onValueChange={(value) => handleChange('storeId', value)}>
          <Picker.Item label="Select a store..." value="" />
          {stores.map(store => (
            <Picker.Item key={store._id} label={store.storeName} value={store._id} />
          ))}
        </Picker>
      </View>

      <Button title="Add Product" onPress={handleSubmit} color="#4F46E5" />
    </ScrollView>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15
  },
  pickerContainer: {
    marginBottom: 20
  },
  label: {
    marginBottom: 5,
    fontWeight: "600"
  }
});