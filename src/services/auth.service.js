import prisma from "../common/prisma/init.prisma.js";
import { BadRequestException, UnAuthorizationException } from '../common/helpers/error.helper.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRED, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRED, REFRESH_TOKEN_SECRET } from '../common/constant/app.constant.js';
import sendMail from "../common/nodemailoer/send-mail.nodemailer.js";

const authService = {
    //api
    register: async (req) => {
        const { full_name, email, pass_word } = req.body;
        const userExists = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        // console.log({userExists});
        if (userExists) {
            throw new BadRequestException(`Tài khoản đã tồn tại`);
        }

        const passHash = bcrypt.hashSync(pass_word, 10)

        const userNew = await prisma.users.create({
            data: {
                email: email,
                full_name: full_name,
                pass_word: passHash
            }
        })

        delete userNew.pass_word;

        // Gửi email trào mừng
        sendMail(email).catch((err) => {
            console.log(`Lỗi gửi email:`, err)
        })

        // userNew.pass_word = `1234`;
        // userNew.email = 1234;

        return userNew;
    },
    login: async (req) => {

        const { email, pass_word } = req.body;

        const userExists = await prisma.users.findFirst({
            where: {
                email: email
            }
        })

        if (!userExists) {
            throw new BadRequestException(`Tài khoản chưa tồn tại`)
        }

        if (!userExists.pass_word) {
            if (userExists.face_app_id) {
                throw new BadRequestException(`Vui lòng đăng nhập bằng facebook để tạo mật khẩu mới`);
            }
            if (userExists.goole_id) {
                throw new BadRequestException(`Vui lòng đăng nhập bằng google để tạo mật khẩu mới`);
            }
            throw new BadRequestException(`Không hợp lệ, vui lòng liên hệ chăm sóc khách hàng`);
        }

        const isPassword = bcrypt.compareSync(pass_word, userExists.pass_word);

        if (!isPassword) {
            throw new BadRequestException(`Mật khẩu không chính xác`)
        }

        // this.createTokens
        const tokens = authService.createTokens(userExists.user_id)
        // const accessToken = this.createTokens({ userid: userExists.id })

        return tokens
    },
    facebookLogin: async (req) => {
        console.log(req.body);
        const { name, email, picture, id } = req.body;
        const avatar = picture.data.url;

        let userExists = await prisma.users.findFirst({
            where: {
                email: email
            }
        });

        if (!userExists) {
            userExists = await prisma.users.create({
                data: {
                    email: email,
                    full_name: name,
                    avatar: avatar,
                    face_app_id: id
                }
            })
        }

        const tokens = authService.createTokens(userExists.user_id)

        return tokens
    },

    refreshToken: async (req) => {
        const refreshToken = req.headers.authorization?.split(` `)[1];
        if (!refreshToken) {
            throw new UnAuthorizationException('Vui lòng cung cấp authorization');
        }

        const accessToken = req.headers[`x-access-token`];
        if (!accessToken) {
            throw new UnAuthorizationException('Vui lòng cung cấp authorization');
        }

        const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
        const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, { ignoreExpiration: true })
        // console.log(accessToken);
        // console.log({decodeAccessToken, decodeRefreshToken});

        if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
            throw new UnAuthorizationException(`2 Cặp Token không hợp lệ`);
        }

        const userExists = await prisma.users.findUnique({
            where: {
                user_id: decodeRefreshToken.userId,
            },
        })

        if (!userExists) throw new UnAuthorizationException(`User không tồn tại`);

        const tokens = authService.createTokens(userExists.user_id);

        return tokens;
    },
    getInfo: async (req) => {
        return req.user
    },





    //function
    createTokens: (userId) => {
        if (!userId) throw new BadRequestException(`Tài khoản không hợp lệ:: 1`)
        const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRED });

        const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRED });

        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    // createTokens: function(payload) {
    //     const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || 'default-secret', {
    //         expiresIn: '1d' // Token expires in 1 day
    //     });
    //     return accessToken
    // }
}

export default authService