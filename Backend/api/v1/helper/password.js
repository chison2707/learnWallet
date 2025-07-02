import bcrypt from "bcrypt";

export const hashPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(pass, salt);

    return hashedPassword;
}

export const comparePassword = async (userPass, pass) => {
    const isMatch = await bcrypt.compare(userPass, pass);

    return isMatch
}