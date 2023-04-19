const express = require("express");
const productController = require("../controllers/productController");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

router.put("/create", verifyAdmin, productController.createProduct);
router.put("/update/:id", verifyAdmin, productController.updateProduct);
router.delete("/delete/:id", verifyAdmin, productController.deleteProduct);
router.get("/detail/:id", productController.detailProduct);
router.get("/getall", productController.getAllProduct);
router.get("/get-all-type", productController.getAllType);
// router.post("/insert", productController.insertData);

module.exports = router;
