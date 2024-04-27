const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
const User = require('../models/user');
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',async (req,res)=>{
    try {
        const user = await User.find()
        res.send(user)
    } catch (error) {
        res.status(500).send('server error ')
    }
})

router.post('/register',async (req,res)=>{
    try {
    
        const {username,password}=req.body;
        const user = new User({username,password});
        await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error.message)
    }
})


router.post('/login',async (req,res)=>{
   try {
    const {username,password}=req.body;
    const user = await User.findOne({username: username});
    if(!user){
        return res.status(404).send('user not found')
    }
    const isPasswordMatch =await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.status(401).send('invalid password')
  }
   const token = jwt.sign({_id:user._id},process.env.JWT_SECRET);
   res.redirect('/posts/');
   } catch (err) {
    res.status(400).send(err.message)
   }
});

module.exports = router;