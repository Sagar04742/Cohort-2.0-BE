import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import userModel from '../models/user.model.js'
import { config } from './config.js'

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            return done(null, false, { message: "Google account has no email" });
        }

        let user = await userModel.findOne({ googleId: profile.id });

        if (!user) {
            // same email already registered with a password -> link the accounts
            user = await userModel.findOne({ email });

            if (user) {
                user.googleId = profile.id;
            } else {
                user = new userModel({
                    email,
                    googleId: profile.id,
                    fullname: profile.displayName || email.split("@")[0],
                });
            }

            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}))

export default passport
