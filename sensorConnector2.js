let cadenceValue = [];
let timestamps = [];

function updateData(value){
    let now = new Date().getDate();

    cadenceValue.push(value);
    timestamps.push(now);

    // 10秒以上前のデータを削除
    while(timestamps[0] < now - 1000){
        timestamps.shift();
        cadenceValue.shift();
    }
}

//RPM計算関数の作成
function calculateRPM(){
    let uniqueValue = [...new Set(cadenceValue)]; //重複値の削除
    let initialValue = uniqueValue[0];

    let rotations = uniqueValue.map(value => value - initialValue); //初期値からの差を取得
    let totalRotations = rotations.reduce((acc, cur) => acc + cur, 0);

    let rpm = totalRotations /(timestamps.length / 1000); //RPM計算
    return rpm
}

function handleCadenceMeasurement(event){
    const value = event.target?.value;
    if(!value){
        console.error("No value received from characteristic");
        return;
    }

    //受信したデータの解析や変更は必要に応じて行う
    const cadence = value.getUint16(0,true);

    updateData(cadence);
    const currentRpm = calculateRPM();

    console.log("Current RPM:" ,currentRpm);
}

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
