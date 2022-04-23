export default class User {
    uid: string = "";
    preferredCurrency: string = "";

    constructor(data: any = null) {
        if (data) {
            this.uid = data.uid ? data.uid : null;
            this.preferredCurrency = data.preferredCurrency ? data.preferredCurrency : null;
        }
    }
}
