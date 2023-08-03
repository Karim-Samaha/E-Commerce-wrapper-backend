const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./config.env" });
mongoose
  .connect(
    `mongodb+srv://karimsamaha:${process.env.MONGO_DB_USERNAME}@cluster0.yojrk9w.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: `${process.env.DATABASE}`,
    }
  )
  .then((x) => console.log("connected to database"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Runing on ${port}`);
});
