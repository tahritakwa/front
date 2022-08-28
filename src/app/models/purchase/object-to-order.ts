import { ProvisioningDetails } from './provisioning-details.model';

export class ObjectToOrder {
  IdItem: number;
  IdTiers: number;
  MouvementQuantity: number;
  LastPrice: number;
  IdCurrency: number;
  /**
   *
   */
  constructor(provisioningDetails?: ProvisioningDetails[]) {
    if (provisioningDetails) {
      provisioningDetails.forEach(element => {
        this.createProvisionDetail(element);
      });
    }
  }
  createProvisionDetail(provisioningDetails: ProvisioningDetails) {
    this.IdItem = provisioningDetails.IdItem;
    this.IdTiers = provisioningDetails.IdTiers;
    this.MouvementQuantity = provisioningDetails.MvtQty;
    this.LastPrice = provisioningDetails.LastePurchasePrice;
    this.IdCurrency = provisioningDetails.IdTiersNavigation.IdCurrency;
  }
}
