// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import firebase from './firebaseConfig';

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('abc@gmail.com'); // Thay thế bằng email của bạn
  const [password, setPassword] = useState<string>('123456'); // Thay thế bằng mật khẩu của bạn
  const [message, setMessage] = useState<string>('');
  const [userData, setUserData] = useState<string | null>(null);
  const [greetings, setGreetings] = useState<any[]>([]); // State để lưu dữ liệu từ Firestore

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      setMessage('Login successful!');
    } catch (error) {
      // setMessage(`Error: ${error.message}`);
    }
  };

  const saveDataToFirestore = async () => {
    try {
      await firestore().collection('greetings').add({
        message: 'Xin chào Thạnh',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Data saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  const fetchGreetingsFromFirestore = async () => {
    try {
      const snapshot = await firestore().collection('greetings').get();
      const data: any[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setGreetings(data);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    saveDataToFirestore(); // Lưu dữ liệu vào Firestore khi mở ứng dụng
    fetchGreetingsFromFirestore(); // Lấy dữ liệu từ Firestore khi mở ứng dụng

    const userRef = database().ref('/users/123');

    // Gán listener để đọc dữ liệu theo thời gian thực
    const onValueChange = userRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(JSON.stringify(data)); // Lưu dữ liệu vào biến userData
      } else {
        setUserData('No user data found.');
      }
    });

    // Cleanup listener on unmount
    return () => userRef.off('value', onValueChange);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{message}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      {userData ? <Text style={styles.message}>User Data: {userData}</Text> : null}

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Greetings from Firestore:</Text>
        {greetings.map((greeting) => (
          <Text key={greeting.id} style={styles.greeting}>
            {greeting.message}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: 'red',
  },
  scrollContainer: {
    marginTop: 20,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;
