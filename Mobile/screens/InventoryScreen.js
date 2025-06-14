// Mobile/screens/InventoryScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const InventoryScreen = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) setUserId(JSON.parse(user)._id);
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:4000/api/product/get/${userId}`)
        .then((res) => res.json())
        .then((data) => setProducts(data || []));

      fetch(`http://localhost:4000/api/store/get/${userId}`)
        .then((res) => res.json())
        .then((data) => setStores(data || []));
    }
  }, [userId]);

  const deleteProduct = (id) => {
    Alert.alert("Delete Product", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          fetch(`http://localhost:4000/api/product/delete/${id}`, {
            method: "DELETE",
          })
            .then(() => setProducts((prev) => prev.filter((p) => p._id !== id)))
            .catch((err) => console.log(err));
        },
      },
    ]);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.detail}>Manufacturer: {item.manufacturer}</Text>
      <Text style={styles.detail}>Stock: {item.stock}</Text>
      <Text style={styles.detail}>Description: {item.description}</Text>
      <Text style={styles.detail}>
        Status: {item.stock > 0 ? "In Stock" : "Not in Stock"}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate("UpdateProduct", { product: item })}>
          <Text style={styles.edit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteProduct(item._id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📦 Inventory</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={styles.addButtonText}>➕ Add Product</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <FlatList
        data={products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </ScrollView>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  edit: {
    color: "#10B981",
    fontWeight: "600",
  },
  delete: {
    color: "#EF4444",
    fontWeight: "600",
  },
});