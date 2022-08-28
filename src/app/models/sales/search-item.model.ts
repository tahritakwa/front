import { User } from '../administration/user.model';
import { Tiers } from '../achat/tiers.model';
import { Resource } from '../shared/ressource.model';

export class SearchItem extends Resource{
    IdTiers: number;
    DateTime: Date;
    IdCashier: number;
    IdCashierNavigation: User;
    IdTiersNavigation: Tiers;
    SearchMethod: string;
}
