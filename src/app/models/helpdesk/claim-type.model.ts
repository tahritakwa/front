import { Resource } from '../shared/ressource.model';


export class ClaimType extends Resource {
  CodeType: string ;
  Type: string ;
  TranslationCode: string ;
  StockOperation: string ;
  ReclamationOperation: string ;
  Description: string ;
}
