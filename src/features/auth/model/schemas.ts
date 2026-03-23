import { getValidationMessage } from '@/src/shared/lib/utils';
import { z } from 'zod';

const getAuthValidationMessage = (key: string) =>
  getValidationMessage(key, 'auth');

const emailSchema = z
  .email({ error: getAuthValidationMessage('emailInvalid') })
  .min(1, { error: getAuthValidationMessage('emailRequired') })
  .min(5, { error: getAuthValidationMessage('emailMin') })
  .max(255, { error: getAuthValidationMessage('emailMax') })
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(1, { message: getAuthValidationMessage('passwordRequired') })
  .min(8, getAuthValidationMessage('passwordMin'))
  .max(128, getAuthValidationMessage('passwordMax'))
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    getAuthValidationMessage('passwordWeak')
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { message: getAuthValidationMessage('passwordRequired') }),
});

// Обычная регистрация (без invite)
export const registerBasicSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: getAuthValidationMessage('confirmPasswordRequired') }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: getAuthValidationMessage('passwordsMismatch'),
    path: ['confirmPassword'],
  });

// Регистрация по invite (с именем)
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: getAuthValidationMessage('nameRequired') })
      .min(2, { message: getAuthValidationMessage('nameMin') })
      .max(100, { message: getAuthValidationMessage('nameMax') })
      .trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: getAuthValidationMessage('confirmPasswordRequired') }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: getAuthValidationMessage('passwordsMismatch'),
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterBasicFormData = z.infer<typeof registerBasicSchema>;
