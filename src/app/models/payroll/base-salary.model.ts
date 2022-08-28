import { Resource } from '../shared/ressource.model';

export class BaseSalary extends Resource {
  Value: number;
  StartDate: Date;
  IdContract: number;
  State: number;
}
