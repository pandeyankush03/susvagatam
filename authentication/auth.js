const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
// const passport=require('passport');
var Passport = require('passport').Passport,
    passport = new Passport(),
    partnerPassport = new Passport();
const ExtractJwt=require('passport-jwt').ExtractJwt;
const JwtStrategy=require('passport-jwt').Strategy;
const User=require("../model/user");
const Partner = require("../model/partner");

module.exports.getToken = function(user) {
    return jwt.sign(user, '12345-67890-09876-54321',
        {expiresIn: 3600});
};
module.exports.encryptPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};
module.exports.authenticate = function(password,hash_password) {
    return bcrypt.compareSync(password,hash_password);
};

var opts={}
    opts.secretOrKey = '12345-67890-09876-54321';
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

module.exports.Jwtpassport=passport.use(new JwtStrategy(opts,
    function(jwt_payload,done){
        // console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id},function(err,userdata){
            if(err)
            {
                return done(err, false);
            }
            if(userdata)
            {
                return done(null, userdata);
            }
            else
            {
                return done(null, false);
            }
        })

}))

module.exports.verifyUser = passport.authenticate('jwt', {session: false});

module.exports.Jwtpassport=partnerPassport.use(new JwtStrategy(opts,
    function(jwt_payload,done){
        // console.log("JWT payload: ", jwt_payload);
        Partner.findOne({_id: jwt_payload._id},function(err,partnerdata){
            if(err)
            {
                return done(err, false);
            }
            if(partnerdata)
            {
                return done(null, partnerdata);
            }
            else
            {
                return done(null, false);
            }
        })
}))
module.exports.verifyPartner = partnerPassport.authenticate('jwt', {session: false});
// module.exports.verifyPartner = (req, res, done) => {
//   Partner.findOne({ _id: req.params.partnerid }, (err, partnerdata) => {
//     if (err) {
//       return done(err, false);
//     }

//     if (partnerdata) {
//       return done(null, partnerdata);
//     }

//     return done(null, false);
//   });
// };

// module.exports.verifyrole = function(login_user_id,userid,done){
//     // req.headers.authorization.split(' ')[1]
//     // var verify_id;
//     // jwt.verify(token, '12345-67890-09876-54321',async (err,data)=>{
//     //     if(err)
//     //     {
//     //       console.log(err);
//     //     }
//     //     else
//     //     {
//     //         verify_id=data._id;
//     //     }
//     // });
//     if(login_user_id==userid)
//     {
//         return done(null,'Permission_granted');
//     }
//     else
//     {
//         User.findById(login_user_id)
//         .then((data)=>{
//          if(data.role=='admin')
//          {
//              return done(null,'Permission_granted');
//             // return done(null,data.role)
//          }
//          else
//          {
//             return done(null,'Permission_denied');
//          }
//         })
//         .catch((err)=>{
//          console.log(err);
//         })    
//     }
// }

