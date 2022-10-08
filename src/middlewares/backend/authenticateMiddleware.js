exports.isLoggedIn = async (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        if(req.xhr){
            return res.status(401).json({message:"Unauthenticated."});
        }else{
            return res.redirect('/system/login');
        }
    }
};

exports.guest = async (req, res, next) => {
    if (req.session.user) {
        res.redirect('/system/home');
    } else {
        return next();
    }
};