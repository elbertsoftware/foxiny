import logger from "./logger";

// TODO: get the first element
const getLanguage = request => {
  const laguages = request.acceptsLanguages();
  const language = request.language;
  logger.info(
    `🔷  Request language is ${request.language}, region is ${region}`,
  );
  return { laguages, language };
};

export { getLanguage };
