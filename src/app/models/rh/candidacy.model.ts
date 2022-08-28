import { Resource } from '../shared/ressource.model';
import { Candidate } from './candidate.model';
import { Recruitment } from './recruitment.model';
import { Interview } from './interview.model';
import { Offer } from './offer.model';
import { Email } from './email.model';

export class Candidacy extends Resource {
  State: number;
  TotalAverageMark?: number;
  NumberOfOffer?: number;
  HasAlreadyAnOffer: boolean;
  IdRecruitment: number;
  IdCandidate: number;
  IdCandidateNavigation: Candidate;
  IdRecruitmentNavigation: Recruitment;
  IdEmailNavigation: Email;
  Interview: Interview[];
  Offer: Offer[];
  CreationDate: Date;
}
