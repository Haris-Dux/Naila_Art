

import express from "express";
import { addExpense, getAllExpenses, getExpensesForBranch } from "../../controllers/Stock/ExpenseController.js";
import { superAdminAndAdminOnly, verifyUser } from "../../middleware/Auth.js";

const expenseRouter = express.Router();

expenseRouter.post("/addExpense",verifyUser,addExpense);
expenseRouter.post("/getAllExpenses",verifyUser, getAllExpenses);
expenseRouter.post("/getExpensesForBranch",verifyUser, getExpensesForBranch);


export default expenseRouter;
