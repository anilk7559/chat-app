const sellItemController = require('../controllers/sell-item.controller');

module.exports = (router) => {
  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {post} /v1/reate-sell-item  Create new sell item
   * @apiDescription Create new sell item
   * @apiUse authRequest
   * @apiPermission all
   */
  router.post(
    '/v1/sell-item',
    Middleware.isAuthenticated,
    sellItemController.createSellItem,
    Middleware.Response.success('create')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission admin
   */

  router.get(
    '/v1/sell-item',
    Middleware.hasRole('admin'),
    sellItemController.search,
    Middleware.Response.success('search')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item/me  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission user
   */

  router.get(
    '/v1/sell-item/model',
    Middleware.isAuthenticated,
    sellItemController.modelSellItem,
    Middleware.Response.success('modelSellItem')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item/me  Get list sell items
   * @apiDescription Get list sell items
   * @apiPermission model
   */

  router.get(
    '/v1/sell-item/me',
    Middleware.isAuthenticated,
    sellItemController.mySellItem,
    Middleware.Response.success('mySellItem')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {get} /v1/sell-item  Get detail sell item
   * @apiDescription Get detail sell item
   * @apiPermission all
   */

  router.get(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.findOne,
    Middleware.Response.success('sellItem')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {post} /v1/sell-item  Update  sell item
   * @apiDescription Update sell item
   * @apiUse authRequest
   * @apiPermission all
   */
  router.put(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.findOne,
    sellItemController.validatePermission,
    sellItemController.update,
    Middleware.Response.success('update')
  );

  /**
   * @apiGroup Sell Item
   * @apiVersion 1.0.0
   * @api {delete} /v1/sell-item/:itemId Remove a photo
   * @apiDescription Remove a sell item
   * @apiUse authRequest
   * @apiParam {String}  itemId
   * @apiPermission user
   */
  router.delete(
    '/v1/sell-item/:itemId',
    Middleware.isAuthenticated,
    sellItemController.remove,
    Middleware.Response.success('remove')
  );
};
