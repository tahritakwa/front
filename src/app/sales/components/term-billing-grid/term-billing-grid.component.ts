import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {BlforTierViewModel} from '../../../models/shared/bl-for-tiers.model';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {DataStateChangeEvent, GridComponent, PagerSettings} from '@progress/kendo-angular-grid';
import {ReportTemplate} from '../../../models/reporting/report-template.model';
import {SelectAllCheckboxState, RowArgs, PageChangeEvent} from '@progress/kendo-angular-grid';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ListDocumentService} from '../../../shared/services/document/list-document.service';
import {DocumentService} from '../../services/document/document.service';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {FileService} from '../../../shared/services/file/file-service.service';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {IntlService} from '@progress/kendo-angular-intl';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {KeyboardConst} from '../../../constant/keyboard/keyboard.constant';
import {isNotNullOrUndefinedAndNotEmptyValue} from '../../../stark-permissions/utils/utils';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { TreasuryConstant } from '../../../constant/treasury/treasury.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';

export const createLineFormGroup = dataItem => new FormGroup({
  'IdTiers': new FormControl(dataItem.IdTiers),
  'TierName': new FormControl(dataItem.TierName),
  'CodeTier': new FormControl(dataItem.CodeTier),
  'BlNumber': new FormControl(dataItem.BlNumber),
  'HtAmount': new FormControl(dataItem.HtAmount),
  'IdSettlementMode': new FormControl(dataItem.IdSettlementMode),
  'SettlementModeCode': new FormControl(dataItem.SettlementModeCode),
  'InAssNumber': new FormControl(dataItem.InAssNumber),
  'formatOptions': new FormControl(dataItem.formatOptions),
});

@Component({
  selector: 'app-term-billing-grid',
  templateUrl: './term-billing-grid.component.html',
  styleUrls: ['./term-billing-grid.component.scss']
})
export class TermBillingGridComponent implements OnInit {
  @ViewChild(GridComponent) private grid: GridComponent;
  @Input() forBl: boolean;
  @Output() isInvoicesGenerated = new EventEmitter<boolean>();
  allDatas: BlforTierViewModel[] = new Array<BlforTierViewModel>();
  filteredData: BlforTierViewModel[] = new Array<BlforTierViewModel>();
  public gridSettings: GridSettings;
  @Input() month: Date = new Date();
  @Input() idTierCategory: number;
  public mySelection: number[] = [];
  public GeneratedInvoiceId: number[] = [];
  public ProductID;
  dataReportTemplate: Array<ReportTemplate> = new Array<ReportTemplate>();
  printReportType: Array<any> = new Array<any>();
  public searchValue: string;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;


