import { Component, ComponentRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ItemService } from '../../../inventory/services/item/item.service';
import { copyOfListByValue, pushIfNotExist } from '../../../shared/helpers/list.helper';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PricesService } from '../../services/prices/prices.service';

@Component({
  selector: 'app-price-items-affection-list',
  templateUrl: './price-items-affection-list.component.html',
  styleUrls: ['./price-items-affection-list.component.scss']
})
export class PriceItemsAffectionListComponent implements OnInit {

  public totalSelection: number;
  predicateQuickSearch: PredicateFormat;
  public isFromSelectAll = false;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public selectedIds: number[] = [];
  public oldSelectedIds: number[] = [];
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_REDUCED;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 5,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: SharedConstant.CODE,
      title: SharedConstant.REFERENCE_TITLE,
      _width: 135,
      filterable: true
    },
    {
      field: SharedConstant.DESCRIPTION,
      title: SharedConstant.DESIGNATION_TITLE,
      _width: 200,
      filterable: true
    },
    {
      field: SharedConstant.ITEM_TIERS,
      title: SharedConstant.FSR_TITLE,
      _width: 135,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  isModal = false;
  options: Partial<IModalDialogOptions<any>>;
  reference: ComponentRef<IModalDialog>;
  public closeDialogSubject: Subject<any>;
  public dataModal: any;
  public searchInput;
  constructor(public pricesService: PricesService, public itemService: ItemService,
    protected translate: TranslateService) { }


  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.options = options;
    this.dataModal = options.data;
    this.closeDialogSubject = options.closeDialogSubject;
  }
  ngOnInit() {
    this.selectedIds = [];
    this.oldSelectedIds = [];
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.itemService.getItemsFillingIsAffected(this.gridSettings.state,
      this.preparePredicate(), this.dataModal.idPrice).subscribe(data => {
        this.gridSettings.gridData = { data: data.data, total: data.total };
        this.totalSelection = data.totalSelection;

        this.gridSettings.gridData.data.forEach(x => {
          if (x.IsAffected) {
            pushIfNotExist(this.selectedIds, x.Id);
          }
        });
        this.prepareSelectAllStatusAndUpdateOldSelectedIds();
      });
  }
  private preparePredicate(): PredicateFormat {
    const predicate = this.predicateQuickSearch ? this.predicateQuickSearch : new PredicateFormat();
    predicate.Relation = new Array<Relation>();
    predicate.Relation.push.apply(predicate.Relation, [new Relation(SharedConstant.TIERS_NAVIGATION)]);
    predicate.Relation.push.apply(predicate.Relation, [new Relation(SharedConstant.ITEM_TIERS)]);
    return predicate;
  }

  public dataStateChange(state: any): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  pictureItemSrc(dataItem) {
    if (dataItem.PictureFileInfo) {
      return SharedConstant.PICTURE_BASE.concat(dataItem.PictureFileInfo.Data);
    }
  }

  public onSelectedKeysChange(selectedIds: number[]) {
    if (!this.isFromSelectAll) {
      if (selectedIds.length > this.oldSelectedIds.length) { // newSelection
        this.affectNewElement();
      } else if (selectedIds.length < this.oldSelectedIds.length) { // Deselection
        this.unaffectElement();
      }
    } else {
      this.isFromSelectAll = false;
    }
  }
  prepareSelectAllStatusAndUpdateOldSelectedIds() {
    const selectionLength = this.totalSelection;
    if (selectionLength === NumberConstant.ZERO) {
      this.selectAllState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
    } else if (selectionLength > NumberConstant.ZERO && selectionLength < this.gridSettings.gridData.total) {
      this.selectAllState = SharedConstant.INDETERMINATE as SelectAllCheckboxState;
    } else {
      this.selectAllState = SharedConstant.CHECKED as SelectAllCheckboxState;
    }
    this.oldSelectedIds = copyOfListByValue(this.selectedIds);
  }
  affectNewElement() {
    this.pricesService.affectItemToPrice(this.dataModal.idPrice, this.selectedIds[this.selectedIds.length - 1]).subscribe(() => {
      this.totalSelection++;
      this.prepareSelectAllStatusAndUpdateOldSelectedIds();
    }, () => {
      this.ngOnInit();
    }, () => {
      this.ngOnInit();
    });
  }
  unaffectElement() {
    let deselectedItem = this.oldSelectedIds.find(x => !this.selectedIds.find(y => y === x));
    this.pricesService.unaffectItemFromPrice(this.dataModal.idPrice, deselectedItem).subscribe(() => {
      this.totalSelection--;
      this.prepareSelectAllStatusAndUpdateOldSelectedIds();
    }, () => {
      this.ngOnInit();
    }, () => {
      this.ngOnInit();
    });
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    this.isFromSelectAll = true;
    if (checkedState === SharedConstant.CHECKED as SelectAllCheckboxState) {
      this.pricesService.affectAllItemsToPrice(this.predicateQuickSearch, this.dataModal.idPrice)
        .subscribe(() => {
          this.totalSelection = this.gridSettings.gridData.total;
          this.prepareSelectAllStatusAndUpdateOldSelectedIds();
        }, () => {
          this.ngOnInit();
        }, () => {
          this.ngOnInit();
        });
    } else {
      this.pricesService.unaffectAllItemsFromPrice(this.predicateQuickSearch, this.dataModal.idPrice)
        .subscribe(() => {
          this.totalSelection = NumberConstant.ZERO;
          this.prepareSelectAllStatusAndUpdateOldSelectedIds();
        }, () => {
          this.ngOnInit();
        }, () => {
          this.ngOnInit();
        });
    }
  }
  public filter() {
    if (this.searchInput && this.searchInput.length > 0) {
      if (!this.predicateQuickSearch) {
        this.predicateQuickSearch = new PredicateFormat();
      }
      if (!this.predicateQuickSearch.Filter) {
        this.predicateQuickSearch.Filter = new Array<Filter>();
      }
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'ItemName');
      if (index >= 0) {
        this.predicateQuickSearch.Filter[index].value = this.searchInput;
      } else {
        this.predicateQuickSearch.Filter.push(new Filter('ItemName', Operation.contains, this.searchInput, false, true));
      }
    }
    else {
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'ItemName');
      if (index >= 0) {
        this.predicateQuickSearch.Filter.splice(index, 1);
      }
    }
    this.gridSettings.state.skip = 0;
    this.initGridDataSource();
  }
  public selectedSupplier($event) {
    if ($event && $event.selectedValue) {
      if (!this.predicateQuickSearch) {
        this.predicateQuickSearch = new PredicateFormat();
      }
      if (!this.predicateQuickSearch.Filter) {
        this.predicateQuickSearch.Filter = new Array<Filter>();
      }
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'IdTier');
      if (index >= 0) {
        this.predicateQuickSearch.Filter[index].value = $event.selectedValue;
      } else {
        this.predicateQuickSearch.Filter.push(new Filter('IdTier', Operation.eq, $event.selectedValue, false, true));
      }
    } else {
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'IdTier');
      if (index >= 0) {
        this.predicateQuickSearch.Filter.splice(index, 1);
      }
    }
  }

  public selectedProduct($event) {
    if ($event) {
      if (!this.predicateQuickSearch) {
        this.predicateQuickSearch = new PredicateFormat();
      }
      if (!this.predicateQuickSearch.Filter) {
        this.predicateQuickSearch.Filter = new Array<Filter>();
      }
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'IdProductItem');
      if (index >= 0) {
        this.predicateQuickSearch.Filter[index].value = $event;
      }else{
        this.predicateQuickSearch.Filter.push(new Filter('IdProductItem', Operation.eq, $event, false, true));
      }
    } else {
      var index = this.predicateQuickSearch.Filter.findIndex(x => x.prop == 'IdProductItem');
      if (index >= 0) {
        this.predicateQuickSearch.Filter.splice(index, 1);
      }
    }
  }
  public Search() {
    this.gridSettings.state.skip = 0;
    this.initGridDataSource();
  }

}

