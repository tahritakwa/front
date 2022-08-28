import { Resource } from '../shared/ressource.model';


export class ClaimInteraction extends Resource {
  IdClaim: number ;
  DocumentDate: Date ;
  TypeInteraction: string ;
  Description: string ;
  TranslationCode: string ;
}
