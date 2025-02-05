import { BadRequestException } from "../helpers/error.helper.js";
import prisma from "../prisma/init.prisma.js";

export const checkPermission = async (req, res, next) => {
    try {
        const user = req.user;
        const role_id = user.role_id;
        const baseUrl = req.baseUrl;
        const routePath = req.route.path;
        const fullPath = `${baseUrl}${routePath}`;
        const method = req.method;

        //nếu là ADMIN (role_id === 1) thì cho qua
        // bắt buộc phải có return, nếu không code sẽ chạy tiếp tục
        if(role_id === 1) return next();

        const permission = await prisma.permissions.findFirst({
            where: {
                endpoint: fullPath,
                method: method
            }
        });

        const role_permission = await prisma.role_permissions.findFirst({
            where: {
                role_id: role_id,
                permission_id: permission.permission_id,
                is_active: true
            }
        })

        if(!role_permission) throw new BadRequestException('Bạn không đủ quyền sử dụng tài nguyên (API) này')

        next()
    } catch (error) {
        next(error)
    }
}