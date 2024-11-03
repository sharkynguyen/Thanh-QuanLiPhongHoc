import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';

const DAKTNC: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const [daktnc, setDaktnc] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('DHDTMT17B');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDaktncFromRealtimeDatabase = async () => {
    setLoading(true);
    try {
      const snapshot = await database()
        .ref('rooms/room1/peopleInRoom')
        .once('value');
      
      const data: any[] = [];
      snapshot.forEach((childSnapshot) => {
        const personData = childSnapshot.val();
        data.push({
          idNumber: personData.idNumber || '',
          name: personData.name || '',
          role: personData.role || '',
        });
      });

      setDaktnc(data);
    } catch (error) {
      console.error('Error fetching data from Realtime Database:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaktncFromRealtimeDatabase();

    if (route.params?.fromHistory) {
      setActiveButton('DHDTMT17B');
    }
  }, [route.params]);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchDaktncFromRealtimeDatabase();
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
      <Text style={styles.title}>DANH SÁCH SINH VIÊN ĐANG TRONG LỚP</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STT</Text>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Role</Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Đang cập nhật dữ liệu...</Text>
          </View>
        ) : (
          daktnc.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{entry.idNumber}</Text>
              <Text style={styles.tableCell}>{entry.name}</Text>
              <Text style={styles.tableCellLast}>{entry.role}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, activeButton === 'DHDTMT17B' ? styles.activeButton : styles.inactiveButton]} onPress={() => handleButtonPress('DHDTMT17B')}>
          <Text style={styles.buttonText}>DHDTMT17B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, activeButton === 'History' ? styles.activeButton : styles.inactiveButton]} onPress={() => handleButtonPress('History')}>
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 30 },
  scrollContainer: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f1f1', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tableHeaderText: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: 'black' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tableCell: { flex: 1, textAlign: 'center', padding: 5, color: 'black' },
  tableCellLast: { flex: 1, textAlign: 'center', padding: 8, color: 'black' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  loadingText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: 'black' },
  buttonContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  button: { padding: 10, flex: 1, alignItems: 'center', borderRadius: 5, marginHorizontal: 5 },
  activeButton: { backgroundColor: '#007bff' },
  inactiveButton: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default DAKTNC;
