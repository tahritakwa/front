import { Resource } from "../shared/ressource.model";

export class TierCategory extends Resource {
    Code: string ;
    Name : string ;
    DeletedToken : string ;
    IdTiers:number ;
}