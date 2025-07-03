export const rergisterVld = (req, res, next) => {
    const errors = [];
    if (!req.body.fullName) {
        errors.push('Vui lòng nhập họ tên của bạn!');
    }
    if (!req.body.email) {
        errors.push('Vui lòng nhập email!');
    }
    if (!req.body.phone) {
        errors.push('Vui lòng nhập số điện thoại!');
    }
    if (!req.body.role) {
        errors.push('Vui lòng nhập quyền!');
    }
    if (!req.body.password) {
        errors.push('Vui lòng nhập mật khẩu!');
    }
    if (!req.body.confirmPassword) {
        errors.push('Vui lòng xác nhận lại mật khẩu!');
    }
    if (!req.body.role) {
        errors.push('Vui lòng chọn phân quyền!');
    }

    if (req.body.password != req.body.confirmPassword) {
        errors.push('Xác nhận mật khẩu không trùng khớp');
    }

    if (req.body.password.length < 6) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự!');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}

export const login = (req, res, next) => {
    const errors = [];
    if (!req.body.email) {
        errors.push('Vui lòng nhập email!');
    }
    if (!req.body.password) {
        errors.push('Vui lòng nhập mật khẩu!');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}