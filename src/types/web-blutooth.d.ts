interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  }
  
  interface Navigator {
    bluetooth: Bluetooth;
  }
  
  interface BluetoothDevice {
    gatt: BluetoothRemoteGATTServer;
  }
  
  interface BluetoothRemoteGATTServer {
    connect(): Promise<BluetoothRemoteGATTServer>;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }
  
  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }
  
  interface BluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
    // 必要に応じてwriteValueやstartNotificationsなどのメソッドも追加できます
  }
  
  interface RequestDeviceOptions {
    filters: Array<{ services: string[] }>;
    // 必要に応じてoptionalServicesやname、namePrefixなどのオプションも追加できます
  }
  