import { Resource } from '../shared/ressource.model';
import { Taxe } from './taxe.model';

export class TaxeGroupConfig extends Resource {
  Value: number;
  IdTaxeGroupTiers: number;
  IdTaxe: number;
  IdTaxeGroupNavigation: number;
  IdTaxeNavigation: Taxe;
  LabelTaxe: string;
  IsDeleted : boolean;
  constructor(Value: number, IdTaxe: number) {
    super();
    this.Value = Value;
    this.IdTaxe = IdTaxe;
}
}
