// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').parse()
// }

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
// const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index')
const screenRouter = require('./routes/screen')
app.set('view engine', 'ejs')
//😎
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}));
app.use(expressLayouts)
app.use(express.static(__dirname+'public'));
app.use(cookieParser());
const csv = require('csvtojson');
var upload = require('express-fileupload')
app.use(upload({
    preserveExtension: true,
    // preserveExtension: 3,
    useTempFiles : true,
    tempFileDir : 'tmp'
}))
// dotenv.config()


// testing stuff
// var admin = require("firebase-admin");
// var firebase = require("firebase");
// const service_account = require("./node-web-app-9a6e2-firebase-adminsdk-67e0c-fa6238225d.json");
// admin.initializeApp({
//     credential: admin.credential.cert(service_account)
// });

// async function getemIl(p){
//     var email=await admin.auth().getUserByEmail(p);
//     console.log(email);
// }
//getemIl('admin@admin.com');


// test auth ground truth



//



// app.get('/test',(req,res)=>{
//     res.render('test');
// })

// app.post('/test', async (req,res)=>{
//     let email =req.body.email;
//     let password =req.body.password;
//     await firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
//         let currentUser = firebase.auth().currentUser.uid;
       
        
//         let token = jwt.sign({_id :currentUser},'somerandomsecretkeywhichwillworkasmysecretkeyfortestingsite',{expiresIn:'1h'});
        
        
//         res.cookie('jwt_cookie', token,{
//         maxAge: 6000000,
//         // maxAge: 60*60*6*1000,
//         httpOnly: true
//         // ,secure: true
//      })
 
        
//         console.log(req.cookies)
//         res.redirect('/home',);
//     })
    
// })
// app.get('/home',auth, (req,res)=>{
//     res.render('home'); 
// })

// app.get('/logout',auth, async (req,res)=>{
//     try{
//         res.clearCookie('jwt_cookie');
//         // await req.user.save();
//         console.log('logout successfully');
//         res.render('test');
//     } catch(error){
//         res.status(500).send(error);
//     }
// })
// app.get('/*',(req,res)=>{
//     firebase.auth().onAuthStateChanged(function(user) {
//         user= firebase.auth().currentUser;
//         console.log(user);
//         // if(user == null) window.href('/screen/signin'); // user is undefined if no user signed in
//        });
// })


//firebase.auth().signInWithEmailAndPassword('admin@admin.com','adminadmin');
// let c_user = admin.auth().currentUser;
// let c_uid = c_user.uid;
//  let Theuid = 'W0Jfek7laMbMz7GyUVPDENSHGn02';
// //    console.log(c_user);
//    // console.log(Theuid);
// admin.auth().createCustomToken(Theuid).then( (customToken) => {
//     console.log(customToken);
// }).catch((err) => {
//     console.log('error creating shitty token!', err);
//     console.log(err.code);
// })


// 


// All routes
app.use('/', indexRouter)
app.use('/screen', screenRouter)

app.listen(process.env.PORT || 3000) 
