const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const multer = require("multer");
//const upload = multer({ dest: "uploads/images/" });

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));
mongoose.set("useCreateIndex", true);

require("./routes/user.route")(app);
require("./routes/items.route")(app);
require("./routes/feedback.route")(app);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    console.log(error);

    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

//Database connection key
const db = require("./config/keys").mongoURI;

//Connection to mongo db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongo DB connected...."))
  .catch((err) => {
    console.log(`Could not connect to the database ${err}`);
    process.exit();
  });

dotenv.config();
//define server running port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));