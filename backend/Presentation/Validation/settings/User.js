import { body } from "express-validator";

export const Name = body(
  "name",
  "Імя має складатися мінімум з 3 символів",
).isLength({ min: 3 });

export const Email = body("email", "Неправильний формат адреси").isEmail();

export const Password = body(
  "password",
  "Пароль має складатися мінімум з 8 символів",
).isLength({
  min: 8,
});

export const NewPassword = body(
  "newPassword",
  "Пароль має складатися мінімум з 8 символів",
).isLength({
  min: 8,
});
