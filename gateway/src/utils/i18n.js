import logger from './logger';

const getLanguage = request => {
  const lang = request.acceptsLanguages();
  logger.info(`Request language is ${lang}`);
  return lang;
};

export { getLanguage };
