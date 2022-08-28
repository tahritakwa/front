import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {ListDocumentService} from '../../../services/document/list-document.service';
import {GridSettings} from '../../../utils/grid-settings.interface';
import {SelectAllCheckboxState} from '@progress/kendo-angular-grid';
import {DocumentService} from '../../../../sales/services/document/document.service';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {ValidationService} from '../../../services/validation/validation.service';
import {ReportTemplate} from '../../../../models/reporting/report-template.model';
import {FileService} from '../../../services/file/file-service.service';
import {SwalWarring} from '../../swal/swal-popup';
import {IntlService} from '@progress/kendo-angular-intl';
import {BlforTierViewModel} from '../../../../models/shared/bl-for-tiers.model';
import {TermBillingGridComponent} from '../../../../sales/components/term-billing-grid/term-billing-grid.component';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import { AuthService } from '../../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { ReportTemplateService } from '../../../services/report-template/report-template.service';
import { Filter, Operation, PredicateFormat, Relation } from '../../../utils/predicate';
import { DocumentConstant } from '../../../../constant/sales/document.constant';
import { LanguageService } from '../../../services/language/language.service';
import { Languages } from '../../../../constant/shared/services.constant';
import { DocumentEnumerator } from '../../../../models/enumerators/document.enum';



@Component({
  selector: 'app-term-billing-list',
  templateUrl: './term-billing-list.component.html',
  styleUrls: ['./term-billing-list.component.scss']
})
export class TermBillingListComponent implements OnInit {
  @ViewChild('bl') public TermBillingGridComponentBl: TermBillingGridComponent;
  @ViewChild('ia') public TermBillingGridComponentIa: TermBillingGridComponent;
  @Input() isBl = true;
  @Input() isAsset = true;
  /** document Enumerator */
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  allDatas: BlforTierViewModel[] = new Array<BlforTierViewModel>();
  filteredData: BlforTierViewModel[] = new Array<BlforTierViewModel>();
  public gridSettings: GridSettings = this.documentListService.gridSettingsBillingTermscolumnsConfig;
  public month: Date = new Date();
  public idTierCategory: number ;
  public mySelection: number[] = [];
  showbl;
  showIa;
  datePipe = new DatePipe('en-US');
  public GeneratedInvoiceId: number[] = [];
  public ProductID;
  public isInvoicesGenerated: boolean;
  dataReportTemplate: Array<ReportTemplate> = new Array<ReportTemplate>();
  printReportType: Array<any> = new Array<any>();
  public clientToSearch = '';
  public selectAllState: SelectAllCheckboxState = 'unchecked';
  hasPrintPermission = false;
  hasGeneratePermission = false;
  /**
   * Form Group
   */
  formGroup: FormGroup;

  public selectableSettings = {
    checkboxOnly: true,
    mode: 'multiple'
  };

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(public documentListService: ListDocumentService, public documentService: DocumentService,
              private fb: FormBuilder, private validationService: ValidationService, protected fileServiceService: FileService,
              private swalWarrings: SwalWarring, private translate: TranslateService, protected growlService: GrowlService,
              protected documentPrintService: DocumentService, public intl: IntlService, private authService: AuthService,
              protected serviceReportTemplate: ReportTemplateService,protected languageService: LanguageService) {
  }

  pressKeybordEnterToSearch(event) {
    if (event.charCode === 13) {
      this.searchbillinglist(this.month);
    }
  }

  get documentDate(): FormControl {
    return this.formGroup.get('DocumentDate') as FormControl;
  }

  createAddForm(): void {
    this.formGroup = this.fb.group({
      DocumentDate: [new Date(), Validators.required],
      IdTierCategory: ['']
    });
  }

