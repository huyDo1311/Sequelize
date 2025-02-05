import { responseSuccess } from '../common/helpers/response.helper.js';
import carService from '../services/car.service.js';
const carController = {
    carList: async (req, res, next) => {

        try {

            const cars = await carService.carList(req);

            const resData = responseSuccess(cars, `Get List Car Successfully`, 200)

            // const resData = {
            //     status: `success`,
            //     code: 200,
            //     message: `Get List Car Successfully`,
            //     metaData : cars,
            //     doc: `api.domain.com/doc`
            // }

            res.status(resData.code).json(resData);

        } catch (error) {
            // console.log('error', error.stack);
            next(error)
        }

    }
}

export default carController