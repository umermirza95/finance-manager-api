/* eslint-disable */

import express from 'express';
import {  validationResult } from 'express-validator';
import * as transactionVaidator from '../validators/Transaction';
import TransactionController from '../controllers/TransactionController';
const validator = require('../validators/Authentication');
const router : express.IRouter  = express.Router();

//router.use(validator.authenticateRequest);


router.post('/', transactionVaidator.validateNewTransaction(), async (req: express.Request, res: express.Response) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw errors;
        }
        let transactionController=new TransactionController();
        const response=await transactionController.addTransaction(req.body);
        res.status(200).send(response);
    }
    catch(error){
        res.status(400).send(error);
    }
});

router.get('/', transactionVaidator.validateGetTransaction(), async (req: express.Request, res: express.Response) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            throw errors;
        }
        let transactionController=new TransactionController();
        const response=await transactionController.getTransactions(req.query);
        res.status(200).send(response);
    }
    catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;