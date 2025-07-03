export const chapter = (req, res, next) => {
    const errors = [];
    if (!req.body.courseId) {
        errors.push('Vui lòng chọn id môn học!');
    }
    if (!req.body.title) {
        errors.push('Vui lòng nhập tiêu đề!');
    }
    if (!req.body.position) {
        errors.push('Vui lòng nhập vị trí!');
    }


    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}
