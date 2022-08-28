import { Resource } from '../shared/ressource.model';
import { BonusValidityPeriod } from './bonus-validity-period.model';

export class Bonus extends Resource {
    Code: string;
    Name: string;
    Description: string;
    Value: number;
    IsFixe: boolean;
    IsContributory: boolean;
    IdCnss: number;
    IsTaxable: boolean;
    DependNumberDaysWorked: boolean;
    UpdatePayslip: boolean;
    /**
     * To memorize the minimum start date of the periodicity in order to carry out checks
     */
    StartDate: Date;
    BonusValidityPeriod: BonusValidityPeriod[];
}
