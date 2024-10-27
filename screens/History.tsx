import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const History: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [daktnc, setDaktnc] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('History');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHistoryFromFirestore = async () => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const snapshot = await firestore()
        .collection('daktnc')
        .orderBy('TimeInOut', 'asc') // Sắp xếp theo TimeInOut từ sớm đến trễ
        .get();
      const data: any[] = [];

      snapshot.forEach(doc => {
        const entry = {
          id: doc.data().ID || '',
          name: doc.data().Name || '',
          timeInOut: doc.data().TimeInOut || '',
          status: doc.data().Status || ''
        };
        data.push(entry);
      });

      setDaktnc(data);
    } catch (error) {
      console.error('Error fetching history from Firestore:', error);
    } finally {
      setLoading(false); // Đặt trạng thái tải dữ liệu thành false khi hoàn tất
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistoryFromFirestore();
    }, 200);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, []);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchHistoryFromFirestore(); // Tải lại dữ liệu khi nhấn nút đã chọn
    } else {
      setActiveButton(buttonName);
      if (buttonName === 'DHDTMT17B') {
        navigation.navigate('NHÓM 6', { fromHistory: true });
      } else {
        console.log('Button History pressed');
        fetchHistoryFromFirestore(); // Tải dữ liệu khi nhấn nút "HISTORY"
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>STATUS</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STT</Text>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Time</Text>
          <Text style={styles.tableHeaderText}>Status</Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Đang cập nhật dữ liệu...</Text>
          </View>
        ) : (
          daktnc.length > 0 ? (
            daktnc.map((entry, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>{entry.id}</Text>
                <Text style={styles.tableCell}>{entry.name}</Text>
                <Text style={styles.tableCell}>{entry.timeInOut}</Text>
                <Text style={styles.tableCellLast}>{entry.status}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.loadingText}>Không có dữ liệu!</Text>
          )
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
          <Text style={styles.buttonText}>HISTORY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 30 },
  scrollContainer: { marginTop: 20 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f1f1', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tableHeaderText: { flex: 1, fontWeight: 'bold', textAlign: 'center', color: 'black' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tableCell: { flex: 2, textAlign: 'center', padding: 5, color: 'black' },
  tableCellLast: { flex: 1.5, textAlign: 'center', padding: 8, color: 'black' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  loadingText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: 'black' },
  buttonContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  button: { padding: 10, flex: 1, alignItems: 'center', borderRadius: 5, marginHorizontal: 5 },
  activeButton: { backgroundColor: '#007bff' },
  inactiveButton: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default History;
