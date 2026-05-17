import * as z from 'zod';

export const signupSchema = z.object({
  firstName: z.string().trim().min(2, { message: 'First name must be at least 2 characters' }),
  surName: z.string().trim().min(2, { message: 'Surname must be at least 2 characters' }),
  date: z.string().min(1, { message: 'Select a day' }),
  month: z.string().min(1, { message: 'Select a month' }),
  year: z.string().min(1, { message: 'Select a year' }),
  gender: z.string().min(1, { message: 'Choose a gender' }),
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/(?=.*?[A-Z])/, { message: 'Add at least one uppercase letter' })
    .regex(/(?=.*?[a-z])/, { message: 'Add at least one lowercase letter' })
    .regex(/(?=.*?[0-9])/, { message: 'Add at least one number' })
    .regex(/(?=.*?[#?!@$%^&*-])/, { message: 'Add at least one special character' }),
});

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});