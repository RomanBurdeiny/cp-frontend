import {
  CAREER_GOAL_VALUES,
  CareerGoal,
  Direction,
  Level,
  Profile,
  profileFormSchema,
  DIRECTION_VALUES,
  LEVEL_VALUES,
  type ProfileFormValues,
} from '@/features/profile/model';
import {
  formatSkillsInput,
  parseSkillsInput,
} from '@/features/profile/utils/skills.utils';
import { ProfileAvatarUpload } from '@/features/profile/ui/ProfileAvatarUpload';
import { useTranslation } from '@/shared/lib/hooks/useTranslation';
import { PrimaryButton } from '@/shared/ui/buttons/PrimaryButton';
import { NamedField } from '@/shared/ui/inputs/NamedField';
import { ChipSelector } from '@/shared/ui/selectors/ChipSelector';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileFormProps {
  initialValues?: Profile;
  onSubmit: (values: Profile) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  submitButtonText: string;
  submitButtonLabel: string;
  title: string;
  showCancelButton?: boolean;
  onCancel?: () => void;
  cancelButtonText?: string;
  onDeleteAvatar?: () => Promise<void>;
  isDeletingAvatar?: boolean;
}

export function ProfileForm({
  initialValues,
  onSubmit,
  isLoading = false,
  error: externalError,
  submitButtonText,
  submitButtonLabel,
  title,
  showCancelButton = false,
  onCancel,
  cancelButtonText,
  onDeleteAvatar,
  isDeletingAvatar = false,
}: ProfileFormProps) {
  const { t } = useTranslation('profile');

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      avatar: initialValues?.avatar ?? '',
      direction: initialValues?.direction ?? Direction.IT,
      level: initialValues?.level ?? Level.Junior,
      skillsInput: initialValues ? formatSkillsInput(initialValues.skills) : '',
      experience: initialValues?.experience ?? '',
      careerGoal: initialValues?.careerGoal ?? CareerGoal.Growth,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!initialValues) return;

    reset({
      ...initialValues,
      avatar: initialValues.avatar ?? '',
      skillsInput: formatSkillsInput(initialValues.skills),
    });
  }, [initialValues, reset]);

  const watchedName = useWatch({ control, name: 'name', defaultValue: '' });
  const baselineServerAvatar = initialValues?.avatar?.trim() ?? '';

  const handleSubmit = async (data: ProfileFormValues) => {
    const skills = parseSkillsInput(data.skillsInput);

    const payload: Profile = {
      name: data.name.trim(),
      avatar:
        typeof data.avatar === 'string' && data.avatar.trim()
          ? data.avatar.trim()
          : undefined,
      direction: data.direction,
      level: data.level,
      skills,
      experience: data.experience.trim(),
      careerGoal: data.careerGoal,
    };

    await onSubmit(payload);
  };

  const displayError = errors.root?.message ?? externalError;

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            className="mb-6 text-xl font-semibold text-gray-900 dark:text-white"
            accessibilityRole="header"
          >
            {title}
          </Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <NamedField
                label={t('name')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('name')}
                autoCapitalize="words"
                error={errors.name?.message}
                touched={fieldState.isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, value }, fieldState }) => (
              <ProfileAvatarUpload
                value={typeof value === 'string' ? value : ''}
                onChange={onChange}
                baselineServerAvatar={baselineServerAvatar}
                displayName={typeof watchedName === 'string' ? watchedName : ''}
                disabled={isLoading}
                isDeleting={isDeletingAvatar}
                onDeleteServerAvatar={onDeleteAvatar}
                fieldError={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="direction"
            render={({ field: { onChange, value } }) => (
              <ChipSelector
                label={t('direction')}
                options={DIRECTION_VALUES}
                selectedValue={value}
                onSelect={onChange}
                translationKey="directions"
              />
            )}
          />

          <Controller
            control={control}
            name="level"
            render={({ field: { onChange, value } }) => (
              <ChipSelector
                label={t('level')}
                options={LEVEL_VALUES}
                selectedValue={value}
                onSelect={onChange}
                translationKey="levels"
              />
            )}
          />

          <Controller
            control={control}
            name="skillsInput"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <NamedField
                label={t('skills')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('skillsPlaceholder')}
                error={errors.skillsInput?.message}
                touched={fieldState.isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name="experience"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <NamedField
                label={t('experience')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={t('experience')}
                multiline
                numberOfLines={4}
                margin="mb-4"
                error={errors.experience?.message}
                touched={fieldState.isTouched}
              />
            )}
          />

          <Controller
            control={control}
            name="careerGoal"
            render={({ field: { onChange, value } }) => (
              <ChipSelector
                label={t('careerGoal')}
                options={CAREER_GOAL_VALUES}
                selectedValue={value}
                onSelect={onChange}
                translationKey="careerGoals"
                classNameSelector="mb-6"
              />
            )}
          />

          {displayError && (
            <Text className="mb-4 text-sm text-red-600 dark:text-red-400">
              {displayError}
            </Text>
          )}

          <View className="flex-row items-stretch gap-3">
            {showCancelButton && (
              <View className="flex-1">
                <PrimaryButton
                  onPress={onCancel}
                  accessibilityLabel={cancelButtonText}
                  className="mb-0 border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                  textClassName="text-center text-base font-semibold text-gray-700 dark:text-gray-300"
                  disabled={isLoading}
                >
                  {cancelButtonText}
                </PrimaryButton>
              </View>
            )}
            <View className="flex-1">
              <PrimaryButton
                onPress={rhfHandleSubmit(handleSubmit)}
                disabled={isLoading}
                isLoading={isLoading}
                accessibilityLabel={submitButtonLabel}
                className="mb-0"
              >
                {submitButtonText}
              </PrimaryButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
