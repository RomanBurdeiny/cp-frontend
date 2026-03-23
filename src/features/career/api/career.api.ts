import { apiClient } from '@/shared/config/api';
import {
  CareerScenario,
  CreateCareerScenarioPayload,
  IScenariosFilters,
  Recommendation,
  RecommendationsResponse,
} from '../model';

export async function createCareerScenario(
  payload: CreateCareerScenarioPayload
): Promise<CareerScenario> {
  const response = await apiClient.post<CareerScenario>(
    '/career/scenarios',
    payload
  );
  return response.data;
}

export async function getRecommendations(): Promise<RecommendationsResponse> {
  const response = await apiClient.get<RecommendationsResponse>(
    '/career/recommendations'
  );
  return response.data;
}

export async function getRecommendationById(
  id: string
): Promise<Recommendation> {
  const response = await apiClient.get<Recommendation>(
    `/career/recommendations/${id}`
  );
  return response.data;
}

export async function getScenarios(
  filters?: IScenariosFilters
): Promise<CareerScenario[]> {
  const response = await apiClient.get<CareerScenario[]>('/career/scenarios', {
    params: filters,
  });
  return response.data;
}

export async function getScenarioById(id: string): Promise<CareerScenario> {
  const response = await apiClient.get<CareerScenario>(
    `/career/scenarios/${id}`
  );
  return response.data;
}

export async function updateScenario(
  id: string,
  payload: CreateCareerScenarioPayload
): Promise<CareerScenario> {
  const response = await apiClient.put<CareerScenario>(
    `/career/scenarios/${id}`,
    payload
  );
  return response.data;
}

export async function deleteScenario(id: string): Promise<void> {
  await apiClient.delete(`/career/scenarios/${id}`);
}
