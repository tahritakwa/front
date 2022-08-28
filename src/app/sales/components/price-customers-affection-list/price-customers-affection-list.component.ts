import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { PagerSettings, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { EnumValues } from 'enum-values';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { TiersConstants } from '../../../constant/purchase/tiers.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ActivitySectorsEnum } from '../../../models/shared/enum/activitySectors.enum';
import { TiersService } from '../../../purchase/services/tiers/tiers.service';
import { copyOfListByValue, pushIfNotExist } from '../../../shared/helpers/list.helper';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, Operator, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PricesService } from '../../services/prices/prices.service';
const ACTIVITY_SECTOR_REFERENCE = 'activitySectorReference';
@Component({
  selector: 'app-price-customers-affection-list',
  templateUrl: './price-customers-affection-list.component.html',
  styleUrls: ['./price-customers-affection-list.component.scss']
})
export class PriceCustomersAffectionListComponent implements OnInit {

  public activitySectors = [];
  public activitySectorsFiltred = [];
  public isFromSelectAll = false;
  public selectAllState: SelectAllCheckboxState = SharedConstant.UNCHECKED as SelectAllCheckboxState;
  public selectedIds: number[] = [];
  public oldSelectedIds: number[] = [];
  public totalSelection: number;
  public idTaxeGroup: number;
  public activitySector: string;
  predicateQuickSearch: PredicateFormat;
  myPredicates: PredicateFormat[] = [];
  tiersType = TiersConstants.CUSTOMER_TYPE;
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS_REDUCED;
  @ViewChild(ACTIVITY_SECTOR_REFERENCE) public activitySectorComboBox: ComboBoxComponent;
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
      field: TiersConstants.CODE_TIERS,
      title: TiersConstants.CODE,
      tooltip: TiersConstants.CODE,
      filterable: true,
      _width: 60
    },
    {
      field: TiersConstants.NAME,
      title: this.translate.instant(TiersConstants.CUSTOMER),
      tooltip: TiersConstants.CUSTOMER,
      filterable: true,
      _width: 240
    },
    {
      field: TiersConstants.ACTIVITY_SECTOR,
      title: this.translate.instant(TiersConstants.ACTIVITY_SECTOR_TITLE),
      tooltip: TiersConstants.ACTIVITY_SECTOR_TITLE,
      filterable: true,
      _width: 240
    },
    {
      field: TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_LABEL,
      title: this.translate.instant(TiersConstants.TAXEGROUP_TITLE),
      tooltip: TiersConstants.TAXEGROUP_TITLE,
      filterable: true,
      _width: 240
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
  constructor(public pricesService: PricesService, public tiersService: TiersService,
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
    this.initActivitySectors();
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.tiersService.getCustomersFillingIsAffectedToPricesWithSpecificFilter(this.gridSettings.state, this.getPredicate(),
      this.dataModal.idPrice).subscribe(data => {
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
  getPredicate(): PredicateFormat[] {
    this.myPredicates = [];
    const predicate = PredicateFormat.prepareIdTypeTiersPredicate(TiersConstants.CUSTOMER_TYPE);
    predicate.IsDefaultPredicate =  true;
    predicate.Operator =  Operator.and;
    if (this.activitySector) {
      predicate.Filter.push(new Filter(TiersConstants.ACTIVITY_SECTOR, Operation.eq, this.activitySector));
    }
    if (this.idTaxeGroup) {
      predicate.Filter.push(new Filter(TiersConstants.ID_TAXEGROUP_TIERS_NAVIGATION_ID, Operation.eq, this.idTaxeGroup));
    }
    this.myPredicates.push(predicate);
    if (this.predicateQuickSearch) {
      this.myPredicates.push(this.predicateQuickSearch);
    }
    if( this.dataModal && this.dataModal.idCurrency){
      predicate.Filter.push(new Filter(TiersConstants.ID_CURRENCY, Operation.eq, this.dataModal.idCurrency));
    }
    return this.myPredicates;
  }
  public receiveData(event: any) {
    this.predicateQuickSearch = event.predicate;
    this.gridSettings.state.skip = 0;
    this.initGridDataSource();
  }
  public dataStateChange(state: any): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  pictureTierSrc(dataItem) {
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
    this.pricesService.affectCustomerToPrice(this.dataModal.idPrice, this.selectedIds[this.selectedIds.length - 1]).subscribe(() => {
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
    this.pricesService.unaffectCustomerFromPrice(this.dataModal.idPrice, deselectedItem).subscribe(() => {
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
      this.pricesService.affectAllCustomersToPrice(this.predicateQuickSearch,
        this.dataModal.idPrice).subscribe(() => {
          this.totalSelection = this.gridSettings.gridData.total;
          this.prepareSelectAllStatusAndUpdateOldSelectedIds();
        }, () => {
          this.ngOnInit();
        }, () => {
          this.ngOnInit();
        });
    } else {
      this.pricesService.unaffectAllCustomersFromPrice(this.predicateQuickSearch,
        this.dataModal.idPrice).subscribe(() => {
          this.totalSelection = NumberConstant.ZERO;
          this.prepareSelectAllStatusAndUpdateOldSelectedIds();
        }, () => {
          this.ngOnInit();
        }, () => {
          this.ngOnInit();
        });
    }
  }
  private initActivitySectors() {
    const activitysSectors = EnumValues.getNames(ActivitySectorsEnum);
    this.activitySectors = activitysSectors.map((activitySectors: any) => {
      return activitySectors = {enumValue: activitySectors, enumText: this.translate.instant(activitySectors)};
    });
    this.activitySectorsFiltred = this.activitySectors;
  }
  /**
   * open the activty sectors combobox on focus event
   */
   openActivtySectorCombobox() {
    this.activitySectorComboBox.toggle(true);
  }
  public handleFiltreActivitySectors(value) {
    this.activitySectors = this.activitySectorsFiltred;
    this.activitySector = value;
  }
  selectedTaxeGroup(event) {
    this.idTaxeGroup = event;
  }
}
