import { getName } from "./get-name";

export const getOrderName = () => {
  return 'getOrderName'+ '-' + getName()
};