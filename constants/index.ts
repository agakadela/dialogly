export const subjects = [
  'math',
  'language',
  'science',
  'history',
  'coding',
  'economics',
] as const;

export enum callStatusEnum {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  CONNECTING = 'connecting',
  COMPLETED = 'completed',
}

export const subjectsColors = {
  science: '#E5D0FF',
  math: '#FFDA6E',
  language: '#BDE7FF',
  coding: '#FFC8E4',
  history: '#FFECC8',
  economics: '#C8FFDF',
  geography: '#FFD4B8',
  finance: '#D4E8FF',
  business: '#E8FFCC',
};

export const voices = {
  male: { casual: '2BJW5coyhAzSr8STdHbE', formal: 'c6SfcYrb2t09NHXiT80T' },
  female: { casual: 'ZIlrSGI4jZqobxRKprJz', formal: 'sarah' },
};
