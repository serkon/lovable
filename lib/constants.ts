export interface JobMetadata {
  id: string;
  field: string;
}

export interface BioTemplateMetadata {
  content: string;
  category: string;
}

export interface ProfileMetadata {
  hobbies: string[];
  bioTemplates: BioTemplateMetadata[];
  maritalStatuses: string[];
  educations: string[];
  intentions: string[];
  jobs: JobMetadata[];
  genders: string[];
}

export const USER_STATUS = {
  ONLINE: "ONLINE",
  AWAY: "AWAY",
  INVISIBLE: "INVISIBLE",
  OFFLINE: "OFFLINE",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface Profile {
  id: string | number;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  distance: number;
  job: string;
  education: string;
  maritalStatus: string;
  intention: string;
  bio: string;
  hobbies: string[];
  imageUrl: string;
  images?: string[];
  iceBreaker: string;
  userStatus?: UserStatus;
  lastActiveAt?: Date;
}
