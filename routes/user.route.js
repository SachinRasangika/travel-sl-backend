module.exports = app => {
    const express = require("express");
    const router = express.Router();
    const UserController = require("../controllers/user.controller");
    const checkAuth = require("../config/auth_check");

    router.post('/register', UserController.validate("CREATE"), UserController.create);
    
    router.post('/login', UserController.validate("LOGIN"), UserController.login);

    router.post('/test', checkAuth, UserController.test);

// Route name 
app.use('/api/users', router);    
}