// Mobile/screens/PurchaseScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PurchaseScreen = () => {
  const [purchases, setPurchases] = useState([]);
  const [userId, setUserId] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPurchases = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id);

      const res = await fetch(`http://localhost:4000/api/purchase/get/${parsed._id}`);
      const data = await res.json();
      setPurchases(data);
    };

    fetchPurchases();
  }, []);

  const renderPurchase = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Product: {item.ProductID?.name || "N/A"}</Text>
      <Text style={styles.detail}>Store: {item.StoreID?.storeName || "N/A"}</Text>
      <Text style={styles.detail}>Quantity: {item.QuantityPurchased}</Text>
      <Text style={styles.detail}>Total: €{item.TotalPurchaseAmount}</Text>
      <Text style={styles.detail}>Date: {new Date(item.PurchaseDate).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Purchase History</Text>

      <FlatList
        data={purchases}
        renderItem={renderPurchase}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddPurchaseDetails')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default PurchaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#10B981',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5
  }
});