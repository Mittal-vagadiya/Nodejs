const { constants } = require('../../Constants')

const errorHandler = (err, req, res, next) => {
    const statusCode = req.statusCode ? req.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ title: "Validation Error", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
            break;
        case constants.FORBIDDEN:
            res.json({ title: "Forbidden Error", message: err.message, stackTrace: err.stack });
            break;
        case constants.UNAUTORIZED:
            res.json({ title: "Unauthorized", message: err.message, stackTrace: err.stack });
            break;
        case constants.SERVER_ERROR:
            res.json({ title: "Server Error", message: err.message, stackTrace: err.stack });
            break;
        default:
            console.log("No Error Found")
    }
}

module.exports = { errorHandler }