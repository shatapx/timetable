const { Router } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();
const jwt = require("jsonwebtoken");
router.post(
  "/registration",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Short password").isLength({ min: 8 }),
    check("name", "Empty name!").exists(),
    check("course", "Choose course!").exists(),
    check("op", "Choose educational program").exists(),
  ],
  async (request, response) => {
    try {
      console.log("Body: ", req.body);
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }

      const { email, password, name, course, op } = request.body;
      const candidate = await User.findOne({ email });

      if (candidate)
        return response
          .status(400)
          .json({ message: "such a user already exists" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        name,
        course,
        op,
      });
      await user.save();

      response.status(201).json({ message: "User registered" });
    } catch (error) {
      response.status(500).json({ message: "Error. Try again" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Enter the correct email").normalizeEmail().isEmail(),
    check("password", "Enter password").exists(),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message: "Incorrect data",
        });
      }
      const { email, password } = request.body;
      const user = await User.findOne({ email });

      if (!user)
        return response.status(400).json({ message: "User not found " });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return response
          .status(400)
          .json({ message: "Incorrect password, try again" });

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "48h",
      });
      response.json({ token, userId: user.id });
    } catch (error) {
      response.status(500).json({ message: "Error. Try again" });
    }
  }
);

module.exports = router;
