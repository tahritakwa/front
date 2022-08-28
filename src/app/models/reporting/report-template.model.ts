import { Resource } from '../shared/ressource.model';

export class ReportTemplate extends Resource {
  IdEntity: number;
  TemplateCode: string;
  TemplateNameFr: string;
  TemplateNameEn: string;
  text: string;
}
