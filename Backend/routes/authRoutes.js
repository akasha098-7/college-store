const express = require('express');
const router = express.Router();

router.post("/register", (req, res) => {
    console.log("Register API Hit!");
    console.log("Request Body:", req.body);   // this helps debugging

    res.json({
        message: "Registration API working!",
        status: "success"
    });
});

router.post("/login", (req, res) => {
    res.json({
        message: "Login API working!",
        status: "success"
    });
});

module.exports = router;
