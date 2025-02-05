import express from "express";
import rootRouter from "./src/routes/root.router.js";
import { handleError } from './src/common/helpers/error.helper.js';
import cors from 'cors'
// const sequelize = new Sequelize('mysql://root:1234@localhost:3307/be_cyber_media')
// const sequelize = new Sequelize("be_cyber_media", "root", "1234", {
//     host: "localhost",
//     port: 3307, // Port of your database
//     dialect: "mysql",
// });

const app = express();

app.use(express.json())

app.use(cors({
    origin: ['http://localhost:5173', 'google.com']
}))

app.use(rootRouter)

app.use(handleError)
// npx sequelize-auto -h localhost -d be_cyber_media -u root -x 1234 -p 3307 --dialect mysql -o src/models -a src/models/additional.json -l esm

/**
 * Code first
 * Đi từ code tạo ra table
 *    tạo table bằng code javascript
 */
/**
 * Database first
 * Đi từ câu lệnh SQL để tạo ra table
 *    - tạo table bằng câu lệnh SQL
 *    - sequelize-auto
 *    - npm i sequelize-auto
 *
 *    - npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm
 */

app.listen(3069, () => {
    console.log(`server online at port 3069`)
})

// app.get(`/`, (request, response, next) => {
//     console.log(`123`);
//   response.json(`hello word`);
// });

// app.get(`/query`, (request, response, next) => {
//     console.log(request.query);
//     const {email,password} = request.query;
//     console.log(email,password);
//   response.json(`query parameters`);
// }
// )

// /* 
//     path parameter
// */

// app.get(`/path/:id`, (request, response, next) => {
//     console.log(request.params);
//   response.json(`path parameters`);
// });

// /* 
//     Headers
// */

// app.get(`/headers`, (request, response, next) => {
//     console.log(request.headers);
//   response.json(`Header parameters`);
// });

// /*
//     Body
// */
// app.post(`/body`, (request, response, next) => {
//     console.log(request.body);
//   response.json(`Body parameters`);
// });


// app.listen(3069, () => {
//     console.log(`server online at port 3069`)
// })


