import {OpportunityType} from './enums/opportunityType.enum';
import {ReasonForChange} from './ReasonForChange.model';

export class Opportunity {

  id?: number;
  title: string;
  categoryId: number;
  rating: string;
  responsableUserId: number;
  currentPositionPipe: number;
  closedPositionPipe: number;
  opportunityCreatedDate?: Date;
  opportunityEndDate: Date;
  estimatedIncome: number;
  currencyId: number;
  description: string;
  employeeId: number;
  productIdList: Array<number>;
  IdContact: number;
  statusTitle: string;
  reasonForChange: string;
  customerId: number;
  organisationId: number;
  idClientContact: number;
  idClientOrganization: number;
  opportunityType: OpportunityType;
  statusList;
  category;
  isDeleted;
  idClient;
  organisationName: string;
  reasonForChanges: Array<ReasonForChange>;

}
