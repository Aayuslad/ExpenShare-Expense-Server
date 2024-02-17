import { Request, Response } from "express";
import Expense, { ExpenseDocument } from "../models/expenseModel";
import User, { UserDocument } from "../models/userModel";
import { Types } from "mongoose";
import cloudinary from "../utils/cloudinary";

export const addExpense = async (req: Request, res: Response) => {
  const { email, expenseAmount, category, expenseTitle, notes, expenseDate } =
    req.body;
  const invoice = req.file?.path;

  const user: UserDocument | null = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not Found" });
  }

  let invoiceUrl = "";
  let publicId = "";

  // if (invoice) {
  //   const result = await cloudinary.uploader.upload(invoice, {
  //     folder: "invoices",
  //   });

  //   invoiceUrl = result.secure_url;
  //   publicId = result.public_id;
  // }

  const expenseObject = {
    expenseAmount,
    category,
    expenseTitle,
    notes,
    invoiceUrl,
    publicId,
    expenseDate,
  };

  const expenseDocument: ExpenseDocument = await Expense.create(expenseObject);

  const expenseId = new Types.ObjectId(expenseDocument._id);
  user.expenses.push(expenseId);

  await user.save();

  res.status(200).json({ message: "Expense Added Successfully" });
};

// GET: /user/getUser
export const getUser = async (req: Request, res: Response) => {
  const user: UserDocument = req.user;

  try {
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};