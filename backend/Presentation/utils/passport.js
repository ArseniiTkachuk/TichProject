import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./../../Infractructure/DataBase/index.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.GetOne(
          { email: profile.emails[0].value },
          "googleId",
        );

        if (user) {
          if (!user.googleId) {
            user = await User.Update(user._id, {
              googleId: profile.id,
              verified: true,
              deleteAt: null,
            });
          }
          return done(null, user);
        }

        user = await User.Add({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          verified: true,
          deleteAt: null,
        });

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

export default passport; // Експортуємо вже налаштований паспорт
