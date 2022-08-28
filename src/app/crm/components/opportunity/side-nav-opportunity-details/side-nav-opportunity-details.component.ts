import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {OpportunityConstant} from '../../../../constant/crm/opportunityConstant';
import {SideNavService} from '../../../services/sid-nav/side-nav.service';
import {ContactConstants} from '../../../../constant/crm/contact.constant';
import {AccountsConstant} from '../../../../constant/accounting/account.constant';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {TranslateService} from '@ngx-translate/core';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {OpportunityDetailsComponent} from '../opportunity-details/opportunity-details.component';
import {DetailContactCrmComponent} from '../../contact-crm/detail-contact-crm/detail-contact-crm.component';
import {OrganisationDetailsComponent} from '../../organisation/organisation-details/organisation-details.component';

@Component({
  selector: 'app-side-nav-opportunity-details',
  templateUrl: './side-nav-opportunity-details.component.html',
  styleUrls: ['./side-nav-opportunity-details.component.scss']
})
export class SideNavOpportunityDetailsComponent implements OnInit, OnChanges {
  classDisplay = OpportunityConstant.HIDDEN_COLLAPSES;
  subscription: Subscription;
  opportunityDetailsData;
  showOrganisationDetails = false;
  showContactDetails = false;
  idOrganisationEvent;
  contactEvent;
  contactEnventFromOrganisation;
  contactSelectedId;
  largeSidNav = false;
  prospectType;
  @Output() componentUpdated = new EventEmitter<void>();
  @Output() closeSidNav = new EventEmitter<void>();
  @Input() data;
  @Input() isArchivingMode = false;
  @Input() source: string;
  @Output() sideNavUpdateMode = new EventEmitter<boolean>();
  private contactDetailsIsInUpdateMode = false;
  private opportunityDetailsIsInUpdateMode = false;
  @ViewChild('componentHolder', {read: ViewContainerRef}) componentHolder: ViewContainerRef;
  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef;

  constructor(private sideNavService: SideNavService, private translate: TranslateService, private swalWarring: SwalWarring,
              @Inject(ViewContainerRef) private viewContainerRef, @Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver;
  }

  ngOnInit() {
    this.initDetailComponent();
    this.dropCurrentComponent();
    this.rootViewContainer = this.componentHolder;
    this.addOpportunityDynamicComponent();
  }

  initDetailComponent() {
    this.sideNavService.getResult().subscribe(data => {
      if (!data) {
        this.hideDisplay();
      }
    });
    this.sideNavService.getreturnEventFromContactOpportunity().subscribe(data => {
      this.showContactDetails = false;
      this.showOrganisationDetails = true;
      this.dropCurrentComponent();
      this.rootViewContainer = this.componentHolder;
      this.addOpportunityDynamicComponent();

    });
    this.listenIfContactInOrgFromOppDetailsIsInUpdateMode();
  }

