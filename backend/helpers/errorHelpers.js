// backend/helpers/errorHelpers.js
const errorHelpers = {
    sendValidationError(res, errors) {
        return res.status(400).json({ errors: errors.array() });
    },
    sendServerError(res, err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = errorHelpers;
