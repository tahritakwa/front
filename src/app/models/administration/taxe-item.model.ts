import { Resource } from '../shared/ressource.model';
import { Taxe } from './taxe.model';


export class TaxeItem extends Resource {
  IdTaxe: number;
  IdArticle: number;
  IdTaxeNavigation: Taxe;
  constructor(taxe: number, article: number) {
    super();
    this.IdArticle = article;
    this.IdTaxe = taxe;
  }
}
