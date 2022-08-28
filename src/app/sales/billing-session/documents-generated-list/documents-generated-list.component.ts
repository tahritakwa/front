
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs/Subscription';
import { BillingSessionConstant } from '../../../constant/sales/billing-session.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BillingSessionState } from '../../../models/enumerators/BillingSessionState.enum';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { ProgressBarState } from '../../../models/enumerators/progress-bar-state.enum';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';
import { BillingSession } from '../../../models/sales/billing-session.model';
import { Document } from '../../../models/sales/document.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ListDocumentService } from '../../../shared/services/document/list-document.service';
import { ProgressService } from '../../../shared/services/signalr/progress/progress.service';
import { DataTransferShowSpinnerService } from '../../../shared/services/spinner/data-transfer-show-spinner.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { Filter, Operation, OrderBy, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { BillingSessionService } from '../../services/billing-session/billing-session.service';
import { DocumentService } from '../../services/document/document.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
const PREVIOUS_URL = '/main/sales/billingSession/ValidateCRA/';
const LOGIC_AND = 'and';

@Component({
  selector: 'app-documents-generated-list',
  templateUrl: './documents-generated-list.component.html',
  styleUrls: ['./documents-generated-list.component.scss']
})
export class DocumentsGeneratedListComponent implements OnInit, OnDestroy {

  // billing session selected from localStorage
  billingSession = new BillingSession();

  // Is true if the user select to generate all invoices
  public generateAll = false;

  // format Date
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  // boolean attributs
  showGrid = false;
  showProgressBar = false;

  progression: ProgressBar;

  // number of payslip records generated
  successeFullyGeneratedDocuments: Document[] = [];

  // Enum of document status
  public statusCode = documentStatusCode;

  public predicate: PredicateFormat;
  // Progress subscription
  subscription: Subscription;

