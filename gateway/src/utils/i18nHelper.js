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

export { getLanguage };
