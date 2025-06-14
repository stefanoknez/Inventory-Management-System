import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StoreScreen = () => {
  const [stores, setStores] = useState([]);
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStores = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      setUserId(parsed._id);

      const res = await fetch(`http://localhost:4000/api/store/get/${parsed._id}`);
      const data = await res.json();
      setStores(data);
    };

    fetchStores();
  }, []);

  const handleDelete = (storeId) => {
    Alert.alert(
      'Delete Store',
      'Are you sure you want to delete this store?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            fetch(`http://localhost:4000/api/store/delete/${storeId}`, {
              method: 'DELETE',
            })
              .then(() => {
                setStores((prev) => prev.filter((s) => s._id !== storeId));
                Alert.alert('Deleted', 'Store deleted successfully.');
              })
              .catch((err) => {
                console.error(err);
                Alert.alert('Error', 'Failed to delete store.');
              });
          },
        },
      ]
    );
  };

  const renderStore = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.storeName}</Text>
      <Text style={styles.detail}>Location: {item.location}</Text>
      <Text style={styles.detail}>Email: {item.email}</Text>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item._id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏪 Your Stores</Text>
      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddStore')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#6366F1',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});