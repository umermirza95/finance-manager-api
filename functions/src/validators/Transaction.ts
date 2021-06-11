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
        }
    });
}

function validateEditTransaction() {
    return [
        body('id').not().isEmpty().custom((value, { req }) => {
            return checkTransactionId(value, req.body.uid)
        }),
        body('amount').optional().isInt().toInt(),
        body('type').optional().isIn(["expense", "income"]),
        body('timestamp').optional().isInt().toInt(),
        body('categoryId').optional().custom((value, { req }) => {
            return checkCategoryId(value, req.body.uid)
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
            reject();
            return;
        }
        const transaction = await firestore().collection("transactions").doc(value).get();
        if (transaction.exists && transaction.data()?.uid === uid) { //  transaction must exist and belong to requesting user
            resolve();
        }
        else {
            reject();
        }
    });
}

export {
    validateNewTransaction,
    validateGetTransaction,
    validateEditTransaction,
    validateDeleteTransaction
}
