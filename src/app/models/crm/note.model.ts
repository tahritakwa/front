import {Opportunity} from './opportunity.model';
import {Organisation} from './organisation.model';

export class Note {
  id: number;
  title: string;
  date: any;
  note: string;
  concernedOrganistaionId: number;
  contactId: number;
  opportunityId: number;
  claimId: number;
  actionId: number;
  idConClient: number;
  idOrgClient: number;
}
