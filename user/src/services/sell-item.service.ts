import { IGetSellItem } from 'src/interfaces/sell-item';

import { APIRequest } from './api-request';

class SellItemService extends APIRequest {
  createSellItem(data: any) {
    return this.post('/sell-item', data);
  }

  // user get sell item of model
  getModelSellItem(data: IGetSellItem) {
    return this.get('/sell-item/model', data as any);
  }

  getMySellItem(data: IGetSellItem) {
    return this.get('/sell-item/me', data as any);
  }

  updateSellItem(id: string, data: any) {
    return this.put(`/sell-item/${id}`, data);
  }

  removeSellItem(id: string) {
    return this.del(`/sell-item/${id}`);
  }
}

export const sellItemService = new SellItemService();
