import { Request, Response, json } from "express";
import { Types } from "mongoose";
import Transaction, { TransactionDocument } from "../models/transactionModal";
import User, { UserDocument } from "../models/userModel";
import cloudinary from "../utils/cloudinary";

export const addTransaction = async (req: Request, res: Response) => {
  const { incomeFlag, email, amount, category, title, notes, transactionDate } =
    req.body;
  const invoice = req.file?.path;

  const user: UserDocument | null = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  let invoiceUrl: string = "";
  let publicId: string = "";

  if (invoice) {
    const result = await cloudinary.uploader.upload(invoice, {
      folder: "invoices",
    });

    invoiceUrl = result.secure_url;
    publicId = result.public_id;
  }

  try {
    const transactionObject = {
      transactionAmount: String(amount),
      category: String(category),
      transactionTitle: String(title),
      notes: String(notes),
      invoiceUrl,
      publicId,
      transactionDate: String(transactionDate),
      type: incomeFlag,
      createdBy: new Types.ObjectId(user._id),
    };

    const transactionDocument: TransactionDocument = await Transaction.create(
      transactionObject
    );

    const transactionId = new Types.ObjectId(transactionDocument._id);
    if (incomeFlag === "income") {
      user.incomes.push(transactionId);
    } else if (incomeFlag === "expense") {
      user.expenses.push(transactionId);
    }
    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  const { email } = req.body;

  const user: UserDocument | null = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  const transactions = await Transaction.find({ createdBy: user._id });

  let total: number = 0;
  let income: number = 0;
  let expense: number = 0;
  transactions.forEach((dataItem) => {
    if (dataItem.type === "income") {
      total += Number(dataItem.transactionAmount);
      income += Number(dataItem.transactionAmount);
    } else {
      total -= Number(dataItem.transactionAmount);
      expense += Number(dataItem.transactionAmount);
    }
  });
  // console.log(income, expense);

  return res.json({ transactions });
};
