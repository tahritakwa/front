import {ClaimsCategoryEnum} from './enums/claimsCategory.enum';
import {ContactCrm} from './contactCrm.model';
import {Opportunity} from './opportunity.model';
import {ClaimsGravityEnum} from './enums/claimsGravity.enum';
import {ClaimType} from './enums/claimType.enum';
import {ClaimStateEnum} from './enums/claimState.enum';

export class Claim {
  id: number;
  topic: string;
  category: ClaimsCategoryEnum;
  declaredBy: ContactCrm;
  deadline: Date;
  gravity: ClaimsGravityEnum;
  state: ClaimStateEnum;
  assignedTo: Opportunity;
  description: string;
  organizationId: number;
  organizationName: string;
  idClientContact: number;
  idClientOrganization: number;
  claimType: ClaimType;
}
