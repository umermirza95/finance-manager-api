/* eslint-disable */

import Utilities from "../Utilities/Utilities";


export default class Transaction {
    id: string = "";
    uid: string = "";
    type: Type = "expense";
    amount: number = 0;
    categoryId: string = "";
    timestamp: number = 0;
    comment: string = "";
    currency: Currency = "PKR";
    exchangeRates: any = {};

    constructor(data: any = null) {
        if (data) {
            this.id = data.id ? data.id : null;
            this.uid = data.user?.uid ? data.user.uid : data.uid ? data.uid : null;
            this.type = data.type ? data.type : null;
            this.amount = data.amount ? data.amount : 0;
            this.categoryId = data.categoryId ? data.categoryId : null;
            this.timestamp = data.timestamp ? data.timestamp : null;
            this.comment = data.comment ? data.comment : null;
            this.currency = data.currency ? data.currency : null;
            this.exchangeRates = data.exchangeRates ? { ...data.exchangeRates } : {};
        }
    }

    update(data: any) {
        this.type = data.type ? data.type : this.type;
        this.amount = data.amount ? data.amount : this.amount;
        this.categoryId = data.categoryId ? data.categoryId : this.categoryId;
        this.timestamp = data.timestamp ? data.timestamp : this.timestamp;
        this.comment = data.comment ? data.comment : this.comment;
        this.currency = data.currency ? data.currency : this.currency;
    }

    createCopy(): Transaction {
        let trans = new Transaction();
        trans.id = this.id;
        trans.uid = this.uid;
        trans.type = this.type;
        trans.amount = this.amount;
        trans.categoryId = this.categoryId;
        trans.timestamp = this.timestamp;
        trans.comment = this.comment;
        trans.currency = this.currency;
        trans.exchangeRates = { ...this.exchangeRates };
        return trans;
    }


    toJson(): any {
        return {
            type: this.type,
            amount: this.amount,
            categoryId: this.categoryId,
            timestamp: this.timestamp,
            comment: this.comment,
            uid: this.uid,
            currency: this.currency,
            exchangeRates: this.exchangeRates
        };
    }
}
type Type = "expense" | "income";
type Currency = "PKR" | "USD" | "CAD" | "EUR"
