import {
  RegisterStepOneSchemaType,
  RegisterStepTwoSchemaType,
} from "@/utils/validation";

export interface ResendOtpBody {
  email: string | null;
}

export interface RegisterValues
  extends RegisterStepOneSchemaType,
    RegisterStepTwoSchemaType {}

export interface VerifyPasswordChange {
  email: string;
  otp: string;
}

export interface ChangePasswordBody {
  email?: string | undefined | null;
  password: string;
  confirmPassword?: string;
}
