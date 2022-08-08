const Items = require("../models/items.model");
const { oneOf, body, validationResult } = require('express-validator');
// const multer = require("multer");

// //Storage location for images
// const storage = multer.diskStorage({
//     destination: function (req, res, cb) {
//       cb(null, "./uploads/images/");
//     },
//     filename: function (req, file, cb) {
//       cb(null, new Date().getTime().toString() + "_" + file.originalname);
//     },
//   });
  
//   //file filtering for images
//   const fileFiler = (req, file, cb) => {
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//       // accept
//       cb(null, true);
//     } else {
//       // reject
//       cb(new Error("message : file not acceptable"), false);
//     }
//   };

// //upload method for images
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 },
//     fileFilter: fileFiler,
//   });

//used the name item so that I can use the same collection to store all the details
exports.addItem = (req, res, next) => {
    try {
        console.log(req.body);
        let images = [];
  
        for (var i = 0; i < req.files.length; i++) {
            images.push(req.files[i].path);
        }

        let new_item = new Items({
            name: req.body.name,
            address: req.body.address,
            location: req.body.location,
            contactNumber: req.body.contactNumber,
            image: images,
            type: req.body.type
        })

        new_item.save().then(data => {
            return res.status(201).json(data);
        }).catch(err => {
            return res.status(500).json({ message: "Something went wrong " + err.message });
        })

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong " + error.message });
    }
}

exports.getAll = (req, res) => {
    Items.find({}).then(data => {
        return res.status(200).send(data);
    }).catch(err => {
        return res.status(500).json({ message: "Something went wrong " + err.message });
    })
}

exports.getOne = (req, res) => {
    Items.findOne({_id: req.params.id}).then(data => {
        return res.status(200).send(data);
    }).catch(err => {
        return res.status(500).json({ message: "Something went wrong " + err.message });
    })
}

exports.delete = (req, res) => {
    const id = req.params.id;
    Items.deleteOne({_id: id}).then(data => {
        return res.status(200).send(data);
    }).catch(err => {
        return res.status(500).json({ message: "Something went wrong " + err.message });
    })
}

exports.update = async (req, res) => {
    const id = req.params.id;
    let item = await Items.findOne({_id: id});
    const {name, address, location, contactNumber, type} = req.body;

    if(name) item.name = name;
    if(address) item.address = address;
    if(location) item.location = location;
    if(contactNumber) item.contactNumber = contactNumber;
    if(type) item.type = type;

    item.save().then(data => {
        return res.status(200).send(data);
    }).catch(err => {
        return res.status(500).json({ message: "Something went wrong " + err.message });
    })
}