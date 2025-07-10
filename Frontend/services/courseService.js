import { getAuth } from "../utils/requestAuth";

export const getCourses = async (token) => {
  const result = await getAuth(`courses`, token);
  return result;
}