import { CameraView } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useScanner from './useScanner';

interface ScannerProps {
  onScan: (barcode: string) => void; // Callback for when a barcode is scanned
  onClose: () => void; // Callback for closing the scanner
}

export default function Scanner({ onScan, onClose }: ScannerProps) {
    const {
        facing,
        permission,
        scanned,
        setScanned,
        requestPermission,
        handleBarCodeScanned,
        toggleCameraFacing,
    } = useScanner();

    const handleScan = ({ type, data }: { type: string; data: string }) => {
        const barcode = handleBarCodeScanned({ type, data }); // Handle the scanned barcode
        onScan(barcode); // Call the onScan callback with the scanned barcode
        onClose(); // Close the scanner
    };

    if (!permission) {
        return <View />; // Render nothing if permission is not requested
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView 
                style={styles.camera} 
                facing={facing} 
                onBarcodeScanned={scanned ? undefined : handleScan} // Handle barcode scanning
            >
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                        <Text style={styles.buttonText}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
    },
    message: {
        textAlign: 'center',
        color: 'white',
        padding: 20,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    closeText: {
        color: 'white',
        fontSize: 28,
    },
    flipButton: {
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
}); 