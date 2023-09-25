// sensorConnector.js

let rpmData = [];


function updateRpmValue(rpm){
    const timestamp = new Date().getTime();
    console.log("Received RPM:", rpm);

    
    const cumulativeRpm = rpm + (rpmData.length > 0 ? rpmData[rpmData.length - 1].cumulativeRpm : 0);

    rpmData.push({ rpm,cumulativeRpm, timestamp }); //履歴に追加

    // 10秒以前のデータを削除
    const tenSecondsAgo = timestamp - 10000;
    rpmData = rpmData.filter(data => data.timestamp > tenSecondsAgo);

    console.log("RPM Data (last 10 seconds):", rpmData);
    
    const averageRpm = getTenSecondAverageRpm(timestamp);
    console.log("10-second average RPM:", averageRpm);
    displayRpm(averageRpm);
}

function getRpmDifferenceOverLast10Seconds(currentTimestamp) {
    const tenSecondsAgo = currentTimestamp - 10000;
    const previousData = rpmData.find(data => data.timestamp <= tenSecondsAgo);

    if (!previousData) return rpmData[0].cumulativeRpm;

    return rpmData[rpmData.length - 1].cumulativeRpm - previousData.cumulativeRpm;
}

function getTenSecondAverageRpm(currentTimestamp){
    const difference = getRpmDifferenceOverLast10Seconds(currentTimestamp);
    return difference / 10;
}

function displayRpm(rpm){
    const cadenceDisplay = document.getElementById("cadenceValue");
    if(cadenceDisplay){
        cadenceDisplay.textContent = `取得値: ${Math.round(rpm)} RPM`;
    }
}


function handleCadenceMeasurement(event){
    const value = event.target?.value;
    if(!value){
        console.error("No value received from characteristec");
        return;
    }
    const rpm = value.getUint16(0, t1ue);
    updateRpmValue(rpm)
}

// 通知を受け取るためのハンドラ関数を追加
// function handleCadenceMeasurement(event) {
//     const value = event.target.value;
//     const rpm = value.getUint16(1, true); // little-endianで値を読み取る
//     console.log('Received RPM:', rpm);
    
//     const cadenceDisplay = document.getElementById('cadenceValue');
//     if (cadenceDisplay) {
//         cadenceDisplay.textContent = `取得値: ${rpm} RPM`;
//         localStorage.removeItem('rpmValue')
//     }
// }

// function resetRPM(){
//     const candenceDisplay = document.getElementById('cadenceValue');
//     if(candenceDisplay){
//         candenceDisplay.textContent = ''
//     }
// }
async function connectToSensor() {
    try {
        //blutoothデバイスの要求
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['00001816-0000-1000-8000-00805f9b34fb'] }
            ],
            optionalServices: ['0000180f-0000-1000-8000-00805f9b34fb']
        });
        console.log("1", device);

        //GATTサーバへの接続
        const server = await device.gatt.connect();
        console.log("2", server);

        //サービスの取得（ケイデンスセンサーのサービスを取得）
        const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
        console.log("3", service);

        // バッテリーサービスの取得
        const batteryService = await server.getPrimaryService('0000180f-0000-1000-8000-00805f9b34fb');

        // バッテリーレベルの特性を取得
        const batteryCharacteristic = await batteryService.getCharacteristic('00002a19-0000-1000-8000-00805f9b34fb');

        // バッテリーレベルの値を読み取る
        const batteryValue = await batteryCharacteristic.readValue();
        const batteryPercent = batteryValue.getUint8(0);
        console.log("Battery Level:", batteryPercent);

        // HTMLにバッテリーレベルを表示
        const batteryDisplay = document.getElementById('batteryLevel');
        if (batteryDisplay) {
            batteryDisplay.textContent = `バッテリー残量: ${batteryPercent}%`;
        }


        //特性の取得（CSC Feature）
        const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
        console.log("4", characteristic);

        // 通知を受け取るためのコードを追加
        characteristic.addEventListener('characteristicvaluechanged', handleCadenceMeasurement);
        await characteristic.startNotifications();
        

        console.log("5", characteristic);

        
    } catch (error) {
        console.error('Error:', error);
    }
}
