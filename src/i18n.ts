import { SCRIPT_NAME } from "./constants";
import { log } from "./logger";

export function initializeI18n(): void {
  log(`i18n Initialized - ${I18n.currentLocale()}`, 1);
  const translations: Record<string, Record<string, string>> = {
    en: {
      tab_title: `${SCRIPT_NAME}`,
      report_an_issue: "Report an Issue on GitHub",
      help: "Help",
      filter_by_state: "Filter Shields By State",
      turn_instruction_preview: "Turn Instruction Preview",
      settings_1: "Enable Debug Mode",
    },
    es: {
      tab_title: `${SCRIPT_NAME}`,
      report_an_issue: "Reportar Un Problema En GitHub",
      help: "Ayuda",
      filter_by_state: "Filtros de Escudos Por Estado",
      settings_1: "Habilitar el modo de Limpiar",
    },
    fr: {
      tab_title: `${SCRIPT_NAME}`,
      report_an_issue: "Signaler un problème sur GitHub",
      help: "Aide",
      filter_by_state: "Filtrer les cartouches de localisation par région",
      turn_instruction_preview: "Aperçu des instructions de guidage",
      settings_1: "Activer le mode de débogage",
    },
  };

  translations["en-GB"] = translations["en-US"] = translations["en-AU"] = translations.en;
  translations["es-419"] = translations.es;
  I18n.translations[I18n.currentLocale()].wmersh = translations.en;

  Object.keys(translations).forEach((locale) => {
    if (I18n.currentLocale() === locale) {
      addFallbacks(translations[locale], translations.en);
      I18n.translations[locale].wmersh = translations[locale];
    }
  });

  function addFallbacks(localeStrings: Record<string, string>, fallbackStrings: Record<string, string>): void {
    Object.keys(fallbackStrings).forEach((key) => {
      if (!localeStrings[key]) {
        localeStrings[key] = fallbackStrings[key];
      }
    });
  }
}
