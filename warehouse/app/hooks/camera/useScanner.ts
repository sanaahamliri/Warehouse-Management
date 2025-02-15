import { CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from 'react';

export default function useScanner() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            if (permission === null) {
                const { status } = await requestPermission();
                if (status !== 'granted') {
                    alert('Sorry, we need camera permissions to make this work!');
                }
            }
        })();
    }, [permission, requestPermission]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        return data;
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
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