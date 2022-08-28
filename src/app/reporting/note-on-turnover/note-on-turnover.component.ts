import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { DataSourceRequestState } from "@progress/kendo-data-query";
import { isNullOrUndefined } from "util";
import { GrowlService } from "../../../COM/Growl/growl.service";
import { ReportingConstant } from "../../constant/accounting/reporting.constant";
import { StockDocumentConstant } from "../../constant/inventory/stock-document.constant";
import { SharedConstant } from "../../constant/shared/shared.constant";
import { NumberConstant } from "../../constant/utility/number.constant";
import { StyleConstant } from "../../constant/utility/style.constant";
import { NoteOnTurnoverLineReport } from "../../models/reporting/note-on-turnover-line-report.model";
import { DocumentService } from "../../sales/services/document/document.service";
import { SwalWarring } from "../../shared/components/swal/swal-popup";
import { FileService } from "../../shared/services/file/file-service.service";
import { ColumnSettings } from "../../shared/utils/column-settings.interface";
import { GridSettings } from "../../shared/utils/grid-settings.interface";
import {process} from '@progress/kendo-data-query';
import { ReportingService } from "../services/reporting.service";
import { ValidationService } from "../../shared/services/validation/validation.service";
import { DataStateChangeEvent, PagerSettings } from "@progress/kendo-angular-grid";
import { AuthService } from "../../login/Authentification/services/auth.service";
import { PermissionConstant } from "../../Structure/permission-constant";
import { DocumentConstant } from "../../constant/sales/document.constant";
import { ImportDocumentConstants } from "../../constant/accounting/import-document.constant";
import { CompanyService } from "../../administration/services/company/company.service";
import {NumberFormatOptions} from '@progress/kendo-angular-intl';
import { ReducedCurrency } from "../../models/administration/reduced-currency.model";
import { LocalStorageService } from "../../login/Authentification/services/local-storage-service";
const MIN_DATE_FILTER = 1753;
@Component({
    selector: 'app-note-on-turnover',
    templateUrl: './note-on-turnover.component.html',
    styleUrls: ['./note-on-turnover.component.scss']
  })
  export class NoteOnTurnoverComponent implements OnInit {
    noteOnTurnoverForm: FormGroup;
    public isDetailsContentVisible = true;
    public fieldsetBorderStyle: string;
    public fieldsetBorderShowed = StyleConstant.BORDER_SOLID;
    public fieldsetBorderHidden = StyleConstant.BORDER_NONE;
    private oldStartDateValue: Date;
    public minEndDate: Date;
    public isValidDateStart = true;
    public isValidDateEnd = true;
    public canChangeServiceDate: boolean = true;
    private oldEndDateValue: Date;
    public maxStartDate: Date;
    public startDateToSend;
    public endDateToSend ;
    public totalData;
    public isGeneratedNoteOnTurnover: boolean;
    public view: NoteOnTurnoverLineReport[];
    hasPrintPermission = false;
    public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
    public idItem : any;
    purchasePrecision: number;
    public formatNumberOptions: NumberFormatOptions;
    public symbole : string;
    public totalLine : any;
    public gridState: DataSourceRequestState = {
      skip: NumberConstant.ZERO,
      take: NumberConstant.FIFTY,
  
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: []
      }
    };
    public columnsConfig: ColumnSettings[] = [
      {
        field: "CodeItem",
        title: DocumentConstant.CODE_TITLE,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "Designation",
        title: DocumentConstant.ITEM_DESIGNATION,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "CodeInvoiceSales",
        title: DocumentConstant.SALES_INVOICE,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "Quantity",
        title: DocumentConstant.QUANTITY_TITLE,
        filterable: true,
        _width: NumberConstant.FIFTY
      },
      {
        field: "Cost",
        title: DocumentConstant.COST_TITLE,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "SalePriceAfterDelivery",
        title: DocumentConstant.SALES_PRICE_AFTER_DELIVERY_TITLE,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "Margin",
        title: DocumentConstant.PROFIT_MARGIN,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      },
      {
        field: "GainInAmountHT",
        title: DocumentConstant.GAIN_IN_AMOUNT_HT,
        filterable: true,
        _width: NumberConstant.ONE_HUNDRED
      }
    ];
    public gridSettings: GridSettings = {
      state: this.gridState,
      columnsConfig: this.columnsConfig,
    };
    datePipe = new DatePipe('en-US');
    constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef, private growlService: GrowlService,public translate: TranslateService,
        private documentService : DocumentService, private fileServiceService: FileService, private swalWarrings: SwalWarring, private reportingService : ReportingService,
        public validationService: ValidationService, private authService: AuthService , public companyService:CompanyService, private localStorageService : LocalStorageService){
        this.fieldsetBorderStyle = this.fieldsetBorderShowed;
    }
    ngOnInit() {
      this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_NOTE_ON_TURNOVER);
        this.createAddForm();
        this.getSelectedCurrency();
    } 
    /**
   * create add form
   * */
  private createAddForm(): void {
    this.noteOnTurnoverForm = this.formBuilder.group({
      StartDocumentDate: [new Date(), Validators.required],
      EndDocumentDate: [new Date(), Validators.required],
      IdItem: ['']
    });
    const yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
    this.noteOnTurnoverForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].setValue(yesterday);
    this.noteOnTurnoverForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].setValue(new Date());
  }
  /*
   * compares if startDate < endDate
   */
  public dateInputsIsValid(): boolean {
    return new Date(this.noteOnTurnoverForm.controls['StartDocumentDate'].value) <= new Date(this.noteOnTurnoverForm.controls['EndDocumentDate'].value);
  }
    public showDetailsContent() {
        this.isDetailsContentVisible = true;
        this.fieldsetBorderStyle = this.fieldsetBorderShowed;
      }

      public hideDetailsContent() {
        this.isDetailsContentVisible = false;
        this.fieldsetBorderStyle = this.fieldsetBorderHidden;
      }
    
    /**
   * Change min value of service date
   * */
  public onChangeStartDate(value: Date): void {
    if (this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value;
      this.minEndDate = this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
      this.cdRef.detectChanges();
    }
  }

  public changeDate() {
    if (this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE) && this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value) {
      const dateStart = this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value;
      if (dateStart.getFullYear() < MIN_DATE_FILTER) {
        this.isValidDateStart = false;
        this.growlService.warningNotification(this.translate.instant('INVALID_START_DATE'));
      } else {
        this.isValidDateStart=true ;
        this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).setValue(new Date(Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())));
      }
    }

    if (this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE) && this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value) {
      const dateEnd = this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
      if (dateEnd.getFullYear() < MIN_DATE_FILTER) {
        this.isValidDateEnd = false;
        this.growlService.warningNotification(this.translate.instant('INVALID_END_DATE'));
      } else {
        this.isValidDateEnd= true;
        this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).setValue(new Date(Date.UTC(dateEnd.getFullYear(),
          dateEnd.getMonth(), dateEnd.getDate())));
      }
    }
  }

  onChangeEndDate(value: Date): void {
    this.canChangeServiceDate = true;
    if (this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value !== this.oldEndDateValue) {
      if (this.canChangeServiceDate) {
        this.oldEndDateValue = this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
        this.maxStartDate = this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value;
        this.cdRef.detectChanges();
      } else {
        this.growlService.ErrorNotification(this.translate.instant('CHECK_ASSIGNMENT_BEFORE_CHANGE_DATE'));
        this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).setValue(this.oldEndDateValue);
      }
    }
  }

  

  PrintJasperNoteOnTurnoverReport() {
    var pipeDate = new DatePipe("en-US");
      const params = {
        startdate: pipeDate.transform(this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value, "yyyy-MM-dd"),
        enddate: pipeDate.transform(this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value, "yyyy-MM-dd"),
        idItem: this.noteOnTurnoverForm.controls['IdItem'].value
      };
      const documentName = this.translate.instant(ReportingConstant.NOTE_ON_TURNOVER)
        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.noteOnTurnoverForm.get(StockDocumentConstant.START_DOCUMENT_DATE).value), 'dd/MM/yyyy'))
        .concat(SharedConstant.UNDERSCORE).concat(this.datePipe.transform(new Date(this.noteOnTurnoverForm.get(StockDocumentConstant.END_DOCUMENT_DATE).value), 'dd/MM/yyyy'));
      const dataToSend = {
        'reportName' : ReportingConstant.NOTE_ON_TURNOVER_REPORT,
        'documentName' : documentName,
        'reportFormatName' : 'pdf',
        'printCopies' : 1,
        'PrintType' : -1,
        'reportparameters' : params
      };
      this.documentService.downloadJasperNoteOnTurnoverReport(dataToSend).subscribe(
        res => {
          this.fileServiceService.downLoadFile(res.objectData);
        }); 
  }

  public loadGridDataSource() {
    let startDate = new Date (this.noteOnTurnoverForm.controls[StockDocumentConstant.START_DOCUMENT_DATE].value);
    let endDate = new Date (this.noteOnTurnoverForm.controls[StockDocumentConstant.END_DOCUMENT_DATE].value);
    this.startDateToSend = startDate.getFullYear().toString().concat(',').concat((startDate.getMonth() + NumberConstant.ONE).toString()).concat(',').concat(startDate.getDate().toString());
    this.endDateToSend = endDate.getFullYear().toString().concat(',').concat((endDate.getMonth() + NumberConstant.ONE).toString()).concat(',').concat(endDate.getDate().toString());
    this.idItem = this.noteOnTurnoverForm.controls['IdItem'].value;
    this.idItem = (this.idItem == null || this.idItem == "")   ? this.idItem = NumberConstant.ZERO: this.idItem;
    this.documentService.GetNoteOnTurnoverLineList( this.startDateToSend, this.endDateToSend,this.idItem).
    subscribe(result => {
      if (result.listData.length == NumberConstant.ZERO) {
        this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS,
          'INFO', 'OK', '', true, true);
      }
        this.totalData = result.listData.NoteOnTurnoverLines;
        this.totalLine = result.listData.totalAmountHT;
        this.prepareList(result);
    });
  }

  prepareList(result) {
    const state = this.gridState;
    state.skip = 0;
    state.take = this.gridSettings.state.take;
    state.filter = this.gridSettings.state.filter;
    state.group = this.gridSettings.state.group;
    state.sort = this.gridSettings.state.sort;
    const Process = !isNullOrUndefined(result.data) ? process(result.data, state) :
      !isNullOrUndefined(result.listData) ? process(result.listData, state) : null;

    if (!isNullOrUndefined(result) && !isNullOrUndefined(Process)) {
      this.view = result.listData;
      this.loadItem();
    } else {
      this.gridSettings.gridData = null;
    }
    if (!isNullOrUndefined(this.gridSettings.gridData)
      && !isNullOrUndefined(this.gridSettings.gridData.total)
      && this.gridSettings.gridData.total > 0) {
      this.isGeneratedNoteOnTurnover = true;
    } else {
      this.isGeneratedNoteOnTurnover = false;
      this.swalWarrings.CreateSwal(StockDocumentConstant.TEXT_BUTTON_SWAL_WARRING_NOTEXISTING_INVENTORY_MOVEMENT_ITEMS,
        'INFO', 'OK', '', true, true);
    }
  }

  private loadItem(gridSettings?, isFiltred?): void {
    if (gridSettings) {
      this.gridSettings.state = gridSettings.state;
      this.gridSettings.gridData.data = gridSettings.gridData.data;
      if (isFiltred) {
        const totalData = this.gridSettings.gridData.data;
        this.gridSettings.gridData = process(totalData, this.gridSettings.state);
      } else {
        const totalData = Object.assign([], this.totalData);
        this.gridSettings.gridData = process(totalData, this.gridSettings.state);
      }
    } else {
      const totalData = Object.assign([], this.totalData);
      this.gridSettings.gridData = process(totalData, this.gridSettings.state);
    }
  }

  generateNoteOnTurnover() {
    if (!this.dateInputsIsValid()) {
      this.growlService.warningNotification(this.translate.instant(ImportDocumentConstants.DATE_INTERVAL_VIOLATION));
      return;
    }
    if (this.noteOnTurnoverForm.valid) {
      this.loadGridDataSource();
    } else {
      this.validationService.validateAllFormFields( this.noteOnTurnoverForm);
    }
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (this.gridSettings) {
      this.gridSettings.state = state;
      this.loadItem(this.gridSettings);
    }
  }
getSelectedCurrency() {
  this.symbole = this.localStorageService.getCurrencySymbol();
  this.formatNumberOptions = {
        style: 'currency',
        currency: this.localStorageService.getCurrencyCode(),
        currencyDisplay: 'symbol',
        minimumFractionDigits: this.localStorageService.getCurrencyPrecision()
  };
}


}
