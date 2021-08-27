const { Router, json } = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();
const jwt = require("jsonwebtoken");

router.post(
  "/registration",
  [
    check("email", "Некоректний email").normalizeEmail().isEmail(),
    check("password", "Закороткий пароль").isLength({ min: 8 }),
  ],
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({
          errors: errors.array(),
          message:
            "Некоректний email або пароль. Пароль повинен бути не менше 8 символів",
        });
      }

      const { email, password } = request.body;
      const candidate = await User.findOne({ email });

      if (candidate)
        return response
          .status(400)
          .json({ message: "Такий користувач вже існує в системі" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
      });
      await user.save();
      response.status(201).json({ message: "Зареєстровано" });
    } catch (error) {
      response
        .status(500)
        .json({ message: "Помилка. Спробуйте знову через деякий час" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
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
      const error_message = "Невірний email або пароль";
      if (!user) return response.status(400).json({ message: error_message });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return response.status(400).json({ message: error_message });

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "48h",
      });
      response.json({ token, userId: user.id, message: "Авторизовано" });
    } catch (error) {
      response.status(500).json({ message: "Помилка. Спробуйте знову" });
    }
  }
);

module.exports = router;
