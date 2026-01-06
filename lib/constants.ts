export type MaritalStatusId = string;
export type EducationId = string;
export type IntentionId = string;

export const USER_STATUS = {
  ONLINE: "ONLINE",
  AWAY: "AWAY",
  INVISIBLE: "INVISIBLE",
  OFFLINE: "OFFLINE",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const HEARTBEAT_INTERVAL = Number(process.env.NEXT_PUBLIC_HEARTBEAT_INTERVAL) || 120000;

export interface Profile {
  id: string | number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  distance: number;
  job: string;
  education: EducationId;
  maritalStatus: MaritalStatusId;
  intention: IntentionId;
  bio: string;
  hobbies: string[];
  imageUrl: string;
  images?: string[];
  iceBreaker: string;
  userStatus?: UserStatus;
  lastActiveAt?: Date;
}
