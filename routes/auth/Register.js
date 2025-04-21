const UserModel = require('../../models/User.js');
const validator = require("email-validator");
const { passwordStrength } = require('check-password-strength');
const bcrypt = require('bcrypt');

const RegisterRoute = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({
            success: false,
            error_code: 'missing-field',
            message: "One or more fields are missing",
        });
    }

    if (!validator.validate(email)) {
        return res.status(400).send({
            success: false,
            error_code: 'email-validation-failed',
            message: "Invalid Email Address",
        });
    }

    const checkPasswordStrength = passwordStrength(password);
    if (checkPasswordStrength.id < 3) {
        return res.status(400).send({
            success: false,
            error_code: 'password-strength-failed',
            message: "Try with a strong password",
            validation_data: checkPasswordStrength,
        });
    }

    const final_email = email.trim().toLowerCase();

    try {
        const userExists = await UserModel.findOne({ email: final_email });
        if (userExists) {
            return res.status(409).send({
                success: false,
                error_code: 'user-already-exists',
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name,
            email: final_email,
            password: hashedPassword,
        });

        await user.save();

        return res.status(201).send({
            success: true,
            message: "User has successfully registered",
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            error_code: 'internal-server-error',
            message: "An error occurred while registering the user",
        });
    }
};

module.exports = RegisterRoute;
