// screens/ClassSelection.tsx
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClassSelection: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState<string>('');

  const handleClassSelection = (className: string) => {
    setSelectedClass(className);
    navigation.navigate('NHÓM 6', { selectedClass: className });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>CHỌN LỚP</Text>
      <TouchableOpacity style={styles.classButton} onPress={() => handleClassSelection('DHDTMT17B')}>
        <Text style={styles.classButtonText}>DHDTMT17B</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.classButton} onPress={() => handleClassSelection('AnotherClass')}>
        <Text style={styles.classButtonText}>AnotherClass</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ffffff' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: 'black', marginBottom: 30 },
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

export default ClassSelection;
