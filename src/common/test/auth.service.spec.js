import { describe, expect, it, jest } from "@jest/globals";
import authService from "../../services/auth.service.js";
import prisma from "../prisma/init.prisma.js";
import {REGEX_EMAIL} from '../constant/app.constant.js';

describe("Auth Service", () => {

    beforeEach(() => {
        // console.log(`beforeEach chạy`);
        jest.spyOn(prisma.users, `create`);
        jest.spyOn(prisma.users, `findFirst`);
    })
    afterEach(() => {
        // console.log(`afterEach chạy`);
        jest.restoreAllMocks();
    })


    it("Case 1: Trường hợp đăng ký thành công thông tin hợp lệ", async () => {
        // console.log(`Case 1`);

        await prisma.users.findFirst.mockResolvedValue(undefined);
        // console.log({userExists});
        await prisma.users.create.mockResolvedValue({
            user_id: 12,
            email: 'nguyenthitest@gmail.com',
            full_name: 'nguyenthitest',
            avatar: null,
            goole_id: null,
            face_app_id: null,
            created_at: `2025-02-05T09:16:34.000Z`,
            updated_at: `2025-02-05T09:16:34.000Z`,
            role_id: 2
        })

        const req = {
            body: {
                full_name: `nguyenthitest`,
                email: `nguyenthitest@gmail.com`,
                pass_word: `1234`
            }
        }
        const userNew = await authService.register(req);
        console.log({ userNew });

        expect(userNew).not.toHaveProperty(`pass_word`);
        expect(typeof userNew.email).toBe(`string`);
        // console.log(REGEX_EMAIL.test(userNew.email));
        expect(REGEX_EMAIL.test(userNew.email)).toBe(true);
    })
    it("Case 2: Trường hợp đăng ký, email đã tồn tại, cần phải báo lỗi", () => {
        // console.log(`Case 2`);
    })

})

