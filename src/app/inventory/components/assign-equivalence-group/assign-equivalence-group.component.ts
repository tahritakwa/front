import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { Item } from '../../../models/inventory/item.model';
import { AdvancedListProductsComponent } from '../advanced-list-products/advanced-list-products.component';

const Items_Tab_Id = 'items-tab-equv';
const Fiches_Tab_Id = 'fiche-tab-equv';
const Depot_Tab_Id = 'tab-associated-depot-equv';

const Items_Tab_Href = 'items-equv';
const Fiches_Tab_Href = 'fiches-equv';
const Depot_Tab_Href = 'associated-depot-equv';

@Component({
  selector: 'app-assign-equivalence-group',
  templateUrl: './assign-equivalence-group.component.html',
  styleUrls: ['./assign-equivalence-group.component.scss'],
})
export class AssignEquivalenceGroupComponent implements OnInit {
  /**
   * equ comp child components Tabs Ids
   */
  public itemsTabId = Items_Tab_Id;
  public fichesTabId = Fiches_Tab_Id;
  public depotTabId = Depot_Tab_Id;

  /**
   * equ comp child components Tabs herf
   */
  public itemsTabHref = Items_Tab_Href;
  public fichesTabHref = Fiches_Tab_Href;
  public depotTabHref = Depot_Tab_Href;

  @Input() item: Item;
  @Input() disabled: boolean;
  @Input() isFromUpdateItem: boolean;
  @ViewChild('listEquivalenceChild') listEquivalenceChild: AdvancedListProductsComponent;

  constructor() { }

  ngOnInit() { }
}
