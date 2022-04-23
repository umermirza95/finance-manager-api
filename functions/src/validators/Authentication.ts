import { auth, firestore } from 'firebase-admin';
import User from '../models/User';
import Utilities from '../Utilities/Utilities';

exports.authenticateRequest = async function (req: any, res: any, next: any) {
    try {
        let authToken = req.headers?.authorization?.split(' ')[1];
        let decodedToken = await auth().verifyIdToken(authToken);
        let user = new User((await firestore().collection(Utilities.collections.users).doc(decodedToken.uid).get()).data());
        req.body.user = user
        req.query.user = user;
        next();
    }
    catch (error) {
        return res.status(403).send(error);
    }
}