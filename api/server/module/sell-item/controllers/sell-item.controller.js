const Joi = require('joi');
const _ = require('lodash');

exports.createSellItem = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      mediaId: Joi.string().required(),
      price: Joi.number().min(0).required(),
      free: Joi.boolean().required(),
      name: Joi.string().min(2).max(500).required(),
      description: Joi.string().required(),
      mediaType: Joi.string().allow('photo', 'video').required()
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }
    const media = await DB.Media.findOne({ _id: validate.value.mediaId });
    if (!media) {
      return next(PopulateResponse.notFound());
    }

    const sellItem = new DB.SellItem({ userId: req.user._id, ...validate.value });
    await sellItem.save();
    res.locals.create = sellItem;
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;

  try {
    const query = Helper.App.populateDbQuery(req.query, {
      equal: ['userId', 'mediaType', 'isApproved']
    });

    const sort = Helper.App.populateDBSort(req.query);
    const count = await DB.SellItem.count(query);
    const items = await DB.SellItem.find(query)
      .populate({
        path: 'media',
        select:
          req.query.userId !== req.user._id.toString()
            ? 'name userId thumbPath blurPath filePath type uploaderId systemType _id'
            : ''
      })
      .populate('model')
      .sort(sort)
      .skip(page * take)
      .limit(take)
      .exec();
    res.locals.search = {
      count,
      items: items.map((item) => {
        const data = item.toObject();
        data.model = item.model ? item.model.getPublicProfile() : {};
        return data;
      })
    };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const schema = Joi.object().keys({
      price: Joi.number().min(0).required(),
      free: Joi.boolean().required(),
      name: Joi.string().min(2).max(500).required(),
      description: Joi.string().required(),
      isApproved: Joi.boolean().optional()
    });

    const validate = schema.validate(req.body);
    if (validate.error) {
      return next(PopulateResponse.validationError(validate.error));
    }
    const newData = req.user.role === 'admin' ? validate.value : _.omit(validate.value, ['isApproved']);
    _.merge(req.sellItem, newData);
    await req.sellItem.save();

    res.locals.update = req.sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.itemId;
    if (!id) {
      return next(PopulateResponse.notFound());
    }
    let sellItem = null;
    if (req.user.role === 'admin') {
      sellItem = await DB.SellItem.findOne({ _id: id }).populate('media').populate('model');
      sellItem.media = await Service.Media.populateAuthRequest({ media: sellItem.media, user: req.user });
    } else if (req.user.role !== 'admin' && req.user.type === 'model') {
      sellItem = await DB.SellItem.findOne({ _id: id, userId: req.user._id }).populate('media');
      sellItem.media = await Service.Media.populateAuthRequest({ media: sellItem.media, user: req.user });
    } else if (req.user.role !== 'admin' && req.user.type === 'user') {
      sellItem = await DB.SellItem.findOne({ _id: id });
    }

    if (!sellItem) {
      return next(PopulateResponse.notFound());
    }

    res.locals.sellItem = sellItem;
    req.sellItem = sellItem;
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const sellItem = await DB.SellItem.findOne({ _id: req.params.itemId });
    if (!sellItem) {
      return next(PopulateResponse.notFound());
    }
    if (req.user.role !== 'admin' && sellItem.userId.toString() !== req.user._id.toString()) {
      return next(PopulateResponse.forbidden());
    }
    await Service.SellItem.checkAndRemoveRelatedData(sellItem);
    await sellItem.remove();

    res.locals.remove = PopulateResponse.success({ message: 'Sell item is removed' }, 'SELL_ITEM_REMOVED');
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.validatePermission = async (req, res, next) => {
  if (
    req.user.role !== 'admin'
    && (req.user.type !== 'model' || req.user._id.toString() !== req.sellItem.userId.toString())
  ) {
    return next(PopulateResponse.forbidden());
  }

  return next();
};

exports.mySellItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    if (req.user.type !== 'model') {
      return next(PopulateResponse.forbidden());
    }

    const count = await DB.SellItem.count({ userId: req.user._id, mediaType: req.query.mediaType, isApproved: true });
    const items = await DB.SellItem.find({ userId: req.user._id, mediaType: req.query.mediaType, isApproved: true })
      .populate('media')
      .sort({ createdAt: -1 })
      .skip(page * take)
      .limit(take)
      .exec();

    res.locals.mySellItem = { count, items };
    return next();
  } catch (e) {
    return next(e);
  }
};

exports.modelSellItem = async (req, res, next) => {
  const page = Math.max(0, req.query.page - 1) || 0; // using a zero-based page index for use with skip()
  const take = parseInt(req.query.take, 10) || 10;
  try {
    // if (req.user.type !== 'user') {
    //   return next(PopulateResponse.forbidden());
    // }

    const count = await DB.SellItem.count({
      userId: req.query.modelId,
      mediaType: req.query.mediaType,
      isApproved: true
    });
    const items = await DB.SellItem.find({
      userId: req.query.modelId,
      mediaType: req.query.mediaType,
      isApproved: true
    })
      .populate('media')
      .sort({ createdAt: -1 })
      .skip(page * take)
      .limit(take)
      .exec();

    // todo - find and populate purchase item data
    const sellItemIds = items.map((item) => item._id);
    const purchaseItems = await DB.PurchaseItem.find({
      userId: req.user._id,
      sellItemId: {
        $in: sellItemIds
      }
    });
    const data = await Promise.all(items.map((item) => {
      item.set('isPurchased', purchaseItems.find((p) => p.sellItemId.toString() === item._id.toString()) !== undefined);
      item.set(
        'purchasedItem',
        purchaseItems.find((p) => (p.sellItemId.toString() === item._id.toString() ? p : null))
      );

      return item;
    }));

    res.locals.modelSellItem = {
      count,
      items: data
    };
    return next();
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
