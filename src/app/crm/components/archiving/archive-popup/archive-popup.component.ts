import {Component, ComponentRef, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {of} from 'rxjs/observable/of';
import {Observable} from 'rxjs/Observable';
import {CheckableSettings, TreeItemLookup} from '@progress/kendo-angular-treeview';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {ModalDialogInstanceService} from 'ngx-modal-dialog/src/modal-dialog-instance.service';
import {ContactCrmService} from '../../../services/contactCrmService/contact-crm.service';
import {SharedCrmConstant} from '../../../../constant/crm/sharedCrm.constant';
import {OpportunityService} from '../../../services/opportunity.service';

@Component({
  selector: 'app-archive-popup',
  templateUrl: './archive-popup.component.html',
  styleUrls: ['./archive-popup.component.scss']
})
export class ArchivePopupComponent implements OnInit, IModalDialog {

  public isArchiving: boolean;
  public archiveDependency;
  public textHeader: string;
  public source: string;
  public sourceId: number;
  public optionDialog: Partial<IModalDialogOptions<any>>;

  public checkedKeys = ['0'];

  public enableCheck = true;
  public checkChildren = true;
  public checkParents = true;
  public checkMode: any = 'multiple';
  public showTree: boolean;

  public contactItem: any;
  public opportunityItem: any;
  public claimItem: any;
  public actionItem: any;

  public get checkableSettings(): CheckableSettings {
    return {
      checkChildren: this.checkChildren,
      checkParents: this.checkParents,
      enabled: this.enableCheck,
      mode: this.checkMode,
    };
  }

  public data: any[];

  public children = (dataItem: any): Observable<any[]> => of(dataItem.items);
  public hasChildren = (dataItem: any): boolean => !!dataItem.items;

  constructor(private translateService: TranslateService,
              private growlService: GrowlService,
              private modalService: ModalDialogInstanceService,
              private organisationService: OrganisationService,
              private contactCrmService: ContactCrmService,
              private oppService: OpportunityService) {
  }

  ngOnInit() {
    const item = [];
    const prefix = '0_';
    let key = 0;
    if (this.archiveDependency.contactDependencyCount > NumberConstant.ZERO) {
      this.contactItem = {
        id: prefix + key,
        type: CrmConstant.CONTACT,
        text: this.getContactText()
      };
      item.push(this.contactItem);
      this.showTree = true;
      key = key + 1;
    }
    if (this.archiveDependency.opportunityDependencyCount > NumberConstant.ZERO) {
      this.opportunityItem = {
        id: prefix + key,
        type: CrmConstant.OPPORTUNITY,
        text: this.getOpportunityText()
      };
      item.push(this.opportunityItem);
      this.showTree = true;
      key = key + 1;
    }
    if (this.archiveDependency.claimDependencyCount > NumberConstant.ZERO) {
      this.claimItem = {
        id: prefix + key,
        type: CrmConstant.CLAIM,
        text: this.getClaimText()
      };
      item.push(this.claimItem);
      this.showTree = true;
      key = key + 1;
    }
    if (this.archiveDependency.actionDependencyCount > NumberConstant.ZERO) {
      this.actionItem = {
        id: prefix + key,
        type: CrmConstant.ACTION,
        text: this.getActionText()
      };
      item.push(this.actionItem);
      this.showTree = true;
    }
    this.data = [{text: this.translateService.instant(CrmConstant.ARCHIVE_ALL), items: item}];
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.optionDialog = options;
    this.isArchiving = this.optionDialog.data.isArchiving;
    this.archiveDependency = this.optionDialog.data.archiveDependency;
    this.source = this.optionDialog.data.source;
    this.sourceId = this.optionDialog.data.sourceId;
    this.textHeader = this.optionDialog.data.textHeader;
  }

  getContactText() {
    return `${this.isArchiving ? this.translateService.instant(CrmConstant.ARCHIVE_DEPENDENCY_CONTACT) :
      this.translateService.instant(CrmConstant.RESTORE_DEPENDENCY_CONTACT)} (${this.archiveDependency.contactDependencyCount})`;
  }

  getOpportunityText() {
    return `${this.isArchiving ? this.translateService.instant(CrmConstant.ARCHIVE_DEPENDENCY_OPPORTUNITY) :
      this.translateService.instant(CrmConstant.RESTORE_DEPENDENCY_OPPORTUNITY)} (${this.archiveDependency.opportunityDependencyCount})`;
  }

  getClaimText() {
    return `${this.isArchiving ? this.translateService.instant(CrmConstant.ARCHIVE_DEPENDENCY_CLAIM) :
      this.translateService.instant(CrmConstant.RESTORE_DEPENDENCY_CLAIM)} (${this.archiveDependency.claimDependencyCount})`;
  }

  getActionText() {
    return `${this.isArchiving ? this.translateService.instant(CrmConstant.ARCHIVE_DEPENDENCY_ACTION) :
      this.translateService.instant(CrmConstant.RESTORE_DEPENDENCY_ACTION)} (${this.archiveDependency.actionDependencyCount})`;
  }

  public restoreSelected() {
    const withContactDependency = this.archiveDependency.contactDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.contactItem.id) > -1;
    const withOpportunityDependency = this.archiveDependency.opportunityDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.opportunityItem.id) > -1;
    const withClaimDependency = this.archiveDependency.claimDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.claimItem.id) > -1;
    const withActionDependency = this.archiveDependency.actionDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.actionItem.id) > -1;
    switch (this.source) {
      case CrmConstant.CONTACT :
        this.restoreContact(withOpportunityDependency, withClaimDependency, withActionDependency);
        break;
      case CrmConstant.OPPORTUNITY:
        this.restoreOpportynity(withClaimDependency, withActionDependency);
        break;
      case CrmConstant.ORGANISATION :
        this.restoreOrganisation(withContactDependency, withOpportunityDependency, withClaimDependency, withActionDependency);
        break;
      default:
        return;
    }
  }

  restoreOrganisation(withContactDependency, withOpportunityDependency, withClaimDependency, withActionDependency) {
    this.organisationService.getJavaGenericService()
      .getEntityById(this.sourceId,
        `${OrganisationConstant.RESTORE_URL}/${withContactDependency}/${withOpportunityDependency}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(() => {
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.SUCCESS_OPERATION));
      }, () => {
      }, () => {
        this.closePopup();
      });
  }

  restoreContact(withOpportunityDependency, withClaimDependency, withActionDependency) {
    this.contactCrmService.getJavaGenericService()
      .getEntityById(this.sourceId,
        `${OrganisationConstant.RESTORE_URL}/${withOpportunityDependency}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(() => {
      }, () => {
      }, () => {
        this.closePopup();
      });
  }

  restoreOpportynity(withClaimDependency, withActionDependency) {
    this.oppService.getJavaGenericService()
      .getEntityById(this.sourceId, `${SharedCrmConstant.RESTORE_URL}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(() => {
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.SUCCESS_OPERATION));
      }, () => {
      }, () => {
        this.closePopup();
      });
  }

  public archiveSelected() {
    const withContactDependency = this.archiveDependency.contactDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.contactItem.id) > -1;
    const withOpportunityDependency = this.archiveDependency.opportunityDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.opportunityItem.id) > -1;
    const withClaimDependency = this.archiveDependency.claimDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.claimItem.id) > -1;
    const withActionDependency = this.archiveDependency.actionDependencyCount === NumberConstant.ZERO ? false
      : this.checkedKeys.indexOf(this.actionItem.id) > -1;

    switch (this.source) {
      case CrmConstant.CONTACT :
        this.archiveContact(withOpportunityDependency, withClaimDependency, withActionDependency);
        break;
      case CrmConstant.OPPORTUNITY:
        this.archiveOpportunity(withClaimDependency, withActionDependency);
        break;
      case CrmConstant.ORGANISATION :
        this.archiveOrganisation(withContactDependency, withOpportunityDependency, withClaimDependency, withActionDependency);
        break;
      default:
        return;
    }
  }

  archiveOrganisation(withContactDependency, withOpportunityDependency, withClaimDependency, withActionDependency) {
    let value;
    this.organisationService.getJavaGenericService()
      .deleteEntity(this.sourceId, `archive/${withContactDependency}/${withOpportunityDependency}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(data => {
        value = data;
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.SUCCESS_OPERATION));
      }, (error => {
      }), () => {
        if (value === true) {
          this.closePopup();
        }
      });
  }

  archiveContact(withOpportunityDependency, withClaimDependency, withActionDependency) {
    let value;
    this.contactCrmService.getJavaGenericService()
      .deleteEntity(this.sourceId, `archive/${withOpportunityDependency}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(data => {
        value = data;
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.SUCCESS_OPERATION));
      }, (error => {
      }), () => {
        if (value === true) {
          this.closePopup();
        }
      });
  }

  archiveOpportunity(withClaimDependency, withActionDependency) {
    let value;
    this.oppService.getJavaGenericService()
      .deleteEntity(this.sourceId, `${SharedCrmConstant.ARCHIVE_URL}/${withClaimDependency}/${withActionDependency}`)
      .subscribe(data => {
        value = data;
        this.growlService.successNotification(this.translateService.instant(SharedCrmConstant.SUCCESS_OPERATION));
      }, (error => {
      }), () => {
        if (value === true) {
          this.closePopup();
        }
      });
  }

  public isItemChecked = (_: any, index: string) => {
    return this.checkedKeys.indexOf(index) > -1 ? 'checked' : 'none';
  };

  public handleChecking(itemLookup: TreeItemLookup): void {
    this.checkedKeys = [itemLookup.item.index];
  }

  closePopup() {
    this.optionDialog.onClose();
    this.modalService.closeAnyExistingModalDialog();
  }

  openItem(dataItem) {
    switch (dataItem.type) {
      case CrmConstant.CONTACT :
        window.open(`main/crm/contactCrm/related/${this.sourceId}/${!this.isArchiving}`, '_blank');
        break;
      case CrmConstant.OPPORTUNITY:
        if (this.source === CrmConstant.ORGANISATION) {
          window.open(`main/crm/opportunity/related/organisation/${this.sourceId}/${!this.isArchiving}`, '_blank');
        } else if (this.source === CrmConstant.CONTACT) {
          window.open(`main/crm/opportunity/related/contact/${this.sourceId}/${!this.isArchiving}`, '_blank');
        }
        break;
      case CrmConstant.CLAIM :
        switch (this.source) {
          case CrmConstant.CONTACT :
            window.open(`main/crm/claim/related/contact/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          case CrmConstant.OPPORTUNITY:
            window.open(`main/crm/claim/related/opportunity/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          case CrmConstant.ORGANISATION :
            window.open(`main/crm/claim/related/organisation/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          default:
            return;
        }
        break;
      case CrmConstant.ACTION :
        switch (this.source) {
          case CrmConstant.CONTACT :
            window.open(`main/crm/action/related/contact/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          case CrmConstant.OPPORTUNITY:
            window.open(`main/crm/action/related/opportunity/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          case CrmConstant.ORGANISATION :
            window.open(`main/crm/action/related/organisation/${this.sourceId}/${!this.isArchiving}`, '_blank');
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
  }
}
