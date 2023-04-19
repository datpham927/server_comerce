const express = require("express");
const orderController = require("../controllers/orderController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.put("/create", verifyUser, orderController.createOrderProduct);
router.get("/all", verifyUser, orderController.getALLOrderProduct);
router.get("/detail/:id", verifyUser, orderController.getDetailOrderProduct);
router.delete("/delete", verifyUser, orderController.deleteOrderProduct);

module.exports = router;
