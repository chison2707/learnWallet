export const proposal = (req, res, next) => {
    const errors = [];
    if (typeof req.body.vote !== "boolean") {
        errors.push('Trường "vote" phải là true hoặc false.');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}