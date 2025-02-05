import { response } from "express"

const video = {
    "/video/video-list": {
        get: {
            tags: ["Videos"],
            security: [{anhHuyToken: []}],
            responses: {
                200: {
                    description: "oke",
                }
            },
            parameters: [
                {
                    name: "page",
                    in: "query",
                    description: "nếu không truyền vào là 1",
                },
                {
                    name: "pageSize",
                    in: "query",
                    description: "nếu không truyền vào là 1",
                },
            ]
        }
    },
    "/video/video-detail/{id}": {
        get: {
            tags: ["Videos"],
            security: [{anhHuyToken: []}],
            responses: {
                200: {
                    description: "oke",
                }
            },
            parameters: [
                {
                    name: "id",
                    in: "path",
                    description: "ID của video",
                    required: true,
                    schema: {
                        type: "string",
                    }
                }
            ]
        },

    },
    "/video/video-create": {
        post: {
            tags: ["Videos"],
            security: [{anhHuyToken: []}],
            responses: {
                200: {
                    description: "oke",
                }
            },
            requestBody: {
                description: "dữ liệu để tạo 1 video",
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                video_name: { type: "string" },
                                description: { type: "string" },
                                views: { type: "number"}
                            }
                        }
                    }
                }
            }
        },

    },
    "/video/video-update": {
        post: {
            tags: ["Videos"],
            security: [{anhHuyToken: []}],
            responses: {
                200: {
                    description: "oke",
                }
            },
            requestBody: {
                description: "dữ liệu để tạo 1 video",
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                file: {
                                    type: "string",
                                    format: "binary"
                                },
                                files: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                        format: "binary"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

    },
}

export default video