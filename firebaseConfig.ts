// firebaseConfig.ts
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCK3JDDhMXLLtKu5IcnZIli0oPbcGg0DjQ",
  authDomain: "quanliphonghoc.firebaseapp.com",
  databaseURL: "https://quanliphonghoc-default-rtdb.firebaseio.com",
  projectId: "quanliphonghoc",
  storageBucket: "quanliphonghoc.appspot.com",
  messagingSenderId: "930500309867",
  appId: "1:930500309867:android:47b584146d1f4656acd22e",
};

// Kiểm tra và khởi tạo Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
