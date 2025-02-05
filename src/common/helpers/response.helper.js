export const responseSuccess = (metadata = null,message = `OK`,code = 200) => {
    
    if (typeof code !== `number`) code = 200;

    return {
        status: `success`,
            code,
            message: message,
            metaData : metadata,
            doc: `api.domain.com/doc`
    }
}

export const responseError = (message = `Internal Server Error`,code = 500, stack = null) => {

    if(typeof code !== `number`) code = 500;

    return {
        status: `error`,
            code,
            message: message,
            doc: `api.domain.com/doc`,
            stack: stack
    }
}