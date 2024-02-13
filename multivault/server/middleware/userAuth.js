import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// - Firebase
const auth = getAuth();

const userAuth = {

    authenticateUser: async (req, res, next ) => {
        const { email, password } = req.body;

        try {
            const userCredential = await signInWithEmailAndPassword( auth, email, password );
            req.userCredential = userCredential;
            req.userToken = await userCredential.user.getIdToken();
            next();
            
        } catch( error ) {
            console.error( 'Login Request Error: ', error );
            res.status(400).json({ message: 'Invalid credentials'});
        }
    },

    getUserCredentials: (req, res, next ) => {
        req.userCredential = req.userCredential || null;
        req.userToken = req.userToken || null;
        next();
    }
}

export default userAuth;