
import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import  MongoDBStore  from "connect-mongodb-session";
import session from "express-session";
import userRouter from "./routes/UserRoutes.js";
import branchRouter from "./routes/BranchRoutes.js";
import baseRouter from "./routes/Stock/BaseRoutes.js";
import suitsRouter from "./routes/Stock/SuitsRoutes.js";
import laceRouter from "./routes/Stock/LaceRoutes.js";
import bagsAndBoxRouter from "./routes/Stock/BagsAndBoxRoutes.js";
import accessoriesRouter from "./routes/Stock/AccesssoriesRoutes.js";
import expenseRouter from "./routes/Stock/ExpenseRoutes.js";
import embrioderyRouter from "./routes/Process/EmbroideryRoutes.js";

const app = express();
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:['http://localhost:5173']
  }));

app.use(express.json({limit:'50mb'}));
const MongoDBStoreSession = MongoDBStore(session);

const store = new MongoDBStoreSession({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    store:store,
    cookie:{
      secure: 'auto',
      httpOnly:true,
      maxAge:1000 * 60 * 60 * 24,
    }
  }));

  app.use("/api/users",userRouter);
  app.use("/api/branches",branchRouter);
  app.use("/api/stock/base",baseRouter);
  app.use("/api/stock/suits",suitsRouter);
  app.use("/api/stock/lace",laceRouter);
  app.use("/api/stock/bags",bagsAndBoxRouter);
  app.use("/api/stock/accessories",accessoriesRouter);
  app.use("/api/stock/expense",expenseRouter);
  app.use("/api/process/embriodery",embrioderyRouter);

// const root = path.resolve();
// app.use(express.static(path.join(root, 'dist')));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(root, 'dist/index.html'));
// });


mongoose
.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Database Connected");
    app.listen(process.env.PORT,console.log(`Server is running on http://localhost:${process.env.PORT}`))
})
.catch((error)=>{
    console.log(error)
});
