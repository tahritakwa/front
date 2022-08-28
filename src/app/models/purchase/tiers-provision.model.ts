import { Provisioning } from './provisioning.model';

import { Tiers } from '../achat/tiers.model';

export class TiersProvisioning {
    Id: number;
    IdTiers: number;
    IdProvisioning: number;
    Total: number;
    IdProvisioningNavigation: Provisioning;
    IdTiersNavigation: Tiers;
    CurrencyCode: string;
    CurrencyPrecision: number;
}
