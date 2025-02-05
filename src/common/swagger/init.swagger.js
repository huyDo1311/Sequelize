import video from "./video.swagger.js"

const swaggerDocument = {
    openapi: "3.1.0",
    info: {
        title: "Be Cyber Media",
        version: "1.0.0.0.0"
    },
    servers: [
        {
            url: "http://localhost:3069",
            description: "server tai local",
        }
    ],
    components: {
        securitySchemes: {
            anhHuyToken: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    paths: {
        ...video
    }
}

export default swaggerDocument