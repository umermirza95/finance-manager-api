/* eslint-disable */

import * as functions from "firebase-functions";
import express from 'express';
const firebase = require("firebase-admin");
import serviceAccount from "./serviceAccountKey.json";
const transactionRouter = require("./routes/Transacition");
const categoryRouter = require('./routes/Category');
const bodyParser = require("body-parser");
const cors = require("cors")({
  origin: true,
});
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})
const app = express();
app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use("/category", categoryRouter);
app.use("/transaction", transactionRouter);


exports.API = functions.https.onRequest(app);
