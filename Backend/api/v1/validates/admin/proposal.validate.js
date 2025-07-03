export const proposal = (req, res, next) => {
    const errors = [];
    if (!req.body.description) {
        errors.push('Vui lòng chọn miêu tả!');
    }
    if (!req.body.title) {
        errors.push('Vui lòng nhập tiêu đề!');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}
