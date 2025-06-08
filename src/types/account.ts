export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    emailToken: string | null;
    tokenExpiration: string; // or Date if you'll parse it
    isEmailVerified: boolean;
    pin: string | null;
    isPinSet: boolean;
    status: string; // or a union type like "Active" | "Inactive" | etc. if you know all possible values
    isOnline: boolean;
    createdAt: string; // or Date
    updatedAt: string; // or Date
    __v: number;
    hasSelectedTopics: boolean;
    selectedTopics: string[];
  };
}

export interface AddTopicsPayload {
  topics: string[];
}
