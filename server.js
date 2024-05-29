const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();

connectDb();
const port = process.env.PORT || 5000;
app.use(express.json()); //Middleware that helps in parsing the json format which comes from the client as req.
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
	console.log(`server running on the port ${port}`);
});
