const express = require("express");
const userController = require("../controllers/userControllers");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.post("/sign-up", userController.register);
router.post("/sign-in", userController.login);
router.put("/update-user/:id", verifyUser, userController.updateUser);
router.delete("/delete-user/:id", verifyAdmin, userController.deleteUser);
router.get("/getall", userController.getAllUser);
router.get("/get-detail/:id", verifyUser, userController.getDetailUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/log-out", userController.logOut);

module.exports = router;
