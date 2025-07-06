import { get, post } from "../utils/request";
// import { getAuth, patchAuth } from "../utils/requestAuth";

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