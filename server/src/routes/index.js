const authRouter = require("./auth");
const userRouter = require("./users");
const bookRouter = require("./books");

function route(app) {
  app.use("/auth", authRouter);
  app.use("/users", userRouter);
  app.use("/books", bookRouter);
}

module.exports = route;
