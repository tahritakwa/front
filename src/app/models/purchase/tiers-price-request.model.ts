import { Resource } from '../shared/ressource.model';
import { PriceRequest } from './price-request.model';
import { Tiers } from '../achat/tiers.model';

export class TiersPriceRequest extends Resource {
    IdTiers: number;
    IdContact: number;
    IdPriceRequest: number;
    IdPriceRequestNavigation: PriceRequest;
    IdTiersNavigation:  Tiers;
}
