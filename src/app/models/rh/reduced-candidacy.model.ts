import { Resource } from '../shared/ressource.model';
import { Candidate } from './candidate.model';

export class ReducedCandidacy extends Resource {
  State: number;
  IdCandidate: number;
  IdCandidateNavigation: Candidate;
}
