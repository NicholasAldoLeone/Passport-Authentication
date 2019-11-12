const express = require("express")
const expressLayouts = require("express-ejs-layouts");

const app = express();

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))


const PORT = process.env.PORT || 8080

app.listen(PORT, function(){
    console.log("Server started on port:", PORT);
})