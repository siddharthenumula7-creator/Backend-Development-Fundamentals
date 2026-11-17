const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

const router = express.Router();
const SALT_ROUNDS = 10;

// Keep the secret in a constant for this lab, as instructed.
// In a later lab, move this value to an environment variable.
const JWT_SECRET = "bdf_lab_04_demo_secret_change_later";

// POST /register/
router.post("/register/", async (request, response) => {
  const { username, name, password } = request.body;

  if (
    typeof username !== "string" || !username.trim() ||
    typeof name !== "string" || !name.trim() ||
    typeof password !== "string" || !password
  ) {
    return response.status(400).json({
      error: "username, name and password are required"
    });
  }

  db.get(
    "SELECT id FROM users WHERE username = ?",
    [username.trim()],
    async (error, user) => {
      if (error) {
        return response.status(500).json({ error: "Database error" });
      }

      if (user) {
        return response.status(400).json({ error: "Username already exists" });
      }

      try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        db.run(
          "INSERT INTO users (username, name, password) VALUES (?, ?, ?)",
          [username.trim(), name.trim(), passwordHash],
          function (insertError) {
            if (insertError) {
              if (insertError.message.includes("UNIQUE")) {
                return response.status(400).json({ error: "Username already exists" });
              }
              return response.status(500).json({ error: "Could not register user" });
            }

            return response.status(201).json({ message: "User registered successfully" });
          }
        );
      } catch (hashError) {
        return response.status(500).json({ error: "Could not hash password" });
      }
    }
  );
});

// POST /login/
router.post("/login/", (request, response) => {
  const { username, password } = request.body;

  if (
    typeof username !== "string" || !username.trim() ||
    typeof password !== "string" || !password
  ) {
    return response.status(400).json({ error: "username and password are required" });
  }

  db.get(
    "SELECT username, password FROM users WHERE username = ?",
    [username.trim()],
    async (error, user) => {
      if (error) {
        return response.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return response.status(400).json({ error: "Invalid user" });
      }

      try {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return response.status(400).json({ error: "Invalid password" });
        }

        const jwtToken = jwt.sign(
          { username: user.username },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        return response.status(200).json({ jwt_token: jwtToken });
      } catch (compareError) {
        return response.status(500).json({ error: "Could not verify password" });
      }
    }
  );
});

module.exports = router;
