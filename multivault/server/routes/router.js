import express from "express";
import userAuth from "./userAuth";

// - Express
const router = express.Router();

// - Authentication 
router.post( '/login', userAuth.authenticateUser, (req, res) => {
    res.status(200).json({ token: req.userToken, userCredential: req.userCredential });
})

router.get( '/homepage', userAuth.getUserCredentials, (req, res) => {
    if( req.userCredential ) {
        console.log( "You're logged in!" );
    } 
    if( req.userToken ) {
        console.log( "Here's your user token: ", req.userToken );
    }
    res.status(200).json({ message: 'Profile Route'} );
})

export default router;  