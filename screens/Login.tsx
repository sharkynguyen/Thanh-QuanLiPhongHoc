import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Text, TouchableOpacity, StyleSheet, Image, Alert, Modal, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'; // Nhập Firebase Auth để xử lý xác thực
import firestore from '@react-native-firebase/firestore'; // Nhập Firestore để tương tác với cơ sở dữ liệu
import firebase from '../firebaseConfig'; // Điều chỉnh việc nhập dựa trên cấu trúc thư mục của bạn
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo để kiểm tra trạng thái kết nối mạng

const Login: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // Trạng thái để lưu thông tin kết nối mạng
  const [isLoading, setIsLoading] = useState<boolean>(false); // Để điều khiển modal tải
  const [hasTimeoutOccurred, setHasTimeoutOccurred] = useState<boolean>(false); // Theo dõi xem thời gian chờ có xảy ra hay không

  // Kiểm tra trạng thái mạng khi thành phần được gắn
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected); // Cập nhật trạng thái kết nối mạng
    });

    return () => {
      unsubscribe(); // Hủy bỏ lắng nghe khi thành phần được gỡ bỏ
    };
  }, []);

  const handleLogin = async () => {
    // Xác thực các trường nhập mà không hiển thị biểu tượng tải
    if (!email && !password) {
      Alert.alert('Thông báo', 'Chưa nhập Email và Password');
      return;
    }
    if (!email) {
      Alert.alert('Thông báo', 'Chưa nhập Email');
      return;
    }
    if (!password) {
      Alert.alert('Thông báo', 'Chưa nhập Password');
      return;
    }

    setIsLoading(true); // Hiển thị modal tải khi kiểm tra kết nối mạng
    setHasTimeoutOccurred(false); // Đặt lại trạng thái thời gian chờ

    let connectionStatus = isConnected;

    // Bắt đầu bộ đếm thời gian 10 giây để kiểm tra trạng thái mạng
    const timeout = setTimeout(() => {
      if (!connectionStatus) {
        setIsLoading(false); // Ẩn modal tải
        setHasTimeoutOccurred(true); // Đánh dấu rằng thời gian chờ đã xảy ra
        Alert.alert('Thông báo', 'Chưa kết nối internet');
      }
    }, 10000);

     // Kiểm tra kết nối mạng trong vòng 10 giây
    const interval = setInterval(() => {
      NetInfo.fetch().then((state) => {
        connectionStatus = state.isConnected; // Cập nhật trạng thái kết nối

        if (connectionStatus && !hasTimeoutOccurred) {
           // Nếu kết nối trong vòng 10 giây, tiến hành đăng nhập
          clearInterval(interval); // Dừng kiểm tra kết nối sau khi đã kết nối
          clearTimeout(timeout); // Hủy bỏ thời gian chờ nếu đã kết nối
          attemptLogin(); // Tiến hành đăng nhập nếu đã kết nối
        }
      });
    }, 1000); // Check every second

    const attemptLogin = async () => {
      try {
        await auth().signInWithEmailAndPassword(email, password);
        setIsLoading(false); // Ẩn modal tải khi đăng nhập thành công
        navigation.navigate('NHÓM 6 - DHDTMT17B'); // Chuyển hướng đến màn hình sau khi đăng nhập
      } catch (error: any) {
        setIsLoading(false); // Ẩn modal tải trước khi hiển thị thông báo lỗi

         // Ngăn không cho hiển thị thông báo nhiều lần
        if (!hasTimeoutOccurred) {
          Alert.alert('Thông báo', 'Email hoặc Password không chính xác');
          setHasTimeoutOccurred(true); // Đánh dấu rằng thông báo đã được hiển thị
        }
      }
    };

    // Nếu đã kết nối ngay từ đầu, tiến hành đăng nhập ngay lập tức
    if (isConnected) {
      attemptLogin();
    }

     // Dọn dẹp sau 10 giây
    setTimeout(() => {
      clearInterval(interval); // Dừng kiểm tra sau thời gian chờ để tránh kiểm tra thêm
    }, 10000);
  };

  const saveDataToFirestore = async () => {
    try {
      await firestore().collection('daktnc').add({ // Lưu dữ liệu vào Firestor
        createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Thêm thời gian tạo
      });
    } catch (error) {
      console.error('Error saving data to Firestore:', error); // Ghi lỗi nếu có lỗi xảy ra
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logoLogin.png')} style={styles.logo} />
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input} // Trường nhập cho email
        placeholder="Email" // Địa chỉ nhắc nhở
        placeholderTextColor={'gray'} // Màu chữ nhắc nhở
        value={email} // Giá trị của trường nhập
        onChangeText={setEmail} // Cập nhật giá trị khi thay đổi
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={'gray'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Ẩn mật khẩu khi nhập
      />
      <TouchableOpacity
        style={styles.loginButton} // Nút đăng nhập
        onPress={handleLogin} // Gọi hàm handleLogin khi nhấn nút
      >
        <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      {/* Modal với ActivityIndicator cho biểu tượng tải */}
      <Modal
        visible={isLoading} // Hiện modal khi isLoading là true
        transparent={true} // Làm cho modal trong suốt
        animationType="none" // Không có hoạt ảnh
        onRequestClose={() => setIsLoading(false)}
      >
        <View style={styles.modalBackground}> 
          <View style={styles.activityIndicatorWrapper}> 
            <ActivityIndicator size="large" color="#007bff" /> 
            <Text style={styles.loadingText}>Đang kết nối...</Text> 
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    marginBottom: 30,
  },
  input: {
    borderColor: "#3399FF",
    borderWidth: 3,
    borderRadius: 30,
    width: 350,
    height: 50,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 10,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 5,
    width: 350,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  logo: {
    width: 350,
    height: 170,
    marginBottom: 10,
    alignSelf: 'center',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Login;
