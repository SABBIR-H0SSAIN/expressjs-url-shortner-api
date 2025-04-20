const UserModel = require('../../models/User.js');
const validator = require("email-validator");
const { passwordStrength } = require('check-password-strength');
const bcrypt = require('bcrypt');

const RegisterRoute = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({
            status: 0,
            error_code: 'missing-field',
            message: "One or more fields are missing",
        });
    }

    if (!validator.validate(email)) {
        return res.status(400).send({
            status: 0,
            error_code: 'email-validation-failed',
            message: "Invalid Email Address",
        });
    }

    const checkPasswordStrength = passwordStrength(password);

    if (checkPasswordStrength.id < 3) {
        return res.status(400).send({
            status: 0,
            error_code: 'password-strength-failed',
            message: "Try with a strong password",
            validation_data: checkPasswordStrength,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ name, email, password: hashedPassword });

        await user.save();
        res.status(200).send({
            status: 1,
            message: "User has successfully registered",
        });
    } catch (error) {
        if(error && error.errorResponse.code == 11000 ){
            return res.status(500).send({
                status: 0,
                error_code: 'user-already-exists',
                message: "User already exists",
            });
        }

        res.status(500).send({
            status: 0,
            error_code: 'internal-server-error',
            message: "An error occurred while registering the user",
        });
    }
};

module.exports = RegisterRoute;