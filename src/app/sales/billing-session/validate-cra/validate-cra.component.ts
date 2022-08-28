import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingSessionService } from '../../services/billing-session/billing-session.service';
import { BillingSessionConstant } from '../../../constant/sales/billing-session.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { BillingSession } from '../../../models/sales/billing-session.model';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { EmployeeProjectsDetails } from '../../../models/sales/employee-projects-details.model';
import { TimeSheetStatusEnumerator } from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import { TimeSheetService } from '../../../rh/services/timesheet/timesheet.service';
import { DocumentService } from '../../services/document/document.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BillingEmployee } from '../../../models/sales/billing-employee.model';
import { BillingEmployeeService } from '../../services/billing-employee/billing-employee.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { BillingSessionState } from '../../../models/enumerators/BillingSessionState.enum';
import { documentStatusCode } from '../../../models/enumerators/document.enum';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
const PREVIOUS_URL = '/main/sales/billingSession/add/';

@Component({
  selector: 'app-validate-cra',
  templateUrl: './validate-cra.component.html',
  styleUrls: ['./validate-cra.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateCraComponent implements OnInit {

  // Enum  Draft, Sended, PartiallyValidated , Validated
  public statusCode = TimeSheetStatusEnumerator;

  // billing session selected from localStorage
  billingSession = new BillingSession();

  // format Date
  formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);


  // List of ids of employees that has the connected user as super hierarchical
  employeeHierarchy: number[] = [];

  // dataGrid
  dataGrid: Array<EmployeeProjectsDetails> = [];
  // Enum of document status
  public statusCodeDocument = documentStatusCode;

  public unselectedProjectErrorMessage = false;

  public billingEmployee: any[] = [];

  // Grid columns Config
  public columnsConfig: ColumnSettings[] = [
    {
      field: BillingSessionConstant.EMPLOYEE_FULLNAME,
      title: BillingSessionConstant.COLLABORATER,
      filterable: false
    }
    ,
    {
      field: BillingSessionConstant.PROJECTS,
      title: BillingSessionConstant.PROJECTS_UPPERCASE,
      filterable: false
    },
    {
      field: BillingSessionConstant.PROJECTS,
      title: BillingSessionConstant.ADR,
      filterable: false
    },
    {
      field: BillingSessionConstant.PROJECTS,
      title: BillingSessionConstant.WORKED_DAYS_UPPERCASE,
      filterable: false
    },
    {
      field: BillingSessionConstant.LEAVE_NUMBER_DAYS,
      title: BillingSessionConstant.LEAVES_UPPERCASE,
      filterable: false
    }
  ];

  public idBillingSession: number;
  /**
   * True if session is closed
   */
  public isClosed: boolean;
  // Verify checked checkbox
  isChecked: boolean;
  isUpdateMode = false;
  language: string;
  public hasShorOrUpdateInvoicePermission: boolean;
  isEnabled: boolean;
  states = BillingSessionState;

  constructor(private billingSessionService: BillingSessionService, public timeSheetService: TimeSheetService,
    public documentService: DocumentService, private growlService: GrowlService, private translate: TranslateService,
    private router: Router, private activatedRoute: ActivatedRoute, public billingEmployeeService: BillingEmployeeService,
    private localStorageService: LocalStorageService, private authService: AuthService) {
    this.language = this.localStorageService.getLanguage();
    this.activatedRoute.params.subscribe(params => {
      this.idBillingSession = params[SharedConstant.ID_LOWERCASE] || NumberConstant.ZERO;
      this.isEnabled = params[SharedConstant.IS_ENABLED] === SharedConstant.TRUE;
    });
  }

  getBillingSession(id) {
    this.billingSessionService.getBillingSessionDetailsById(id)
      .subscribe(data => {
        this.billingSession = data;
        this.isClosed = this.billingSession.State === BillingSessionState.Closed;
        this.billingSession.Month = new Date(this.billingSession.Month);
        this.billingSession.BillingEmployee = this.billingSession.BillingEmployee;
        this.getTimeSheets(this.billingSession.Id);
      });

  }

  ngOnInit() {
    this.hasShorOrUpdateInvoicePermission = this.authService.hasAuthorities([
      PermissionConstant.CommercialPermissions.SHOW_INVOICE_SALES, PermissionConstant.CommercialPermissions.UPDATE_INVOICE_SALES]);
    if (this.idBillingSession) {
      this.getBillingSession(this.idBillingSession);
    }
    if (this.billingSession === undefined || this.billingSession === null) {
      this.router.navigate([BillingSessionConstant.BILLING_SESSION_List]);
    }
  }

  public getTimeSheets(id: number) {
    this.billingSessionService.getTimeSheetDetailsByEmployee(id).subscribe(data => {
      if (data) {
        this.dataGrid = data;
        data.forEach(element => {
          this.billingEmployee = this.billingEmployee.concat(element.BillingEmployee);
        });
        this.billingSession.BillingEmployee = this.billingEmployee;
      }
    });
  }

  public updateBillingSession() {
    this.billingSession.State = BillingSessionState.Bills;
    this.billingSessionService.save(this.billingSession, this.isUpdateMode).subscribe((result) => {
      if (this.billingSession.BillingEmployee.filter(x => x.IsChecked).length > NumberConstant.ZERO) {
        this.router.navigateByUrl(BillingSessionConstant.DOCUMENT_GENERATED.concat(this.billingSession.Id.toString(),
        SharedConstant.SLASH, String(this.isEnabled)), { skipLocationChange: true });
      } else {
        this.unselectedProjectErrorMessage = true;
      }
    });
  }

  public goNext() {
    if ((!this.isEnabled && this.billingSession.State === BillingSessionState.Bills) ||
      this.billingSession.State === BillingSessionState.Closed) {
      this.router.navigateByUrl(BillingSessionConstant.DOCUMENT_GENERATED.concat(this.billingSession.Id.toString(),
        SharedConstant.SLASH, String(this.isEnabled)), { skipLocationChange: true });
    } else {
      this.unselectedProjectErrorMessage = false;
      if (this.billingSession.BillingEmployee.filter(x => x.IsChecked).length > NumberConstant.ZERO) {
        this.updateBillingSession();
      } else {
        this.unselectedProjectErrorMessage = true;
      }
    }
  }

  public selectProject(dataItem: BillingEmployee) {
    if (!dataItem.IdDocumentNavigation || dataItem.IdDocumentNavigation.IdDocumentStatus === this.statusCodeDocument.Provisional) {
      dataItem.IsChecked = !dataItem.IsChecked;
    } else {
      this.growlService.warningNotification(this.translate.instant(BillingSessionConstant.VALIDATED_INVOICE_ASSOCIATED_TO_PROJECT));
    }
  }

  public atLeatOneTimesheetIsValidated(): boolean {
    for (let i = NumberConstant.ZERO; i < this.dataGrid.length; i++) {
      if (this.dataGrid[i].TimeSheetStatus === this.statusCode.Validated) {
        return true;
      }
    }
    return false;
  }

  public onPreviousClik(): void {
    this.router.navigateByUrl(PREVIOUS_URL.concat(this.idBillingSession.toString(), SharedConstant.SLASH, String(this.isEnabled)),
      { skipLocationChange: true });
  }

  public onInvoiceClik(id: number, idDocumentStatus): void {
    window.open(DocumentConstant.SALES_INVOICE_EDIT_URL + id.toString() + SharedConstant.SLASH + idDocumentStatus.toString());
  }
}
