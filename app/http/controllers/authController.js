const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function authController() {
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/adminHome' : '/'
    }
    
    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            const { email, password } = req.body
            //console.log(req.body)
           // Validate request 
            if(!email || !password) {
                req.flash('error', 'All fields are required')
                return res.redirect('/login')
            }

            passport.authenticate('local', function(err, user, info) {
                if(err) {
                    req.flash('error', info.message )
                    return next(err)
                }
                if(!user) {
                    req.flash('error', info.message )
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err) {
                        req.flash('error', info.message ) 
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res) {
                const { name, email, password } = req.body
                
                // Validate request 

                if(!name || !email || !password) {
                    req.flash('error', 'All fields are required')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }

         
                // Check if email exists 

                const userExists = await User.exists({ email: email });

                if (userExists) {
                    req.flash('error', 'Email already taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    return res.redirect('/register');
                }

                // Hash password 
                const hashedPassword = await bcrypt.hash(password, 10);

                // Create a user 
                const user = new User({
                    name,
                    email,
                    password: hashedPassword
                });

                user.save()
                .then((user) => {
                    // Login
                    return res.redirect('/');
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/register');
                });


        },
        logout(req, res) {
            req.logout(function(err) {
              if (err) {
                // Handle the error, perhaps by sending an error response
                return res.status(500).send("Logout failed");
              }
              
              // Successful logout, redirect to login page or wherever you want
              return res.redirect('/login');
            });
          }
          
    }
}

module.exports = authController