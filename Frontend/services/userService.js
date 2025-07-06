import { post } from "../utils/request";
// import { getAuth, patchAuth } from "../utils/requestAuth";

export const login = async (options) => {
    const result = await post(`users/login`, options);
    return result;
}

// export const register = async (options) => {
//     const result = await post(`users/register`, options);
//     return result;
// }

// export const detail = async (token) => {
//     const result = await getAuth(`users/detail`, token);
//     return result;
// }

// export const editUser = async (options, token) => {
//     const result = await patchAuth(`users/edit`, options, token);
//     return result;
// }

// export const changePass = async (options, token) => {
//     const result = await patchAuth(`users/changePass`, options, token);
//     return result;
// }