import React from 'react';

// ケイデンスページのコンポーネント
const CadencePage: React.FC = () => {
  // センサーへの接続とデータ取得を行う関数
  const connectToSensor = async () => {
    try {
      // Bluetoothデバイスをブラウザから選択して接続
      // ここでは特定のサービスUUIDを持つデバイスをフィルタリングしています
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['00001816-0000-1000-8000-00805f9b34fb'] }, // Cycling Speed and CadenceのサービスUUID
        ],
      });

      // センサーのGATTサーバーに接続
      const server = await device.gatt.connect();
      // 指定したUUIDのサービスを取得
      const service = await server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
      // サービス内のCSC Measurementキャラクタリスティックを取得
      const characteristic = await service.getCharacteristic(
        '00002a5b-0000-1000-8000-00805f9b34fb'
      );
      // キャラクタリスティックの現在の値を読み取り
      const value = await characteristic.readValue();

      // コンソールにケイデンスの値を表示
      console.log('Cadence value:', value.getUint8(0));
    } catch (error) {
      // エラーが発生した場合はコンソールに出力
      console.error('Error:', error);
    }
  };

  // レンダリング部分
  return (
    <div>
      {/* 接続ボタン。クリック時にconnectToSensor関数が実行される */}
      <button onClick={connectToSensor}>Connect to Cadence Sensor</button>
    </div>
  );
};

// このコンポーネントを外部から利用できるようにエクスポート
export default CadencePage;
