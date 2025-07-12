import { getAuth, postAuth } from "../utils/requestAuth";

export const getCourses = async (token) => {
  const result = await getAuth(`courses`, token);
  return result;
}

export const getChapters = async (courseId, token) => {
  const result = await getAuth(`courses/${courseId}`, token);
  return result;
}

export const getLessons = async (chapterId, token) => {
  const result = await getAuth(`courses/chapter/${chapterId}`, token);
  return result;
}

export const completeLesson = async (lessonId, options, token) => {
  const result = await postAuth(`leassons/complete/${lessonId}`, options, token);
  return result;
}