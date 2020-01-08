const express = require("express");
const app = express();

const userRouter = require("./user/router");
const loginRouter = require("./auth/router");
const conferenceRouter = require("./conference/router");
const commentRouter = require("./comment/router");
const favouriteRouter = require("./favourite/router");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cors = require("cors");
const corsMiddleware = cors();

app.use(corsMiddleware);
app.use(jsonParser);
const port = process.env.PORT || 4000;
app.use(userRouter);
app.use(loginRouter);
app.use(conferenceRouter);
app.use(commentRouter);
app.use(favouriteRouter);

app.listen(port, () => console.log(`Listening on ${port}`));