  listenIfContactInOrgFromOppDetailsIsInUpdateMode() {
    this.sideNavService.isContactInOrgFromOppInUpdateMode().subscribe((result) => {
      if (result && result.isUpdate && result.isUpdate === true) {
        this.contactDetailsIsInUpdateMode = true;
      } else {
        this.contactDetailsIsInUpdateMode = false;
      }

    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.data.currentValue.data) {
      if (this.data.value === true && this.data.data) {
        if (this.opportunityDetailsIsInUpdateMode === true ||
          (this.contactDetailsIsInUpdateMode === true && this.showOrganisationDetails === false) ||
          (this.contactDetailsIsInUpdateMode === true && this.showOrganisationDetails === true)
        ) {
          this.openModalToConfirmOpeningOtherData();
        } else {
          this.showContactDetails = false;
          this.showOrganisationDetails = false;
          this.opportunityDetailsData = this.data.data;
          this.dropCurrentComponent();
          this.rootViewContainer = this.componentHolder;
          this.addOpportunityDynamicComponent();
          this.classDisplay = 'hidden collapse show';
        }
      } else {
        this.classDisplay = 'hidden collapse';
      }
    }
  }

  hideDisplay(): void {
    if (this.showContactDetails === true) {
      if (this.contactDetailsIsInUpdateMode === true) {
        this.openModalToConfirmReturningToOpportunity();
      } else if (this.contactDetailsIsInUpdateMode === false) {
        this.dropCurrentComponent();
        this.addOpportunityDynamicComponent();
        this.showContactDetails = false;
      }
    } else if (this.showOrganisationDetails) {
      this.dropCurrentComponent();
      this.addOpportunityDynamicComponent();
      this.showOrganisationDetails = false;
    } else {
      if (this.opportunityDetailsIsInUpdateMode === true) {
        this.openModalToConfirmClosingSidNav();
      } else if (this.opportunityDetailsIsInUpdateMode === false) {
        this.closeSidNav.emit();
      }
    }
  }

  showOrganisation(event?: any) {
    this.showOrganisationDetails = true;
    this.showContactDetails = false;
    this.prospectType = event.isProspect;
    if (event) {
      this.idOrganisationEvent = event.data;
      this.dropCurrentComponent();
      this.rootViewContainer = this.componentHolder;
      this.addOrganisationDynamicComponent();
    }
  }

  showContact(event) {
    if (event) {
      this.showOrganisationDetails = false;
      this.showContactDetails = true;

      if (event.parent === ContactConstants.ORGANISATION) {
        this.contactEvent = undefined;
        this.contactSelectedId = event.data.id;
      } else {
        this.contactEvent = event;
      }
      this.dropCurrentComponent();
      this.rootViewContainer = this.componentHolder;
      this.addContactDynamicComponent();
    }
  }

  showContactFromOrganization(event) {
    if (event) {
      this.showOrganisationDetails = false;
      this.showContactDetails = true;
      this.contactEnventFromOrganisation = {value: true, data: event.data, parent: OpportunityConstant.ORGANISATION};
      this.dropCurrentComponent();
      this.rootViewContainer = this.componentHolder;
      this.addContactDynamicComponent();
    }
  }

  backTorRelatedContactDetails(event) {
    if (event) {
      this.showOrganisationDetails = false;
      if (this.contactDetailsIsInUpdateMode === true) {
        this.openModalToConfirmReturningToOpportunity();
      } else if (this.contactDetailsIsInUpdateMode === false) {
        this.showContactDetails = false;
        this.dropCurrentComponent();
        this.rootViewContainer = this.componentHolder;
        this.addOpportunityDynamicComponent();
      }
    }
  }

  resizeSidNav(value) {
    this.largeSidNav = value;
  }

  passeRelatedContactToUpdateMode(event) {
    if (event && event.isUpdate === true) {
      this.contactDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.contactDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.contactDetailsIsInUpdateMode);
  }

  passeOpportunityToUpdateMode(event) {
    if (event && event.isUpdate === true) {
      this.opportunityDetailsIsInUpdateMode = true;
    } else if (event && event.isUpdate === false) {
      this.opportunityDetailsIsInUpdateMode = false;
    }
    this.sideNavUpdateMode.emit(this.opportunityDetailsIsInUpdateMode);
  }


  openModalToConfirmReturningToOpportunity() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        if (this.showContactDetails === true) {
          this.showContactDetails = false;
        } else if (this.showOrganisationDetails === true) {
          this.showOrganisationDetails = false;
        }
        this.contactDetailsIsInUpdateMode = false;
      }
    });
  }


  openModalToConfirmClosingSidNav() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.closeSidNav.emit();
        this.opportunityDetailsIsInUpdateMode = false;
        this.contactDetailsIsInUpdateMode = false;
      }
    });
  }

  openModalToConfirmOpeningOtherData() {
    const swalWarningMessage = `${this.translate.instant(AccountsConstant.CURRENT_OPERATION_HAS_NOT_BEEN_COMPLETED_YET)}`;
    this.swalWarring.CreateSwal(swalWarningMessage, AccountsConstant.ARE_YOU_SURE_TO_LEAVE_THE_OPERATION_WITHOUT_BEING_COMPLETED,
      SharedConstant.YES, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.showContactDetails = false;
        this.showOrganisationDetails = false;
        this.opportunityDetailsData = this.data.data;
        this.classDisplay = 'hidden collapse show';
        this.opportunityDetailsIsInUpdateMode = false;
        this.contactDetailsIsInUpdateMode = false;
        this.dropCurrentComponent();
        this.rootViewContainer = this.componentHolder;
        this.addOpportunityDynamicComponent();
      }
    });
  }

  addOpportunityDynamicComponent() {
    const factory = this.factoryResolver.resolveComponentFactory(OpportunityDetailsComponent);
    const instance = this.rootViewContainer.createComponent(factory).instance;
    instance.detailsData = this.opportunityDetailsData;
    instance.componentIsUpdade.subscribe(() => {
      this.componentUpdated.emit();
    });
    instance.showDetailOrganisationEvent.subscribe(event => this.showOrganisation(event));
    instance.passeToUpdateMode.subscribe(event => this.passeOpportunityToUpdateMode(event));
    instance.showDetailContactEvent.subscribe(event => this.showContact(event));
    instance.isArchivingMode = this.isArchivingMode;
  }

  addOrganisationDynamicComponent() {
    const factory = this.factoryResolver.resolveComponentFactory(OrganisationDetailsComponent);
    const instance = this.rootViewContainer.createComponent(factory).instance;
    instance.idOrganisationEvent = this.idOrganisationEvent;
    instance.isProspectType = this.prospectType;
    instance.idOrganisationEvent = this.idOrganisationEvent;
    instance.backToOpportinutyEvent.subscribe((event) => {
      this.backTorRelatedContactDetails(event);
    });
    instance.showDetailContactEvent.subscribe((event) => {
      this.showContactFromOrganization(event);
    });
    instance.isArchivingMode = this.isArchivingMode;
  }

  addContactDynamicComponent() {
    const factory = this.factoryResolver.resolveComponentFactory(DetailContactCrmComponent);
    const instance = this.rootViewContainer.createComponent(factory).instance;
    instance.isArchivingMode = this.isArchivingMode;
    instance.backToOpportunityEvent.subscribe(event => this.backTorRelatedContactDetails(event));
  }

  dropCurrentComponent() {
    if (this.rootViewContainer) {
      const factory = this.factoryResolver
        .resolveComponentFactory(OpportunityDetailsComponent);
      this.rootViewContainer.clear();
    }
  }
  sidenavWidthStyle() {
    const sidNav = document.getElementsByClassName('sidebar-lg-show');
    const asideNav = document.getElementsByClassName(' aside-menu-lg-show');
    const marginLeft = sidNav.length === 0 ? '5px' : '200px';
    const marginRight = asideNav.length === 0 ? '0px' : '235px';
    return {'overflow-y': ' unset', 'margin-left': marginLeft, 'margin-right': marginRight};
  }
}
