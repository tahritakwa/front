import { Resource } from '../shared/ressource.model';
import { Cnss } from './cnss.model';
import { ContractBenefitInKind } from './contract-benefit-in-kind.model';
import { OfferBenefitInKind } from '../rh/offer-benefit-in-kind.model';

export class BenefitInKind extends Resource {
    Name: string;
    Description: string;
    IdCnss?: number;
    Code: string;
    IdCnssNavigation: Cnss;
    IsTaxable: boolean;
    DependNumberDaysWorked: boolean;
    ContractBenefitInKind: Array<ContractBenefitInKind>;
    OfferBenefitInKind: OfferBenefitInKind[];
}
