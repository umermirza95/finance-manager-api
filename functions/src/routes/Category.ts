import express from 'express';
import CategoryController from '../controllers/CategoryController';

const validator = require('../validators/Authentication');
const router: express.IRouter = express.Router();

router.use(validator.authenticateRequest);

router.get('/', async (req: express.Request, res: express.Response) => {
    try {
        let categoryController = new CategoryController();
        let response = await categoryController.getCategory();
        res.status(200).send(response);

    }
    catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;