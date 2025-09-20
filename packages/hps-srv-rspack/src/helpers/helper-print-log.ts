import { logger } from '@hyperse/hps-srv-common';

export const printInfo = (message: string, silent = false) => {
  if (!silent) {
    logger.info(message);
  }
};

export const printError = (message: string | Error) => {
  logger.error(message);
};

const formatCompilerError = (errors: any, formattedMessages: string[] = []) => {
  if (!errors) {
    return formattedMessages;
  }
  if (typeof errors === 'string') {
    formattedMessages.push(errors);
  } else if (Array.isArray(errors)) {
    for (const error of errors) {
      formatCompilerError(error, formattedMessages);
    }
  } else if (typeof errors === 'object') {
    // Only need to show `stack` or `message`
    const onlyOneMsg = errors.stack || errors.message;
    delete errors.stack;
    delete errors.message;

    const newErrors = {
      ...errors,
      _newMsg: onlyOneMsg,
    };
    for (const [, value] of Object.entries(newErrors)) {
      formatCompilerError(value, formattedMessages);
    }
  }
  return formattedMessages;
};

/**
 * Do not use `logger` to print webpack compiler error, cause of it may have it's message formatting.
 * @param errors
 * @returns
 */
export const printCompilerError = (errors: any) => {
  const newErrors = formatCompilerError(errors, []);
  for (const message of newErrors) {
    console.log(message);
  }
  return newErrors;
};
