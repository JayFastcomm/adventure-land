const path = require("path");
const Cors = require("cors");
const Express = require("express");
const portConfig = 3000;
const app = Express();
const server = require("http").createServer(app);

server.listen(3000);

app.use(Cors());
app.use(
  Express.static(path.join(__dirname, "./"), {
    index: false,
    extensions: ["js"],
  })
);

app.use(Express.static("public"));
