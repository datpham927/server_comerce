



const ProductModel = require("../models/ProductMode");
const OrderModel = require("../models/OrderProducts");

const createOrderProduct = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const user = req.user
  try {
    const promises = orderItems.map(async (order) => {
      const productData = await ProductModel.findOneAndUpdate(
        {
          _id: order.product,
          discount: { $gte: order.amount },
        },
        {
          $inc: {
            discount: -order.amount,
            soled: +order.amount,
          },
        },
        { new: true }
      );
      if (productData) {
        return {
          status: "OK",
          message: "SUCCESS",
          data: order
        }
      } else {
        return {
          status: "ERR",
          message: "ERR",
          id: order.product,
        };
      }
    });
    //Promise.all([])  trả về một mảng theo thứ tự trả về
    const results = await Promise.all(promises);
    const dataErr = results && results.filter((item) => item.status === "ERR");
    const dataSuccess = results && results.filter((item) => item.status === "OK");
    if (dataSuccess?.length > 0) {
      console.log(dataSuccess.map(e => e?.data))
      await OrderModel.create({
        orderItems: dataSuccess.map(e => e?.data),
        shippingAddress,
        paymentMethod,
        shippingPrice,
        totalPrice,
        user: user.id,
        itemsPrice,
      });
    }
    if (dataErr?.length > 0) {
      return res.json({
        status: "ERR",
        message: `San pham voi id${dataErr?.map(e => e?.id)?.join(",")} khong du hang`,
        id: dataErr?.map(e => e?.id),
      });
    }
    return res.json({
      status: "OK",
      message: "success",
    });

  } catch (error) {
    console.log(error.message);
  }
};

const getALLOrderProduct = async (req, res) => {
  const user = req.user
  try {

    const detailOrder = await OrderModel.find({
      user: user.id
    }).sort({ createdAt: -1, updatedAt: -1 });
    if (!detailOrder) {
      return res.json({
        status: "ERR",
        message: "error",
      });
    }
    return res.json({
      status: "OK",
      message: "success",
      data: detailOrder
    });

  } catch (error) {
    console.log(error.message);
  }
};
const getDetailOrderProduct = async (req, res) => {
  const user = req.user
  const { id } = req.params
  try {
    const detailOrder = await OrderModel.findOne({
      user: user.id,
      _id: id
    });
    if (!detailOrder) {
      return res.json({
        status: "ERR",
        message: "error",
      });
    }
    return res.json({
      status: "OK",
      message: "success",
      data: detailOrder
    });

  } catch (error) {
    console.log(error.message);
  }
};
const deleteOrderProduct = async (req, res) => {
  const { orderItems, _id } = req.body;
  const user = req.user
  try {
    orderItems.map(async (order) => {
      const productData = await ProductModel.findOneAndUpdate(
        {
          _id: order.product,
        },
        {
          $inc: {
            discount: +order.amount,
            soled: -order.amount,
          },
        },
        { new: true }
      );
      if (productData) {
        return {
          status: "OK",
          message: "SUCCESS",
          data: order
        }
      } else {
        return {
          status: "ERR",
          message: "ERR",
          id: order.product,
        };
      }
    });
    await OrderModel.deleteOne({
      _id,
      user: user.id
    })
    return res.json({
      status: "OK",
      message: "success",
    });

  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { createOrderProduct, getALLOrderProduct, getDetailOrderProduct, deleteOrderProduct };
