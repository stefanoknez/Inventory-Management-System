import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setUpdatedUser(parsed);
    };
    fetchUser();
  }, []);

  const handleChange = (key, value) => {
    setUpdatedUser({ ...updatedUser, [key]: value });
  };

  const handleSave = () => {
    setUser(updatedUser);
    setEditMode(false);
    Alert.alert("Updated", "Profile successfully updated.");
  };

  const handleSignOut = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }]
            })
          );
        }
      }
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
      {["firstName", "lastName", "email", "phoneNumber"].map((field) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{field.replace(/([A-Z])/g, ' $1')}</Text>
          <TextInput
            editable={editMode}
            value={updatedUser[field]}
            onChangeText={(text) => handleChange(field, text)}
            style={[styles.input, editMode && styles.editable]}
          />
        </View>
      ))}

      <TouchableOpacity
        onPress={() => (editMode ? handleSave() : setEditMode(true))}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {editMode ? "Save Changes" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={[styles.button, { backgroundColor: "#EF4444", marginTop: 12 }]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f4f8"
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20
  },
  field: {
    width: "100%",
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#eee"
  },
  editable: {
    backgroundColor: "#fff",
    borderColor: "#10B981"
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 6,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});