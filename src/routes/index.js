const userRoutes = require("./useRoutes");
const productRoutes = require("./productRouter");
const orderRoutes = require("./orderRouter");

const routes = (app) => {
  app.use("/api/user", userRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/order", orderRoutes);
};

module.exports = routes;
