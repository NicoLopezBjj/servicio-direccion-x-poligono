const express = require("express");
const path = require("path");

const PORT = 3001;

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use("/address", require("./routes/addressRoutes"));

app.listen(3001, () => {
    console.log(`Listening on port: ${PORT}`);
});