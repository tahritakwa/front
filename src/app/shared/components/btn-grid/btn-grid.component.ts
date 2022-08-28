import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {ItemService} from '../../../inventory/services/item/item.service';
import {TranslateService} from '@ngx-translate/core';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ClaimConstants} from '../../../constant/crm/claim.constant';
import {CrmConfig} from '../../../models/crm/CrmConfig.model';
import {ResourceService} from '../../services/resource/resource.service';
import {Resource} from '../../../models/shared/ressource.model';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { isNullOrUndefined } from 'util';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { DocumentService } from '../../../sales/services/document/document.service';
import { RoleJavaService } from '../../../administration/services/role/role.java.service';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { DocumentEnumerator } from '../../../models/enumerators/document.enum';

@Component({
  selector: 'app-btn-grid',
  templateUrl: './btn-grid.component.html',
  styleUrls: ['./btn-grid.component.scss']
})
export class BtnGridComponent implements OnInit {
  @Input() isPrintShow = false;
  @Input() isExportModel = false;
  @Input() isImportFile = false;
  @Input() isExportExcel = false;
  @Input() isExportPDF = false;
  @Input() isDownloadData = false;
  @Input() isPrintReport = false;
  @Input() isDesactivate = false;
  @Input() isReactivate = false;
  @Input() isDelete = false;
  @Input() isFromGarage;
  @Input() advencedAdd: boolean;
  @Input() isOenModalToBillingTerm: boolean;
  @Input() sendMail: boolean;
  @Input() add: boolean;
  @Input() export: boolean;
  @Input() model: boolean;
  @Input() addLink: string;
  @Input() params: any;
  @Input() cardView: boolean;
  @Input() listView: boolean;
  @Input() showPopUpAdd: boolean;
  @Input() showSynchronzeBToB: boolean;
  @Input() btnText;
  @Output() sendMailEvent = new EventEmitter<void>();
  @Input() crmConfig: CrmConfig;
  @Output() cardViewEvent = new EventEmitter<void>();
  @Output() listViewEvent = new EventEmitter<void>();
  @Output() deleteSelectedItems = new EventEmitter<void>();
  @Output() archiveSelectedItems = new EventEmitter<void>();
  @Output() showAddPopUp = new EventEmitter<void>();
  @Output() restoreSelectedItems = new EventEmitter<void>();
  @Output() printReportEvent = new EventEmitter<string>();
  public claimSource = ClaimConstants.CLAIMS;
  public MASS_ACTIONS = this.translationService.instant(ClaimConstants.MASS_ACTIONS);
  @Input() relativeStyle: boolean;
  @Input() gridSettings: any;
  @Input() predicate: any;
  @Input() filtersItemDropdown: any;
  @Input() fileName: string;
  newPredicate: any;
  newGridSettings: any;
  @Output() incomingFileEvent = new EventEmitter<void>();
  @Output() downLoadFileEvent = new EventEmitter<void>();
  @Output() downLoadData = new EventEmitter<void>();
  @Input() idForExportFile = 'toggle';
  @Input() exportReport: boolean;
  @Output() exportReportEvent = new EventEmitter<void>();
  @ViewChild('excelexport') excelexportRef: any;
  @Input() service: ResourceService<Resource>;
  @Input() api: string;
  data: any;
  @Input() source: string;
  @Output() reactivateItemsUsers = new EventEmitter<void>();
  @Output() desactivateItemsUsers = new EventEmitter<void>();
  @Output() multiPrint = new EventEmitter<void>();
  @Input() title = SharedConstant.EMPTY;
  @Input() isFromItem: Boolean = false ;
  @Input() Config: any[] ;
  @Input() isFromDocument : boolean = false;
  @Input() isFromProvision : boolean = false;
  @Input() isFromRole: boolean = false;
  @Output() synchronizeWithBToBEvent = new EventEmitter<void>();
  @Input() filterItemSearch: any;
  @Input() isFromCRM = false;
  @Input() documentType : any;
  /** document Enumerator */
  documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  @Output() generateInvoiceEvent = new EventEmitter();
  @Input() isVisibleGenerateInvoiceButton : boolean;

    constructor(public itemService: ItemService, public translationService: TranslateService, public documentService: DocumentService,
      public roleServiceJava: RoleJavaService, private localStorageService: LocalStorageService) { }

