import { Resource } from '../shared/ressource.model';
import { Offer } from './offer.model';

export class Advantages extends Resource {
    Description: string;
    IdOffer: number;
    IdOfferNavigation: Offer;
}
