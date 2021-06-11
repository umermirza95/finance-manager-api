/* eslint-disable */
import Transaction from '../models/Transaction';
import { firestore } from 'firebase-admin';
import Utilities from '../Utilities/Utilities';

export default class TransactionController {

    constructor() {
    }

    addTransaction(data: any): Promise<Transaction> {
        let newTransaction = new Transaction(data);
        if (!newTransaction.timestamp) {
            newTransaction.timestamp = Date.now();
        }
        return new Promise<Transaction>(async (resolve, reject) => {
            try {
                let table=Utilities.collections.transactions;
                const transaction = await firestore().collection(table).add(newTransaction.toJson());
                newTransaction.id = transaction.id;
                resolve(newTransaction);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    editTransaction(data: any): Promise<Transaction> {
        return new Promise<Transaction>(async (resolve, reject) => {
            try {
                let table=Utilities.collections.transactions;
                const dbTrans=await firestore().collection(table).doc(data.id).get();
                let transaction=new Transaction(dbTrans.data());
                transaction.id=dbTrans.id;
                transaction.update(data);
                await firestore().collection(table).doc(data.id).update(transaction.toJson());
                resolve(transaction);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    deleteTransaction(data: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let table=Utilities.collections.transactions;
                await firestore().collection(table).doc(data.id).delete();
                resolve({status:"ok"});
            }
            catch (error) {
                reject(error);
            }
        });
    }

    getTransactions(filter: any): Promise<Array<Transaction>> {
        return new Promise<Array<Transaction>>(async (resolve, reject) => {
            try {
                let table=Utilities.collections.transactions;
                let arr: Array<Transaction> = [];
                let query = firestore().collection(table)
                    .where("uid", "==", filter.uid)
                    .where("timestamp", ">=", filter.from)
                    .where("timestamp", "<=", filter.to);
                if (filter.type) {
                    query = query.where("type", "==", filter.type);
                }
                if (filter.categoryId) {
                    query = query.where("categoryId", "==", filter.categoryId);
                }
                const transactions = await query.get();
                transactions.forEach((transaction) => {
                    let trans = new Transaction(transaction.data());
                    trans.id = transaction.id;
                    arr.push(trans);
                });
                arr.sort((transA: Transaction, transB: Transaction) => { return transA.timestamp < transB.timestamp ? 1 : -1 });
                resolve(arr);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}