const Joi = require('joi');

function validateDescription(req, res, next) {
    const schema = Joi.object({
        description: Joi.string().min(10).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}

module.exports = { validateDescription };
