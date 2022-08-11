const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('register')
}

module.exports.register = async (req,res) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registerUser = await User.register(user, password);
    req.login(registerUser , err => {
        if(err) return next(err);
        req.flash('success', `welcome ${registerUser.username}`)
        res.redirect('/home');
    })
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', `welcome back ${req.body.username}`)
    const redirectUrl = (req.session.returnTo || '/home');
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    req.flash('Logged out')
    res.redirect('/home')
    });
    
}