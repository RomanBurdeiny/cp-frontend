import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Platform } from 'react-native';

import enAuth from './i18n/locales/en/auth.json';
import enCareer from './i18n/locales/en/career.json';
import enCommon from './i18n/locales/en/common.json';
import enJobs from './i18n/locales/en/jobs.json';
import privacyEn from './i18n/locales/en/privacy.json';
import enProfile from './i18n/locales/en/profile.json';
import termsEn from './i18n/locales/en/terms.json';
import ruAuth from './i18n/locales/ru/auth.json';
import ruCareer from './i18n/locales/ru/career.json';
import ruCommon from './i18n/locales/ru/common.json';
import ruJobs from './i18n/locales/ru/jobs.json';
import privacyRu from './i18n/locales/ru/privacy.json';
import ruProfile from './i18n/locales/ru/profile.json';
import termsRu from './i18n/locales/ru/terms.json';

const resources = {
  ru: {
    common: ruCommon,
    profile: ruProfile,
    auth: ruAuth,
    jobs: ruJobs,
    career: ruCareer,
    privacy: privacyRu,
    terms: termsRu,
  },
  en: {
    common: enCommon,
    profile: enProfile,
    auth: enAuth,
    jobs: enJobs,
    career: enCareer,
    privacy: privacyEn,
    terms: termsEn,
  },
};

const LANGUAGE_KEY = 'app_language';

function getInitialLng(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'ru') return stored;
    } catch {
      // ignore
    }
  }
  const device = Localization.getLocales()[0]?.languageCode?.slice(0, 2);
  return device === 'en' ? 'en' : 'ru';
}

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources,
  lng: getInitialLng(),
  fallbackLng: 'ru',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export async function setLanguage(lng: 'ru' | 'en') {
  // eslint-disable-next-line import/no-named-as-default-member
  await i18n.changeLanguage(lng);
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      localStorage.setItem(LANGUAGE_KEY, lng);
    } catch {
      // ignore
    }
  }
}

export default i18n;
