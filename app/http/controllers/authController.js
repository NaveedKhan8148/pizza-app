const passport = require("passport");
const User = require("../../models/user");
// const session = require('express-session')
const bcrypt = require('bcrypt');

function authController() {
    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res,next) {
          const {email, password } = req.body;
            if (!email || !password) {

                req.flash('error', "All fields are required");
                return res.redirect('/login');
            }
          passport.authenticate("local",(err,user,info)=>{
            if(err){
              req.flash('error',info.message)
              return next(err)
            }
            if(!user){
              req.flash('error',info.message)
              return res.redirect('/login')
            }
            req.logIn(user,(err)=>{
              if(err){
                req.flash('error',info.message)
                return next(err)

              }
              return res.redirect('/')
            })
          })(req,res,next)
      },
        register(req, res) {
            res.render('auth/register');
        },
        async PostRegister(req, res) {

            const { name, email, password } = req.body;
            if (!name || !email || !password) {

                req.flash('error', "All fields are required");
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect('/register');
            }
          
            
            try {
                const result = await User.exists({ email: email });
                if (result) {
                    req.flash('error', "Email already exists");
                    req.flash("name", name);
                    req.flash("email", email);
                    return res.redirect('/register');
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                console.log(hashedPassword)
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });

              const a = await user.save();
              
                 
                return res.redirect('/');
            } catch (err) {
                req.flash('error', "Something went wrong");
                return res.redirect('/register');
            }
        },
        logout(req,res){
            req.logout()
            res.redirect('/login')
        }
    };
}

module.exports = authController;
