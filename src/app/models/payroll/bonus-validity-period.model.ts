import { Resource } from '../shared/ressource.model';


export class BonusValidityPeriod extends Resource {
    IdBonus: number; 
    Value: number;
    StartDate: Date;
    IdBonusNavigation: number;
}
