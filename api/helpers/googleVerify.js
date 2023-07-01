import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'
dotenv.config()

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const googleVerify = async (idToken = '') => {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const { name: username,
        picture: img,
        email: email
    } = ticket.getPayload();

    return { username, img, email };

}


export default googleVerify;