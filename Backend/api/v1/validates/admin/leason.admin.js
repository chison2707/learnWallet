export const leasson = (req, res, next) => {
    const errors = [];
    if (!req.body.chapterId) {
        errors.push('Vui lòng chọn id chương học!');
    }
    if (!req.body.title) {
        errors.push('Vui lòng nhập tiêu đề!');
    }
    if (!req.body.position) {
        errors.push('Vui lòng nhập vị trí!');
    }
    if (!req.body.videoUrl) {
        errors.push('Vui lòng tải video khóa học lên!');
    }


    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}

export const leassonEdit = (req, res, next) => {
    const errors = [];
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
