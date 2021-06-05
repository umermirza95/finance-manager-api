/* eslint-disable */
import Transaction from '../models/Transaction';
import { firestore } from 'firebase-admin';

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
                const transaction = await firestore().collection("transactions").add(newTransaction.toJson());
                newTransaction.id = transaction.id;
                resolve(newTransaction);
            }
            catch (error) {
                reject(error);
            }
        })
    }

    getTransactions(filter: any): Promise<Array<Transaction>> {
        return new Promise<Array<Transaction>>(async (resolve, reject) => {
            try {
                let arr: Array<Transaction> = [];
                let query = firestore().collection("transactions")
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
                arr.sort((transA: Transaction, transB: Transaction) => { return transA.timestamp > transB.timestamp ? 1 : -1 });
                resolve(arr);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}