//@flow

import { setupI18n } from "@lingui/core";
import logger from "./logger";

// TODO: get the first element
const getLanguage = request => {
  const laguages = request.acceptsLanguages();
  const language = request.language;
  logger.info(
    `🔷  Request languages is ${
      request.languages
    }, priority language is ${language}`,
  );
  return { laguages, language };
};

// i18n lunguiJS instance initialization
const i18n = setupI18n({
  catalogs: {
    en: require("../../locale/en/messages"),
    vi: require("../../locale/vi/messages"),
  },
});

export default i18n;

export { getLanguage };
