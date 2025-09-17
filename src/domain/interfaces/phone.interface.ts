export enum EPhoneType {
  'FIXED',
  'MOBILE',
}

export interface PhoneDomain {
  id: string;
  areaCode: string;
  isPrimary: boolean;
  isWhatsapp: boolean;
  type: EPhoneType;
  number: string;
}
