import {auth} from 'firebase-admin';

exports.authenticateRequest = async function (req: any, res: any, next: any) {
    try {
        //let authToken = req.headers.authorization.split(' ')[1];
        //let user = await auth().verifyIdToken(authToken);
        //req.body.uid=user.uid;
        //req.query.uid=user.uid;
        req.body.uid="JVYV8piaechU0QNN8i0pVoysExn1";
        req.query.uid="JVYV8piaechU0QNN8i0pVoysExn1";
        next();
    }
    catch(error){
        return res.status(403).send(error);
    }
}