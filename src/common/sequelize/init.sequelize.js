import initModels from '../../models/init-models.js';
import { Sequelize } from 'sequelize';
import { DATABASE_URL } from '../constant/app.constant.js';


export const sequelize = new Sequelize(DATABASE_URL, { logging: false });
const models = initModels(sequelize);

// sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch((error) => {
//         console.error('Unable to connect to the database:', error);
//     });
// try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }

export default models