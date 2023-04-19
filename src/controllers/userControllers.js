const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password, confirm, phone } = req.body;
  try {
    const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    const checkEmail = regexEmail.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required",
      });
    } else if (!checkEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is email",
      });
    } else if (password !== confirm) {
      return res.status(200).json({
        status: "ERR",
        message: "Incorrect confirm ",
      });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(200).json({
        status: "OK",
        message: "The email is already",
      });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const userNew = await UserModel.create({
      ...req.body,
      password: hashPassword,
    });
    return res.status(200).json({
      status: "OK",
      message: "The email is already",
      data: userNew,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;
  try {
    if (!password || !email) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required",
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        status: "ERR",
        message: "Email does not exist ",
      });
    }
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Email or password is incorrect",
      });
    }
    const access_token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "10d",
      }
    );
    const refresh_token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
    res.cookie("refresh_token", refresh_token, {
      HttpOnly: true,
      // Secure: true,
      //bảo mật phía client
      //trình duyệt sẽ chỉ gửi cookie qua HTTPS, giúp cookie an toàn hơn
      //bằng cách ngăn không cho kẻ tấn công chặn cookie. Điều này rất quan trọng
      //khi xử lý thông tin nhạy cảm, chẳng hạn như mã thông báo xác thực người dùng hoặc thông tin thanh toán.
    });
    return res.status(200).json({
      status: "OK",
      message: "login in successfully",
      access_token,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  console.log("userId", userId);
  try {
    const { password } = req.body;
    let hashPassword;
    if (password) {
      hashPassword = bcrypt.hashSync(password, 10);
    }

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is not defined",
      });
    }
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { ...req.body, password: hashPassword },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "OK",
      message: "updated successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    await UserModel.findByIdAndDelete(userId, { new: true });
    return res.status(200).json({
      status: "OK",
      message: "delete successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUser = await UserModel.find();
    return res.status(200).json({
      status: "OK",
      message: "Success",
      data: allUser,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};
const getDetailUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "Error",
      });
    }
    return res.status(200).json({
      status: "OK",
      message: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is require",
      });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(200).json({
          status: "ERR",
          message: "The authentication",
        });
      }
      const { id, isAdmin } = user;
      const access_token = jwt.sign(
        {
          id,
          isAdmin,
        },
        process.env.ACCESS_TOKEN
      );
      return res.status(200).json({
        status: "OK",
        message: "Success",
        access_token,
      });
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const logOut = (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "logout successfully",
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
  logOut,
};
