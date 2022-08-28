import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { ProvisioningService } from '../../services/order-project/provisioning-service.service';
import { OrderProjectService } from '../../services/order-project/order-project.service';
import { CurrencyService } from '../../../administration/services/currency/currency.service';
import { FormGroup } from '@angular/forms';
import { GridComponent, SelectableSettings, PageChangeEvent, PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState, process } from '@progress/kendo-data-query';
import { EquivalentItem } from '../../../models/purchase/equivalent-iItem.model';
import { ProvisioningDetails } from '../../../models/purchase/provisioning-details.model';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { DetailsProductComponent } from '../../../shared/components/item/details-product/details-product.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { ReducedCurrency } from '../../../models/administration/reduced-currency.model';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';


@Component({
  selector: 'app-advenced-list-provisionnig',
  templateUrl: './advenced-list-provisionnig.component.html',
  styleUrls: ['./advenced-list-provisionnig.component.scss']
})
export class AdvencedListProvisionnigComponent implements OnInit {

  @Input() selectedValueMultiSelect;
  @Input() SalesHistory;
  @Input() ShowHistory;
  @Input() isMinMaxCheked;
  @Input() SatrtDatePurchase;
  @Input() EndDatePurchase;
  @Input() SatrtDateSales;
  @Input() EndDateSales;
  @Input() isFromDocument = false;

  @ViewChild(GridComponent) private grid: GridComponent;
  equivalentItems: EquivalentItem;
  public existingElementList: Array<any> = new Array<any>();
  orderObject: ProvisioningDetails;
  currency: number;
  public formGroup: FormGroup;
  public formGrid: FormGroup;
  isNew: boolean;
  private editedRowIndex: number;
  formatOptions: any;
  public idItem;
  public description;
  public selectableSettings: SelectableSettings;

  @Input() showGrid = true;
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public pagerSettings: PagerSettings = {
    buttonCount: 5, info: true, type: 'numeric', pageSizes: [10, 20, 30, 40, 50, 100], previousNext: true
  };
  public skip = 0;
  public pageSize = 10;
  salescurrency: any;
  public valueToFind ;
  constructor(public provisioningService: ProvisioningService,
    public OrderService: OrderProjectService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef, private modalService: ModalDialogInstanceService,
    public currencyService: CurrencyService, private companyService: CompanyService, private localStorageService : LocalStorageService) {
    this.setSelectableSettings();
  }

  public ngOnInit() {
      this.salescurrency = this.localStorageService.getCurrencyCode();
  }
  /** call service*/
  setGridLines() {
    if (this.idItem) {
      if(!this.valueToFind){
      this.equivalentItems =
        new EquivalentItem(this.idItem, this.skip, this.pageSize, this.existingElementList.map(({ IdItem }) => IdItem));
      }else{
        this.equivalentItems =
        new EquivalentItem(this.idItem, this.skip, this.pageSize, this.existingElementList.map(({ IdItem }) => IdItem), this.valueToFind);
      }

      this.provisioningService.GetEquivalentList(this.equivalentItems).subscribe(data => {
        this.OrderService.equivalentData = [];
        this.OrderService.counterEquivalent = 0;
        if (data.listObject.listData.length > 0) {
          let lines = Array.from(Object.keys(data.listObject.listData), k => data.listObject.listData[k]);
          lines.forEach(element => {
            if (element != null) {
              this.assignValues(element);
            }
          });
        }
        this.gridSettings.gridData = {
          data: this.OrderService.equivalentData,
          total: data.listObject.total
        };
      });
    }
  }
  public setGridEmpty() {
    this.OrderService.equivalentData = [];
    this.OrderService.counterEquivalent = 0;
    this.gridSettings.gridData = {
      data: this.OrderService.equivalentData,
      total: 0
    };
  }
  /**assing data to grid */
  assignValues(element) {
    this.orderObject = this.OrderService.assignValues(element, true);
    this.formGroup = this.OrderService.createFormGroup(this.orderObject);
    this.formatOptions = this.OrderService.formatOptions;
    this.isNew = true;
    this.OrderService.saveEquivalentItem(this.formGroup.value, this.isNew);
    this.closeEditor();
  }

  private closeEditor(): void {
    if (this.grid) {
      this.grid.closeRow(this.editedRowIndex);
      this.isNew = false;
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
  }
  /**Selecting row settings */
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };
  }
  /**Select row in equivalent list */
  selectRow($event) {
    $event.selectedRows.forEach(selected => {
      this.OrderService.importedData.push(selected.dataItem);
    });
    if ($event.deselectedRows.length > 0) {
      const index = this.OrderService.importedData.indexOf($event.deselectedRows[0].dataItem);
      this.OrderService.importedData.splice(index, 1);
    }
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.setGridLines();
  }
  onClickGoToDetails(id) {
    const TITLE = '';
    this.formModalDialogService.openDialog(TITLE, DetailsProductComponent,
      this.viewRef, this.close.bind(this),
      id, true, SharedConstant.MODAL_DIALOG_SIZE_L);
  }
  close() {
    this.modalService.closeAnyExistingModalDialog();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.gridSettings.gridData = process(this.OrderService.equivalentData, this.gridSettings.state);
  }
  public receiveData($event){
    if($event){
      this.valueToFind = $event;
    }else{
      this.valueToFind = undefined;
    }
    this.setGridLines();
  }
}
