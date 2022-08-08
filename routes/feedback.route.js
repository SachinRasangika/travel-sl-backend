module.exports = app => {
    const express = require("express");
    const router = express.Router();
    const feedbackController = require("../controllers/feedback.controller");
    const checkAuth = require("../config/auth_check");

    router.post('/create', feedbackController.create);

    router.post('/getall', feedbackController.getAll);

// Route name 
app.use('/api/feedback', router);        
}