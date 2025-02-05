import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant/app.constant.js";
import prisma from "../prisma/init.prisma.js";
import {UnAuthorizationException} from '../../common/helpers/error.helper.js';

export const protect = async (req, res, next) => {

    try {

        const accessToken = req.headers.authorization?.split(` `)[1];

        if(!accessToken){
            throw new UnAuthorizationException('Vui lòng cung cấp authorization');
        }

        const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        // console.log("🚀 ~ protect ~ decode:", decode)

        const user = await prisma.users.findUnique({
            where: {
                user_id: decode.userId
            }
        })

        req.user = user;

        next();
        
    } catch (error) {
        next(error)
    }
};

