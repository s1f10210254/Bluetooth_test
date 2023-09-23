import React from "react";
export async function connectToSensor() {
    try {
        //Bluetoothデバイスに接続を試みる
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { services: ['00001816-0000-1000-8000-00805f9b34fb'] }
            ],
        });
        console.log("1", device)

        // 選択されたデバイスのGATT(Generic Attribute Profile)サーバに接続する
        const server = await device.gatt.connect();
        console.log("2", server)

        const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
        console.log("3", service)

        const characteristic = await service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
        console.log("4", characteristic)

        const value = await characteristic.readValue();
        console.log("5", value)
        console.log('Cadence value:', value.getUint8(0));
    } catch (error) {
        console.error('Error:', error);
    }

    return(
        <div>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Web Bluetooth Example</title>
            </head>

            <body>
                <button onClick={connectToSensor}>センサーに接続</button>
            </body>
        </div>
    )
}
