

import express from "express";
import { addExpense, deleteExpense, getAllExpenses, getExpensesForBranch } from "../../controllers/Stock/ExpenseController.js";
import { verifyUser } from "../../middleware/Auth.js";

const expenseRouter = express.Router();

expenseRouter.post("/addExpense",verifyUser,addExpense);
expenseRouter.post("/getAllExpenses",verifyUser, getAllExpenses);
expenseRouter.post("/getExpensesForBranch",verifyUser, getExpensesForBranch);
expenseRouter.post("/deleteExpense",verifyUser, deleteExpense);


export default expenseRouter;
