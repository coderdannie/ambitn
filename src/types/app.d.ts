type SingleValue = {
  value: string;
  label: string;
};

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  data: {
    isEmailVerified: boolean;
    hasSelectedTopics: boolean;
  };
}

interface RegisterResponse {
  message: string;
}
