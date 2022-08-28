import { Component, OnInit, Input, ChangeDetectorRef, ViewContainerRef, ViewChild } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { DocumentService } from '../../services/document/document.service';
import { documentStatusCode, DocumentEnumerator } from '../../../models/enumerators/document.enum';
import { PagerSettings, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { dateValueGT, dateValueLT } from '../../../shared/services/validation/validation.service';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { process } from '@progress/kendo-data-query';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';


const START_DATE = 'StartDate';
const END_DATE = 'EndDate';
@Component({
  selector: 'app-valid-invoice-asset-list',
  templateUrl: './valid-invoice-asset-list.component.html',
  styleUrls: ['./valid-invoice-asset-list.component.scss']
})
export class ValidInvoiceAssetListComponent implements OnInit {
  invoiceAssetFormGroup: FormGroup;
  private oldStartDateValue: Date;
  private oldEndDateValue: Date;
  public minEndDate: Date;
  public maxStartDate: Date;
  public totalData;
  startDate: Date;
  endDate: Date;
  @ViewChild('container', { read: ViewContainerRef })
  public containerRef: ViewContainerRef;
  public pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public documentEnumerator: DocumentEnumerator = new DocumentEnumerator();
  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 40,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public gridSettings: GridSettings = {
    state: this.gridState
  };

  public statusCode = documentStatusCode;

  public skip = 0;
  public pageSize = 40;

  public columnsConfig: ColumnSettings[] = [
    {
      field: 'Code',
      title: 'CODE',
      filterable: true
    },
    {
      field: 'DocumentDate',
      title: 'DATE',
      filterable: true,
      format: 'dd/MM/yyyy'
    },
    {
      field: 'IdDocumentStatus',
      title: 'STATUS',
      filterable: true
    },
    {
      field: 'DocumentTtcpriceWithCurrency',
      title: 'TTC_AMOUNT',
      filterable: true
    },
    {
      field: 'DocumentRemainingAmountWithCurrency',
      title: 'REMAINING_AMOUNT',
      filterable: true
    },
  ];
  @Input() selectedValue: number;
  public hasInvoiceAssetListPermission = false;

  constructor(private documentService: DocumentService, public fb: FormBuilder, private cdRef: ChangeDetectorRef,
    private authService: AuthService) { }

  ngOnInit() {
    this.hasInvoiceAssetListPermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.LIST_INVOICE_ASSET_SALES);
    this.gridState.skip = 0;
    this.gridState.take = 10;
    this.skip = 0;
    this.createFormGroup();
    this.getDataSource();


  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.gridState = state;
    this.searchDocuments();
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.gridState.skip = skip;
    this.gridState.take = take;
    this.getDataSource();
  }

  openDocument(document) {
    let url = '';
    if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoices) {
      url = DocumentConstant.SALES_INVOICE_URL.concat('/').concat(DocumentConstant.SHOW);
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesAsset) {
      url = DocumentConstant.SALES_ASSET_URL.concat('/').concat(DocumentConstant.SHOW);
    }
    if (document.DocumentTypeCode === DocumentEnumerator.SalesInvoiceAsset) {
      url = DocumentConstant.SALES_ASSET_URL.concat('/').concat(DocumentConstant.SHOW);
    }
    window.open(url.concat('/').concat(document.Id).concat('/').concat(document.IdDocumentStatus));
  }

  getDataSource() {
    this.totalData = [];
    this.documentService.getValidAssetsAndInvoice(this.selectedValue, this.gridState,
      new PredicateFormat(), this.startDate, this.endDate).subscribe(x => {
      this.gridSettings.gridData = {
        data: x.listObject.listData,
        total: x.listObject.total
      };
      this.totalData = this.gridSettings.gridData.data;
    });
  }
  /** create the form group */
  public createFormGroup(): void {
    this.invoiceAssetFormGroup = this.fb.group({
      StartDate: [new Date()],
      EndDate: [new Date()]
    });
    this.addDependentDateControls(this.invoiceAssetFormGroup);
  }
  private addDependentDateControls(currentformGroup: FormGroup) {
    this.setStartDateControl(currentformGroup);
    this.setEndDateControl(currentformGroup);
    currentformGroup.get(START_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(END_DATE).hasError('dateValueGT')) {
        currentformGroup.get(END_DATE).setErrors(null);
      }
    });
    currentformGroup.get(END_DATE).valueChanges.subscribe(() => {
      if (currentformGroup.get(START_DATE).hasError('dateValueLT')) {
        currentformGroup.get(START_DATE).setErrors(null);
      }
    });

  }
  private setStartDateControl(currentformGroup: FormGroup) {
    const oEndDate = new Observable<Date>(observer => observer.next(currentformGroup.get(END_DATE).value));
    currentformGroup.setControl(START_DATE, this.fb.control(currentformGroup.value.startDate,
      [dateValueLT(oEndDate)]));
  }
  private setEndDateControl(currentformGroup: FormGroup) {
    const oStartDate = new Observable<Date>(observer => observer.next(currentformGroup.get(START_DATE).value));
    currentformGroup.setControl(END_DATE, this.fb.control(currentformGroup.value.endDate,
      [dateValueGT(oStartDate)]));
  }
  changeStartDate() {
    if (this.invoiceAssetFormGroup.get(START_DATE).value !== this.oldStartDateValue) {
      this.oldStartDateValue = this.invoiceAssetFormGroup.get(START_DATE).value;
      if (!this.oldStartDateValue) {
        this.minEndDate = undefined;
      } else {
        this.minEndDate = this.oldStartDateValue;
      }
      this.cdRef.detectChanges();
    }
  }
  clickSearch() {
    this.gridSettings.state.skip = 0;
    this.searchDocuments();
  }
  searchDocuments() {

    if (this.invoiceAssetFormGroup.controls['StartDate'].value && this.invoiceAssetFormGroup.controls['EndDate'].value) {

      let startDateValue = this.invoiceAssetFormGroup.controls['StartDate'].value;
      let endDateValue = this.invoiceAssetFormGroup.controls['EndDate'].value;
      this.startDate = new Date(Date.UTC(startDateValue.getFullYear(), startDateValue.getMonth(), startDateValue.getDate()));
      this.endDate = new Date(Date.UTC(endDateValue.getFullYear(), endDateValue.getMonth(), endDateValue.getDate()));

    } else if (this.invoiceAssetFormGroup.controls['StartDate'].value) {

      let startDateValue = this.invoiceAssetFormGroup.controls['StartDate'].value;
      this.startDate = new Date(Date.UTC(startDateValue.getFullYear(), startDateValue.getMonth(), startDateValue.getDate()));
      this.endDate = null;

    } else if (this.invoiceAssetFormGroup.controls['EndDate'].value) {

      let endDateValue = this.invoiceAssetFormGroup.controls['EndDate'].value;
      this.startDate = null;
      this.endDate = new Date(Date.UTC(endDateValue.getFullYear(), endDateValue.getMonth(), endDateValue.getDate()));

    } else {

      this.endDate = null;
      this.startDate = null;

    }

    this.getDataSource();
  }
  changeEndDate() {
    if (this.invoiceAssetFormGroup.get(END_DATE).value !== this.oldEndDateValue) {
      this.oldEndDateValue = this.invoiceAssetFormGroup.get(END_DATE).value;

      if (!this.oldEndDateValue) {
        this.maxStartDate = undefined;
      } else {
        this.maxStartDate = this.oldEndDateValue;
      }
      this.cdRef.detectChanges();
    }
  }
}
