import { Router } from "express";
import * as transactionController from "../controllers/transactionController";
import upload from "../middlewares/multer";
const transactionRouter: Router = Router();

transactionRouter
  .post("/add", upload.single("invoice"), transactionController.addTransaction)
  .post("/getAll", transactionController.getAllTransactions);

export default transactionRouter;
