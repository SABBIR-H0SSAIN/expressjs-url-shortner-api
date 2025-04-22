require('dotenv').config();

const LogoutRoute = (req,res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return res.status(200).send({
        success: true,
        message: 'Logout successful',
    });
}

module.exports = LogoutRoute;