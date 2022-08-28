import { Resource } from '../shared/ressource.model';
import { Worker } from './worker.model';
import { Post } from './post.model';
import { ReducedCountry } from '../administration/reduced-country.model';
import { ReducedCity } from '../administration/reduced-city.model';
import { Mileage } from './mileage.model';
import { ProposedOperation } from './proposed-operation.model';
import { Operation } from '../../../COM/Models/operations';

export class MileageProposedOperation extends Resource {
   IdMileage: number;
   IdOperation: number;
   IdMileageNavigation: Array<Mileage>;
   IdOperationNavigation: Array<Operation>;
}
