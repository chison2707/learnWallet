import { get, post } from "../utils/request";
import { getAuth } from "../utils/requestAuth";

export const login = async (options) => {
    const result = await post(`users/login`, options);
    return result;
}

export const register = async (options) => {
    const result = await post(`users/register`, options);
    return result;
}

export const getStudent = async () => {
    const result = await get(`users/getListStudent`);
    return result;
}

export const detail = async (token) => {
    const result = await getAuth(`users/detail`, token);
    return result;
}

export const getStudents = async (token) => {
    const result = await getAuth(`users/getListStudent`, token);
    return result;
}