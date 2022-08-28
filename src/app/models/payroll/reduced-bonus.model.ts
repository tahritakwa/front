import { Resource } from '../shared/ressource.model';

export class ReducedBonus extends Resource {
    Code: string;
    Name: string;
    Description: string;
    /**
     * To memorize the minimum start date of the periodicity in order to carry out checks
     */
    StartDate: Date;
}
