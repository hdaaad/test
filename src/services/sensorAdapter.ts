/**
 * EZMaker 소리 센서 데이터 입력 어댑터 모듈
 * 
 * [설계 의도]
 * 오늘은 사용자가 직접 측정값을 수동으로 입력하여 테스트하고,
 * 내일 피지컬 컴퓨팅 과학실험 해커톤에서는 EZMaker 소리센서(Web Serial 또는 Web Bluetooth)로부터
 * 실시간 측정값을 받아 자동으로 채워 넣을 수 있도록 데이터 입력 레이어를 완벽히 분리했습니다.
 */

export interface SensorDeviceState {
  isConnected: boolean;
  connectionType: 'none' | 'serial' | 'bluetooth';
  deviceName: string | null;
  currentReading: number | null;
  lastError: string | null;
}

export type SensorDataListener = (value: number) => void;

class EZMakerSensorManager {
  private state: SensorDeviceState = {
    isConnected: false,
    connectionType: 'none',
    deviceName: null,
    currentReading: null,
    lastError: null,
  };

  private listeners: Set<SensorDataListener> = new Set();
  private isSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;
  private isBluetoothSupported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

  public getState(): SensorDeviceState {
    return { ...this.state };
  }

  public checkSupport() {
    return {
      serial: this.isSerialSupported,
      bluetooth: this.isBluetoothSupported,
    };
  }

  public subscribe(listener: SensorDataListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(value: number) {
    this.state.currentReading = value;
    this.listeners.forEach((listener) => listener(value));
  }

  /**
   * [내일 해커톤 연동용] Web Serial API 연결 준비 인터페이스
   */
  public async connectSerial(): Promise<boolean> {
    if (!this.isSerialSupported) {
      this.state.lastError = '현재 브라우저가 Web Serial API를 지원하지 않습니다 (Chrome/Edge 권장).';
      return false;
    }

    try {
      // 내일 실제 포트 오픈 로직을 넣을 수 있도록 준비된 슬롯
      // const port = await (navigator as any).serial.requestPort();
      // await port.open({ baudRate: 115200 });
      this.state.isConnected = true;
      this.state.connectionType = 'serial';
      this.state.deviceName = 'EZMaker Sound Sensor (Serial COM)';
      this.state.lastError = null;
      return true;
    } catch (err: any) {
      this.state.lastError = err?.message || '시리얼 포트 연결에 실패했습니다.';
      return false;
    }
  }

  /**
   * [내일 해커톤 연동용] Web Bluetooth API 연결 준비 인터페이스
   */
  public async connectBluetooth(): Promise<boolean> {
    if (!this.isBluetoothSupported) {
      this.state.lastError = '현재 브라우저가 Web Bluetooth API를 지원하지 않습니다.';
      return false;
    }

    try {
      this.state.isConnected = true;
      this.state.connectionType = 'bluetooth';
      this.state.deviceName = 'EZMaker Sensor (BLE)';
      this.state.lastError = null;
      return true;
    } catch (err: any) {
      this.state.lastError = err?.message || '블루투스 기기 연결에 실패했습니다.';
      return false;
    }
  }

  public disconnect(): void {
    this.state.isConnected = false;
    this.state.connectionType = 'none';
    this.state.deviceName = null;
  }

  /**
   * 센서 모의 시뮬레이터 (오늘 사전 테스트 및 센서 없을 때 대비)
   */
  public simulateLiveSensorReading(targetType: 'baseline' | 'sponge' | 'felt' | 'cardboard'): number {
    // 0 ~ 1023 스케일의 소리 센서 아날로그 상대 신호 크기
    let base = 800;
    if (targetType === 'sponge') base = 420;
    else if (targetType === 'felt') base = 530;
    else if (targetType === 'cardboard') base = 630;

    // 약간의 실제 환경 센서 잡음 변동(±15) 모의
    const noise = Math.floor(Math.random() * 31) - 15;
    const value = Math.max(50, Math.min(1023, base + noise));
    this.notify(value);
    return value;
  }
}

export const sensorManager = new EZMakerSensorManager();
