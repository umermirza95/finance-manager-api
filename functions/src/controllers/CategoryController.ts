import Category from '../models/Category';
import { firestore } from 'firebase-admin';

export default class CategoryController {

    constructor() {
    }

    getCategory(filter: any=null): Promise<Array<Category>> {
        return new Promise<Array<Category>>(async (resolve, reject) => {
            try {
                let response=new Array<any>();
                const categories = await firestore().collection("categories").get();
                categories.forEach(categorySnapshot => {
                    let category=new Category(categorySnapshot.data());
                    category.id=categorySnapshot.id;
                    response.push(category.toJson());
                });
                resolve(response);
            }
            catch (error) {
                reject(error);
            }
        })
    }
}