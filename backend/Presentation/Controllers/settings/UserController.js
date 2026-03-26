import { User, Test } from "./../../../Infractructure/DataBase/index.js";
import * as AuthUtils from "./../../Utils.js";
import SendVerefyEmailCode from "./../../utils/sendVerefyEmailCode.js";
import sendResetPasswordLink from "../../utils/sendResetPasswordLink.js";

export const AuthGoogle = (req, res) => {
  try {
    const token = AuthUtils.CreateToken(req.user._id);
    // ПЕРЕНАПРАВЛЕННЯ НА ФРОНТЕНД
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/#/authSuccess?token=${token}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося зареєструватися" });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.GetOne({ email }, "verified");

    if (existingUser && existingUser.verified)
      return res
        .status(400)
        .json({ message: "Користувач з таким email вже існує" });

    const code = AuthUtils.CreateRandomCode(6).toString();

    const codeHash = await AuthUtils.CreatePasswordHash(code);
    const passwordHash = await AuthUtils.CreatePasswordHash(password);

    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв

    if (existingUser) {
      await User.Update(existingUser._id, {
        name,
        passwordHash: passwordHash,
        emailCodeHash: codeHash,
        emailCodeExpires: expires,
      });
    } else {
      await User.Add({
        name,
        email,
        passwordHash: passwordHash,
        emailCodeHash: codeHash,
        emailCodeExpires: expires,
      });
    }

    SendVerefyEmailCode(code, email);

    res.json({ message: "Код надіслано на email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не вдалося зареєструватися" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.GetOne({ email }, "emailCodeExpires emailCodeHash");

    if (!user)
      return res.status(400).json({ message: "Користувача не знайдено" });

    if (!user.emailCodeExpires || user.emailCodeExpires < new Date())
      return res.status(400).json({ message: "Код просрочений" });

    const isValid = await AuthUtils.CheckPasswordHash(code, user.emailCodeHash);
    if (!isValid) return res.status(400).json({ message: "Код неправильний" });

    await User.Verify(user._id);

    const token = AuthUtils.CreateToken(user._id);

    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося зареєструватися" });
  }
};

export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.GetOne({ email }, "_id");

    if (!user)
      return res.status(400).json({ message: "Користувача не знайдено" });

    const code = AuthUtils.CreateRandomCode(6).toString();
    const codeHash = await AuthUtils.CreatePasswordHash(code);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв

    await User.Update(user._id, {
      emailCodeHash: codeHash,
      emailCodeExpires: expires,
    });

    SendVerefyEmailCode(code, email);

    res.json({ message: "Код надіслано на email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося надіслати код" });
  }
};

export const login = async (req, res) => {
  try {
    const user = User.GetOne(
      { email: req.body.email },
      "verified passwordHash",
    );

    if (!user || !user.verified || !user.passwordHash) {
      return res.status(404).json({
        message: "Невірний логін або пароль",
      });
    }

    // Перевірка, чи вірний password
    const isValidPass = await AuthUtils.CheckPasswordHash(
      req.body.password,
      user.passwordHash,
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Невірний логін або пароль",
      });
    }

    const token = AuthUtils.CreateToken(user._id);

    res.json({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося ввійти",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { link, email } = req.body;

    const user = await User.GetOne({ email }, "_id");

    if (!user) {
      return res.json({ seccess: true });
    }

    const resetToken = AuthUtils.CreateRandomCode(32).toString();
    const tokenHash = await AuthUtils.CreatePasswordHash(resetToken);
    //  Зберігаємо хеш та час закінчення дії в базі
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 хв

    await User.Update(user._id, {
      emailCodeHash: tokenHash,
      emailCodeExpires: expires,
    });

    // створюємо посилання
    const resetUrl = `${link}?token=${resetToken}&email=${email}`;

    //  Відправляємо лист
    sendResetPasswordLink(resetUrl, email);

    res.json({ seccess: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося надіслати лист",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.GetOne({ email }, "emailCodeHash");

    if (!user || !user.emailCodeHash) {
      return res.status(404).json({
        message: "Посилання недійсне або прострочене",
      });
    }

    const isValid = await AuthUtils.CheckPasswordHash(
      token,
      user.emailCodeHash,
    );

    if (!isValid) {
      return res
        .status(404)
        .json({ message: "Посилання недійсне або прострочене" });
    }

    const passwordHash = await AuthUtils.CreatePasswordHash(password);

    await User.Update(user._id, {
      passwordHash,
      passwordResetTokenHash: null,
      passwordResetTokenExpires: null,
    });

    res.json({ message: "Пароль змінений" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не вдалося змінити пароль",
    });
  }
};

export const GetUserProfile = async (req, res) => {
  try {
    //  Отримуємо дані користувача
    const [user, rawTests] = await Promise.all([
      User.GetOne({ _id: req.userId }, "name imageUrl"),
      Test.GetAll({ author: req.userId }, "title slug exercises.question"),
    ]);

    if (!user) {
      return res.status(404).json({ message: "Користувач не знайдений" });
    }

    const formattedTests = rawTests.map((test) => ({
      id: test._id,
      title: test.title,
      slug: test.slug,
      tasks: test.exercises.map((ex) => ex.question),
      currentTaskIndex: 0,
    }));

    res.json({
      name: user.name,
      imageUrl: user.imageUrl,
      tests: formattedTests,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Помилка сервера" });
  }
};

export const Update = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
    };

    // Якщо файл завантажено, додаємо imageUrl
    if (req.file) {
      updateData.imageUrl = req.file.url;
    }

    await User.Update(req.userId, updateData);

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося обновити профіль" });
  }
};

export const UpdatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await User.GetOne({ _id: req.userId }, "passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    if (user.passwordHash) {
      const isValid = await AuthUtils.CheckPasswordHash(
        password,
        user.passwordHash,
      );

      if (!isValid) {
        return res.status(400).json({ message: "Старий пароль не вірний" });
      }
    }

    const passwordHash = await AuthUtils.CreatePasswordHash(newPassword);
    await User.Update(user._id, {
      passwordHash,
    });

    res.json({ seccess: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не вдалося змінити пароль" });
  }
};
