import { Resource } from '../shared/ressource.model';
import { Recruitment } from './recruitment.model';
import { Language } from '../shared/Language.model';

export class RecruitmentLanguage extends Resource {
  IdRecruitment: number;
  IdLanguage: number;
  Rate: number;
  IdRecruitmentNavigation: Recruitment;
  IdLanguageNavigation: Language;

  constructor(IdRecruitment: number, IdLanguage: number, Rate: number) {
    super();
    this.IdRecruitment = IdRecruitment;
    this.IdLanguage = IdLanguage;
    this.Rate = Rate;
  }
}
