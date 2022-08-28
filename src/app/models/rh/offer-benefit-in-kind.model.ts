import { Resource } from '../shared/ressource.model';
import { BenefitInKind } from '../payroll/benefit-in-kind.model';
import { Offer } from './offer.model';

export class OfferBenefitInKind extends Resource {
    IdOffer: number;
    IdBenefitInKind: number;
    ValidityStartDate?: Date;
    ValidityEndDate?: Date;
    Value: number;
    IdBenefitInKindNavigation: BenefitInKind;
    IdOfferNavigation: Offer;
}
