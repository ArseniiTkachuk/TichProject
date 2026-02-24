import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/User.js"; // перевір шлях до моделі
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:2222/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // 1. Шукаємо користувача за email (який обов'язковий у тебе в схемі)
      let user = await UserModel.findOne({ email: profile.emails[0].value });

      if (user) {
        // Якщо юзер є, але ще не заходив через Google — додаємо йому ID
        if (!user.googleId) {
          user.googleId = profile.id;
          user.verified = true; // Google вже верифікував пошту
          await user.save();
        }
        return done(null, user);
      }

      // 2. Якщо користувача немає — створюємо нового
      user = await UserModel.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        verified: true,
        deleteAt: null, // Щоб акаунт не видалився через 24 години
      });

      done(null, user);
    },
  ),
);

export default passport;
