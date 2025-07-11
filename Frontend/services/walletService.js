import { getAuth } from "../utils/requestAuth";

export const getWallet = async (token) => {
  const result = await getAuth(`wallets`, token);
  return result;
}