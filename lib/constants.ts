export type MaritalStatusId = string;
export type EducationId = string;
export type IntentionId = string;

export interface Profile {
  id: string | number;
  name: string;
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
}
