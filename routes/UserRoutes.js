const express= require("express");
const UserRoutes=express.Router();

const { 
    addUser,
    getAllUsers,
    getOneUser
}= require ("../controllers/UserController"); 
 
UserRoutes.post('/add',addUser);
UserRoutes.get('/getallusers',getAllUsers);
UserRoutes.get('/getoneuser/:email',getOneUser);

module.exports=UserRoutes;