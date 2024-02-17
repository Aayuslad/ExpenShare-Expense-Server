import { Router } from "express";
import * as expenseController from "../controllers/expenseController";
import upload from "../middlewares/multer";
const expenseRouter: Router = Router();
const incomeRouter: Router = Router();

expenseRouter.post(
  "/add",
  upload.single("invoice"),
  expenseController.addExpense
);

export { expenseRouter, incomeRouter };

