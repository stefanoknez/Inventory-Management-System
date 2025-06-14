import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddStore = () => {
  const [form, setForm] = useState({
    storeName: '',
    location: '',
    email: '',
    imageUrl: ''
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const empty = Object.entries(form).some(([k, v]) => !v.trim());
    if (empty) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(storedUser);

      const payload = {
        ...form,
        userID: parsed._id
      };

      const res = await fetch("http://localhost:4000/api/store/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to add store");

      Alert.alert("Success", "Store added successfully!");
      setForm({ storeName: '', location: '', email: '', imageUrl: '' });
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏬 Add New Store</Text>

      <TextInput
        placeholder="Store Name"
        value={form.storeName}
        onChangeText={(v) => handleChange('storeName', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={form.location}
        onChangeText={(v) => handleChange('location', v)}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={form.imageUrl}
        onChangeText={(v) => handleChange('imageUrl', v)}
        style={styles.input}
      />

      <Button title="Add Store" onPress={handleSubmit} color="#4F46E5" />
    </ScrollView>
  );
};

export default AddStore;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    marginBottom: 15
  }
});