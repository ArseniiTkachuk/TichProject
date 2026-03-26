import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import * as Controllers from "./Controllers/index.js";
import * as DB from "./../Infractructure/DataBase/index.js";
import { uploadImg, hashFiles, CheckAuthUser } from "./Utils.js";
import * as Validator from "./Validation/index.js";

DB.connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 2222;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use("/uploads", express.static(uploadDir));
app.use("/utils", express.static(path.join(__dirname, "utils")));

// Роути
app.post(
  "/register",
  uploadImg.any(),
  [Validator.User.Name, Validator.User.Email, Validator.User.Password],
  Validator.CheckValidation,
  Controllers.UserController.register,
);

app.post(
  "/verify-email",
  uploadImg.any(),
  Validator.User.Email,
  Validator.CheckValidation,
  Controllers.UserController.verifyEmail,
);

app.post("/sendCode", uploadImg.any(), Controllers.UserController.sendCode);

app.post(
  "/login",
  uploadImg.any(),
  [Validator.User.Email, Validator.User.Password],
  Validator.CheckValidation,
  Controllers.UserController.login,
);

app.post(
  "/sendLink",
  uploadImg.any(),
  Controllers.UserController.forgotPassword,
);

app.post(
  "/auth/reset-password",
  uploadImg.any(),
  Validator.User.Password,
  Validator.CheckValidation,
  Controllers.UserController.resetPassword,
);

app.get("/auth", CheckAuthUser, Controllers.UserController.GetUserProfile);

app.patch(
  "/auth",
  uploadImg.single("avatar"),
  hashFiles,
  Validator.User.Name,
  Validator.CheckValidation,
  CheckAuthUser,
  Controllers.UserController.Update,
);

app.patch(
  "/editPassword",
  uploadImg.any(),
  CheckAuthUser,
  Validator.User.Password,
  Validator.User.NewPassword,
  Validator.CheckValidation,
  Controllers.UserController.UpdatePassword,
);

// === Test ===
app.post(
  "/test",
  uploadImg.any(),
  CheckAuthUser,
  hashFiles,
  Validator.Test.TestValidation,
  Validator.CheckValidation,
  Controllers.TestController.CreateTest,
);

app.get("/test/:id", Controllers.TestController.GetTest);
app.get("/getOneTest/:id", Controllers.TestController.GetOneTest);
app.post(
  "/test/:id/result",
  uploadImg.any(),
  Controllers.TestController.CheckTest,
);
app.delete("/test/:id", Controllers.TestController.Remove);
app.patch(
  "/test/:id",
  uploadImg.any(),
  CheckAuthUser,
  hashFiles,
  Validator.Test.TestValidation,
  Validator.CheckValidation,
  Controllers.TestController.Update,
);
app.get(
  "/test/:testId/result/:childSlug",
  CheckAuthUser,
  Controllers.TestController.CheckChildTest,
);

// Слухач
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server OK on ${PORT}`);
});
