const jwt = require('jsonwebtoken');

const VerifyAuthentication = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).send({
            success: false,
            error_code: 'unauthorized',
            message: 'User not authorized',
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
        if(err) {
            if(err.name == 'TokenExpiredError') {
                return res.status(401).send({
                    success: false,
                    error_code: 'token-expired',
                    message: 'Your session has expired. Please log in again.',
                });
            }

            return res.status(403).send({
                success: false,
                error_code: 'invalid-token',
                message: 'Invalid token',
            });
        }
        
        req.user = {
            id: data.id,
            email: data.email,
        }
  
        next();
    });
};

module.exports = VerifyAuthentication;
