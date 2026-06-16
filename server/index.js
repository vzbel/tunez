const morgan = require("morgan");
const express = require("express");
const { pool } = require("./config/database.js");
const app = express();

app.use(express.json());

// log requests
const MORGAN_FORMAT =
  ":method :url :status :res[content-length] - :response-time ms :body";
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan(MORGAN_FORMAT));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
