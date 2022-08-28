import { Bonus } from '../payroll/bonus.model';
import { Resource } from '../shared/ressource.model';
import { Offer } from './offer.model';

export class OfferBonus extends Resource {
    Value: number;
    ValidityStartDate: Date;
    ValidityEndDate?: Date;
    IdBonus: number;
    IdOffer: number;
    IdBonusNavigation: Bonus;
    IdOfferNavigation: Offer;
}
