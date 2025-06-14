import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';

// Add screens
import AddSale from '../components/AddSale';
import AddProduct from '../components/AddProduct';
import AddPurchaseDetails from '../components/AddPurchaseDetails';
import AddStore from '../components/AddStore';
import UploadImage from '../components/UploadImage';
import UpdateProduct from '../components/UpdateProduct';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      {/* Functional screens */}
      <Stack.Screen name="AddSale" component={AddSale} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="AddStore" component={AddStore} />
      <Stack.Screen name="AddPurchaseDetails" component={AddPurchaseDetails} />
      <Stack.Screen name="UploadImage" component={UploadImage} />
      <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
    </Stack.Navigator>
  );
}