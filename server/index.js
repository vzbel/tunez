const morgan = require("morgan");
const express = require("express");
const session = require("express-session");
const { pool } = require("./config/database.js");
const app = express();

const ErrorNames = require("./config/errorNames.js");
const passport = require("passport");
require("./config/passportLocal.js");

// routers
const AuthRouter = require("./routes/auth.js");

app.use(express.json());

// log requests
const MORGAN_FORMAT =
  ":method :url :status :res[content-length] - :response-time ms :body";
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(MORGAN_FORMAT));

// user sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    credentials: "include",
  }),
);
app.use(passport.authenticate("session"));

// handle login, signup, etc
app.use("/auth", AuthRouter);

// custom error handler
app.use((err, req, res, next) => {
  console.error(err);
  switch (err.name) {
    case ErrorNames.INVALID_LOGIN:
      return res.status(401).send({ error: "invalid username or password" });
  }
  return res.status(500).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
