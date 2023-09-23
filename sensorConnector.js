// sensorConnector.js
async function connectToSensor() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['00001816-0000-1000-8000-00805f9b34fb'] }
            ],
        });
        console.log("1", device);

        const server = await device.gatt.connect();
        console.log("2", server);

        const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
        console.log("3", service);

        const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
        console.log("4", characteristic);

        const value = await characteristic.readValue();
        const cadenceDisplay = document.getElementById('cadenceValue');
        if (cadenceDisplay) {
            cadenceDisplay.textContent = `取得値: ${value.getUint8(0)} RPM`;
        } else {
            const cadenceInfoDiv = document.getElementById('cadenceInfo');
            if (cadenceInfoDiv) {
                cadenceInfoDiv.innerHTML += "<p>null</p>";
            } else {
                console.error('cadenceInfo element not found in the DOM');
            }
        }
        
        console.log("5", value);
        console.log('Cadence value:', value.getUint8(0));
    } catch (error) {
        console.error('Error:', error);
    }
}
