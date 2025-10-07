const express = require("express");
const {updateData} = require("../utils/validation.js")
const profileRouter = express.Router();
const { userAuth } = require("../../middlewares/auth.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
});
profileRouter.patch("/profile/edit",userAuth,(req,res)=>{
try{
   if(! updateData(req)){
    throw new Error ("can not update this")
  }
  const loginUser = req.user
  console.log(loginUser)
  Object.keys(req.body).every(key => loginUser[key] = req.body[key])
  res.json({
    message : `data updated successfully`,
    data : loginUser
  });


}catch (err) {
    res.status(400).send("Something went wrong" + err);
  }
})

module.exports = profileRouter;
