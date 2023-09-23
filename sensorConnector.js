// // sensorConnector.js
// async function connectToSensor() {
//     try {
//         //blutoothデバイスの要求
//         const device = await navigator.bluetooth.requestDevice({
//             filters: [
//                 { services: ['00001816-0000-1000-8000-00805f9b34fb'] }
//             ],
//         });
//         console.log("1", device);

//         //GATTサーバへの接続
//         const server = await device.gatt.connect();
//         console.log("2", server);

//         //サービスの取得（特定のサービスに関する情報を持つサービスを取得）
//         const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
//         console.log("3", service);

//         //特性の取得（サービス内には１つ以上の特性が含まれている。特性はデバイスが提供する具体的なデータや機能を意味する。）
//         // const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
//         const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');

//         console.log("4", characteristic);

//         const value = await characteristic.readValue();
//         const cadenceDisplay = document.getElementById('cadenceValue');
//         if (cadenceDisplay) {
//             cadenceDisplay.textContent = `取得値: ${value.getUint8(0)} RPM`;
//         } else {
//             const cadenceInfoDiv = document.getElementById('cadenceInfo');
//             if (cadenceInfoDiv) {
//                 cadenceInfoDiv.innerHTML += "<p>null</p>";
//             } else {
//                 console.error('cadenceInfo element not found in the DOM');
//             }
//         }
        
//         console.log("5", value);
//         console.log('Cadence value:', value.getUint8(0));
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }


// sensorConnector.js

// 通知を受け取るためのハンドラ関数を追加
function handleCadenceMeasurement(event) {
    const value = event.target.value;
    const rpm = value.getUint16(1, true); // little-endianで値を読み取る
    console.log('Received RPM:', rpm);
    
    const cadenceDisplay = document.getElementById('cadenceValue');
    if (cadenceDisplay) {
        cadenceDisplay.textContent = `取得値: ${rpm} RPM`;
    }
}

async function connectToSensor() {
    try {
        //blutoothデバイスの要求
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['00001816-0000-1000-8000-00805f9b34fb'] }
            ],
        });
        console.log("1", device);

        //GATTサーバへの接続
        const server = await device.gatt.connect();
        console.log("2", server);

        //サービスの取得（特定のサービスに関する情報を持つサービスを取得）
        const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
        console.log("3", service);


        //特性の取得
        const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
        console.log("4", characteristic);

        // // 通知を受け取るためのコードを追加
        // characteristic.addEventListener('characteristicvaluechanged', handleCadenceMeasurement);
        // await characteristic.startNotifications();

        // 通知を開始する
        await characteristic.startNotifications();

        // ケイデンスの値が変わったときのイベントハンドラを設定
        characteristic.oncharacteristicvaluechanged = (event) => {
            const value = event.target.value;
            console.log("Received cadence value:", value);
            const rpm = value.getUint16(0, true); // 注意: データ形式によっては変更が必要です
            const cadenceDisplay = document.getElementById('cadenceValue');
            if (cadenceDisplay) {
                cadenceDisplay.textContent = `取得値: ${rpm} RPM`;
            } else {
                console.error('cadenceValue element not found in the DOM');
            }
        };

        console.log("5", characteristic);

        
    } catch (error) {
        console.error('Error:', error);
    }
}