  ngOnInit() {
  }

  public convert() {
    const doc = new jsPDF();
    const columns = [this.translationService.instant('FSR'),
    this.translationService.instant('CODE'),
    this.translationService.instant('Description'),
    this.translationService.instant('STOCK'),
    this.translationService.instant('PHT'),
    this.translationService.instant('PRODUCT_BAND')];
    let rows: any[];

    this.newGridSettings = JSON.parse(this.gridSettings);
    this.newPredicate = JSON.parse(this.predicate);

    this.newGridSettings.state.take = this.newGridSettings.gridData.total;
    this.newGridSettings.state.skip = 0;
    this.itemService.exportPdf(this.newGridSettings.state, this.newPredicate, this.filtersItemDropdown).subscribe(result => {
      rows = [];
      result.listData.forEach((element) => {
        let item = Object.values(element);
        rows.push(item);
      });

      doc.autoTable(columns, rows, {
        styles: {
          fontSize: 9,
          columnStyles: {
            0: { columnWidth: 40},
            1: { columnWidth: 400 },
            2: { columnWidth: 40 },
            3: { columnWidth: 200 },
            4: { columnWidth: 80 },
          },
        },
      });
      doc.save(this.translationService.instant(this.fileName) + '-' + new Date() + '.pdf');
    });
  }

  public convert2() {
    let doc = new jsPDF();
    let columns = [this.translationService.instant('CODE'),
    this.translationService.instant('Description'),
    this.translationService.instant('PHT'),
    this.translationService.instant('PRODUCT_BAND'),
    this.translationService.instant('VEHICLE')];
    let rows: any[];

    this.newGridSettings = JSON.parse(this.gridSettings);
    this.newPredicate = JSON.parse(this.predicate);

    this.newGridSettings.state.take = this.newGridSettings.gridData.total;
    this.newGridSettings.state.skip = 0;
    this.itemService.exportPdf(this.newGridSettings.state, this.newPredicate, this.filtersItemDropdown).subscribe(result => {
      rows = [];
      result.listData.forEach((element) => {
        const itemToAdd = {
          Code: element.Code,
          Description: element.Description,
          UnitHtsalePrice: element.UnitHtsalePrice,
          LabelProduct: element.LabelProduct,
          LabelVehicule: element.LabelVehicule
        };
        rows.push(Object.values(itemToAdd));
      });

      doc.autoTable(columns, rows, {
        styles: {
          fontSize: 9,
          columnStyles: {
            0: { columnWidth: 40},
            1: { columnWidth: 400 },
            2: { columnWidth: 40 },
            3: { columnWidth: 200 },
            4: { columnWidth: 80 },
          },
        }
      });
      doc.save(this.translationService.instant(this.fileName) + '-' + new Date() + '.pdf');
    });
  }
  public exportPDF() {
    /**
     * @TO_DO
     */
  }
  changeViewToList() {
    this.listViewEvent.emit();
  }

  changeViewToCard() {
    this.cardViewEvent.emit();
  }

  goToSendMail() {
    this.sendMailEvent.emit();
  }
  goToIncomingFile(event) {
    this.incomingFileEvent.emit(event);
  }
  goToDownLoadFileEvent() {
  this.downLoadFileEvent.emit();
  }
  deleteSelected() {
    this.deleteSelectedItems.emit();
  }

  archiveSelected() {
    this.archiveSelectedItems.emit();
  }

  addPopUp() {
    this.showAddPopUp.emit();
  }

  restoreSelected() {
    this.restoreSelectedItems.emit();
  }
  exportReportAction() {
    this.exportReportEvent.emit();
  }
  synchronizeWithBToB() {
    this.synchronizeWithBToBEvent.emit();
  }
  get dateTime(): Date {
    return new Date();
  }

