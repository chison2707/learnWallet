import { getAuth } from "../utils/requestAuth";

export const getCourses = async (token) => {
  const result = await getAuth(`courses`, token);
  return result;
}

export const getChapters = async (courseId, token) => {
  const result = await getAuth(`courses/${courseId}`, token);
  return result;
}