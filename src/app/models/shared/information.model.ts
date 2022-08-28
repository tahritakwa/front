import { Resource } from './ressource.model';
export class Information extends Resource {
  IdInfo: number;
  Url: string;
  IsMail: boolean;
  IsNotification: boolean;
  Type: string;
}
