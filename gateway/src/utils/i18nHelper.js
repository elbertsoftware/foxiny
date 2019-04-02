import logger from './logger';

// TODO: get the first element
const getLanguage = request => {
  const lang = request.acceptsLanguages();
  logger.info(`🔷  Request language is ${lang}`);
  return lang;
};

export { getLanguage };
