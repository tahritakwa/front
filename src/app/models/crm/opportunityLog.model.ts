export class OpportunityLog {
  oldStatus: string;
  newStatus: string;
  opportunityId: number;
  userMail: string;
  opportunityTitle: string;
  updatedDate: string;

  constructor(oldStatus: string, newStatus: string, idOpportunity: number, userMail: string, opportunityName: string, updateDate: string) {
    this.oldStatus = oldStatus;
    this.newStatus = newStatus;
    this.opportunityId = idOpportunity;
    this.userMail = userMail;
    this.opportunityTitle = opportunityName;
    this.updatedDate = updateDate;
  }
}
