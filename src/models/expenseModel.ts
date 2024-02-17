import { Document, Schema, Types, model } from "mongoose";

export interface ExpenseDocument extends Document {
  _id: string;
  expenseTitle: string;
  expenseAmount: string;
  category: string;
  notes: string;
  invoiceUrl: string;
  publicId: string;
  expenseDate: string;
}

const expenseSchema = new Schema<ExpenseDocument>({
  expenseAmount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  expenseTitle: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  invoiceUrl: {
    type: String,
  },
  publicId: {
    type: String,
  },
  expenseDate: {
    type: String,
    required: true,
  },
});

const Expense = model<ExpenseDocument>("Expense", expenseSchema);

export default Expense;
