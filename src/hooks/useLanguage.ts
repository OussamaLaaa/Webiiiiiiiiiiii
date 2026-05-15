import { useSiteConfig } from '../context/SiteConfigContext';
import type { SiteArTranslations } from '../config/siteConfig';

export const useLanguage = () => {
  const { siteConfig, setSiteConfig } = useSiteConfig();
  const isAr = siteConfig.language === 'ar';
  const ar = siteConfig.arTranslations;

  const t = (enText: string, arText: string): string => {
    return isAr ? arText : enText;
  };

  const tAr = (key: keyof SiteArTranslations): string => {
    return ar[key];
  };

  const toggleLanguage = () => {
    setSiteConfig((prev) => ({
      ...prev,
      language: prev.language === 'ar' ? 'en' : 'ar',
    }));
  };

  const setLanguage = (lang: 'en' | 'ar') => {
    setSiteConfig((prev) => ({ ...prev, language: lang }));
  };

  return { isAr, language: siteConfig.language, t, tAr, toggleLanguage, setLanguage, ar };
};
