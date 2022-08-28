import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class CurriculumVitae extends Resource {
  DepositDate: Date;
  CreationDate: Date;
  Entitled: string;
  IdCandidate: number;
  CvFileInfo: FileInfo;
  CurriculumVitaePath: string;
}
