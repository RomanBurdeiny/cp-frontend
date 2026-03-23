import { CareerGoal, Direction, Level, UserRole } from '@/shared/model';
import {
  CreateCareerScenarioSchema,
  type CareerScenarioActionSchema,
} from './schemas';
import type {
  DIRECTION_FILTER_VALUES,
  IS_ACTIVE_FILTER_VALUES,
  LEVEL_FILTER_VALUES,
} from './constants';

export type CareerScenarioAction = CareerScenarioActionSchema;

export type CreateCareerScenarioPayload = CreateCareerScenarioSchema;

export interface CareerScenarioAuthor {
  _id: string;
  email: string;
  role: UserRole;
}

export interface CareerScenario {
  _id: string;
  direction: Direction;
  level: Level;
  title: string;
  description: string;
  actions: CareerScenarioAction[];
  /** После populate — объект с email; иначе может отсутствовать или быть только id */
  createdBy?: CareerScenarioAuthor | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRecommendation {
  direction: Direction;
  level: Level;
  careerGoal: CareerGoal;
}

export type Recommendation = Omit<CareerScenario, 'createdBy'>;

export interface RecommendationsResponse {
  profile: ProfileRecommendation;
  recommendations: Recommendation[];
}

export interface IScenariosFilters {
  direction?: Direction;
  level?: Level;
  isActive?: boolean;
}

export interface ScenariosListResponse {
  scenarios: CareerScenario[];
}

export type DirectionFilterValue = (typeof DIRECTION_FILTER_VALUES)[number];
export type LevelFilterValue = (typeof LEVEL_FILTER_VALUES)[number];
export type IsActiveFilterValue = (typeof IS_ACTIVE_FILTER_VALUES)[number];
