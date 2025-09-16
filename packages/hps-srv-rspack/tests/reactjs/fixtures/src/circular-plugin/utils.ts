import { getName } from "./get-name";

export const getTimestamp = () => {
  return Date.now();
};

export const orderInfo = () => {
    return { orderName: getName() }
};