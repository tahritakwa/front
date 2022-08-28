import { AfterViewChecked, Component, HostListener, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CounterSalesConstant } from '../../../constant/sales/counter-sales.constant';
import { DocumentConstant } from '../../../constant/sales/document.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { LocalStorageService } from '../../../login/Authentification/services/local-storage-service';
import { DocumentEnumerator, documentStatusCode } from '../../../models/enumerators/document.enum';
import { SessionCash } from '../../../models/payment/session-cash.model';
import { Document } from '../../../models/sales/document.model';
import { Ticket } from '../../../models/treasury/ticket.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Filter, Operation, Relation } from '../../../shared/utils/predicate';
import { SessionCashService } from '../../../treasury/services/session-cash/session-cash.service';
import { TicketService } from '../../../treasury/services/ticket/ticket.service';
import { DocumentService } from '../../services/document/document.service';
import { SearchItemService } from '../../services/search-item/search-item.service';
import { CounterSalesDetailsComponent } from '../counter-sales-details/counter-sales-details.component';
import swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { CashRegisterConstant } from '../../../constant/treasury/cash-register.constant';
import { CashRegisterTicketComponent } from '../../../treasury/cash-management/cash-registers/cash-register-ticket/cash-register-ticket.component';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CloseCashRegisterSessionComponent } from '../../../treasury/cash-management/cash-registers/close-cash-register-session/close-cash-register-session.component';
import { OpenCashRegisterSessionComponent } from '../../../treasury/cash-management/cash-registers/open-cash-register-session/open-cash-register-session.component';
import { PredicateFormat } from '../../../shared/utils/predicate';
@Component({
  selector: 'app-counter-sales',
  templateUrl: './counter-sales.component.html',
  styleUrls: ['./counter-sales.component.scss']
})
export class CounterSalesComponent implements OnInit, AfterViewChecked {

  @ViewChild('VC_LI', { read: ViewContainerRef }) viewContainerOfLi: ViewContainerRef;
  @ViewChild('li_Template', { read: TemplateRef }) templateOfLi: TemplateRef<null>;
  @ViewChild('VC_Tab', { read: ViewContainerRef }) viewContainerOfTab: ViewContainerRef;
  @ViewChild('Tab_Template', { read: TemplateRef }) templateOfTab: TemplateRef<null>;
  @ViewChildren('counterDetails') counterDetails: QueryList<CounterSalesDetailsComponent>;
  // Properties
  counter = 1;
  public canCancelSale: boolean;
  public sessionCash: SessionCash;
  public idWarehouse: number;
  public show = false;
  public dateFormat = this.translate.instant("DATE_AND_TIME_FORMAT");
  public haseCloseSessionCashPermission: boolean;
  public idTicket: number;
  public id: number;
  public idDocument: number;
  public predicate = new PredicateFormat();
  public editMode = true;




