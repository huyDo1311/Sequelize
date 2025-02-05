import { BadRequestException } from '../common/helpers/error.helper.js';
import Cars from '../models/Car.model.js';


const carService = {
    carList: async (req) => {
        

        // const passUser = 123;
        // const passDB = 1234;
        // if(passUser !== passDB){
        //     throw new BadRequestException(`Mật khẩu không chính xác`);
        // }
        // console.log(abc)

        // console.log(`first`)
        // const {page} = req.query;
        // console.log(page);
        const cars = await Cars.findAll({ raw: true });
        return cars;
    },
}

export default carService