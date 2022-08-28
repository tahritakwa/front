import { Item } from '../inventory/item.model';
import { Tiers } from '../achat/tiers.model';

export class ProvisioningDetails {
    Id = 0;
    IdProvisioning = 0;
    IdItem = 0;
    MvtQty = 0;
    LastePurchasePrice = 0;
    IsDeleted = false;
    IdItemNavigation = new Item();
    MinQuantity = 0;
    DeleveryDelay = 0;
    AverageSalesPerDay = 0;
    OnOrderQuantity = 0;
    CurrencyCode = '';
    CurrencyPrecision = 0;
    formatOptions = {};
    IdTiers = 0;
    isQtyChanged;
    LastSalesPrice = 0;
    LabelVehicule = '';
    IdTiersNavigation = new Tiers();
    RemainingQty = 0;
    constructor(dataItem?: ProvisioningDetails) {
        if (dataItem) {
            Object.assign(this, dataItem);
            // this.IdTiers = dataItem.Item.IdTiersNavigation.Id;
        }
    }
}
