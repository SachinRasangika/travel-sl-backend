const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/user.model");
const { oneOf, body, validationResult } = require('express-validator');

exports.create = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        //check errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).send(errors.array());
        }

        let userEx = await User.findOne({ email: email });

        if (userEx != null) {
            return res.status(401).json({ message: "Email is already in use" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })

        newUser.save().then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            return res.status(500).json({ message: "Something went wrong" });
        })

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong " + error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).send(errors.array());
        }

        let user = await User.findOne({ email: email });

        if (user == null) {
            return res.status(401).json({ message: "Email is wrong" });
        }

        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }

                jwt.sign(payload, keys.secretOrKey, {expiresIn: 31556926}, (err, token) => {
                    res.json({
                        success: true,
                        token: token,
                        type: user.role
                      });
                })
            }
            else {
                return res.status(401).json({ message: "Password is wrong" });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong " + error.message });
    }
}

exports.test = (req, res) => {
    return res.status(200).send("Test route");
}

exports.validate = (method) => {
    switch (method) {
        case "CREATE": {
            return [
                body('name', "name doesn't exist").exists(),
                body('email', "email doesn't exist").exists(),
                body('password', "password doesn't exist").exists(),
                body('role', "role doesn't exist").exists(),
            ]
        }
        case "LOGIN": {
            return [
                body('email', "email doesn't exist").exists(),
                body('password', "password doesn't exist").exists(),
            ]
        }
    }
}