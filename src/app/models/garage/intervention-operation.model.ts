import { Resource } from '../shared/ressource.model';
import { Intervention } from './intervention.model';
import { Operation } from './operation.model';

export class InterventionOperation extends Resource {
  IdIntervention: number;
  IdOperation: number;
  Status: number;
  ValidateBy: number;
  Duration: string;
  Description: string;
  Ttcprice: number;

  IdInterventionNavigation: Intervention;
  IdOperationNavigation: Operation;

  constructor(model: any) {
    super();
    this.Id = model.Id;
    this.IdIntervention = model.IdIntervention;
    this.IdOperation = model.IdOperation;
    this.Status = model.Status;
    this.ValidateBy = model.ValidateBy;
    this.Duration = model.Duration;
    this.Ttcprice = model.Ttcprice;
    this.IdOperationNavigation = model.IdOperationNavigation;
    this.Description = model.Description;
  }

}