  // tslint:disable-next-line: member-ordering
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: LOGIC_AND,
      filters: []
    }
  };

  // Grid columns proprety
  public columnsConfig: ColumnSettings[] = this.documentListService.columnsConfig;
  public idBillingSession: number;
  public isClosed = false;
  public isUpdateMode = true;
  public AllEmployeesIds: number[] = [];
  language: string;
  public documentEnumerator = DocumentEnumerator;
  checkedEmployeeWithNotValidatedTimeSheets = NumberConstant.ZERO;
  public hasClosePermission: boolean;
  public hasShorOrUpdateInvoicePermission: boolean;
  public hasGeneratePermission: boolean;
  isEnabled: boolean;

  constructor( private router: Router, public documentListService: ListDocumentService,
    private dataTransferShowSpinnerService: DataTransferShowSpinnerService, private activatedRoute: ActivatedRoute,
    private progressService: ProgressService, private translate: TranslateService, private billingSessionService: BillingSessionService,
    private swalWarrings: SwalWarring, private localStorageService: LocalStorageService, private authService: AuthService) {
      this.language = this.localStorageService.getLanguage();
      this.activatedRoute.params.subscribe(params => {
        this.idBillingSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
        this.isEnabled = params[SharedConstant.IS_ENABLED] === SharedConstant.TRUE;
      });
  }

  ngOnInit() {
    this.hasClosePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.CLOSE_BILLING_SESSION);
    this.hasGeneratePermission = this.authService.hasAuthority(PermissionConstant.CommercialPermissions.GENERATE_BILLING_SESSION_INVOICES);
    this.hasShorOrUpdateInvoicePermission = this.authService.hasAuthorities([
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES, PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES]);
    this.columnsConfig.push({
      field: DocumentConstant.PROJECT_NAME_FROM_ID_PROJECT_NAVIGATION,
      title: DocumentConstant.PROJECT,
      filterable: true,
    });
    if (this.idBillingSession) {
      this.getBillingSession(this.idBillingSession);
    }
    if (this.billingSession === undefined || this.billingSession === null) {
      this.router.navigate([BillingSessionConstant.BILLING_SESSION_List]);
    }
  }

  getBillingSession(id) {
    this.billingSessionService.getBillingSessionDetailsById(id)
      .subscribe(data => {
        this.billingSession = data;
        this.isClosed = this.billingSession.State === BillingSessionState.Closed;
        this.billingSession.Month = new Date(this.billingSession.Month);
        this.billingSession.BillingEmployee = this.billingSession.BillingEmployee.filter(x => x.IsChecked);
        this.checkedEmployeeWithNotValidatedTimeSheets = new Set(data.BillingEmployee.filter
          (x => x.IdTimeSheetNavigation.Status !== NumberConstant.FOUR).map(y => y.IdEmployee)).size;
        this.progression = new ProgressBar();
        this.progressService.initBillingSessionProgressHubConnection();
        this.progressService.registerOnBillingSessionProgressBarProgressionEvent();
        if (this.billingSession.BillingEmployee && this.billingSession.BillingEmployee.length > NumberConstant.ZERO) {
          this.successeFullyGeneratedDocuments =
            this.billingSession.BillingEmployee.filter(x => x.IdDocumentNavigation != null).map(x => x.IdDocumentNavigation);
          this.successeFullyGeneratedDocuments.length > NumberConstant.ZERO ? this.showGrid = true : this.showGrid = false;
        }
        if (this.billingSession.State === BillingSessionState.Closed) {
          this.preparePredicate();
          this.initGridDataSource();
        }
        this.subscription = this.progressService.billingSessionProgressionSubject.subscribe((result: ProgressBar) => {
          this.billingSession.GeneratedDocuments = result.SuccesseFullyGeneratedObjects;
          this.showGrid = true;
          this.progression = result;
          this.successeFullyGeneratedDocuments = result.SuccesseFullyGeneratedObjects;
          this.showProgressBar = this.progression != null ? true : false;
          if (this.progression.State === ProgressBarState.Completed) {
            setTimeout(() => {
              this.showProgressBar = false;
            }, 500);
            this.progressService.destroyBillingSessionProgressHubConnection();
          }
        });
      });
  }

  public preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Filter.push(new Filter(BillingSessionConstant.ID_BILLING_SESSION, Operation.eq, this.idBillingSession));
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BillingSessionConstant.PROJECT_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BillingSessionConstant.TIMESHEET_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BillingSessionConstant.TIERS_NAVIGATION)]);
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(BillingSessionConstant.CURRENCY_NAVIGATION)]);
  }

  private initGridDataSource(predicate?: PredicateFormat) {
    this.predicate = predicate ? predicate : this.predicate;
    this.billingSessionService.getDocumentsGenerated(this.gridState, this.predicate).subscribe(result => {
      if (result && result.data && result.data[NumberConstant.ZERO]) {
        this.successeFullyGeneratedDocuments = result.data;
        this.successeFullyGeneratedDocuments.length > NumberConstant.ZERO ? this.showGrid = true : this.showGrid = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.progressService.destroyBillingSessionProgressHubConnection();
  }

  onClickRegenerate() {
    if (this.progression.State !== ProgressBarState.Pending) {
      this.generateAll = true;
      this.showGrid = false;
      this.successeFullyGeneratedDocuments = [];
      this.progressService.initBillingSessionProgressHubConnection();
      this.progressService.registerOnBillingSessionProgressBarProgressionEvent();
      this.onClickGenerate();
    }
  }

  public async onClickGenerate() {
    this.progression.Progression = NumberConstant.ZERO;
    this.showProgressBar = true;
    this.dataTransferShowSpinnerService.setShowSpinnerValue(this.showProgressBar);
    await this.billingSessionService.generateInvoiceFromBillingSession(this.billingSession.Id).toPromise().then(() => {
      this.showProgressBar = false;
      this.billingSessionService.getById(this.billingSession.Id).subscribe(result => {
        this.billingSession.NumberOfNotGeneratedDocuments = result.NumberOfNotGeneratedDocuments;
      });
      this.getBillingSession(this.idBillingSession);
    });
  }

  public onPreviousClik(): void {
    this.router.navigateByUrl(PREVIOUS_URL.concat(this.idBillingSession.toString(), SharedConstant.SLASH, String(this.isEnabled)),
      { skipLocationChange: true });
  }

  public closeSessionClick(): void {
    this.swalWarrings.CreateSwal(BillingSessionConstant.CLOSE_BILLING_SESSION_DETAIL_MESSAGE, SharedConstant.WARNING_TITLE,
      SharedConstant.OKAY, SharedConstant.CANCEL).then((result) => {
        if (result.value) {
          this.billingSession.State = BillingSessionState.Closed;
          this.billingSessionService.save(this.billingSession, false).subscribe(() => {
            this.router.navigate([BillingSessionConstant.BILLING_SESSION_List]);
          });
        }
      });
  }
}
