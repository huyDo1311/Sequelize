import express from "express";
import rootRouter from "./src/routes/root.router.js";
import { handleError } from './src/common/helpers/error.helper.js';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./src/common/prisma/init.prisma.js";




/**
 * PRISMA
 *    - npm i prisma
 *    - npm i @prisma/client
 *
 *    - npx prisma init: khởi tạo prisma
 *       - tạo ra .env
 *       - tạo ra prisma/schema.prisma
 *
 *    - npx prisma db pull
 *    - npx prisma generate
 *
 * *** Cập nhật lại DB
 *    prisma: chỉ cần chạy 2 câu lệnh sau:
 *       npx prisma db pull
 *       npx prisma generate
 *
 *    sequelize:
 *       npx sequelize-auto -h localhost -d db_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models -a src/models/additional.json -l esm
 */

// app.use(
//    (req, res, next) => {
//       console.log(`middleware 1`);
//       const payload = `payload`;
//       res.payload = payload;
//       next(123);
//    },
//    (req, res, next) => {
//       console.log(`middleware 2`);
//       console.log(res.payload);
//       next();
//    },
//    (req, res, next) => {
//       console.log(`middleware 3`);
//       next();
//    },
//    (err, req, res, next) => {
//       const resData = responseError(err.message, err.code, err.stack);
//       res.status(resData.code).json(resData);
//    }
// );

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
// /**
//  * Body
//  * để nhận được dữ liệu từ body bắt buộc phải có
//  *    - app.use(express.json())
//  *    - hoặc sử dụng thư viện parser: https://www.npmjs.com/package/parser
//  */
// app.post(`/body`, (request, response, next) => {
//    console.log(request.body);
//    response.json(`Body Parameters`);
// });

// /**
//  * Query Parameters
//  * Thường dùng: khi muốn phân trang, search, filter
//  */
// app.get(`/query`, (request, response, next) => {
//    console.log(request.query);

//    const { email, password } = request.query;

//    console.log(email, password);

//    response.json(`Query Parameters`);
// });

// /**
//  * Path Parameters
//  * Thường dùng: khi muốn lấy chi tiết (detail) của một user, product, ....
//  */
// app.get(`/path/:id`, (request, response, next) => {
//    console.log(request.params);
//    response.json(`Path Parameters`);
// });

// /**
//  * Headers
//  */
// app.get(`/headers`, (request, response, next) => {
//    console.log(request.headers);
//    response.json(`Header Parameters`);
// });

/*

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

const app = express();

// middleware giúp phân giải dữ liệu từ json sang đối tượng javascript
app.use(express.json());
app.use(
   cors({
      origin: ["http://localhost:5173", "google.com"],
   })
);

app.use(rootRouter);

const httpServer = createServer(app);

const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
    console.log('socket.id', socket.id);

    socket.on(`join-room`, (data) => {
        console.log({ data })
        const { user_id_sender, user_id_recipient } = data;
        //   tạo roomID: sắp xếp 2 id lại với nhau
        const roomId = [user_id_sender, user_id_recipient].sort((a, b) => a - b).join("_");
        // console.log({roomId});
        // Đảm bảo thoát hết room trước khi join room
        socket.rooms.forEach((roomId) => {
            socket.leave(roomId);
        })
        socket.join(roomId);
    })

    socket.on(`send-message`, async (data) => {
        console.log({ data });
        const { message, user_id_sender, user_id_recipient } = data;
        const roomId = [user_id_sender, user_id_recipient].sort((a, b) => a - b).join("_");
        io.to(roomId).emit(`receive-message`, data);

        await prisma.chats.create({
            data: {
                message: message,
                user_id_sender: user_id_sender,
                user_id_recipient: user_id_recipient
            }
        })
    })

    // Nên lấy danh sách message khởi tạo ban đầu bằng API
    // Không nên dùng socket như phía dưới
    socket.on(`get-list-message`, async (data) => {
        // console.log(`get-list-message`,{data})
        const { user_id_sender, user_id_recipient } = data;

        const chats = await prisma.chats.findMany({
            where: {
                OR: [
                    // lấy tin nhắcn của mình gửi đi
                    {
                        user_id_sender: user_id_sender,
                        user_id_recipient: user_id_recipient
                    },
                    // lấy tin nhấn của đối phương gửi đi
                    {
                        user_id_sender: user_id_recipient,
                        user_id_recipient: user_id_sender
                    }
                ]
            }
        })

        socket.emit(`get-list-message`, chats);

    })
});

httpServer.listen(3069, () => {
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


