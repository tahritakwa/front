import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Filter, Operation, Operator } from '../../../shared/utils/predicate';
import { ItemConstant } from '../../../constant/inventory/item.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SearchConstant } from '../../../constant/search-item';
import { ItemService } from '../../services/item/item.service';
import { AddInventoryMovementComponent } from '../../Inventor-document/add-inventory-movement/add-inventory-movement.component';

@Component({
  selector: 'app-inventory-search-item',
  templateUrl: './inventory-search-item.component.html',
  styleUrls: ['./inventory-search-item.component.scss']
})
export class InventorySearchItemComponent implements OnInit, OnDestroy {



  searchBarcode = false;
  search = true;
  current = 1;
  @Input()
  public isForWarehouseDetail = false;
  @Output() ShownTecDoc = new EventEmitter<boolean>();

  reference: string;
  barcodestring: string;

  enterAction;
  filterTies: Filter;
  constructor(public productlist: AddInventoryMovementComponent, public itemService: ItemService) {
    this.enterAction = function (event) {
      const keyName = event.key;
      if (keyName === KeyboardConst.ENTER) {
        if (this.reference) {
          if (this.productlist.modalOptions.data) {
            this.filter(SearchConstant.PEER_CODE, this.productlist.modalOptions.data);
          }
          this.filter(SearchConstant.PEER_CODE);
        }
      }
    };
    document.addEventListener(SearchConstant.KEY_DOWN, this.enterAction);
  }

  showSearch() {
    this.search = true;
    this.searchBarcode = false;
    this.productlist.filterArray = new Array<Filter>();
  }

  showBarcode() {
    this.search = false;
    this.searchBarcode = true;
    this.productlist.filterArray = new Array<Filter>();
  }


  filter(searchTheme: string, filters?) {
    const filter = new Array<Filter>();
    let operator = Operator.and;
    switch (searchTheme) {
      case ItemConstant.PerCode: {
        if (this.filterTies) {
          filter.push(this.filterTies);
        }
        filter.push(new Filter(ItemConstant.CODE, Operation.contains, this.reference, false, true));
        filter.push(new Filter(ItemConstant.DESCRIPTION, Operation.contains, this.reference, false, true));
        break;
      }
      case ItemConstant.PerBarCode: {
        filter.push(new Filter(ItemConstant.BARCODE1D, Operation.contains, this.barcodestring, false, true));
        filter.push(new Filter(ItemConstant.BARCODE2D, Operation.contains, this.barcodestring, false, true));
        break;
      }

    }
    this.productlist.filter(filter, operator, this.searchBarcode);
  }


  pressKeybordEnter(event) {
    if (event.charCode === 13 && this.search) {
      this.filter(SearchConstant.PEER_CODE);
    }
    if (event.charCode === 13 && this.searchBarcode) {
      this.filter(SearchConstant.PEER_BARCODE);
    }
  }

  ngOnInit() {
    this.itemService.TecDoc = false;   
  }
  ngOnDestroy(): void {
    document.removeEventListener(SearchConstant.KEY_DOWN, this.enterAction, false);
  }

}
