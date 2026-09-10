
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Todo = require("./models/Todo");

const app = express();

// ========================================
// CONFIGURATION
// ========================================

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection failed");
    console.log(error.message);
  });


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
  });
});


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

const authenticate = (req, res, next) => {

  // Get JWT from cookie
  const token = req.cookies.token;

  // No token
  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {

    // Verify JWT
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    // Store decoded information
    // inside request object
    req.user = decoded;

    // Continue
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token",
    });

  }
};


// ========================================
// REGISTER
// ========================================

app.post(
  "/api/auth/register",
  async (req, res) => {
console.log("request recieved")
    try {

      const {
        name,
        email,
        password,
      } = req.body;


      // ------------------------------------
      // VALIDATION
      // ------------------------------------

      if (!name || !email || !password) {

        return res.status(400).json({
          message: "All fields are required",
        });

      }


      // Password length
      if (password.length < 6) {

        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });

      }


      // ------------------------------------
      // CHECK EXISTING USER
      // ------------------------------------

      const existingUser =
        await User.findOne({
          email: email.toLowerCase().trim(),
        });


      if (existingUser) {

        return res.status(400).json({
          message: "Email already registered",
        });

      }


      // ------------------------------------
      // HASH PASSWORD
      // ------------------------------------

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      // ------------------------------------
      // CREATE USER
      // ------------------------------------

      const user =
        await User.create({

          name: name.trim(),

          email: email.toLowerCase().trim(),

          password: hashedPassword,

        });


      // ------------------------------------
      // CREATE JWT
      // ------------------------------------

      const token =
        jwt.sign(

          {
            id: user._id,
            email: user.email,
          },

          JWT_SECRET,

          {
            expiresIn: "1d",
          }

        );


      // ------------------------------------
      // STORE JWT IN COOKIE
      // ------------------------------------

      res.cookie(
        "token",
        token,
        {

          httpOnly: true,

          secure: true,

          sameSite: "lax",

          maxAge:
            24 *
            60 *
            60 *
            1000,

        }
      );


      // ------------------------------------
      // RESPONSE
      // ------------------------------------

      res.status(201).json({

        message:
          "Registration successful",

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

        },

      });

    }

    catch (error) {

      console.log(
        "Registration error:",
        error
      );

      res.status(500).json({

        message:
          "Registration failed",

      });

    }

  }
);


// ========================================
// LOGIN
// ========================================

app.post(
  "/api/auth/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;


      // ------------------------------------
      // VALIDATION
      // ------------------------------------

      if (!email || !password) {

        return res.status(400).json({

          message:
            "Email and password are required",

        });

      }


      // ------------------------------------
      // FIND USER
      // ------------------------------------

      const user =
        await User.findOne({

          email:
            email.toLowerCase().trim(),

        });


      if (!user) {

        return res.status(401).json({

          message:
            "Invalid email or password",

        });

      }


      // ------------------------------------
      // COMPARE PASSWORD
      // ------------------------------------

      const passwordMatch =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!passwordMatch) {

        return res.status(401).json({

          message:
            "Invalid email or password",

        });

      }


      // ------------------------------------
      // CREATE JWT
      // ------------------------------------

      const token =
        jwt.sign(

          {

            id: user._id,

            email: user.email,

          },

          JWT_SECRET,

          {

            expiresIn: "1d",

          }

        );


      // ------------------------------------
      // STORE JWT IN COOKIE
      // ------------------------------------

      res.cookie(
        "token",
        token,
        {

          httpOnly: true,

          secure: true,

          sameSite: "none",

          maxAge:
            24 *
            60 *
            60 *
            1000,

        }
      );


      // ------------------------------------
      // RESPONSE
      // ------------------------------------

      res.json({

        message:
          "Login successful",

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

        },

      });

    }

    catch (error) {

      console.log(
        "Login error:",
        error
      );

      res.status(500).json({

        message:
          "Login failed",

      });

    }

  }
);


// ========================================
// LOGOUT
// ========================================

app.post(
  "/api/auth/logout",
  (req, res) => {

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({

      message:
        "Logout successful",

    });

  }
);


// ========================================
// GET CURRENT USER
// ========================================

app.get(
  "/api/auth/me",

  authenticate,

  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        )
        .select("-password");


      if (!user) {

        return res.status(404).json({

          message:
            "User not found",

        });

      }


      res.json(user);

    }

    catch (error) {

      console.log(
        "Get user error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get user",

      });

    }

  }
);


// ========================================
// GET ALL TODOS
// ========================================

app.get(
  "/api/todos",

  authenticate,

  async (req, res) => {

    try {

      const todos =
        await Todo.find({

          user:
            req.user.id,

        })
        .sort({

          createdAt: -1,

        });


      res.json(todos);

    }

    catch (error) {

      console.log(
        "Get todos error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get todos",

      });

    }

  }
);


// ========================================
// CREATE TODO
// ========================================

app.post(
  "/api/todos",

  authenticate,

  async (req, res) => {

    try {

      const {
        title,
        description,
      } = req.body;


      // ------------------------------------
      // VALIDATE TITLE
      // ------------------------------------

      if (
        !title ||
        !title.trim()
      ) {

        return res.status(400).json({

          message:
            "Title is required",

        });

      }


      // ------------------------------------
      // CREATE TODO
      // ------------------------------------

      const todo =
        await Todo.create({

          title:
            title.trim(),

          description:
            description
              ? description.trim()
              : "",

          completed:
            false,

          // Connect todo to logged-in user
          user:
            req.user.id,

        });


      res.status(201).json(todo);

    }

    catch (error) {

      console.log(
        "Create todo error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to create todo",

      });

    }

  }
);


// ========================================
// UPDATE TODO
// ========================================

app.put(
  "/api/todos/:id",

  authenticate,

  async (req, res) => {

    try {

      const {
        title,
        description,
        completed,
      } = req.body;


      // ------------------------------------
      // UPDATE TODO
      // ------------------------------------

      const todo =
        await Todo.findOneAndUpdate(

          {
            _id:
              req.params.id,

            user:
              req.user.id,

          },

          {

            title:
              title?.trim(),

            description:
              description
                ? description.trim()
                : "",

            completed:
              completed,

          },

          {

            new: true,

            runValidators: true,

          }

        );


      // ------------------------------------
      // TODO NOT FOUND
      // ------------------------------------

      if (!todo) {

        return res.status(404).json({

          message:
            "Todo not found",

        });

      }


      res.json(todo);

    }

    catch (error) {

      console.log(
        "Update todo error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update todo",

      });

    }

  }
);


// ========================================
// DELETE TODO
// ========================================

app.delete(
  "/api/todos/:id",

  authenticate,

  async (req, res) => {

    try {

      const todo =
        await Todo.findOneAndDelete({

          _id:
            req.params.id,

          user:
            req.user.id,

        });


      // ------------------------------------
      // TODO NOT FOUND
      // ------------------------------------

      if (!todo) {

        return res.status(404).json({

          message:
            "Todo not found",

        });

      }


      res.json({

        message:
          "Todo deleted",

      });

    }

    catch (error) {

      console.log(
        "Delete todo error:",
        error
      );

      res.status(500).json({

        message:
          "Failed to delete todo",

      });

    }

  }
);


// ========================================
// START SERVER
// ========================================

app.listen(
  PORT,

  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);
