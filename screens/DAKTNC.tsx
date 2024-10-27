import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DAKTNC: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const [daktnc, setDaktnc] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('DHDTMT17B');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDaktncFromFirestore = async () => {
    setLoading(true);
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
          notes: doc.data().Notes || '',
          status: doc.data().Status || '',
          timeInOut: doc.data().TimeInOut || '',
          timestamp: doc.data().Timestamp || new Date(),
        };
        data.push(entry);
      });

      const latestRaEntries: { [key: string]: any } = {};
      const displayedIds: { [key: string]: boolean } = {};
      const filteredData: any[] = [];

      // Xác định bản ghi "Ra" mới nhất cho mỗi ID
      data.forEach(entry => {
        if (entry.status === 'Ra') {
          latestRaEntries[entry.id] = entry; // Lưu bản ghi "Ra" mới nhất
        }
      });

      // Lọc các bản ghi "Vào" để chỉ hiển thị nếu có TimeInOut sau TimeInOut của bản ghi "Ra" mới nhất
      data.forEach(entry => {
        if (entry.status === 'Vào') {
          const latestRa = latestRaEntries[entry.id];

          // Nếu không có bản ghi "Ra", hiển thị bản ghi "Vào"
          if (!latestRa) {
            if (!displayedIds[entry.id]) {
              filteredData.push(entry);
              displayedIds[entry.id] = true; // Đánh dấu ID này đã được hiển thị
            }
          } else {
            // Nếu có bản ghi "Ra", chỉ hiển thị nếu TimeInOut "Vào" lớn hơn "Ra"
            if (entry.timeInOut > latestRa.timeInOut) {
              if (!displayedIds[entry.id]) {
                filteredData.push(entry);
                displayedIds[entry.id] = true; // Đánh dấu ID này đã được hiển thị
              }
            }
          }
        }
      });

      // Không thêm bản ghi "Ra" vào dữ liệu hiển thị

      setDaktnc(filteredData);
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaktncFromFirestore();

    if (route.params?.fromHistory) {
      setActiveButton('DHDTMT17B');
    }
  }, [route.params]);

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
      <Text style={styles.title}>DHDTMT17B</Text>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>STT</Text>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Notes</Text>
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
              <Text style={styles.tableCell}>{entry.id}</Text>
              <Text style={styles.tableCell}>{entry.name}</Text>
              <Text style={styles.tableCellLast}>{entry.notes}</Text>
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

export default DAKTNC;
