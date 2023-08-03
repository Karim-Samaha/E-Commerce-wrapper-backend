const express = require("express");
const productsRoute = require("./routes/products");
const categoriesRoute = require("./routes/categories");
const userRoute = require("./routes/users");
const errorHandler = require("./controllers/errorController");
// const CC = require("currency-converter-lt");

// let currencyConverter = new CC({ from: "USD", to: "EGP" });
// currencyConverter.convert(1).then((response) => {
//   console.log(response); //or do something else
// });
const app = express();
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/products", productsRoute);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/", userRoute);

app.use(errorHandler);

// app.use("*", (req, res, next) => {
//   res.status(500).end(
//     JSON.stringify({
//       status: "Server Error",
//     })
//   );
// });

module.exports = app;
