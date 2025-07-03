export const course = (req, res, next) => {
    const errors = [];
    if (!req.body.title) {
        errors.push('Vui lòng nhập tiêu đề!');
    }
    if (!req.body.description) {
        errors.push('Vui lòng nhập mô tả ngắn gọn về nó!');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}
