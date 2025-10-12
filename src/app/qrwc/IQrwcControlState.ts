import { IControlState } from '@q-sys/qrwc';

// Extend IControlState, only add Values and index signature
export interface IQrwcControlState extends IControlState {
  Values?: any[];
}
