/* eslint-disable */
import Transaction from '../models/Transaction';
import { firestore } from 'firebase-admin';
import Utilities, { convertUnixToDate } from '../Utilities/Utilities';
import User from '../models/User';
import { getCurrentExchangeRate, getHistoricExchangeRate } from '../Utilities/ExchangeRate';

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
                let user: User = data.user;
                newTransaction.exchangeRates[newTransaction.currency] = 1;
                if (newTransaction.currency !== user.preferredCurrency) {
                    newTransaction.exchangeRates[user.preferredCurrency] = await getCurrentExchangeRate(newTransaction.currency, user.preferredCurrency);
                }
                const transaction = await firestore().collection(Utilities.collections.transactions).add(newTransaction.toJson());
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
                let table = Utilities.collections.transactions;
                const dbTrans = await firestore().collection(table).doc(data.id).get();
                let newTransaction = new Transaction(dbTrans.data());
                newTransaction.update(data);
                let oldTransaction = new Transaction(dbTrans.data());
                newTransaction.id = dbTrans.id;
                oldTransaction.id = newTransaction.id;
                let user: User = data.user;
                if (newTransaction.currency !== oldTransaction.currency || newTransaction.timestamp !== oldTransaction.timestamp) {
                    newTransaction.exchangeRates = {};
                    newTransaction.exchangeRates[newTransaction.currency] = 1;
                    newTransaction.exchangeRates[user.preferredCurrency] = await getHistoricExchangeRate(newTransaction.currency, user.preferredCurrency, newTransaction.timestamp);
                }
                await firestore().collection(table).doc(data.id).update(newTransaction.toJson());
                resolve(newTransaction);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    deleteTransaction(data: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                let table = Utilities.collections.transactions;
                await firestore().collection(table).doc(data.id).delete();
                resolve({ status: "ok" });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    getTransactions(filter: any): Promise<Array<Transaction>> {
        return new Promise<Array<Transaction>>(async (resolve, reject) => {
            try {
                let table = Utilities.collections.transactions;
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