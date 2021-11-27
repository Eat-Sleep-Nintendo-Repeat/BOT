const express = require("express");
const app = express();

app.use("*", (req, res) => {
    res.send()
})

app.listen(7811, () => {
    console.log(" is active and listenig on 7811");
})