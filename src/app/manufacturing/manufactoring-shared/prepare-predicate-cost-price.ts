import {Filter, PredicateFormat, Relation} from '../../shared/utils/predicate';


export function preparePredicateFilterToGetCostPrice(idItem): PredicateFormat {
  const prepareFilter: PredicateFormat = new PredicateFormat();
  prepareFilter.Filter = [];
  prepareFilter.Relation = [];
  prepareFilter.Filter.push(new Filter('Id', 1, idItem, false, false));
  prepareFilter.Relation.push(new Relation('IdTiersNavigation'), new Relation('ItemWarehouse'),
    new Relation('TaxeItem'), new Relation('IdNatureNavigation'), new Relation('ItemKitIdKitNavigation'),
    new Relation('ItemKitIdItemNavigation'), new Relation('ItemVehicleBrandModelSubModel'),
    new Relation('IdProductItemNavigation'), new Relation('ItemTiers'), new Relation('ItemTiers.IdTiersNavigation'),
    new Relation('OemItem'), new Relation('OemItem.IdBrandNavigation'), new Relation('ItemSalesPrice'));
  return prepareFilter;
}
