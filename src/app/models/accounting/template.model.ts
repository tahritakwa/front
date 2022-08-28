import { TemplateDetails } from "./templateDetails.model";

export class Template  {
    id: number;
    label: string;
    journalId: number;
    journalLabel: string;
    templateDetails: TemplateDetails[];
  }