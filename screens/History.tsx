import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ScrollView, View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';

const History: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('History');
  const [loading, setLoading] = useState<boolean>(true);

  const formatDuration = (durationInSeconds: number): string => {
    if (durationInSeconds === 0) return ''; // Không hiển thị nếu duration là 0

    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const fetchHistoryFromRealtimeDatabase = async () => {
    setLoading(true);
    try {
      const snapshot = await database()
        .ref('rooms/room1/history')
        .once('value');

      const data: any[] = [];
      snapshot.forEach(childSnapshot => {
        const entry = childSnapshot.val();
        data.push({
          time: entry.time || '',
          idNumber: entry.idNumber || '',
          name: entry.name || '',
          action: entry.action || '',
          duration: entry.duration || 0,
        });
      });

      data.sort((a, b) => {
        const timeA = Date.parse(a.time);
        const timeB = Date.parse(b.time);
        return timeA - timeB;
      });

      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history from Realtime Database:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistoryFromRealtimeDatabase();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchHistoryFromRealtimeDatabase();
    } else {
      setActiveButton(buttonName);
      if (buttonName === 'DHDTMT17B') {
        navigation.navigate('NHÓM 6', { fromHistory: true });
      } else {
        fetchHistoryFromRealtimeDatabase();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HISTORY</Text>
      <ScrollView style={styles.scrollContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>STT</Text>
              <Text style={styles.tableHeaderText}>Time</Text>
              <Text style={styles.tableHeaderText}>ID</Text>
              <Text style={styles.tableHeaderText}>Name</Text>
              <Text style={styles.tableHeaderText}>Action</Text>
              <Text style={styles.tableHeaderText}>Duration</Text>
            </View>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Đang cập nhật dữ liệu...</Text>
              </View>
            ) : (
              historyData.length > 0 ? (
                historyData.map((entry, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{index + 1}</Text>
                    <Text style={styles.tableCell}>{entry.time}</Text>
                    <Text style={styles.tableCell}>{entry.idNumber}</Text>
                    <Text style={styles.tableCell}>{entry.name}</Text>
                    <Text style={styles.tableCell}>{entry.action}</Text>
                    {/* Chỉ hiển thị Duration nếu không phải là 0 */}
                    {entry.duration > 0 ? (
                      <Text style={styles.tableCellLast}>
                        {formatDuration(entry.duration)}
                      </Text>
                    ) : (
                      <Text style={styles.tableCellLast}>-</Text> // Hoặc hiển thị dấu gạch ngang nếu không có duration
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.loadingText}>Không có dữ liệu!</Text>
              )
            )}
          </View>
        </ScrollView>
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
  tableHeader: { 
    flexDirection: 'row', 
    padding: 1, 
    borderBottomWidth: 1, 
    borderBottomColor: '#000', 
    backgroundColor: '#f1f1f1' 
  },
  tableHeaderText: { 
    flex: 1, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: 'black', 
    borderRightWidth: 1, 
    borderRightColor: '#000',
    paddingVertical: 5, 
    width: 100 
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: 5, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd'
  },
  tableCell: {  
    textAlign: 'center', 
    paddingVertical: 5,
    color: 'black', 
    borderRightWidth: 1, 
    borderRightColor: '#ddd',
    width: 100 
  },
  tableCellLast: { 
    flex: 1, 
    textAlign: 'center', 
    paddingVertical: 5,
    color: 'black' 
  }, 
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  loadingText: { textAlign: 'center', marginVertical: 10, fontSize: 16, color: 'black' },
  buttonContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  button: { padding: 10, flex: 1, alignItems: 'center', borderRadius: 5, marginHorizontal: 5 },
  activeButton: { backgroundColor: '#007bff' },
  inactiveButton: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default History;
