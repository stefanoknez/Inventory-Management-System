import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Picker, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSale = ({ visible, onClose, onAdd }) => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [stockSold, setStockSold] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(await AsyncStorage.getItem('user'));
      setUserId(user._id);

      const [productsRes, storesRes] = await Promise.all([
        fetch(`http://localhost:4000/api/product/get/${user._id}`).then(res => res.json()),
        fetch(`http://localhost:4000/api/store/get/${user._id}`).then(res => res.json())
      ]);

      setProducts(productsRes);
      setStores(storesRes);
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!productId || !storeId || !stockSold) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    fetch(`http://localhost:4000/api/sales/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID: userId,
        ProductID: productId,
        StoreID: storeId,
        StockSold: Number(stockSold),
        SaleDate: new Date()
      })
    })
      .then(res => res.json())
      .then(data => {
        Alert.alert('Success', 'Sale added.');
        onAdd(data);
        onClose();
        setProductId('');
        setStoreId('');
        setStockSold('');
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to add sale.');
      });
  };

  return (
    <Modal visible={visible} animationType="slide">
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>➕ Add Sale</Text>

        <Text style={styles.label}>Product</Text>
        <Picker
          selectedValue={productId}
          onValueChange={(itemValue) => setProductId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Product" value="" />
          {products.map((p) => (
            <Picker.Item label={p.name} value={p._id} key={p._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Store</Text>
        <Picker
          selectedValue={storeId}
          onValueChange={(itemValue) => setStoreId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Store" value="" />
          {stores.map((s) => (
            <Picker.Item label={s.storeName || s.name} value={s._id} key={s._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Stock Sold</Text>
        <TextInput
          style={styles.input}
          value={stockSold}
          onChangeText={setStockSold}
          keyboardType="numeric"
        />

        <View style={styles.buttons}>
          <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default AddSale;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4
  },
  picker: {
    backgroundColor: '#f0f0f0',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  submit: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 6
  },
  cancel: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 6
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});