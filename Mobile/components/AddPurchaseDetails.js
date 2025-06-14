import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPurchaseDetails = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productID: '',
    quantityPurchased: '',
    purchaseDate: '',
    totalPurchaseAmount: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      const res = await fetch(`http://localhost:4000/api/product/get/${parsed._id}`);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const parsed = JSON.parse(storedUser);

    const payload = {
      ...form,
      userID: parsed._id
    };

    try {
      const res = await fetch("http://localhost:4000/api/purchase/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to add purchase");

      Alert.alert("Success", "Purchase added successfully!");
      setForm({ productID: '', quantityPurchased: '', purchaseDate: '', totalPurchaseAmount: '' });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧾 Add Purchase</Text>

      <TextInput
        placeholder="Product ID"
        value={form.productID}
        onChangeText={(v) => handleChange('productID', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity Purchased"
        value={form.quantityPurchased}
        onChangeText={(v) => handleChange('quantityPurchased', v)}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Purchase Date (YYYY-MM-DD)"
        value={form.purchaseDate}
        onChangeText={(v) => handleChange('purchaseDate', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Total Purchase Amount (€)"
        value={form.totalPurchaseAmount}
        onChangeText={(v) => handleChange('totalPurchaseAmount', v)}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Submit Purchase" onPress={handleSubmit} color="#4F46E5" />
    </ScrollView>
  );
};

export default AddPurchaseDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6
  }
});