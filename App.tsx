// App.tsx
import React from 'react'; // Nhập React để sử dụng JSX và các thành phần React
import { NavigationContainer } from '@react-navigation/native'; // Nhập NavigationContainer để sử dụng điều hướng
import { createStackNavigator } from '@react-navigation/stack'; // Nhập createStackNavigator để sử dụng điều hướng theo ngăn xếp
import Login from './screens/Login'; // Nhập thành phần màn hình Đăng nhập
import IntermediateScreen from './screens/IntermediateScreen'; // Nhập thành phần màn hình Trung gian
import DAKTNC from './screens/DAKTNC'; // Nhập thành phần màn hình DAKTNC
import History from './screens/History'; // Nhập thành phần màn hình Lịch sử
// Tạo một thể hiện Stack Navigator
const Stack = createStackNavigator();

// Thành phần chính của ứng dụng
const App: React.FC = () => {
  return (
    // Bọc ứng dụng trong NavigationContainer để kích hoạt điều hướng
    <NavigationContainer>
      {/* Stack.Navigator chứa các màn hình khác nhau trong ứng dụng */}
      <Stack.Navigator initialRouteName="Login"> 
        {/* Thuộc tính initialRouteName thiết lập màn hình đầu tiên hiển thị khi ứng dụng tải */}
        <Stack.Screen
          name="Login" // Tên của tuyến đường
          options={{ headerTitle: 'NHÓM 6 - DHDTMT17B', headerTitleAlign: 'center' }} 
          // Thành phần để hiển thị cho tuyến đường này
          component={Login} 
        />
        <Stack.Screen 
          name="NHÓM 6 - DHDTMT17B" 
          component={IntermediateScreen} 
        />
        <Stack.Screen 
          name="NHÓM 6" 
          component={DAKTNC} 
        />
        <Stack.Screen 
          name="History" 
          component={History} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Xuất thành phần App như là xuất mặc định
export default App;
