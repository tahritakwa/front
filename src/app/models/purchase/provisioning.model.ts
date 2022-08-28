import { ProvisioningOption } from './provision-option.model';
import { Resource } from '../shared/ressource.model';

export class Provisioning extends Resource {
    Code: string;
    ProjectDate: Date;
    CreationDate: Date;
    IdProvisioningOption: number;
    DeletedToken: string;
    isPurchaseOrderGenerated: boolean;
    IdTiers: Array<number> = new Array<number>();
    IdProvisioningOptionNavigation: ProvisioningOption;
    constructor(IdTiers: Array<number>, HistorySales: boolean, HistoryPurchase: boolean, QtMin_Max: boolean
        , SearchByNewReferences: boolean, SatrtDatePurchase: Date, EndDatePurchase: Date, SatrtDateSales: Date
      , EndDateSales: Date, NewReferencesStartDate: Date, NewReferencesEndDate: Date) {
      super();
        this.IdProvisioningOptionNavigation =
            new ProvisioningOption(HistorySales, HistoryPurchase, QtMin_Max, SearchByNewReferences,
                SatrtDatePurchase, EndDatePurchase, SatrtDateSales, EndDateSales, NewReferencesStartDate, NewReferencesEndDate);
        this.IdTiers = IdTiers;
    }
}
