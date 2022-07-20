class UserTransformer {
    async transformUser(user){
        return await transform(user);
    }
    
    async transformMultiplUser(user){
        let data = [];
        for (let i = 0; i < user.length; i++) {
            data.push(await transform(user[i]));
        }
        return data;
    }
}

module.exports = UserTransformer;

const transform = async (user) => {
    return {
        _id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        address: user.address,
        username: user.username,
        mobileNumber: user.mobile_num
    };
};






