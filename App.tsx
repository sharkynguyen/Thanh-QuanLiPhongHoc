import React, { useEffect, useState } from 'react';
import { SafeAreaView, TextInput, Text, StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const ClassSelection: React.FC = ({ navigation }: any) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  const handleClassSelection = (className: string) => {
    setSelectedClass(className);
    navigation.navigate('DAKTNC', { selectedClass: className });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CHỌN LỚP:</Text>
      <TouchableOpacity
        style={styles.classButton}
        onPress={() => handleClassSelection('DHDTMT17B')}
      >
        <Text style={styles.classButtonText}>DHDTMT17B</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.classButton}
        onPress={() => handleClassSelection('AnotherClass')}
      >
        <Text style={styles.classButtonText}>AnotherClass</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const DAKTNC: React.FC = ({ navigation }: any) => {
  const [daktnc, setDaktnc] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('DHDTMT17B');

  const fetchDaktncFromFirestore = async () => {
    try {
      const snapshot = await firestore().collection('daktnc').get();
      const data: any[] = [];

      snapshot.forEach(doc => {
        const entry = {
          id: doc.data().ID || '',
          name: doc.data().Name || '',
          notes: doc.data().Notes || '',
        };
        data.push(entry);
      });

      setDaktnc(data);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    }
  };

  useEffect(() => {
    fetchDaktncFromFirestore();
  }, []);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchDaktncFromFirestore();
    } else {
      setActiveButton(buttonName);
      if (buttonName === 'History') {
        navigation.navigate('History');
      } else {
        console.log('Button DHDTMT17B pressed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LỚP DHDTMT17B:</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STT</Text>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Notes</Text>
        </View>
        {daktnc.length > 0 ? (
          daktnc.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{entry.id}</Text>
              <Text style={styles.tableCell}>{entry.name}</Text>
              <Text style={styles.tableCellLast}>{entry.notes}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Đang cập nhật dữ liệu!.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeButton === 'DHDTMT17B' ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress('DHDTMT17B')}
        >
          <Text style={styles.buttonText}>DHDTMT17B</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activeButton === 'History' ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress('History')}
        >
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const History: React.FC = ({ navigation }: any) => {
  const [daktnc, setDaktnc] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('History');

  const fetchHistoryFromFirestore = async () => {
    try {
      const snapshot = await firestore().collection('daktnc').get();
      const data: any[] = [];

      snapshot.forEach(doc => {
        const entry = {
          id: doc.data().ID || '',
          name: doc.data().Name || '',
          timeInOut: doc.data().TimeInOut || '',
        };
        data.push(entry);
      });

      setDaktnc(data);
    } catch (error) {
      console.error('Error fetching history from Firestore:', error);
    }
  };

  useEffect(() => {
    fetchHistoryFromFirestore();
  }, []);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchHistoryFromFirestore();
    } else {
      setActiveButton(buttonName);
      if (buttonName === 'DHDTMT17B') {
        navigation.navigate('DAKTNC');
      } else {
        console.log('Button History pressed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>LỊCH SỬ TIME IN/OUT:</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STT</Text>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Time In/Out</Text>
        </View>
        {daktnc.length > 0 ? (
          daktnc.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{entry.id}</Text>
              <Text style={styles.tableCell}>{entry.name}</Text>
              <Text style={styles.tableCellLast}>{entry.timeInOut}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Đang cập nhật dữ liệu!.</Text>
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeButton === 'DHDTMT17B' ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress('DHDTMT17B')}
        >
          <Text style={styles.buttonText}>DHDTMT17B</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, activeButton === 'History' ? styles.activeButton : styles.inactiveButton]}
          onPress={() => handleButtonPress('History')}
        >
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// New Intermediate Screen
const IntermediateScreen: React.FC = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>DANH SÁCH LỚP HỌC:</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('DAKTNC')}
      >
        <Text style={styles.loginButtonText}>DHDTMT17B</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('abc@gmail.com');
  const [password, setPassword] = useState<string>('123456');
  const [message, setMessage] = useState<string>('');

  const handleLogin = async (navigation: any) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('NHÓM 6 - DHDTMT17B');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };
  
  const saveDataToFirestore = async () => {
    try {
      await firestore().collection('daktnc').add({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      console.log('Data saved to Firestore!');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login"
          options={{
            headerTitle: () => (
              <Text style={styles.headerTitle}>NHÓM 6 - DHDTMT17B</Text>
            ),
            headerTitleAlign: 'center',
          }}
        >
          {({ navigation }) => (
            <SafeAreaView style={styles.container}>
              <Image
                source={require('./assets/logoiuh.jpg')}
                style={styles.logo}
              />
              <Text style={styles.title}>LOGIN</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => handleLogin(navigation)}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <Text>{message}</Text>
            </SafeAreaView>
          )}
        </Stack.Screen>
        <Stack.Screen name="NHÓM 6 - DHDTMT17B" component={IntermediateScreen} />
        <Stack.Screen name="ClassSelection" component={ClassSelection} />
        <Stack.Screen name="DAKTNC" component={DAKTNC} />
        <Stack.Screen name="History" component={History} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  classButton: {
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
  classButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  inactiveButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 2,
    textAlign: 'center',
    padding: 5,
  },
  tableCellLast: {
    flex: 1.5,
    textAlign: 'center',
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  logo: {
    width: 400,
    height: 170,
    marginBottom: 16,
    alignSelf: 'center',
  },
});

export default App;
