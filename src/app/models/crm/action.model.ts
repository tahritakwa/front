import {Address} from './address.model';

export class Action {
  id: number;
  name: string;
  commercialAssignedToId: number;
  commercialAssignedToEmail: number;
  type: string;
  startDate: any;
  reminderDate: any;
  endDate: any;
  duration: number;
  deadLine: Date;
  progress: string;
  priority: string;
  state: string;
  associatedOpportunityId: number;
  organizationId: number;
  description: string;
  address: Address;
  contactConcernedId: number;
  associatedOppClientId: number;
  contactClientId: number;
  concernedOrgClientId: number;
  reminders: any[];
  frequency: any;
}
