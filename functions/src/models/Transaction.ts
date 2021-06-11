/* eslint-disable */

export default class Transaction {
    id: string = "";
    uid: string = "";
    type: Type = "expense";
    amount: number = 0;
    categoryId: string = "";
    timestamp: number = 0;
    comment: string = "";

    constructor(data: any = null) {
        if (data) {
            this.id = data.id ? data.id : null;
            this.uid = data.uid ? data.uid : null;
            this.type = data.type ? data.type : null;
            this.amount = data.amount ? data.amount : 0;
            this.categoryId = data.categoryId ? data.categoryId : null;
            this.timestamp = data.timestamp ? data.timestamp : null;
            this.comment = data.comment ? data.comment : null;
        }
    }

    update(data: any) {
        this.type = data.type ? data.type : this.type;
        this.amount = data.amount ? data.amount : this.amount;
        this.categoryId = data.categoryId ? data.categoryId : this.categoryId;
        this.timestamp = data.timestamp ? data.timestamp : this.timestamp;
        this.comment = data.comment ? data.comment : this.comment;
    }


    toJson(): any {
        return {
            type: this.type,
            amount: this.amount,
            categoryId: this.categoryId,
            timestamp: this.timestamp,
            comment: this.comment,
            uid: this.uid
        };
    }
}
type Type = "expense" | "income";
