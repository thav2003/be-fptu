const authServices = require("../service/authServices");
const AppError = require("../utils/appError");
module.exports = {
  signup: authServices.signup,
  login: authServices.login,
  logout: authServices.logout,
  protect: authServices.protect,
  isLoggedIn: authServices.isLoggedIn,
  forgotPassword: authServices.forgotPassword,
  resetPassword: authServices.resetPassword,
  updatePassword: authServices.updatePassword,
  restrictTo:
    (...roles) =>
    (req, res, next) => {
      // roles ['admin', 'lead-guide']. role='user'
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    },
};
