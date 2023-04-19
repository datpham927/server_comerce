const ProductModel = require("../models/ProductMode");
const dataProducts = require("../data.json");

const createProduct = async (req, res) => {
  try {
    const { name, image, type, price, countInStock, rating, description } =
      req.body;
    if (!name || !image || !type || !price || !countInStock || !description) {
      return res.status(200).json({
        status: "ERR",
        message: "the input is required",
      });
    }
    const checkProduct = await ProductModel.findOne({ name });
    if (checkProduct) {
      return res.status(200).json({
        status: "ERR",
        message: "Product already exists",
      });
    }
    product = await ProductModel.create({ ...req.body });
    return res.status(200).json({
      status: "OK",
      message: "Success",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    productId = req.params.id;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "the productId is require",
      });
    }
    product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(200).json({
        status: "ERR",
        message: "Product not exists",
      });
    }
    const updateProduct = await ProductModel.findByIdAndUpdate(
      { _id: productId },
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      status: "OK",
      message: "Success",
      product: updateProduct,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    productId = req.params.id;
    if (!productId) {
      return res.status(404).json({
        status: "ERR",
        message: "the productId is required",
      });
    }
    await ProductModel.findByIdAndDelete({ _id: productId });
    return res.status(200).json({
      status: "OK",
      message: "Success",
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const detailProduct = async (req, res) => {
  try {
    productId = req.params.id;
    if (!productId) {
      return res.status(404).json({
        status: "ERR",
        message: "the productId is required",
      });
    }
    product = await ProductModel.findOne({ _id: productId });
    return res.status(200).json({
      status: "OK",
      message: "Success",
      product,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const total = await ProductModel.count();
    let products = {};
    if (filter) {
      //name:áo
      products = await ProductModel.find({ [filter[0]]: filter[1] })
        .limit(Number(limit))
        .skip(Number(page * limit));
      return res.status(200).json({
        status: "OK",
        message: "Success",
        products,
        total,
        totalPage: Math.ceil(total / limit),
        currentPage: Number(page) + 1,
      });
    }

    if (sort) {
      //ao : asc
      products = await ProductModel.find()
        .limit(Number(limit))
        .skip(Number(page * limit))
        .sort({ [sort[0]]: sort[1] });
      return res.status(200).json({
        status: "OK",
        message: "Success",
        products,
        total,
        totalPage: Math.ceil(total / limit),
        currentPage: Number(page) + 1,
      });
    }
    if (!limit) {
      products = await ProductModel.find();
    } else {
      products = await ProductModel.find()
        .limit(limit)
        .skip(page * limit);
    }
    return res.status(200).json({
      status: "OK",
      message: "Success",
      products,
      total,
      totalPage: Math.ceil(total / limit),
      currentPage: Number(page) + 1,
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: error.message,
    });
  }
};

const insertData = async (req, res) => {
  try {
    dataProducts.forEach(async (e) => {
      const newData = new ProductModel({
        image: e.image,
        name: e.name,
        sold: Number(e.sold),
        price: Number(e.price.replaceAll(".", "")),
        discount: Number(e.discount),
        type: e.type,
        countInStock: Number(e.countInStock),
      });
      newData
        .save()
        .then(() => console.log(`Data saved: ${newData}`))
        .catch((err) => console.log(err));
    }); // new Data(data);
    // newData
    //   .save()
    //   .then(() => console.log(`Data saved: ${newData}`))
    //   .catch((err) => console.log(err));
  } catch (error) {
    res.json(error);
  }
};
const getAllType = async (req, res) => {
  try {
    const data = await ProductModel.distinct("type");
    res.json(data);
  } catch (error) { }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  detailProduct,
  getAllProduct,
  insertData,
  getAllType,
};
