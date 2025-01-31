const User= require('../models/User') 

const addUser = async (req, res) => { 
    const { email } = req.body; 
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try { 
        const newUser = new User({ email });
        await newUser.save(); 
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) { 
        res.status(500).json({ message: 'Error adding user', error });
    }
};

const getAllUsers=async(req,res)=>{
    try{ 
        const users=await User.find() 
        res.json({users}) 
    }catch(error){ 
        res.status(500).json({message:'Error retrieving users',error}) 
    }
} 

const getOneUser = async (req, res) => {
    try { 
        console.log("req",req.params);
      const user = await User.findOne({ email: req.params.email }); 
      console.log(user);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
  
 
module.exports={ 
    addUser,
    getAllUsers,
    getOneUser
}