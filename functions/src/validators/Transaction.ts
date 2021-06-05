import { checkSchema, ValidationChain, query } from 'express-validator';
import { firestore } from 'firebase-admin';

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
                options: (value) => {
                    return new Promise<void>(async (resolve, reject) => {
                        const category = await firestore().collection("categories").doc(value).get();
                        if (category.exists) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    })
                }
            }
        },
        timestamp: {
            in: "body",
            optional: { options: { nullable: true } },
            toInt: true
        }
    });
}

function validateGetTransaction() {
    return [
        query('from').not().isEmpty().isInt().toInt(),
        query('to').not().isEmpty().isInt().toInt(),
        query('type').optional().isIn(["expense","income"])
    ];
}

export { validateNewTransaction, validateGetTransaction }
