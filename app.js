const express = require("express");
// const bodyParser  =  Required ('body-parser')
const methodOverride = require("method-override");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const confessRouter = require("./routes/confessionRoutes");
const facebookRouter = require("./routes/facebookRouter");
const rfs = require("rotating-file-stream");
const app = express();
//app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));
//app.set("trust proxy", true);
app.use(methodOverride("_method"));

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
//  sever static files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https:", "http:", "data:", "ws:"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "http:", "data:"],
      scriptSrc: [
        "'self'",
        "https:",
        "http:",
        "blob:",
        "https://js.stripe.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
    },
  })
);

// Development logging
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "public"),
});
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "/public/access.log"),
//   { flags: "a",interval: '1d' }
// );
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: accessLogStream }));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
// 2) CORS
const allowlist = ["http://localhost:3001"];
const corsOptionsDelegate = {
  origin: (origin, callback) => {
    if (allowlist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new AppError(`Cors not enable on this server!`, 404));
    }
  },
};
//app.use("/api", cors(corsOptionsDelegate));
app.use("/api", cors());
// 3) ROUTES
//  create routes for main pages
app.use("/api/v1/users", userRouter);
app.use("/api/v1/confession", confessRouter);
app.use("/api/v1/tool", facebookRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
