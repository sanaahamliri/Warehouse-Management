import { CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from 'react';

export default function useScanner() {
    const [facing, setFacing] = useState<CameraType>('back'); // State to manage camera facing
    const [permission, requestPermission] = useCameraPermissions(); // Hook to manage camera permissions
    const [scanned, setScanned] = useState(false); // State to track if a barcode has been scanned

    useEffect(() => {
        (async () => {
            if (permission === null) {
                const { status } = await requestPermission(); // Request permission if it hasn't been determined yet
                if (status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!');
                }
            }
        })();
    }, [permission, requestPermission]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true); // Set scanned to true
        return data; // Return the scanned data
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back')); // Toggle between front and back camera
    }

    return {
        facing,
        permission,
        scanned,
        setScanned,
        requestPermission,
        handleBarCodeScanned,
        toggleCameraFacing,
    }
} 