  constructor(private swalWarrings: SwalWarring, private translate: TranslateService,
    private documentService: DocumentService, private searchItemService: SearchItemService,
    private sessionCashService: SessionCashService, private localStorageService: LocalStorageService,
    private router: Router, private modalDialogService: FormModalDialogService, private viewContainerRef: ViewContainerRef,
    private authService: AuthService, private route: ActivatedRoute) {
    const url = this.router.url.split(SharedConstant.SLASH);
    const idDoc = url[NumberConstant.FIVE] === "idDocument";
    if (idDoc) {
      this.route.params.subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.idDocument = id;
          this.editMode = false;
        }
      });
    } else {
      this.route.params.subscribe(params => {
        const id = +params['id'];
        if (id) {
          this.idTicket = id;
          this.editMode =false;
        }
      });
    }
      
     }
    @HostListener('document:keydown.shift.H', ['$event']) 
     onKeydownShiftHHandler(event: KeyboardEvent) {
       this.seeHistory()
   }

  ngOnInit() {
    this.haseCloseSessionCashPermission = this.authService.hasAuthority(PermissionConstant.TreasuryPermissions.CLOSE_SESSION_CASH);
    if (this.idTicket ) {
     this.getSessionByIdTicket();
    } else if (this.idDocument) {
      this.getSessionByIdDocument() ; 
    } else {
      this.getOpenedSessionByUser();
    }
      
  }

  getOpenedSessionByUser(){
    this.sessionCashService.getUserOpenedSession(this.localStorageService.getEmail()).subscribe(data => {
      if (data.objectData) {
        this.sessionCash = data.objectData;
        this.idWarehouse = this.sessionCash.IdCashRegisterNavigation.IdWarehouse;
        this.show = this.sessionCash != undefined ? true : false;
      } else {
        let message: string = this.translate.instant(
          CounterSalesConstant.CANNOT_FIND_SESSION
        );

        swal.fire({
          icon: SharedConstant.ERROR,
          html: message,
          onClose: () => this.exit()
        });
      }
    });
  }

  getSessionByIdTicket() {
    this.sessionCashService.getSessionDetailsById(this.idTicket,NumberConstant.ZERO).subscribe(data => {
      if (data.objectData) {
        this.sessionCash = data.objectData;
        this.idWarehouse = this.sessionCash.IdCashRegisterNavigation.IdWarehouse;
        this.show = this.sessionCash != undefined ? true : false;
      }
    });
  }

  getSessionByIdDocument() {
    this.sessionCashService.getSessionDetailsById(NumberConstant.ZERO,this.idDocument).subscribe(data=> {
      if (data.objectData) {
        this.sessionCash = data.objectData;
        this.idWarehouse = this.sessionCash.IdCashRegisterNavigation.IdWarehouse;
        this.show = this.sessionCash != undefined ? true : false;
      }
    });
  }


  exit(data?: any) {
    if (!data) {
      this.router.navigate(['/main/dashboard']);
    } else if (data && data.exit) {
      const swalWarningMessage = `${this.translate.instant(CashRegisterConstant.OPEN_AUTOMTIC_SESSION_CASH)}`;
      const title = `${this.translate.instant(CashRegisterConstant.OPEN_CASH_REGISTER)}`;
      this.swalWarrings.CreateSwal(swalWarningMessage, title, SharedConstant.YES, SharedConstant.NO).then((result) => {
        if (result.value) {
          this.openCashSession();
        }
        else {
          this.ngOnInit();
        }
      })
    }
  }

  openCashSession() {
    this.modalDialogService.openDialog(CashRegisterConstant.OPEN_CASH_REGISTER, OpenCashRegisterSessionComponent,
      this.viewContainerRef, this.ngOnInit.bind(this), this.sessionCash, false, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  cloneNewTabTemplate($event) {
    // Add New Li
    const componentRefLi = this.viewContainerOfLi.createEmbeddedView(this.templateOfLi,
      { option: { index: {}, data: {} } });
    componentRefLi.context.option.index = this.counter;

    // Add New Nav
    const componentRefTab = this.viewContainerOfTab.createEmbeddedView(this.templateOfTab,
      { option: { index: {}, data: {}, viewReference: {}, liAssociatedReference: {} } });
    // set the input of the new component by passing data in options
    componentRefTab.context.option.viewReference = componentRefTab;
    componentRefTab.context.option.liAssociatedReference = componentRefLi;
    componentRefTab.context.option.index = this.counter;

    if ($event > NumberConstant.ZERO) {
      document.getElementById('vente'.concat($event.toString()).concat("-li")).className = 'nav-link nav-link-new';
      document.getElementById('vente'.concat($event.toString())).className = 'tab-pane fade px-2';
    }
    // Increment Counter
    this.counter++;
  }

  RemoveTabFromContainer($event) {
    // remove the view
    if ($event) {
      // find the index of the view from a reference
      const positionTab = this.viewContainerOfTab.indexOf($event.viewReference);
      // remove the Tab from container
      this.viewContainerOfTab.remove(positionTab);
      // find the index of the Li from a reference
      const positionLi = this.viewContainerOfLi.indexOf($event.liAssociatedReference);
      // remove the Li from container
      this.viewContainerOfLi.remove(positionLi);
      // Make the prev/next element selected
      let pos = positionTab == NumberConstant.ZERO ? positionTab + NumberConstant.ONE : positionTab - NumberConstant.ONE;
      const elementLi = document.getElementById('tabListSales');
      const nav = elementLi.getElementsByTagName('a')[pos];
      if (nav != undefined) {
        elementLi.getElementsByTagName('a')[pos].className = 'nav-link nav-link-new active';
        let href = elementLi.getElementsByTagName('a')[pos].href;
        let id = href.substr(href.indexOf('#') + NumberConstant.ONE);
        const elementTab = document.getElementById(id);
        elementTab.className = 'tab-pane fade px-2 show active';
      } else {
        this.cloneNewTabTemplate(NumberConstant.ZERO);
      }
    }

  }

  // Delete all provisional Bl if the user navigate to another interface
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    let idBlProvisional = []
    if (this.searchItemService && this.searchItemService.idDocument) {
      this.searchItemService.idDocument = undefined;
    }
    if (this.searchItemService && this.searchItemService.idSupplier) {
      this.searchItemService.idSupplier = undefined;
    }
    if (this.searchItemService && !this.searchItemService.disableFields) {
      this.searchItemService.disableFields = true;
    }
    this.counterDetails.forEach(counterDetail => {
      if (counterDetail.documentForm.controls.IdDocumentStatus.value == documentStatusCode.Provisional && counterDetail.documentForm.controls.Id.value > NumberConstant.ZERO) {
        idBlProvisional.push(counterDetail.documentForm.controls.Id.value);
      }
    });
    if (idBlProvisional.length == NumberConstant.ZERO) {
      return true;
    }
    return new Promise(resolve => {
      let canDeactivate = false;
      const swalWarningMessage = `${this.translate.instant(SharedConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}` +
        ` ${this.translate.instant(CounterSalesConstant.PROVISONAL_DELIVERY_FORMS_WILL_BE_REMOVED)}`;
      this.swalWarrings.CreateSwal(swalWarningMessage, SharedConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
        SharedConstant.YES, SharedConstant.NO).then((result) => {
          if (result.value) {
            this.documentService.removeDocuments(idBlProvisional).subscribe(() => {
              canDeactivate = true;
              this.searchItemService.idDocument = undefined;
              resolve(canDeactivate);
            })
          } else {
            resolve(canDeactivate);
          }

        });
    });
  }
  ngAfterViewChecked(): void {
    this.canCancelSale = this.counterDetails.length == NumberConstant.ONE ? false : true;
    if (this.show && this.counterDetails.length == NumberConstant.ZERO) {
      this.cloneNewTabTemplate(NumberConstant.ZERO);
    }
  }
  selectNewTab($event) {
    document.getElementById('vente'.concat($event.toString()).concat("-li")).className = 'nav-link nav-link-new active';
    document.getElementById('vente'.concat($event.toString())).className = 'tab-pane fade px-2 show active';
  }

  seeHistory() {
    const data = {};
    data['openedSession'] = this.sessionCash;
    this.modalDialogService.openDialog(null, CashRegisterTicketComponent,
      this.viewContainerRef, null, data, false, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  closeSessionCash() {
    const data = {};
    data['openedSession'] = this.sessionCash;
    this.modalDialogService.openDialog(CashRegisterConstant.CLOSE_CASH_REGISTER, CloseCashRegisterSessionComponent,
      this.viewContainerRef, this.exit.bind(this), data, true, SharedConstant.MODAL_DIALOG_SIZE_M);

  }
}
