import { analytics } from '@/features/analytics/lib/track';
import { useCareerStore } from '@/features/career/store';
import { RecommendationCard } from '@/features/career/ui';
import { useProfileStore } from '@/features/profile/store/profile-store';
import { useTranslation } from '@/shared/lib/hooks/useTranslation';
import { useExitOrBack } from '@/shared/lib/hooks/useExitOrBack';
import { FullScreenLoader, IconNavPressable } from '@/src/shared/ui';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecommendationsScreen() {
  const {
    recommendations,
    isLoadingRecommendations,
    error,
    fetchRecommendations,
  } = useCareerStore();
  const profile = useProfileStore((s) => s.profile);
  const { t } = useTranslation('career');
  const { t: tProfile } = useTranslation('profile');
  const router = useRouter();
  const exitOrBack = useExitOrBack();

  useEffect(() => {
    analytics.careerRecommendationsOpened();
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleRefresh = () => {
    fetchRecommendations();
  };

  if (isLoadingRecommendations && !recommendations) {
    return <FullScreenLoader message={t('recommendations.loading')} />;
  }

  if (error) {
    return (
      <SafeAreaView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          <View className="mb-4 flex-row items-center gap-2">
            <IconNavPressable
              name="arrow-back"
              accessibilityLabel={t('recommendations.goBack')}
              onPress={exitOrBack}
            />
          </View>
          <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/40">
            <Text className="text-sm text-red-700 dark:text-red-300">
              {error}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!recommendations) {
    return (
      <SafeAreaView
        className="flex-1 bg-gray-50 dark:bg-gray-900"
        edges={['top', 'bottom']}
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          <Text className="text-center text-gray-600 dark:text-gray-400">
            {t('recommendations.errors.noProfile')}
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const chipSource = profile ?? recommendations.profile;
  const directionText =
    t(`directions.${chipSource.direction}`) || chipSource.direction;
  const levelText = t(`levels.${chipSource.level}`) || chipSource.level;
  const careerGoalText =
    tProfile(`careerGoals.${chipSource.careerGoal}`) ||
    chipSource.careerGoal;

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      edges={['top', 'bottom']}
    >
      <FlatList
        data={recommendations.recommendations}
        keyExtractor={(item) => item._id}
        refreshing={isLoadingRecommendations}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View className="px-6 pb-4 pt-6">
            <View className="mb-3 flex-row items-center gap-2">
              <IconNavPressable
                name="arrow-back"
                accessibilityLabel={t('recommendations.goBack')}
                onPress={exitOrBack}
              />
            </View>
            <Text className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {t('recommendations.profile.title')}
            </Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-blue-100 px-3 py-1.5 dark:bg-blue-900">
                <Text className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                  {directionText}
                </Text>
              </View>
              <View className="rounded-full bg-purple-100 px-3 py-1.5 dark:bg-purple-900">
                <Text className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                  {levelText}
                </Text>
              </View>
              <View className="rounded-full bg-green-100 px-3 py-1.5 dark:bg-green-900">
                <Text className="text-xs font-semibold text-green-800 dark:text-green-200">
                  {careerGoalText}
                </Text>
              </View>
            </View>
            <Text className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t('recommendations.title')}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !isLoadingRecommendations ? (
            <View className="px-6 py-10">
              <Text className="text-center text-gray-500 dark:text-gray-400">
                {t('recommendations.empty')}
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View className="px-6">
            <RecommendationCard
              recommendation={item}
              onPress={() => {
                analytics.recommendationClicked(item._id);
                router.push(`/recommendations/${item._id}`);
              }}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
