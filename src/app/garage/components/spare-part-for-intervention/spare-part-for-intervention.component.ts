import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
  Output, SimpleChanges, ViewChild, ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { GridComponent, PagerSettings } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { CompanyService } from '../../../administration/services/company/company.service';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Currency } from '../../../models/administration/currency.model';
import { InterventionOrderStateEnumerator } from '../../../models/enumerators/intervention-order-state.enum';
import { InterventionItem } from '../../../models/garage/intervention-item.model';
import { RepairOrderItem } from '../../../models/garage/repair-order-item.model';
import { Item } from '../../../models/inventory/item.model';
import { SearchItemService } from '../../../sales/services/search-item/search-item.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { FileService } from '../../../shared/services/file/file-service.service';
import { strictSup, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { InterventionService } from '../../services/intervention/intervention.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

@Component({
  selector: 'app-spare-part-for-intervention',
  templateUrl: './spare-part-for-intervention.component.html',
  styleUrls: ['./spare-part-for-intervention.component.scss']
})
export class SparePartForInterventionComponent implements OnInit, OnChanges, OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  @ViewChild('grid') grid: GridComponent;
  @ViewChild(ComboBoxComponent) itemComponent: ComboBoxComponent;
  @Input() idIntervention: number;
  @Input() idRepairOrder: number;
  @Input() idWarehouse: number;
  @Input() idGarage: number;
  @Input() interventionItemList: any[];
  @Input() repairOrderItemList: any[];
  @Input() isUpdateMode: boolean;
  @Input() isForRepairOrder: boolean;
  @Input() isRepairOrderValid: boolean;
  @Input() intervention: any;
  @Input() hasUpdatePermission: boolean;
  @Input() companyCurrency: Currency;
  @Input() language: string;
  @Input() idCustomer: number;
  @Output() updateInterventionParts: EventEmitter<any> = new EventEmitter();
  @Output() sparePartsChanged: EventEmitter<any> = new EventEmitter();
  itemForGarageSubscription: Subscription;
  interventionStateEnumerator = InterventionOrderStateEnumerator;
  // FormGroup Properties
  formGroup: FormGroup;

  // Update Properties
  private editedRowIndex: number;
  isEditingMode = false;

  currentItem: any;

  hideSearch = false;
  isNew = false;

  isChanged = false;

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
      field: GarageConstant.HT_PRICE,
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

  constructor(private fb: FormBuilder, public viewRef: ViewContainerRef, private interventionService: InterventionService,
    private validationService: ValidationService, private swalWarrings: SwalWarring,
     private searchItemService: SearchItemService, private translateService: TranslateService, private companyService: CompanyService,
      private fileService: FileService, private localStorageService: LocalStorageService, private growlService: GrowlService) {
    this.itemForGarageSubscription = this.searchItemService.itemForGarageSubject.subscribe((itemForGarage) => {
      this.itemSelectedForGarageEvent(itemForGarage);
    });
  }

  ngOnInit() {
    this.processGridData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processGridData();
  }
  /**
   * Create spare parts form group
   */
  createFormGroup(dataItem?) {
    this.formGroup = this.fb.group({
      Id: [dataItem ? dataItem.Id : 0],
      IdItem: [dataItem ? dataItem.IdItem : undefined, Validators.required],
      IdIntervention: [dataItem ? dataItem.IdIntervention : this.idIntervention],
      IdRepairOrder: [dataItem ? dataItem.IdRepairOrder : this.idRepairOrder],
      Quantity: [dataItem ? dataItem.Quantity : undefined, Validators.compose([
        Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$'), strictSup(0)
      ])],
      UnitHtsalePrice: [{
        value: dataItem ? dataItem.UnitHtsalePrice : '', disabled: true
      }],
      Htprice: [{
        value: dataItem ? dataItem.Htprice : '', disabled: true
      }]
    });
  }

  addHandler({ sender }) {
    if (!this.isEditingMode) {
      this.createFormGroup();
      this.grid.addRow(this.formGroup);
      this.isEditingMode = true;
      this.isNew = true;
    }
  }

  editHandler({ dataItem, rowIndex }) {
    if (!this.isEditingMode && this.hasUpdatePermission) {
      this.isEditingMode = true;
      this.editedRowIndex = rowIndex;
      this.currentItem = dataItem;
      this.createFormGroup(this.currentItem);
      this.grid.editRow(rowIndex, this.formGroup);
      this.isNew = false;
    }
  }

  saveHandler({ dataItem, formGroup, isNew }) {
    if (this.formGroup.valid) {
      this.currentItem = Object.assign({}, this.currentItem, formGroup.getRawValue());
      this.interventionService.getSparePartsPriceForInterventionItem(this.idGarage,
        this.currentItem.IdItem, this.currentItem.Quantity).subscribe((data) => {
          this.currentItem.UnitHtsalePrice = data.UnitHtsalePrice;
          this.currentItem.Htprice = data.Htprice;
          this.currentItem.RemainingQuantity = data.RemainingQuantity;
          this.isChanged = true;
          this.sparePartsChanged.emit(this.isChanged);
          let index = -1;
          if (!this.isForRepairOrder) {
            index = this.interventionItemList.findIndex(x => x.IdItem === this.currentItem.IdItem);
          } else {
            index = this.repairOrderItemList.findIndex(x => x.IdItem === this.currentItem.IdItem);
          }
          if (isNew) {
            if (index >= 0) {
              let duplicateItemMessage = this.translateService.instant(GarageConstant.DUPLICATED_ITEM);
              duplicateItemMessage = duplicateItemMessage.replace('{Item}', this.currentItem.IdItemNavigation.Code);
              this.growlService.ErrorNotification(duplicateItemMessage);
            } else {
              if (!this.isForRepairOrder) {
                this.interventionItemList.unshift(this.currentItem);
              } else {
                this.repairOrderItemList.unshift(this.currentItem);
              }
            }
          } else {
            let indexOldItem = -1;
            if (!this.isForRepairOrder) {
              indexOldItem = this.interventionItemList.findIndex(x => x.IdItem === dataItem.IdItem);
              if (index >= 0 && (index === indexOldItem)) {
                this.interventionItemList[index] = this.currentItem;
              }
            } else {
              indexOldItem = this.repairOrderItemList.findIndex(x => x.IdItem === dataItem.IdItem);
              if (index >= 0 && (index === indexOldItem)) {
                this.repairOrderItemList[index] = this.currentItem;
              }
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
    this.isChanged = true;
    this.sparePartsChanged.emit(this.isChanged);
    if (!this.isEditingMode) {
      this.swalWarrings.CreateSwal().then((result: { value: any; }) => {
        if (result.value) {
          if (!this.isForRepairOrder) {
            const index = this.interventionItemList.findIndex((x) => x.IdItem === dataItem.IdItem);
            this.interventionItemList.splice(index, NumberConstant.ONE);
            this.gridSettings.state.skip = (this.interventionItemList.length % this.gridSettings.state.take) !== 0 ?
              this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
          } else {
            const index = this.repairOrderItemList.findIndex((x) => x.IdItem === dataItem.IdItem);
            this.repairOrderItemList.splice(index, NumberConstant.ONE);
            this.gridSettings.state.skip = (this.repairOrderItemList.length % this.gridSettings.state.take) !== 0 ?
              this.gridSettings.state.skip : this.gridSettings.state.skip - this.gridSettings.state.take;
          }
          this.gridSettings.state.skip = (this.gridSettings.state.skip < 0) ? 0 : this.gridSettings.state.skip;
          this.processGridData();
        }
      });
    }
  }

  closeEditor() {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
    this.isEditingMode = false;
  }

  // show print report
  showPrintButton(): boolean {
    if (this.intervention && this.intervention.Status === this.interventionStateEnumerator.Open &&
      this.interventionItemList.find(item => item.RemainingQuantity < item.Quantity)) {
      return true;
    }
    return false;
  }

  itemSelected($event) {
    if ($event && !$event.openModel) {
      const selectedItem = $event.itemDataSource.filter(x => x.Id === this.formGroup.controls['IdItem'].value);
      if (selectedItem && selectedItem.length > 0) {
        this.currentItem = {};
        this.currentItem.IdItemNavigation = selectedItem[0];
        this.formGroup.controls.UnitHtsalePrice.setValue(this.currentItem.IdItemNavigation.UnitHtsalePrice);
        this.formGroup.controls.Quantity.setValue(this.formGroup.controls.Quantity.value ?
          this.formGroup.controls.Quantity.value : NumberConstant.ONE);
      }
    } else if (!this.formGroup.controls['IdItem'].value) {
      this.currentItem = undefined;
      this.formGroup.controls.UnitHtsalePrice.setValue(undefined);
      this.formGroup.controls.Quantity.setValue(undefined);
      this.formGroup.controls.Htprice.setValue(undefined);
    }
  }

  itemSelectedForGarageEvent($event) {
    if ($event) {
      const sendedItem = $event;
      if (!sendedItem.Quantity) {
        this.growlService.ErrorNotification(this.translateService.instant(GarageConstant.CHECK_QUANTITY_GREATER_THAN_ZERO));
      }
      this.currentItem = new Object();
      this.currentItem.IdItemNavigation = new Item();
      this.currentItem.IdItemNavigation.Description = sendedItem.Description;
      this.currentItem.IdItemNavigation.Code = sendedItem.Code;
      this.currentItem.Id = 0;
      this.currentItem.IdItem = sendedItem.IdItem;
      this.currentItem.IdIntervention = this.idIntervention;
      this.currentItem.IdRepairOrder = this.idRepairOrder;
      this.currentItem.UnitHtsalePrice = sendedItem.UnitHtsalePrice;
      this.currentItem.Quantity = sendedItem.Quantity;
      this.createFormGroup(this.currentItem);
      const dataItem = {};
      dataItem['IdItem'] = sendedItem.IdItem;
      this.isNew = true;
      this.saveHandler({ dataItem: dataItem, formGroup: this.formGroup, isNew: this.isNew });
    }
  }

  processGridData() {
    if (!this.isForRepairOrder) {
      if (this.interventionItemList !== undefined) {
        const interventionItems = Object.assign([], this.interventionItemList);
        this.gridSettings.gridData = process(interventionItems, this.gridSettings.state);
      }
    } else {
      if (this.repairOrderItemList !== undefined) {
        const repairOrderItems = Object.assign([], this.repairOrderItemList);
        this.gridSettings.gridData = process(repairOrderItems, this.gridSettings.state);
      }
    }
  }

  dataStateChange($event: State) {
    this.gridSettings.state = $event;
    this.processGridData();
  }

  onPrintReportClick(): void {
    if (this.isChanged) {
      this.swalWarrings.CreateSwal(GarageConstant.ITEMS_CHANGED_MESSAGE, GarageConstant.ITEMS_CHANGED_TITLE).then((result) => {
        if (result.value) {
          // update intervention
          this.updateInterventionParts.emit();
          this.isChanged = false;
          // do the print
          this.printReport();
        }
      });
    } else {
      // do the print
      this.printReport();
    }
  }

  printReport() {
    const documentName = this.translateService.instant(GarageConstant.MISSING_SPARE_PARTS);
    const params = {
      'idIntervention': this.idIntervention,
    };
    const dataToSend = {
      'reportName': 'MissingSpareParts',
      'documentName': documentName.concat('_').concat(this.intervention.Code),
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': '-1',
      'reportparameters': params
    };
    this.interventionService.downloadJasperReport(dataToSend).subscribe(
      res => {
        this.fileService.downLoadFile(res.objectData);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.itemForGarageSubscription) {
      this.itemForGarageSubscription.unsubscribe();
    }
  }

  getInterventionItem(): any[] {
    return this.interventionItemList;
  }

}