  GenerateTermInvoice() {
    if (this.formGroup.valid) {
      if (this.showbl) {
        this.documentService.GenerateTermInvoice(this.TermBillingGridComponentBl.SelectedLines,
          this.month, this.formGroup.controls['DocumentDate'].value, true).subscribe(x => {
            if (x.length < this.TermBillingGridComponentBl.SelectedLines.length && x.length !=0) {
              this.growlService.warningNotification(this.translate.instant(SharedConstant.ALREADY_DELIVERY_INVOICED));
            }
            this.TermBillingGridComponentBl.GenerateTermInvoice(x);
            this.GeneratedInvoiceId = this.TermBillingGridComponentBl.GeneratedInvoiceId;
          });
      } else {
        this.documentService.GenerateTermInvoice(this.TermBillingGridComponentIa.SelectedLines,
          this.month, this.formGroup.controls['DocumentDate'].value, false).subscribe(x => {
          this.TermBillingGridComponentIa.GenerateTermInvoice(x);
          this.GeneratedInvoiceId = this.TermBillingGridComponentIa.GeneratedInvoiceId;
        });
      }
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  PrintTermInvoice($event) {
    if (this.formGroup.valid) {
      const dataToSend = this.getReportName($event);
      this.openReport(dataToSend);
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }

  PrintTermInvoiceJasper($event) {
    if (this.formGroup.valid) {
      const dataToSend = this.getReportName($event);
      this.openJasperReport(dataToSend);
    } else {
      this.validationService.validateAllFormFields(this.formGroup);
    }
  }


  ngOnInit() {
    this.hasPrintPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.PRINT_TERM_BILLING);
    this.hasGeneratePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_TERM_BILLING);
    if (this.isBl) {
      this.showbl = true;
      this.showIa = false;
    } else {
      this.showbl = false;
      this.showIa = true;
    }
    this.isInvoicesGenerated = false;
    const predicate = new PredicateFormat();
    predicate.Filter = new Array<Filter>();
    predicate.Filter.push(new Filter(DocumentConstant.REPORT_CODE, Operation.eq,this.documentEnumerator.SalesInvoices));
    predicate.Relation = new Array<Relation>();
    this.serviceReportTemplate.readPredicateData(predicate).subscribe(data => {
      let propertyNameReportTemplate: string;
      if (this.languageService.selectedLang === Languages.FR.value) {
        propertyNameReportTemplate = DocumentConstant.TEMPLATE_NAME_FR;
      } else {
        propertyNameReportTemplate = DocumentConstant.TEMPLATE_NAME_EN;
      }
      data.forEach(repT => {
        repT.text = repT[propertyNameReportTemplate];
      });
        this.dataReportTemplate = data;
    });
    this.createAddForm();
    this.printReportType = [
      {printType: 'ORIGINALE', TemplateCode: this.translate.instant('ORIGINALE')},
      {printType: 'COPIE', TemplateCode: this.translate.instant('COPIE')},
      {printType: 'DUPLICATA', TemplateCode: this.translate.instant('DUPLICATA')},
      {printType: 'DETAILED', TemplateCode: this.translate.instant('DETAILED')},
    ];

  }

  setIsInvoicesGenerated($event) {
    this.isInvoicesGenerated = $event;
  }

  searchbillinglist(month) {
    this.month = month;
    this.idTierCategory = this.formGroup.controls.IdTierCategory.value == ''? NumberConstant.ZERO : this.formGroup.controls.IdTierCategory.value ;
    if (this.showbl) {
      this.TermBillingGridComponentBl.searchbillinglist(month , this.idTierCategory);
    } else {
      this.TermBillingGridComponentIa.searchbillinglist(month , this.idTierCategory);
    }
  }


  public getPrintType(printType) {
    if (printType === 'ORIGINALE') {
      return 0;
    } else if (printType === 'COPIE') {
      return 1;
    } else if (printType === 'DUPLICATA') {
      return 2;
    } else if (printType == 'DETAILED') {
      return 3;
    } else {
      return -1;
    }
  }
  // get report after selecting report button
  public getReportName($event) {
    let printType;
    if ($event && $event.printType) {
      printType = this.getPrintType($event.printType);
    } else {
      printType = -1;
    }

    const params = this.GeneratedInvoiceId.map(x => {
      return {
        report_documentId: x,
      };
    });
    if (printType == 0 || printType == 1 || printType == 2) {
      var detailledReportData = this.dataReportTemplate.filter(x => x.TemplateCode!= 'DETAILED')[0];

    return {
      'listIds': this.GeneratedInvoiceId,
      'DynamicListIds': params,
      'documentName': this.translate.instant(SharedConstant.TERM_BILLING).concat(SharedConstant.UNDERSCORE)
        .concat(this.datePipe.transform(new Date(this.documentDate.value), 'dd/MM/yyyy')),
      'reportCode': 'I-SA',
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': printType,
      'isFromBl': this.showbl ? 1 : -1,
      'reportName':  detailledReportData ?  (<any>detailledReportData).ReportName : 'genericDocumentReport',
    };
  } else {
    var detailledReportData = this.dataReportTemplate.filter(x => x.TemplateCode == 'DETAILED')[0];

    return {
      'listIds': this.GeneratedInvoiceId,
      'DynamicListIds': params,
      'documentName': this.translate.instant(SharedConstant.TERM_BILLING).concat(SharedConstant.UNDERSCORE)
        .concat(this.datePipe.transform(new Date(this.documentDate.value), 'dd/MM/yyyy')),
      'reportCode': 'I-SA',
      'reportFormatName': 'pdf',
      'printCopies': 1,
      'PrintType': printType,
      'isFromBl': this.showbl ? 1 : -1,
      'reportName':  detailledReportData ?  (<any>detailledReportData).ReportName : 'documentSalesDetails',
    };
  }}

  // download with telerik report
  public openReport(dataToSend) {
    dataToSend = JSON.parse(JSON.stringify(dataToSend));
    this.multiPrintDownloadedReport(dataToSend);

  }

  // download with jasper report
  public openJasperReport(dataToSend) {
    dataToSend = JSON.parse(JSON.stringify(dataToSend));
    this.multiPrintDownloadedReportJasper(dataToSend);

  }

  /// Multi Print Invoice Directly
  public multiPrintDownloadedReport(dataItem): void {
    this.documentPrintService.multiPrintReport(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  /// Multi Print Invoice Directly
  public multiPrintDownloadedReportJasper(dataItem): void {
    this.documentPrintService.multiPrintReportJasper(dataItem).subscribe(
      res => {
        this.fileServiceService.downLoadFile(res.objectData);
      });
  }

  refreshData() {
    if (this.showbl) {
      this.TermBillingGridComponentBl.refreshData();
    } else {
      this.TermBillingGridComponentIa.refreshData();
    }
  }

  isGenerateBtnDisabled() : boolean {
    if(this.showbl){
      return (!this.TermBillingGridComponentBl || (this.TermBillingGridComponentBl && this.TermBillingGridComponentBl.mySelection.length === 0));
    }else {
      return !this.TermBillingGridComponentIa || (this.TermBillingGridComponentIa && this.TermBillingGridComponentIa.mySelection.length === 0);
    }
  }
}
