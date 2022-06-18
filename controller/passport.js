const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    callbackURL: 'https://www.getkeepers.net/auth/google/callback',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_ID,
},
    (accessToken, refreshToken, profile, done) => {
        // Check if user with same email or id exists in DB if not create one and save in DB
        const token = jwt.sign({ email: profile.emails }, process.env.TOKEN_KEY, { expiresIn: '14d' });
        const user = {
            email: profile.emails,
            username: profile.username,
            id: profile.id,
            profileUrl: profile.profileUrl,
            token
        };
        // Now token and user are ready store them in DB
        done(null, user);
    }),
);
passport.serializeUser((user, done) => {
    if (user) return done(null, user)
    else return done(null, false)
}),
    passport.deserializeUser((id, done) => {
        if (user) return done(null, user)
        else return done(null, false)
    }),

    module.exports = passport;