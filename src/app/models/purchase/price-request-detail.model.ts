import { Resource } from '../shared/ressource.model';
import { PriceRequest } from './price-request.model';
import { Item } from '../inventory/item.model';
import { Tiers } from '../achat/tiers.model';
import { Contact } from '../shared/contact.model';

export class PriceRequestDetail extends Resource {
    IdPriceRequest: number;
    IdItem: number;
    Designation: string;
    MovementQty: number;
    IdItemNavigation: Item;
    IdTiers: number;
    IdTiersNavigation: Tiers;
    IdContact: number;
    ContactString: string;
    IdPriceRequestNavigation: PriceRequest;
    IdContactNavigation : Contact;
}
