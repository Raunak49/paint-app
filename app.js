const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const catchAsync = require('./utils/catchAsync')
const User = require('./models/user');
const users = require('./controllers/users.js')

const MongoDBStore = require("connect-mongo");

const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl ,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("database connected");
});

const app = express();

app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'nosecret'

const store = MongoDBStore.create({
    url: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(helmet({ contentSecurityPolicy: false}))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use((req,res,next) => {
res.locals.currentUser = req.user;
res.locals.success = req.flash('success')
res.locals.error = req.flash('error');
if(!['/login', '/register'].includes(req.originalUrl)) 
    req.session.returnTo = req.originalUrl
next();
})

app.get('/', (req, res)=> {
    res.render('home');
})

app.get('/paintbox', (req,res) => {
    res.render('paintbox')
})

app.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

app.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login',  keepSessionInfo: true}) , users.login)

app.get('/logout', users.logout)

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.listen(3000 , () =>{ 
    console.log('working')
})