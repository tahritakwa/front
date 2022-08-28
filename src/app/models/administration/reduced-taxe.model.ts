import { Resource } from '../shared/ressource.model';

export class ReducedTaxe extends Resource {
  Label: string;
  CodeTaxe: string;
  TaxeTypeLabel: string;
  IdTaxeType: number;
  TaxeValue?: number;
}
