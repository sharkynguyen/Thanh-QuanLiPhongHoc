// screens/IntermediateScreen.tsx 
import React, { useState } from 'react'; // Nhập React và useState
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, ImageBackground, View, Alert } from 'react-native'; // Nhập các thành phần cần thiết từ React Native

const IntermediateScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null); // Trạng thái để lưu l

  const handleEmptyPress = (className: string) => {
    setSelectedClass(className); // Cập nhật lớp đã chọn
    Alert.alert(
      'Thông báo',
      `${className} chưa có dữ liệu`, // Thông báo khi lớp chưa có dữ liệu
      [{ text: 'OK' }], 
      { cancelable: false } // Không cho phép hủy thông báo
    ); 
  };

  return (
    <SafeAreaView style={styles.container}> 
      <Text style={styles.title}>DANH SÁCH LỚP</Text>
      <ImageBackground source={require('../assets/logoBackground.png')} style={styles.logoBackGround}>
        <View style={styles.table}>
          <View style={styles.table_Row}>
            <View style={styles.table_Column}>
              <TouchableOpacity style={styles.classButton} onPress={() => navigation.navigate('NHÓM 6')}>
                <Text style={styles.classButtonText}>DHDTMT17B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 2')}>
                <Text style={styles.classButtonText}>Class 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 3')}>
                <Text style={styles.classButtonText}>Class 3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 4')}>
                <Text style={styles.classButtonText}>Class 4</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.table_Column}>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 5')}>
                <Text style={styles.classButtonText}>Class 5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 6')}>
                <Text style={styles.classButtonText}>Class 6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 7')}>
                <Text style={styles.classButtonText}>Class 7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.classButton} onPress={() => handleEmptyPress('Class 8')}>
                <Text style={styles.classButtonText}>Class 8</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 30 },
  logoBackGround: { opacity: 0.5, width: 350, height: 350, marginBottom: 10, alignSelf: 'center' },
  table: { flexDirection: 'column', justifyContent: 'space-around' },
  table_Row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  table_Column: { flex: 1, padding: 5 },
  classButton: {
    borderColor: '#696969',
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
  classButtonText: { color: 'black', fontWeight: 'bold' },
});

export default IntermediateScreen;
