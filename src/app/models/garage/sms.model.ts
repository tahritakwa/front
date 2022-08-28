import { Resource } from '../shared/ressource.model';
import { SmsTiers } from './sms-tiers.model';

export class Sms extends Resource {
    Body: string;
    Sender: string;
    ValidReceivers: string;
    InvalidReceivers: string;
    Priority: string;
    SenderForResponse?: boolean;
    TotalCreditsRemoved?: number;
    NameTiers: any;
    ReceiversList: any;
    SmsTiers?: Array<SmsTiers>;
    Immediate?: boolean;
    SendDate?: Date;
    SendHour?: any;

}
