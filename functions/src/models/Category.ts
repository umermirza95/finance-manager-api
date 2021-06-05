/* eslint-disable */

export default class Category {
    id: string = "";
    createdBy: string = "";
    name: string = "";
    type:string="";

    constructor(data: any = null) {
        if (data) {
            this.id = data.id ? data.id : null;
            this.createdBy = data.createdBy ? data.createdBy : null;
            this.name = data.name ? data.name : null;
            this.type=data.type ? data.type : null;
        }
    }

    toJson(): any {
        return {
            name: this.name,
            uid: this.createdBy,
            id: this.id,
            type:this.type
        };
    }
}