  getAllDataAndSave() {

    const state = {
      take: NumberConstant.MAX_INT,
      skip: 0,
      filter: this.gridSettings.state.filter,
      group: this.gridSettings.state.group,
      sort: this.gridSettings.state.sort,
      aggregates: this.gridSettings.state.aggregates
    };
    if(this.isFromItem){
      this.filterItemSearch.page = NumberConstant.ZERO;
      this.filterItemSearch.pageSize = NumberConstant.ZERO;
      this.itemService.getItemDataWithSpecificFilter(this.filterItemSearch).subscribe((result) => {
          this.data = result.listData;
          this.excelexportRef.data = this.data;
          this.excelexportRef.data.forEach(m => {
          this.itemService.convertListToString(m);
          });
          this.excelexportRef.save();
        });

    } else if (this.isFromDocument){
      this.service.reloadServerSideDataWithListPredicate(state, this.predicate,
        DocumentConstant.GET_DATASOURCE_WITH_SPECIFC_PREDICATE, false).subscribe(res => {
          this.data = res.data;
          this.excelexportRef.data = this.data;
          this.excelexportRef.data.forEach(m => {
            if (!isNullOrUndefined(m.DocumentDate)) {
              m.DocumentDate = new Date(m.DocumentDate);
            }
            m.DocumentStatus = !isNullOrUndefined(m.DocumentStatus) ?
            this.documentService.translateStatus(m.IdDocumentStatus, m.DocumentTypeCode) : '';
            if (!isNullOrUndefined(m.IdDocumentStatusNavigation)) {
              m.IdDocumentStatusNavigation.Label = !isNullOrUndefined(m.IdDocumentStatusNavigation)
              && !isNullOrUndefined(m.IdDocumentStatusNavigation.Label) ?
              this.translationService.instant(m.IdDocumentStatusNavigation.Label.toUpperCase()) : '';
            }
          });
          this.excelexportRef.save();
        });
    } else if (this.isFromProvision) {
      this.service.reloadServerSideDataWithListPredicate(state, this.predicate,
        SharedConstant.GET_DATA_WITH_SPECIFIC_FILTER).subscribe(data => {
          this.data = data.data;
          this.excelexportRef.data = this.data;
          this.excelexportRef.data.forEach(m => {
            if (!isNullOrUndefined(m.CreationDate)) {
              m.CreationDate = new Date(m.CreationDate);
            }
          });
          this.excelexportRef.save();
      });
    }else if(this.isFromRole){
      this.roleServiceJava.getJavaGenericService()
      .getEntityList(`?companyCode=${(this.localStorageService.getCompanyCode())}&page=${state.skip}&size=${state.take}`)
      .subscribe(data => {
        this.data = data.content ;
        this.excelexportRef.data = this.data;
        this.excelexportRef.save();
      });
    } else {
    this.service.reloadServerSideData(state, this.predicate, this.api).subscribe(data => {
      this.data = data.data;
      this.excelexportRef.data = this.data;
      this.excelexportRef.data.forEach(m => {
        this.service.translaiteData(m);
        if (!isNullOrUndefined(m.DocumentDate)) {
          m.DocumentDate = new Date(m.DocumentDate);
        }
        if (!isNullOrUndefined(m.ExpectedEndDate)) {
          m.ExpectedEndDate = new Date(m.ExpectedEndDate);
        }
        if (!isNullOrUndefined(m.StartDate)) {
          m.StartDate = new Date(m.StartDate);
        }
          m.DocumentStatus = !isNullOrUndefined(m.DocumentStatus) ?
          this.translationService.instant(m.DocumentStatus.toUpperCase()) : '';
          if (!isNullOrUndefined(m.IdDocumentStatusNavigation)) {
          m.IdDocumentStatusNavigation.Label = !isNullOrUndefined(m.IdDocumentStatusNavigation)
          && !isNullOrUndefined(m.IdDocumentStatusNavigation.Label) ?
          this.translationService.instant(m.IdDocumentStatusNavigation.Label.toUpperCase()) : '';
         }
      });
      this.excelexportRef.save();
    });
  }

  }

  /**
   * this method is to replace download button treatment
   */
  public downloadData() {
    this.downLoadData.emit();
  }
  public goToReactivateItemsUsers() {
    this.reactivateItemsUsers.emit();
  }
  public goToDesactivateItemsUsers() {
    this.desactivateItemsUsers.emit();
  }

  printJasper(typeReport: string) {
    this.printReportEvent.emit(typeReport);
  }
  public print() {
    this.multiPrint.emit();
  }

  public generateInvoice(){
    this.generateInvoiceEvent.emit();
  }
}
