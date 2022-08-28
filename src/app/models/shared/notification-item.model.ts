import { Resource } from './ressource.model';

/**
 *
 * Notification item model
 * */
export class NotificationItem extends Resource {
  IdNotification: number;
  IdTargetUser: number;
  IdTiers: number;
  Viewed: boolean;
  Link: string;
  CodeEntity: string;
  NotificationType: number;
  IdInfo: number;
  Lang: string;
  CreationDate: Date;
  FinancialCommitmentDate: Date;
  CreationDateString: string;
  FinancialCommitmentDateString: string;
  TranslationKey: string;
  Text: string;
  Creator: NotificationCreator;
  DataOfEndContract: NotificationItemEndContract;
  Parameters: any;
  ConnectedCompany: string;

  constructor(Id?: number, parentId?: number, IdTargetUser?: number, Viewed?: boolean, CreationDateString?: string,
              TranslationKey?: string, Creator?: NotificationCreator, NotificationType?: number) {
    super();
    this.Id = Id;
    this.parentId = parentId;
    this.IdTargetUser = IdTargetUser;
    this.Viewed = Viewed;
    this.CreationDateString = CreationDateString;
    this.TranslationKey = TranslationKey;
    this.Creator = Creator;
    this.NotificationType = NotificationType;
  }
}
class NotificationCreator {
  FirstName: string;
  LastName: string;
}

class NotificationItemEndContract {
  FullName: string;
  DateEndContract: string;
}
