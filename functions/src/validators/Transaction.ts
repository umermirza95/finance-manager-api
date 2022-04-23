import { checkSchema, ValidationChain, query, body } from 'express-validator';
import { firestore } from 'firebase-admin';
import Utilities from '../Utilities/Utilities';

function validateNewTransaction() {
    return checkSchema({
        amount: {
            in: "body",
            isInt: true,
            toInt: true
        },
        type: {
            in: "body",
            isIn: {
                options: [["income", "expense"]]
            }
        },
        comment: {
            in: "body",
            optional: { options: { nullable: true } },
            isLength: {
                options: { min: 1, max: 100 }
            }
        },
        categoryId: {
            in: "body",
            isString: true,
            custom: {
                options: (value, { req }) => {
                    return checkCategoryId(value, req.body);
                }
            }
        },
        timestamp: {
            in: "body",
            optional: { options: { nullable: true } },
            isInt: true,
            toInt: true
        },
        currency: {
            in: "body",
            isString: true,
            custom: {
                options: (value, { req }) => {
                    return checkCurrency(value);
                }
            }
        }
    });
}

function validateEditTransaction() {
    return [
        body('id').not().isEmpty().custom((value, { req }) => {
            return checkTransactionId(value, req.body.user.uid)
        }),
        body('currency').optional().isString().custom((value, { req }) => {
            return checkCurrency(value);
        }),
        body('amount').optional().isInt().toInt(),
        body('type').optional().isIn(["expense", "income"]),
        body('timestamp').optional().isInt().toInt(),
        body('categoryId').optional().custom((value, { req }) => {
            return checkCategoryId(value, req.body.user.uid)
        })

    ];
}

function validateDeleteTransaction() {
    return [
        query('id').not().isEmpty().custom((value, { req }) => {
            return checkTransactionId(value, req.query?.uid)
        })
    ];
}

function validateGetTransaction() {
    return [
        query('from').not().isEmpty().isInt().toInt(),
        query('to').not().isEmpty().isInt().toInt(),
        query('type').optional().isIn(["expense", "income"])
    ];
}

function checkCategoryId(value: any, uid: string) {
    return new Promise<void>(async (resolve, reject) => {
        if (!value) {
            reject();
            return;
        }
        const category = await firestore().collection("categories").doc(value).get();
        const createdBy = category.data()?.createdBy;
        if (category.exists && (createdBy === uid || createdBy === Utilities.creators.system)) { // If category exists then it should either be default or user's
            resolve();
        }
        else {
            reject();
        }
    });
}

function checkTransactionId(value: string, uid: string) {
    return new Promise<void>(async (resolve, reject) => {
        if (!value) {
            reject("transaction id is missing");
            return;
        }
        const transaction = await firestore().collection("transactions").doc(value).get();
        if (transaction.exists && transaction.data()?.uid === uid) { //  transaction must exist and belong to requesting user
            resolve();
        }
        else {
            reject("transaction not found");
        }
    });
}

function checkCurrency(value: string) {
    return new Promise<void>(async (resolve, reject) => {
        if (!value) {
            reject("Currency is missing");
            return;
        }
        const currencies = await firestore().collection("supportedCurrencies").get();
        currencies.forEach(currency => {
            if (currency.data().code == value) {
                resolve();
                return;
            }
        });
        reject("currency not supported");
    });
}

export {
    validateNewTransaction,
    validateGetTransaction,
    validateEditTransaction,
    validateDeleteTransaction
}
