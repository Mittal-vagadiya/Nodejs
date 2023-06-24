const jwt = require('jsonwebtoken');
const asyncHnadler = require('express-async-handler');
const expressAsyncHandler = require('express-async-handler');
const UserModel = require('../model/UserModel');

// verify the token of currently login user
const verifyToken = asyncHnadler((req, res, next) => {
  // Get the token from the request headers
const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is not attached to Header' });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401)
      throw new Error("User Aothorized Token Expired, Please Login Again.")
    }
    req.user = decoded;
    next()

    if (!token) {
      res.status(401)
      throw new Error("User is not Authenticated")
    }
  });
})

// To check logged in user is admin or not 
// If user is admin then only give him access to read data
const isAdmin = (expressAsyncHandler(async(req,res,next) => {
  const findUser = await UserModel.findById(req.user.id)
  if(findUser.isAdmin != "admin"){
    res.status(400)
    throw new Error("You are not Admin.")
  }
  next()
}))
module.exports = {verifyToken,isAdmin}
