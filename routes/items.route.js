module.exports = app => {
    const express = require("express");
    const router = express.Router();
    const ItemsController = require("../controllers/items.controller");
    const checkAuth = require("../config/auth_check");
    const multer = require("multer");

    //Storage location for images
    const storage = multer.diskStorage({
        destination: function (req, res, cb) {
        cb(null, "./uploads/images/");
        },
        filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString() + "_" + file.originalname);
        },
    });
    
    //file filtering for images
    const fileFiler = (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        // accept
        cb(null, true);
        } else {
        // reject
        cb(new Error("message : file not acceptable"), false);
        }
    };

    //upload method for images
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: fileFiler,
    });

    router.post('/create', upload.array("photos", 12), ItemsController.addItem);

    router.get('/getall', ItemsController.getAll);

    router.get('/getone/:id', ItemsController.getOne);

    router.delete('/delete/:id', ItemsController.delete);

    router.patch('/update/:id', ItemsController.update);
    
// Route name 
app.use('/api/items', router);    
}