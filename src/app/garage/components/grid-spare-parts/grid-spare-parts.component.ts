import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalDialogInstanceService } from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { KeyboardConst } from '../../../constant/keyboard/keyboard.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { OperationKitItem } from '../../../models/garage/operation-kit-item.model';
import { Item } from '../../../models/inventory/item.model';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { ItemDropdownComponent } from '../../../shared/components/item-dropdown/item-dropdown.component';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageService } from '../../../shared/services/language/language.service';
import { strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { OperationKitService } from '../../services/operation-kit/operation-kit.service';
import { OperationService } from '../../services/operation/operation.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { Company } from '../../../models/administration/company.model';

@Component({
  selector: 'app-grid-spare-parts',
  templateUrl: './grid-spare-parts.component.html',
  styleUrls: ['./grid-spare-parts.component.scss']
})
export class GridSparePartsComponent implements OnInit, OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @ViewChild('grid') grid: GridComponent;
  @Input() listItems: any[];
  @Input() isModal;
  @Input() idOperationKit: number;
  @Input() hasUpdatePermission: boolean;
  itemForGarageSubscription: Subscription;
  @Output() sendFromItem: EventEmitter<any> = new EventEmitter<any>();


  // FormGroup Properties
  formGroup: FormGroup;

  // Update Properties
  private editedRowIndex: number;
  isEditingMode = false;


  hideSearch = false;
  isNew = false;
  isForGarage = true;

  itemKit: OperationKitItem;
  filterValue = '';

  /*
  * Spare parts Grid columns
  */
  columnsConfig: ColumnSettings[] = [
    {
      field: GarageConstant.DESCRIPTION,
      title: GarageConstant.PIECE_TITLE,
      filterable: true,
      tooltip: GarageConstant.PIECE_TITLE
    },
    {
      field: GarageConstant.QUANTITY,
      title: GarageConstant.QUANTITY_TITLE,
      filterable: true,
      tooltip: GarageConstant.QUANTITY_TITLE
    },
    {
      field: GarageConstant.UNIT_HT_PRICE,
      title: GarageConstant.HT_UNIT_PRICE_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_UNIT_PRICE_TITLE
    },
    {
      field: GarageConstant.HTPRICE,
      title: GarageConstant.HT_AMOUNT_TITLE,
      filterable: true,
      tooltip: GarageConstant.HT_AMOUNT_TITLE
    }
  ];

  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TEN,
    filter: {
      filters: [],
      logic: 'and'
    },
    group: []
  };

  gridSettings: GridSettings = { state: this.gridState, columnsConfig: this.columnsConfig };

  userCurrency: Currency;
  userCurrencyPrecision: any;
  userCurrencyCode: any;
  language: string;

  constructor(private fb: FormBuilder, public viewRef: ViewContainerRef, private operationService: OperationService,
    private validationService: ValidationService, private swalWarrings: SwalWarring, private operationKitService: OperationKitService
      , private searchItemService: SearchItemService, private localStorageService : LocalStorageService, private companyService: CompanyService,
      private growlService: GrowlService, private translateService: TranslateService,
      private modalService: ModalDialogInstanceService) {
    this.itemForGarageSubscription = this.searchItemService.itemForGarageSubject.subscribe((itemForGarage) => {
      this.itemSelectedForGarageEvent(itemForGarage);
    });
    this.language = this.localStorageService.getLanguage();

  }
  ngOnInit() {
    this.companyService.getCurrentCompany().subscribe((data: Company) => {
      this.userCurrency = data.IdCurrencyNavigation;
    });
      if (this.isModal) {
        this.getListItemsByOperationKit();
      }
      this.processGridData();
  }
  /**
   * Create spare parts form group
   */
  createFormGroup(dataItem?) {
    this.formGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdItem: [dataItem ? dataItem.IdItem : undefined, Validators.required],
      IdOperationKit: [dataItem ? dataItem.IdOperationKit : this.idOperationKit],
      Quantity: [dataItem ? dataItem.Quantity : undefined, Validators.compose([
        Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'), strictSup(0)
      ])],
      UnitHtsalePrice: [{
        value: dataItem ? dataItem.UnitHtsalePrice : '', disabled: true
      }],
      HtPrice: [{
        value: dataItem ? dataItem.HtPrice : '', disabled: true
      }]
    });
  }

  addHandler({ sender }) {
    if (!this.isEditingMode) {
      this.createFormGroup();
      this.grid.addRow(this.formGroup);
      this.isEditingMode = true;
      this.isNew = true;
      this.sendFromItem.emit(true);
    }
  }

  editHandler({ dataItem, rowIndex }) {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.itemKit = dataItem;
      this.createFormGroup(dataItem);
      this.grid.editRow(rowIndex, this.formGroup);
      this.isNew = false;
    }
  }

  saveHandler({ dataItem, formGroup, isNew }) {
    if (this.formGroup.valid) {
      this.itemKit = Object.assign({}, this.itemKit, formGroup.getRawValue());
      this.operationService.getSparePartsPriceForOneItem(this.itemKit.IdItem, this.itemKit.Quantity).subscribe((data) => {
        this.itemKit.HtPrice = data.Htprice;
        const index = this.listItems.findIndex(x => x.IdItem === this.itemKit.IdItem);
        if (isNew) {
          if (index >= 0) {
            let duplicateItemMessage = this.translateService.instant(GarageConstant.DUPLICATED_ITEM);
            duplicateItemMessage = duplicateItemMessage.replace('{Item}', this.itemKit.IdItemNavigation.Code);
            this.growlService.ErrorNotification(duplicateItemMessage);
          } else {
            this.listItems.unshift(this.itemKit);
          }
        } else {
          const indexOldItem = this.listItems.findIndex(x => x.IdItem === dataItem.IdItem);
          if (index >= 0 && (index === indexOldItem)) {
            this.listItems[index] = this.itemKit;
          }
        }
        this.closeEditor();
        this.processGridData();
        this.isNew = isNew;
      });
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  cancelHandler({ isNew }) {
    this.closeEditor();
    this.isNew = isNew;
  }

  public removeHandler({ dataItem }) {
    if (!this.isEditingMode) {
      this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
        if (result.value) {
          const index = this.listItems.findIndex((x) => x.IdItem === dataItem.IdItem);
          this.listItems.splice(index, NumberConstant.ONE);
          this.gridSettings.state.skip = (this.listItems.length % this.gridSettings.state.take ) !== 0 ?
          this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
       this.gridSettings.state.skip = (this.gridSettings.state.skip < 0 ) ? 0 : this.gridSettings.state.skip;
          this.processGridData();
        }
      });
    }
    this.sendFromItem.emit(true);
  }

  closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
    this.sendFromItem.emit(true);
  }

  itemSelectedForGarageEvent($event) {
    if ($event) {
      const sendedItem = $event;
      if (!sendedItem.Quantity) {
        this.growlService.ErrorNotification(this.translateService.instant(GarageConstant.CHECK_QUANTITY_GREATER_THAN_ZERO));
      }
      this.itemKit = new OperationKitItem();
      this.itemKit.IdItemNavigation = new Item();
      this.itemKit.IdItemNavigation.Description = sendedItem.Description;
      this.itemKit.IdItemNavigation.Code = sendedItem.Code;
      this.itemKit.Id = 0;
      this.itemKit.IdItem = sendedItem.IdItem;
      this.itemKit.IdOperationKit = this.idOperationKit;
      this.itemKit.UnitHtsalePrice = sendedItem.UnitHtsalePrice;
      this.itemKit.Quantity = sendedItem.Quantity;
      this.createFormGroup(this.itemKit);
      const dataItem = {};
      dataItem['IdItem'] = sendedItem.IdItem;
      this.isNew = true;
      this.saveHandler({ dataItem: dataItem, formGroup: this.formGroup, isNew: this.isNew });
    }
  }

  itemSelected($event) {
    if ($event && !$event.openModel) {
      const selectedItem = $event.itemDataSource.filter(x => x.Id === this.formGroup.controls['IdItem'].value);
      if (selectedItem && selectedItem.length > 0) {
        this.itemKit = new OperationKitItem();
        this.itemKit.IdItemNavigation = selectedItem[0];
        this.formGroup.controls.UnitHtsalePrice.setValue(this.itemKit.IdItemNavigation.UnitHtsalePrice);
        this.formGroup.controls.Quantity.setValue(this.formGroup.controls.Quantity.value ?
          this.formGroup.controls.Quantity.value : NumberConstant.ONE);
      }
    } else if (!this.formGroup.controls['IdItem'].value) {
      this.itemKit = undefined;
      this.formGroup.controls.UnitHtsalePrice.setValue(undefined);
      this.formGroup.controls.Quantity.setValue(undefined);
      this.formGroup.controls.HtPrice.setValue(undefined);
    }
  }

  getListItemsByOperationKit() {
    this.operationKitService.getOperationKitByCondiction(this.idOperationKit).subscribe((data) => {
      if (data.OperationKitItem) {
        this.listItems = [];
        data.OperationKitItem.forEach((x: OperationKitItem) => {
          this.listItems.unshift((x));
          this.processGridData();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.itemForGarageSubscription) {
      this.itemForGarageSubscription.unsubscribe();
    }
  }
  processGridData() {
    if (this.listItems !== undefined) {
      const items = Object.assign([], this.listItems);
      this.gridSettings.gridData = process(items, this.gridSettings.state);
    }
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.processGridData();
  }

  getListItems(): any[] {
    return this.listItems;
  }

}
