// Mobile/screens/SalesScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SalesScreen = ({ navigation }) => {
  const [sales, setSales] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id);

      const res = await fetch(`http://localhost:4000/api/sales/get/${parsed._id}`);
      const data = await res.json();
      setSales(data);
    };

    fetchSales();
  }, []);

  const renderSale = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Product: {item.ProductID?.name || "N/A"}</Text>
      <Text style={styles.detail}>Store: {item.StoreID?.storeName || "N/A"}</Text>
      <Text style={styles.detail}>Quantity Sold: {item.StockSold}</Text>
      <Text style={styles.detail}>Total: €{item.TotalSaleAmount}</Text>
      <Text style={styles.detail}>Date: {new Date(item.SaleDate).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Sales</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSale")}
      >
        <Text style={styles.addButtonText}>➕ Add Sale</Text>
      </TouchableOpacity>

      <FlatList
        data={sales}
        renderItem={renderSale}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  addButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center"
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "600"
  },
  detail: {
    fontSize: 14,
    color: "#555"
  }
});