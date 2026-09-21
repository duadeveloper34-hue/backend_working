import bcryptjs from "bcryptjs";
import User from "../model/User.js";
import tokenGenerator from "../utils/tokenGenerator.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const isUserRepeated = await User.findOne({ email });

    if (isUserRepeated) {
      return res.status(409).json({
        success: false,
        message: "Email already registered!",
      });
    }

    const hashPass = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPass,
    });

    await newUser.save();

    const token = tokenGenerator({ id: newUser._id });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 3600000,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.log(`Signup error! ${err}`);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const compPass = await bcryptjs.compare(password, user.password);

    if (!compPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials!",
      });
    }

    const token = await tokenGenerator({
      id: user._id,
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (err) {
    console.log(`Logout error! ${err}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};

export const getme = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found!",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(`Get me error! ${err}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again!",
    });
  }
};
