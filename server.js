const config = require("./config.js");
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");
const db = require("./models");
const fileUpload = require("express-fileupload");
const Constant = require("./config/constant");
const path = require("path");
db.sequelize.sync();

var httpServer;
const app = express();
app.use(compression());
// parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({ extended: false, limit: "50mb", extended: true })
);
app.use(express.json());

// parse application/json
app.use(bodyParser.json());
app.use(logger("dev")); // log every request to the console
app.use(cors());
// Note that this option available for versions 1.0.0 and newer.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

var dir = path.join(__dirname, "/public/images");

app.use("/images", express.static(dir));

// import route file

// user route file
app.use("/account", require("./route/account"));
app.use("/policy", require("./route/policy"));
app.use("/agent", require("./route/agent"));
app.use("/premium", require("./route/premium"));
app.use("/claim", require("./route/claim"));
app.use("/complaint", require("./route/complaint"));
app.use("/client", require("./route/client"));
app.use("/holidays", require("./route/holiday"));
app.use("/reimbursement", require("./route/reimbursement"));
app.use(
  "/reimbursementService",
  require("./route/reimbursement_service_master")
);
app.use("/supports", require("./route/supports_route"));
// app.use('/servicerequest', require('./route/serviceRequest'));

// Handling non matching request from the client
app.use((req, res, next) => {
  return res.status(Constant.NOT_FOUND).json({
    code: Constant.NOT_FOUND,
    message: Constant.REQUEST_NOT_FOUND,
    data: res,
  });
});

if (process.env.NODE_ENV == "production") {
  httpServer = http.createServer(app);
  // for production
  //var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
  //var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
  //var credentials = {key: privateKey, cert: certificate};
  // var httpsServer = https.createServer(credentials, app);
} else {
  httpServer = http.createServer(app);
}

httpServer.listen(config.PORT, () => {
  console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
});
