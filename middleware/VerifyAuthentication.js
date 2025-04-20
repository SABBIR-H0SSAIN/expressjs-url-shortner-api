const jwt = require('jsonwebtoken');

const VerifyAuthentication = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send({
                status: 401,
                error_code: 'user-not-authorized',
                message: 'User not authorized',
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;

        next();
    } catch (err) {
        return res.status(403).send({
            status: 403,
            error_code: 'invalid-token',
            message: 'Invalid or expired token',
        });
    }
};

module.exports = VerifyAuthentication;
