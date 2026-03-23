import type { IJobsFilters, Job } from '@/features/jobs/model';
import { JobItem } from '@/features/jobs/ui/JobItem';
import { JobsFilters } from '@/features/jobs/ui/JobsFilters';
import { useTranslation } from '@/shared/lib/hooks/useTranslation';
import { ReactNode } from 'react';
import { FlatList, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface JobsListViewProps {
  jobs: Job[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: IJobsFilters;
  onChangeFilters: (partial: Partial<IJobsFilters>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onOpenJob: (id: string) => void;
  headerRight?: ReactNode;
  getIsFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
}

export function JobsListView({
  jobs,
  total,
  isLoading,
  error,
  filters,
  onChangeFilters,
  onApplyFilters,
  onResetFilters,
  onOpenJob,
  headerRight,
  getIsFavorite,
  onToggleFavorite,
}: JobsListViewProps) {
  const { t } = useTranslation('jobs');
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#111827' : '#f9fafb';

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor }}
      edges={['top', 'bottom']}
    >
      <View className="flex-1 px-4 pb-4 pt-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('listTitle')}
          </Text>
          {headerRight && (
            <View className="flex-row items-center gap-2">{headerRight}</View>
          )}
        </View>

        <JobsFilters
          filters={filters}
          isLoading={isLoading}
          onChange={onChangeFilters}
          onApply={onApplyFilters}
          onReset={onResetFilters}
        />

        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/40">
            <Text className="text-sm text-red-700 dark:text-red-300">
              {error}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <FlatList
            data={jobs}
            keyExtractor={(item) => item._id}
            refreshing={isLoading}
            onRefresh={onApplyFilters}
            ListEmptyComponent={
              !isLoading ? (
                <View className="mt-10 items-center">
                  <Text className="text-gray-500 dark:text-gray-400">
                    {t('empty')}
                  </Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <JobItem
                handleOpenJob={onOpenJob}
                item={item}
                t={t}
                isFavorite={getIsFavorite ? getIsFavorite(item._id) : undefined}
                onToggleFavorite={onToggleFavorite}
              />
            )}
          />
        </View>

        {total > 0 && (
          <View className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700">
            <Text className="text-center text-xs text-gray-500 dark:text-gray-400">
              {t('total', { count: total })}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
