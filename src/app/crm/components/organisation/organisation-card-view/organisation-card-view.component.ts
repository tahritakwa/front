import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef} from '@angular/core';
import {DataSourceRequestState} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {OrganisationService} from '../../../services/organisation/organisation.service';
import {TranslateService} from '@ngx-translate/core';
import {TiersConstants} from '../../../../constant/purchase/tiers.constant';
import {PredicateFormat} from '../../../../shared/utils/predicate';
import {TiersService} from '../../../../purchase/services/tiers/tiers.service';
import {DataStateChangeEvent} from '@progress/kendo-angular-grid';
import {PopupSendMailComponent} from '../../../../mailing/components/template-email/popup-send-mail/popup-send-mail.component';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {Router} from '@angular/router';
import {OrganisationConstant} from '../../../../constant/crm/organisation.constant';
import {PermissionConstant} from '../../../../Structure/permission-constant';
import {AuthService} from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-organisation-card-view',
  templateUrl: './organisation-card-view.component.html',
  styleUrls: ['./organisation-card-view.component.scss']
})
export class OrganisationCardViewComponent implements OnChanges {
  @Input() organisationFiltred;
  @Input() organisationType;
  @Input() prospectType;
  @Output() organisationFromCard = new EventEmitter<any>();
  @Output() sendOrganisationToDelete = new EventEmitter<any>();
  @Output() sendOrganisationToArchive = new EventEmitter<any>();
  @Output() sendOrganisationToRestore = new EventEmitter<any>();
  @Output() pageChangeEvent = new EventEmitter<any>();
  @Output() stateChangeEvent = new EventEmitter<any>();
  @Input() isArchivingMode;
  private predicate: PredicateFormat;
  private currentPage: number = NumberConstant.ONE;
  pagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  dataToSendToPoPUp: any;
  public gridState: DataSourceRequestState = {
    skip: (this.currentPage * NumberConstant.TEN) - NumberConstant.TEN,
    take: NumberConstant.TEN,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState
  };
  public showed = false;
  public CRMPermissions = PermissionConstant.CRMPermissions;

  /**
   * @param organisationService
   * @param tiersService
   * @param translateService
   */
  constructor(private organisationService: OrganisationService,
              private tiersService: TiersService,
              private translateService: TranslateService,
              private router: Router,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              public authService: AuthService) {
    this.predicate = PredicateFormat.prepareTiersPredicateWithContacts(TiersConstants.CUSTOMER_TYPE);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.organisationFiltred !== undefined) {
      this.gridSettings = simpleChanges.organisationFiltred.currentValue;
      this.showed = true;
    }
  }

  goToDetails(organisation) {
    if(!this.isArchivingMode) {
      this.router.navigateByUrl(OrganisationConstant.ORGANISATION_DETAILS_URL
        .concat(String(organisation.id)).concat('/' + this.prospectType), {skipLocationChange: true});
    }
  }

  deleteOrganisation(organisation, e) {
    e.stopPropagation();
    this.sendOrganisationToDelete.emit(organisation);
  }

  archiveOrganisation(organisation, e) {
    e.stopPropagation();
    this.sendOrganisationToArchive.emit(organisation);
  }

  restoreOrganisation(organisation, e) {
    e.stopPropagation();
    this.sendOrganisationToRestore.emit(organisation);
  }



  onPageChange(currentpage) {
    this.currentPage = currentpage;
    this.onPageChangeFiltredOrganisations();
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
    this.stateChangeEvent.emit(state);
  }

  private onPageChangeFiltredOrganisations() {
    this.pageChangeEvent.emit(this.currentPage);
  }
}
