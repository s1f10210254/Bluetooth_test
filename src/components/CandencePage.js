"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// ケイデンスページのコンポーネント
const CadencePage = () => {
    // センサーへの接続とデータ取得を行う関数
    const connectToSensor = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Bluetoothデバイスをブラウザから選択して接続
            // ここでは特定のサービスUUIDを持つデバイスをフィルタリングしています
            const device = yield navigator.bluetooth.requestDevice({
                filters: [
                    { services: ['00001816-0000-1000-8000-00805f9b34fb'] }, // Cycling Speed and CadenceのサービスUUID
                ],
            });
            // センサーのGATTサーバーに接続
            const server = yield device.gatt.connect();
            // 指定したUUIDのサービスを取得
            const service = yield server.getPrimaryService('00001816-0000-1000-8000-00805f9b34fb');
            // サービス内のCSC Measurementキャラクタリスティックを取得
            const characteristic = yield service.getCharacteristic('00002a5b-0000-1000-8000-00805f9b34fb');
            // キャラクタリスティックの現在の値を読み取り
            const value = yield characteristic.readValue();
            // コンソールにケイデンスの値を表示
            console.log('Cadence value:', value.getUint8(0));
        }
        catch (error) {
            // エラーが発生した場合はコンソールに出力
            console.error('Error:', error);
        }
    });
    // レンダリング部分
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("button", { onClick: connectToSensor }, "Connect to Cadence Sensor")));
};
// このコンポーネントを外部から利用できるようにエクスポート
exports.default = CadencePage;
