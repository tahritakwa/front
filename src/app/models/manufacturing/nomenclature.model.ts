import {OfProductLine} from './ofProductLine.model';
import {NomenclatureType} from '../enumerators/nomenclature-type.enum';

export class Nomenclature {

  id: number;
  reference: string;
  typeNomenclature: NomenclatureType;
  productId: number;
  productLines: Array<OfProductLine>;

}
