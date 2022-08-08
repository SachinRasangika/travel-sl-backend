const Feedback = require("../models/feedback.model");
const { oneOf, body, validationResult } = require('express-validator');

exports.create = (req, res) => {
    try {
        const {email, subject, message} = req.body;

        let newFeedback = new Feedback({
            email: email,
            subject: subject,
            message: message
        });

        newFeedback.save().then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            return res.status(500).json({ message: "Something went wrong " + err.message });
        })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong " + error.message });
    }
}

exports.getAll = (req, res) => {
    Feedback.find({}).then(data => {
        return res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json({ message: "Something went wrong " + err.message });
    })
}