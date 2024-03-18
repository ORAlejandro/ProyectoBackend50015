const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager();

//Pasport Github:
const GitHubStrategy = require("passport-github2");

//Pasport Local:
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age, rol = "usuario"} = req.body;
        try {
            let user = await UserModel.findOne({ email });
            if(user) return done(null, false);
            const newCart = await cartManager.createCart();

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                rol,
                cart: newCart._id
            }
            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if(!user) {
                console.log("Usuario inexistente");
                return done(null, false);
            }
            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({_id: id});
        done(null, user);
    })

    //GitHubStrategy
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.5ce667be059a4d3f",
        clientSecret: "2349a098368a20b8f2fdfa11ffe289c8a2c19f71",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 1,
                    email: profile._json.email,
                    password: ""
                }
                let result = await UserModel.create(newUser);
                done(null, result)
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = initializePassport;