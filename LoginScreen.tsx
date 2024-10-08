// LoginScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Button, Text, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [message, setMessage] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage('Chưa nhập tài khoản và mật khẩu.');
      return;
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      setMessage('Đăng nhập thành công!');
      navigation.navigate('DAKTNC'); 
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error: any) => {
    console.error(error); // Ghi log lỗi
    if (error.code === 'auth/wrong-password') {
      setMessage('Mật khẩu không chính xác.');
    } else if (error.code === 'auth/user-not-found') {
      setMessage('Không tìm thấy tài khoản.');
    } else {
      setMessage('Đã xảy ra lỗi khi đăng nhập.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.message}>{message}</Text>
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
      </View>
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '80%',
  },
  message: {
    marginBottom: 16,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default LoginScreen;
