import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';

interface PDFViewerProps {
  pdfUri: string; // Specify that pdfUri should be a string
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUri }) => {
  const pdfRef = useRef<Pdf>(null); // Specify type for the ref
  const pdfSource = { uri: pdfUri, cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        ref={pdfRef}
        source={pdfSource}
        style={styles.pdf}
        onError={(error) => {
          console.log(error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
});

export default PDFViewer;
