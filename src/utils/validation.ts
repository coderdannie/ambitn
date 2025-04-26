import * as z from 'zod';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(2, { message: 'Email must be at least 2 characters' }),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerStepOneSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
    })
    .min(8, { message: 'Password must be at least 8 characters long' }),
});
export type RegisterStepOneSchemaType = z.infer<typeof registerStepOneSchema>;

export const registerStepTwoSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must be less than 50 characters' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must be less than 50 characters' }),
  dob: z.string().regex(/^\d{2}\/\d{2}\/\d{2}$/, {
    message: 'Date of birth must be in the format DD/MM/YY',
  }),
  country: z.string().min(1, { message: 'Country is required' }),
});

export type RegisterStepTwoSchemaType = z.infer<typeof registerStepTwoSchema>;
