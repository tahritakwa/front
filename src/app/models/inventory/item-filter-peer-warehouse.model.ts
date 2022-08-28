import { PredicateFormat } from '../../shared/utils/predicate';
import { FiltersItemDropdown } from '../shared/filters-item-dropdown.model';

export class ItemFilterPeerWarehouse {
  predicate: PredicateFormat;
  filtersItemDropdown: FiltersItemDropdown;
  constructor(pred: PredicateFormat, filtersItemDropdown: FiltersItemDropdown) {
    this.predicate = pred;
    this.filtersItemDropdown = filtersItemDropdown;
  }
}
