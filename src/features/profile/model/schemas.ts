import { Direction, Level, CareerGoal } from '@/shared/model';
import { getValidationMessage } from '@/src/shared/lib/utils';
import { parseSkillsInput } from '@/features/profile/utils/skills.utils';
import { z } from 'zod';

const getProfileValidationMessage = (key: string) =>
  getValidationMessage(key, 'profile');

export const directionSchema = z.enum(Direction);

export const levelSchema = z.enum(Level);

export const careerGoalSchema = z.enum(CareerGoal);

export const baseProfileSchema = z.object({
  name: z
    .string()
    .min(2, getProfileValidationMessage('nameMin'))
    .max(100, getProfileValidationMessage('nameMax'))
    .trim(),
  // avatar: URL, путь /avatars/..., локальный URI (file, blob, content, …)
  avatar: z
    .union([
      z.literal(''),
      z.url(),
      z
        .string()
        .regex(/^\/avatars\/.+/, getProfileValidationMessage('avatarInvalid')),
      z.string().regex(/^blob:/, getProfileValidationMessage('avatarInvalid')),
      z
        .string()
        .regex(
          /^(file|content|ph|assets-library):\/\//,
          getProfileValidationMessage('avatarInvalid')
        ),
    ])
    .optional(),
  direction: directionSchema,
  level: levelSchema,
  experience: z
    .string()
    .min(10, getProfileValidationMessage('experienceMin'))
    .max(2000, getProfileValidationMessage('experienceMax'))
    .trim(),
  careerGoal: careerGoalSchema,
});

export const profileSchema = baseProfileSchema.extend({
  skills: z
    .array(
      z
        .string()
        .min(1, getProfileValidationMessage('skillEmpty'))
        .max(50, getProfileValidationMessage('skillMax'))
        .trim()
    )
    .min(1, getProfileValidationMessage('skillsMin'))
    .max(20, getProfileValidationMessage('skillsMax')),
});

// Валидация skillsInput: проверяем количество навыков (1–20), а не длину строки
export const profileFormSchema = baseProfileSchema.extend({
  skillsInput: z
    .string()
    .min(1, getProfileValidationMessage('skillsMin'))
    .refine(
      (val) => parseSkillsInput(val).length >= 1,
      getProfileValidationMessage('skillsMin')
    )
    .refine(
      (val) => parseSkillsInput(val).length <= 20,
      getProfileValidationMessage('skillsMax')
    ),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type ProfileFormValues = z.input<typeof profileFormSchema>;
