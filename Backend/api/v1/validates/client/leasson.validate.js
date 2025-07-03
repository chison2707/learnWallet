export const leasson = (req, res, next) => {
    const errors = [];
    if (!req.body.watchedDuration) {
        errors.push('Vui lòng nhập gửi số phút đã xem!');
    }

    if (errors.length > 0) {
        return res.json({
            status: 422,
            errors: errors
        });
    }
    next();
}