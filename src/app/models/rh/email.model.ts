import { Resource } from '../shared/ressource.model';
import { Interview } from './interview.model';
import { Offer } from './offer.model';

export class Email extends Resource {
  Subject: string;
  Body: string;
  Status: number;
  Sender: string;
  Receivers: string;
  Interview: Interview[];
  Offer: Offer[];
  CandidacyState: boolean;
  From: string;
}
