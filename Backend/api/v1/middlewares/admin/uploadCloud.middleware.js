import { uploadToCloudinary } from "../../helper/uploadToCloudinary.js";

export const uploadSingle = async (req, res, next) => {
    if (req["file"]) {
        const { url, duration } = await uploadToCloudinary(req["file"].buffer);
        req.body[req["file"].fieldname] = url;
        req.body["duration"] = duration;
        next();
    } else {
        next();
    }
}

export const uploadFields = async (req, res, next) => {
    for (const key in req["files"]) {
        const links = [];
        for (const item of req["files"][key]) {
            try {
                const link = await uploadToCloudinary(item.buffer);
                links.push(link);
            } catch (error) {
                console.log(error);
            }
        }
        req.body[key] = links;
    }
    next();
}