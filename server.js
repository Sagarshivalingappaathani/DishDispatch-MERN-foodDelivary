const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts"); 
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(expressLayouts);

app.set("views", path.join(__dirname, "resources/views")); // Use app.set to set the views directory
app.set("view engine", "ejs");

app.get("/", (req, res) => {
 res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 