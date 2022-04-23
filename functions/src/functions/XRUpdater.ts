import * as functions from "firebase-functions";
import Transaction from "../models/Transaction";
import { firestore } from 'firebase-admin';
import { getHistoricExchangeRate } from "../Utilities/ExchangeRate";
import Utilities from "../Utilities/Utilities";

const XRUpdater = functions.firestore.document('transactions/{docId}').onWrite(async (change, context) => {

    if (!change.before.data()) {
        let transaction = new Transaction(change.after.data());
        transaction.id = context.params.docId;
        await updateCurrencies(transaction);
    }
    else if (change.before.data() && change.after.data()) {
        let newTransaction = new Transaction(change.after.data());
        let oldTransaction = new Transaction(change.before.data());
        newTransaction.id = context.params.docId;
        if (oldTransaction.currency !== newTransaction.currency || oldTransaction.timestamp !== newTransaction.timestamp) {
            await updateCurrencies(newTransaction);
        }
    }
    return null;
});

const updateCurrencies = async (transaction: Transaction): Promise<void> => {
    console.log("updating exchange rates for " + transaction.id);
    try {
        const currencyDocs = await firestore().collection("supportedCurrencies").get();
        const currencies: string[] = [];
        currencyDocs.forEach(currencyDoc => {
            currencies.push(currencyDoc.data().code);
        });
        for (let i = 0; i < currencies.length; i++) {
            let currency = currencies[i];
            if (!transaction.exchangeRates[currency]) { // don't do this for exchange rates already available
                const rate = await getHistoricExchangeRate(transaction.currency, currency, transaction.timestamp);
                transaction.exchangeRates[currency] = rate;
            }
        }
        await firestore().collection(Utilities.collections.transactions).doc(transaction.id).update(transaction.toJson());
        return;
    }
    catch (e) {
        throw ("unable to update exchange rates " + transaction.id);
    }
}

export default XRUpdater;