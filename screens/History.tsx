import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import * as XLSX from "xlsx";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Buffer } from 'buffer';

import {
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import { firebase } from '@react-native-firebase/auth';

const History: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<string>('History');
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filterAction, setFilterAction] = useState<string>('');
  const [showNoteColumn, setShowNoteColumn] = useState<boolean>(false);


  const generateExcel = async (filter: string = '') => {
    try {
      // Fetch history data from Firebase
      const snapshot = await database().ref('rooms/room1/history').once('value');
      const data: any[] = [];
  
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const entry = childSnapshot.val();
          const { action, duration, idNumber, name, time } = entry;
          let note = ''; // Initialize empty note
  
          // Apply note logic based on action
          if (action === 'Ra' && duration) {
            note = `Ra ngoài ${duration} phút`;
          }
  
          // Apply filter if provided
          if (filter === '' || (filter === 'Ra' && action === 'Ra')) {
            data.push({ action, duration, idNumber, name, time, note });
          }
        });
      }
  
      // Sort data by time
      data.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
  
      // Define Excel title
      const title = [["Classroom History"]];
  
      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data, { origin: "A2" });
  
      // Add title to the worksheet
      XLSX.utils.sheet_add_aoa(worksheet, title, { origin: "A1" });
  
      // Create the workbook
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  
      // Convert workbook to buffer (Excel file as binary data)
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
      // Không cần lưu file, chỉ cần tạo buffer và mở trực tiếp
      const fileBase64 = Buffer.from(excelBuffer).toString('base64');
  
      // Chia sẻ hoặc mở file ngay lập tức
      const options = {
        url: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileBase64}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        title: 'Classroom History',
      };
  
      // Mở hoặc chia sẻ file
      await Share.open(options);
  
    } catch (error) {
      console.error("Error exporting data from Firebase to Excel:", error);
    }
  };
  
  

  const fetchHistoryFromRealtimeDatabase = async (filter: string = '') => {
    setLoading(true);
    try {
      const snapshot = await database().ref('rooms/room1/history').once('value');
      const data: any[] = [];
      const entryTimes: { [id: string]: string } = {}; // Track entry times for each ID
      const hasLateNote: { [id: string]: boolean } = {}; // Track if "Đi trễ" note has been added for an ID
      const leaveCounts: { [id: string]: number } = {}; // Track number of "Ra" actions per ID
      const lateThresholdTime = "12:30:00"; // Time threshold for "Be Late"
  
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const entry = childSnapshot.val();
          const currentAction = entry.action || '';
          const idNumber = entry.idNumber || '';
          const currentTime = entry.time || '';
          let note = ''; // Initialize empty note
  
          // Extract the time part for comparison
          const extractedTime = currentTime.split(' ')[1] || ''; // Assuming format "DD-MM-YYYY HH:MM:SS"
  
          if (currentAction === 'Vào') {
            // Check if this is the first "Vào" for the ID
            if (!entryTimes[idNumber]) {
              entryTimes[idNumber] = currentTime; // Store first "Vào" time for this ID
  
              // Apply "Đi trễ" logic only for the first "Vào"
              if (!hasLateNote[idNumber] && extractedTime > lateThresholdTime) {
                const lateMinutes = Math.floor(
                  (new Date(`1970-01-01T${extractedTime}Z`).getTime() -
                    new Date(`1970-01-01T${lateThresholdTime}Z`).getTime()) /
                    60000
                );
                if (lateMinutes > 0) {
                  note = `Đi trễ ${lateMinutes} phút`;
                  hasLateNote[idNumber] = true; // Mark that "Đi trễ" has been applied for this ID
                }
              }
            }
          } else if (currentAction === 'Ra' && entryTimes[idNumber]) {
            // Count "Ra" actions
            leaveCounts[idNumber] = (leaveCounts[idNumber] || 0) + 1;
  
            // Check for leave duration and frequency
            const entryTime = new Date(entryTimes[idNumber]);
            const leaveTime = new Date(currentTime);
            const duration = Math.floor((leaveTime.getTime() - entryTime.getTime()) / 60000); // Duration in minutes
  
            if (duration >= 30) {
              note = `Ra ngoài ${duration} phút`;
            }
  
            if (leaveCounts[idNumber] >= 3) {
              note = note ? `${note}, Ra ${leaveCounts[idNumber]} lần` : `Ra ${leaveCounts[idNumber]} lần`;
            }
  
            // Reset entry time for the next "Vào"
            entryTimes[idNumber] = '';
          }
  
          // Add the entry to data based on the filter
          if (filter === 'Vào' && currentAction === 'Vào') {
            data.push({ ...entry, note });
          } else if (filter === 'Ra' && currentAction === 'Ra') {
            data.push({ ...entry, note });
          } else if (filter === 'Be Late' && note.includes('Đi trễ')) {
            data.push({ ...entry, note });
          } else if (
            filter === 'Cần chú ý' &&
            (note.includes('Ra ngoài') || note.includes('Ra'))
          ) {
            data.push({ ...entry, note });
          } else if (!filter) {
            data.push({ ...entry, note });
          }
        });
      }
  
      // Sort data by time
      data.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history from Realtime Database:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleToolbarItemPress = () => {
    setModalVisible(true);
  };

  const handleModalButtonPress = (buttonName: string) => {
    setModalVisible(false); // Close the modal after pressing a button
  
    if (buttonName === 'PDF') {
      generateExcel(); // Gọi hàm tạo PDF
    } else {
      // Các hành động khác như đã làm trong mã trước
      if (buttonName === 'Vào') {
        setFilterAction('Vào');
        fetchHistoryFromRealtimeDatabase('Vào'); // Fetch only "Vào" action records
        setShowNoteColumn(false); // Hide the Note column for "Vào"
      } else if (buttonName === 'Ra') {
        setFilterAction('Ra');
        fetchHistoryFromRealtimeDatabase('Ra'); // Fetch only "Ra" action records
        setShowNoteColumn(false); // Hide the Note column for "Ra"
      } else if (buttonName === 'Be Late') {
        setFilterAction('Be Late');
        fetchHistoryFromRealtimeDatabase('Be Late'); // Fetch only "Be Late" action records
        setShowNoteColumn(true); // Show the Note column for "Be Late"
      } else if (buttonName === 'Cần chú ý') {
        setFilterAction('Cần chú ý');
        fetchHistoryFromRealtimeDatabase('Cần chú ý'); // Fetch records that need attention
        setShowNoteColumn(true); // Show the Note column for "Cần chú ý"
      } else {
        setFilterAction(''); // Reset the filter
        setShowNoteColumn(false); // Hide the Note column by default
        fetchHistoryFromRealtimeDatabase(); // Fetch all records
      }
    }
  };
  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleToolbarItemPress} style={styles.toolbarButton}>
          <Text style={styles.toolbarButtonText}>LỌC</Text>
        </TouchableOpacity>
      ),
    });

    const timer = setTimeout(() => {
      fetchHistoryFromRealtimeDatabase();
    }, 200);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleButtonPress = (buttonName: string) => {
    if (buttonName === activeButton) {
      fetchHistoryFromRealtimeDatabase();
      setShowNoteColumn(true); 
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
              {showNoteColumn && (
              <Text style={styles.tableHeaderText}>Note</Text> // Thêm cột "Note" nếu showNoteColumn là true
              )}
            
            </View>
            {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Đang cập nhật dữ liệu...</Text>
          </View>
            ) : historyData.length > 0 ? (
            historyData.map((entry, index) => (
      <View key={index} style={styles.tableRow}>
      <Text style={styles.tableCell}>{index + 1}</Text>
      <Text style={styles.tableCell}>{entry.time}</Text>
      <Text style={styles.tableCell}>{entry.idNumber}</Text>
      <Text style={styles.tableCell}>{entry.name}</Text>
      <Text style={styles.tableCell}>{entry.action}</Text>
      {showNoteColumn && (
        <Text style={styles.tableCell}>{entry.note}</Text> // Display "Note" if available
      )}
    </View>
  ))
) : (
    <Text style={styles.loadingText}>Không có dữ liệu!</Text>
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

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalButtonPress('Vào')}
            >
              <Text style={styles.modalButtonText}>VÀO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalButtonPress('Ra')}
            >
              <Text style={styles.modalButtonText}>RA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalButtonPress('Be Late')}
            >
              <Text style={styles.modalButtonText}>ĐI TRỄ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalButtonPress('Cần chú ý')}
            >
              <Text style={styles.modalButtonText}>CẦN CHÚ Ý</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleModalButtonPress('PDF')}
            >
              <Text style={styles.modalButtonText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  toolbarButton: { marginRight: 15, padding: 8, backgroundColor: '#007bff', borderRadius: 5 },
  toolbarButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default History;
