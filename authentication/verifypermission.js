const User= require('../model/user');

module.exports.verifyPermission = function(login_user_id,userid,done){
    if(login_user_id==userid)
    {
        return done(null,'Permission_granted');
    }
    else
    {
        User.findById(login_user_id)
        .then((data)=>{
            if(data)
            {
                if(data.role=='admin')
                {
                    return done(null,'Permission_granted');
                    // return done(null,data.role)
                }
                else
                {
                    return done(null,'Permission_denied');
                }
            }
            else
            {   
                return done(null,'Permission_denied');
            }
        })
        .catch((err)=>{
         console.log(err);
        })    
    }
}