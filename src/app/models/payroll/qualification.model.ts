import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';
import { QualificationType } from './qualification-type.model';
import { Country } from '../administration/country.model';

export class Qualification extends Resource {
  IdEmployee?: number;
  IdCandidate?: number;
  University: string;
  IdQualificationCountry: number;
  IdQualificationType: number;
  QualificationDescritpion: string;
  GraduationYearDate?: Date;
  QualificationFileInfo: Array<FileInfo>;
  QualificationAttached: string;
  IdQualificationTypeNavigation: QualificationType;
  IdQualificationCountryNavigation: Country;
}