  public clientToSearch = '';
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  /**
   * Form Group
   */
  formGroup: FormGroup;
  gridFormGroup: FormGroup;
  isEditingMode: boolean = false;
  public selectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };
  keyAction;
  private editedRowIndex: number;
  public SelectedLines: Array<any> = new Array<any>();
  public selectedSettlementCode: string;
  hasGeneratePermission = false;

  constructor(public documentListService: ListDocumentService, public documentService: DocumentService,
              private fb: FormBuilder, private validationService: ValidationService, protected fileServiceService: FileService,
              private swalWarrings: SwalWarring,
              protected documentPrintService: DocumentService, public intl: IntlService, private authService: AuthService) {
    this.setSelectableSettings();
    this.keyAction = (event) => {
      const keyName = event.key;
      /*escape keyboard click */
      if (keyName === KeyboardConst.ESCAPE && this.isEditingMode) {
        this.closeEditor();
      }
      /*Enter keyboard click */
      if (keyName === KeyboardConst.ENTER && this.isEditingMode) {
        this.saveCurrent();
      }
    };
  }

  public cancelHandler(): void {
    this.closeEditor();
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
    this.editedRowIndex = undefined;
    this.gridFormGroup = undefined;
    this.selectedSettlementCode = undefined;
    this.isEditingMode = true;

  }

  public sort: SortDescriptor[] = [{
    field: TreasuryConstant.NAME,
    dir: undefined
  }];


  public saveCurrent(): void {
    let elementInGrid;
    if (this.gridSettings.gridData.data) {
      this.gridSettings.gridData.data.find(x => x.IdTiers === this.gridFormGroup.controls['IdTiers'].value).IdSettlementMode = this.gridFormGroup.controls['IdSettlementMode'].value;
      this.gridSettings.gridData.data.find(x => x.IdTiers === this.gridFormGroup.controls['IdTiers'].value).SettlementModeCode = this.selectedSettlementCode;
      this.closeEditor();
    }
  }

  public lineClickHandler({isEdited, dataItem, rowIndex}, SetedValue?: boolean, data?: any): void {
    if (isEdited || this.gridFormGroup) {
      return;
    }
    this.isEditingMode = true;
    this.gridFormGroup = createLineFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.grid.editRow(rowIndex, this.gridFormGroup);
  }

  settlementModeCodeValueChange(event) {
    this.selectedSettlementCode = event;
  }

  get documentDate(): FormControl {
    return this.formGroup.get('DocumentDate') as FormControl;
  }

  showaction(event?) {
    if (event.data === undefined) {
      this.clientToSearch = '';
      this.filteredData = this.allDatas;
      this.gridSettings.gridData.data =
        this.allDatas.slice(this.gridSettings.state.skip, this.gridSettings.state.skip + this.gridSettings.state.take);
    }

  }

  pressKeybordEnterToSearch(event) {
    if (event.charCode === 13) {
      this.searchbillinglist(this.month , this.idTierCategory);
    }
  }

  createAddForm(): void {
    this.formGroup = this.fb.group({
      DocumentDate: [new Date(), Validators.required]
    });
  }

  public GenerateTermInvoice(data) {
    this.GeneratedInvoiceId = data;
    this.isInvoicesGenerated.emit(this.GeneratedInvoiceId.length > 0);
    this.clientToSearch = '';
    this.selectAllState = 'unchecked';
  }

  PrintTermInvoice($event) {
    if (this.formGroup.valid) {
      const dataToSend = this.getReportName($event);
      this.openReport(dataToSend);
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      mode: 'multiple'
    };
  }

  public mySelectionKey(context: RowArgs): number {
    return context.dataItem.IdTiers;
  }

  ngOnInit() {
    this.hasGeneratePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_TERM_BILLING);
    if (this.forBl) {
      this.gridSettings = this.documentListService.gridSettingsBillingTermscolumnsConfig;
    } else {
      this.gridSettings = this.documentListService.gridSettingsBillingTermsForIacolumnsConfig;
    }
    this.loadItems();
    this.createAddForm();

    this.printReportType = [
      {printType: 'ORIGINALE', TemplateCode: 'ORIGINALE'},
      {printType: 'COPIE', TemplateCode: 'COPIE'},
      {printType: 'DUPLICATA', TemplateCode: 'DUPLICATA'},
    ];

    this.clientToSearch = '';
  }

  public searchbillinglist(month , idTierCategory) {
    this.month = month;
    this.idTierCategory = idTierCategory ;
    if (this.isInvoicesGenerated) {
      this.swalWarrings.CreateSwal(SharedConstant.TEXT_BUTTON_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION,
        SharedConstant.TITLE_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION,
        SharedConstant.TEXT_BUTTON_SWAL_WARNING_VALIDATE_REFRESH_TERMBILLING_GENERATION).then((result) => {
        if (result.value) {
          this.loadItems();
          this.mySelection = [];
        }
      });
    } else {
      this.loadItems();
      this.mySelection = [];
    }
    this.clientToSearch = '';
  }


  public pageChange({skip, take}: PageChangeEvent): void {
    this.gridSettings.state.skip = skip;
    this.gridSettings.state.take = take;
    this.gridSettings.gridData.data =
      this.filteredData.slice(this.gridSettings.state.skip, this.gridSettings.state.skip + this.gridSettings.state.take);
  }

  private loadItems(): void {
    if (this.forBl) {
      this.documentService.getBlsForTermBilling(this.month , this.idTierCategory).subscribe(x => {
        this.setData(x);
      });
    } else {
      this.documentService.getInvoiceAssetsForTermBilling(this.month , this.idTierCategory).subscribe(x => {
        this.setData(x);
      });
    }
  }

  private setData(x) {
    this.allDatas = x.listData;
    this.filteredData = x.listData;
    this.gridSettings.gridData = {
      data: x.listData.slice(0, this.gridSettings.state.take),
      total: x.total
    };
    this.mySelection = [];
    this.isInvoicesGenerated.emit(false);
  }


  public getPrintType(printType) {
    if (printType === 'ORIGINALE') {
      return 0;
    } else if (printType === 'COPIE') {
      return 1;
    } else if (printType === 'DUPLICATA') {
      return 2;
    } else {
      return -1;
    }
  }

  // get report after selecting report button
  public getReportName($event) {
    let reportName: string;
    let printType;
    if ($event && $event.printType) {
      printType = this.getPrintType($event.printType);
    } else {
      printType = -1;
    }

    if (this.forBl) {
      reportName = 'report_invoice_multi';
    } else {
      reportName = 'report_invoiceasset_multi';
    }

    return {
      'listIds': this.GeneratedInvoiceId,
      'printType': printType,
      'isFromBl': this.forBl ? 1 : 0,
      'reportName': reportName
    };
  }

  // open report modal
  public openReport(dataToSend) {
    dataToSend = JSON.parse(JSON.stringify(dataToSend));
    this.multiPrintDownloadedReport(dataToSend);

  }

  /// Multi Print Invoice Directly
  public multiPrintDownloadedReport(dataItem): void {
    this.documentPrintService.multiPrintReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  public refreshData() {
    this.swalWarrings.CreateSwal(SharedConstant.TEXT_BUTTON_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION,
      SharedConstant.TITLE_SWAL_WARNING_REFRESH_TERMBILLING_GENERATION,
      SharedConstant.TEXT_BUTTON_SWAL_WARNING_VALIDATE_REFRESH_TERMBILLING_GENERATION).then((result) => {
      if (result.value) {
        this.loadItems();
      }
    });


  }

  onSelectedKeysChange($event) {
    let len = this.mySelection.length;
    this.SelectedLines = [];
    this.mySelection.forEach(element => {
      const idSettlementMode = this.gridSettings.gridData.data.find(x => x.IdTiers === element).IdSettlementMode;
      const dataSend = {
        'IdTier': Number(element),
        'IdSettlementMode': idSettlementMode != null ?  Number(idSettlementMode) : NumberConstant.ZERO,
      };
      this.SelectedLines.push(dataSend);
    });
    let lenListInGrid = this.allDatas.map((item) => item.IdTiers).length;
    if (len === 0) {
      this.selectAllState = 'unchecked';
    } else if (len > 0 && len < lenListInGrid) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = 'checked';
    }
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState) {
    if (checkedState === 'checked') {
      if (this.filteredData) {
        Array.prototype.push.apply(this.mySelection, this.filteredData.map((item) => item.IdTiers));
        this.mySelection = this.mySelection.filter(
          (thing, i, arr) => arr.findIndex(t => t === thing) === i
        );
      }
      this.selectAllState = 'checked';
    } else {
      let listToUncheck = this.filteredData.map((item) => item.IdTiers);
      if (listToUncheck && listToUncheck.length > 0) {
        listToUncheck.forEach(y => this.mySelection.splice(this.mySelection.indexOf(y), 1));
      }
      this.selectAllState = 'unchecked';
    }
  }

  idSettlementModeValueChange($event) {
    var index = this.mySelection.indexOf(this.gridFormGroup.controls['IdTiers'].value);
    if (index >= 0) {
      this.SelectedLines[index].IdSettlementMode = $event;
    }
  }

  public search() {
      this.filteredData = this.allDatas.filter(p => (p.CodeTier + p.TierName).toUpperCase().includes(this.clientToSearch.toUpperCase()));
      this.gridSettings.gridData.data =
        this.filteredData.slice(0, this.gridSettings.state.take);
   }

   sortChange(sort){
     this.sort = sort;
     let data = new Array<BlforTierViewModel>();
     this.allDatas.forEach(elt => data.push(elt));

     if (this.sort[NumberConstant.ZERO] && this.sort[NumberConstant.ZERO].dir === TreasuryConstant.ASC || this.sort[NumberConstant.ZERO].dir === TreasuryConstant.DESC){
       if(this.sort[NumberConstant.ZERO].field === DocumentConstant.TIER_NAME){
        this.gridSettings.gridData.data = data.sort((a,b) => a.TierName > b.TierName ? NumberConstant.ONE :-NumberConstant.ONE);
       }
       if(this.sort[NumberConstant.ZERO].field === DocumentConstant.HT_AMOUNT){
        this.gridSettings.gridData.data = data.sort((a,b) => a.HtAmount > b.HtAmount ? NumberConstant.ONE : -NumberConstant.ONE);
       }
       if(this.sort[NumberConstant.ZERO].field === DocumentConstant.NUMBER_OF_BL){
        this.gridSettings.gridData.data = data.sort((a,b) => a.BlNumber > b.BlNumber ? NumberConstant.ONE : -NumberConstant.ONE);
       }
       if(this.sort[NumberConstant.ZERO].dir === TreasuryConstant.DESC){
        this.gridSettings.gridData.data = this.gridSettings.gridData.data.reverse();
       }
     }
     else {
      this.gridSettings.gridData.data = this.allDatas;
     }
   }
}
