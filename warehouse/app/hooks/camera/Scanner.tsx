import { CameraView } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useScanner from './useScanner';

interface ScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
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
        const barcode = handleBarCodeScanned({ type, data });
        onScan(barcode);
        onClose();
    };

    if (!permission) {
        return <View />;
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
                onBarcodeScanned={scanned ? undefined : handleScan}
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