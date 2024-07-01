const Joi = require('joi');

/**
 * do upload a video
 */
exports.upload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(PopulateResponse.error({ message: 'Missing video file!' }, 'ERR_MISSING_VIDEO'));
    }

    const schema = Joi.object()
      .keys({
        name: Joi.string().allow('', null).optional(),
        description: Joi.string().allow('', null).optional()
      })
      .unknown();

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }

    const video = await Service.Media.createVideo({
      value: validate.value,
      user: req.user,
      file: req.file
    });

    res.locals.video = video;
    return next();
  } catch (e) {
    return next(e);
  }
};
