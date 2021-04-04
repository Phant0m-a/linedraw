const jwt = require('jsonwebtoken');

const auth = async (req,res,next) => {
    try {
        console.log('second page');
    
        const token = req.cookies.jwt_cookies;
        const {jwt_cookie} = req.cookies;
        console.log(jwt_cookie);
        const varifyUser = jwt.verify(jwt_cookie,'somerandomsecretkeywhichwillworkasmysecretkeyfortestingsite');
        console.log('This is varify user part: ');
        console.log(varifyUser);
      //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJXMEpmZWs3bGFNYk16N0d5VVZQREVOU0hHbjAyIiwiaWF0IjoxNjE1NzM0OTIwLCJleHAiOjE2MTU3Mzg1MjB9.ZK3UAu0X2rNDydW38Sm3u5UW9p7jNpIJF-cmuFb6TOk'
        next();

        // req.token = token;
        // req.user = 'admin@admin.com';

    }
    catch(error){
        res.status(401).redirect('/screen/signin');
    }
}

module.exports = auth;