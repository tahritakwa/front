import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {OpportunityKanbanComponent} from './components/opportunity/opportunity-kanban/opportunity-kanban.component';
import {BarRatingModule} from 'ngx-bar-rating';
import {DragulaModule} from 'ng2-dragula';
import {OpportunityService} from './services/opportunity.service';
import {PopupAddOpporttunityComponent} from './components/opportunity/popup-add-opportunity/popup-add-opportinity.component';
import {ErrorHandlerService} from '../../COM/services/error-handler-service';
import {TranslateModule} from '@ngx-translate/core';
import {TreeTableModule} from 'ng-treetable';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {BodyModule, HeaderModule, RowFilterModule} from '@progress/kendo-angular-grid';
import {AddCategoryComponent} from './components/category/add-category/add-category.component';
import {UserMultiselectComponent} from '../shared/components/user-multiselect/user-multiselect.component';
import {SortableModule} from '@progress/kendo-angular-sortable';
import {CategoryService} from './services/category/category.service';
import {RouterModule} from '@angular/router';
import {ListStatusOpportunityComponent} from './components/status-opportunity/list-status-opportunity/list-status-opportunity.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {PopupAddStatusOpportunityComponent} from './components/opportunity/add-status-opportunity/popup-add-status-opportunity.component';
import {CrmRoutingModule, routes} from './crm-routing.module';
import {ColumnResizingService} from '@progress/kendo-angular-grid/dist/es2015/column-resizing/column-resizing.service';
import {ListCategoryConfigComponent} from './components/category/list-category-config/list-category-config.component';
import {CurrencyService} from '../administration/services/currency/currency.service';
import {StatusChangeComponent} from './components/status-change/status-change.component';
import {FeedBackService} from './services/feedback/feed-back.service';
import {AddProspectComponent} from './components/contact-crm/add-prospect/add-prospect.component';
import {DetailContactCrmComponent} from './components/contact-crm/detail-contact-crm/detail-contact-crm.component';
import {LayoutModule} from '@angular/cdk/layout';
import {ContactCrmService} from './services/contactCrmService/contact-crm.service';
import {UploadFileService} from './services/contactCrmService/upload-file.service';
import {SidNavComponent} from './components/contact-crm/sid-nav/sid-nav.component';
import {OrganisationAddComponent} from './components/organisation/organisation-add/organisation-add.component';
import {OrganisationService} from './services/organisation/organisation.service';
import {OrganisationListComponent} from './components/organisation/organisation-list/organisation-list.component';
import {OrganisationDetailsComponent} from './components/organisation/organisation-details/organisation-details.component';
import {SideNavOrganisationDetailsComponent}
from './components/organisation/side-nav-organisation-details/side-nav-organisation-details.component';
import {OrganisationSideNavService} from './services/sid-nav/organisation-side-nav.service';
import {OpportunityDetailsComponent} from './components/opportunity/opportunity-details/opportunity-details.component';
import {SideNavOpportunityDetailsComponent}
from './components/opportunity/side-nav-opportunity-details/side-nav-opportunity-details.component';
import {AddNewOpportunityComponent} from './components/opportunity/add-new-opportunity/add-new-opportunity.component';
import {UpdateServiceService} from './services/update-service.service';
import {ContactListComponent} from './components/contact-crm/contact-list.component';
import {OpportunityFilterService} from './services/opportunity-filter.service';
import {SkillsService} from '../payroll/services/skills/skills.service';
import {EmployeeSkillsService} from '../payroll/services/employee-skills/employee-skills.service';
import {AddressOrganisationComponent} from './components/address-organisation/address-organisation.component';
import {AddressOrganisationDetailsComponent} from './components/address-organisation-details/address-organisation-details.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {ActionsListComponent} from './components/action/actions-list/actions-list.component';
import {SearchActionComponent} from './components/action/search-action/search-action.component';
import {CompanySkillsComponent} from '../administration/company/company-skills/company-skills.component';
import {AddActionComponent} from './components/action/add-action/add-action.component';
import {AddClaimComponent} from './components/claim/add-claim/add-claim.component';
import {ClaimCrmService} from './services/claim/claim.service';
import {ClaimsListComponent} from './components/claim/claims-list/claims-list.component';
import {DetailActionComponent} from './components/action/detail-action/detail-action.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {ScheduleModule} from 'primeng/schedule';
import {SideNavClaimComponent} from './components/claim/side-nav-claim/side-nav-claim.component';
import {DetailClaimComponent} from './components/claim/detail-claim/detail-claim.component';
import {ClaimSearchAndFilterComponent} from './components/claim/claim-search-and-filter/claim-search-and-filter.component';
import {ReminderComponent} from './components/reminder/reminder.component';
import {PopupElementComponent} from './components/calendar/popup-element/popup-element.component';
import {OrganisationCardViewComponent} from './components/organisation/organisation-card-view/organisation-card-view.component';
import {ContactCardViewComponent} from './components/contact-crm/contact-card-view/contact-card-view.component';
import {LeaveService} from '../payroll/services/leave/leave.service';
import {AppAsideModule} from '@coreui/angular';
import {ActionSidNavService} from './services/sid-nav/action-sid-nav.service';
import {FileListComponent} from './components/file/file-list.component';
import {FileAddComponent} from './components/file/file-add/file-add.component';
import {FileService} from './services/file/file.service';
import {AttachmentService} from './services/attachment/attachment.service';
import {ListNoteComponent} from './components/note/list-note/list-note.component';
import {AddNoteComponent} from './components/note/add-note/add-note.component';
import {NoteService} from './services/note/note.service';
import {TooltipModule} from '@progress/kendo-angular-tooltip';
import {OrganizationFilterComponent} from './components/organisation/organization-filter/organization-filter.component';
import {GenericCrmService} from './generic-crm.service';
import {ClaimSideNavService} from './services/sid-nav/claim-side-nav.service';
import {SideNavActionComponent} from './components/action/side-nav-action/side-nav-action.component';
import {PopupAddFileComponent} from './components/file/popup-add-file/popup-add-file.component';
import {HistoryListComponent} from './components/history/history-list/history-list.component';
import {HistoryService} from './services/history/history.service';
import {PagerCrmComponent} from './components/pager-crm/pager-crm.component';
import {PopupSendMailComponent} from '../mailing/components/template-email/popup-send-mail/popup-send-mail.component';
import {SendMailService} from '../mailing/services/send-mail/send-mail.service';
import {ActionArchivingComponent} from './components/archiving/action-archiving/action-archiving.component';
import {ContactArchivingComponent} from './components/archiving/contact-archiving/contact-archiving.component';
import {OpportunityArchivingComponent} from './components/archiving/opportunity-archiving/opportunity-archiving.component';
import {OrganisationArchivingComponent} from './components/archiving/organisation-archiving/organisation-archiving.component';
import {ClaimArchivingComponent} from './components/archiving/claim-archiving/claim-archiving.component';
import {PipelineListComponent} from './components/pipeline/pipeline-list/pipeline-list.component';
import {PipelineService} from './services/pipeline/pipeline.service';
import {SettingCategoryAndDropdownsComponent}
from './components/pipeline/setting-category-and-dropdowns/setting-category-and-dropdowns.component';
import {PermissionComponent} from './components/permission/permission.component';
import {PermissionService} from './services/permission/permission.service';
import {ArchivePopupComponent} from './components/archiving/archive-popup/archive-popup.component';
import {ActionReminderComponent} from './components/action/action-reminder/action-reminder.component';
import {ReminderEventComponent} from './components/reminder-event/reminder-event.component';
import { ActionRelatedItemsComponent } from './components/action/action-related-items/action-related-items.component';
import { ContactRelatedItemsComponent } from './components/contact-crm/contact-related-items/contact-related-items.component';
import { ClaimRelatedItemsComponent } from './components/claim/claim-related-items/claim-related-items.component';
import { OpportunityRelatedItemsComponent } from './components/opportunity/opportunity-related-items/opportunity-related-items.component';
import { OrganisationRelatedItemsComponent }
from './components/organisation/organisation-related-items/organisation-related-items.component';
import {DetailsUserCredentialsComponent}
from '../mailing/components/mailing-settings/user-mailing-settings/details-user-credentials/details-user-credentials.component';
import {AddCurrencyComponent} from '../administration/currency/add-currency/add-currency.component';
import {OpportunityListComponent} from './components/opportunity/opportunity-list/opportunity-list.component';
import {DatesToRememberDropDownComponent}
from './components/date-to-remember/date-to-remember-drop-down/dates-to-remember-drop-down.component';
import {AddDateToRememberComponent} from './components/date-to-remember/add-date-to-remember/add-date-to-remember.component';
import {MarkingEventItemsService} from './services/markingEventsItems/marking-event-items.service';
import {TemplateEmailService} from '../mailing/services/template-email/template-email.service';
import {AttchmentServiceService} from '../mailing/services/send-mail/attchment-service.service';
import {CurrencyRateService} from '../administration/services/currency-rate/currency-rate.service';
import { AddStatusComponent } from './components/status-opportunity/add-status/add-status.component';
import { UrlServicesService } from './services/url-services.service';
import { EventComponent } from './components/event/event/event.component';
import { EventService } from './services/event/event.service';
import {EmployeeTeamService} from './../payroll/services/employee-team/employee-team.service';
// @ts-ignore
import {GMapModule} from 'primeng/gmap';
import {DialogModule} from 'primeng/dialog';
import {CheckboxModule} from 'primeng/checkbox';
import { ListDropdownsComponent } from './components/dropdowns/list-dropdowns/list-dropdowns.component';
import { AddDropdownsComponent } from './components/dropdowns/add-dropdowns/add-dropdowns.component';
import {DropdownService} from './services/dropdowns/dropdown.service';
import { AddCampaignComponent } from './components/campaign/add-campaign/add-campaign.component';
import { ListCampaignComponent } from './components/campaign/list-campaign/list-campaign.component';
import {CampaignService} from './services/campaign/campaign.service';
import { StepperComponent } from './components/stepper/stepper/stepper.component';
import { FiltreCampaignComponent } from './components/campaign/filtre-campaign/filtre-campaign.component';
import { ContactPhoneComponent } from './components/contact-crm/contact-phone/contact-phone.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule, BarRatingModule, DragulaModule.forRoot(),
    TooltipModule,
    TranslateModule,
    TreeTableModule,
    TableModule,
    RowFilterModule,
    BodyModule,
    CrmRoutingModule,
    SortableModule,
    ColorPickerModule,
    LayoutModule,
    ScheduleModule,
    AppAsideModule,
    HeaderModule,
    GMapModule,
    DialogModule,
    CheckboxModule, Ng2TelInputModule

  ],
  declarations: [
    PopupAddStatusOpportunityComponent,
    ListStatusOpportunityComponent,
    OpportunityKanbanComponent,
    PopupAddOpporttunityComponent,
    ListCategoryConfigComponent,
    AddCategoryComponent,
    UserMultiselectComponent,
    StatusChangeComponent,
    ContactListComponent,
    DetailContactCrmComponent,
    AddProspectComponent,
    SidNavComponent,
    OrganisationAddComponent,
    OrganisationListComponent,
    OpportunityListComponent,
    OrganisationDetailsComponent,
    SideNavOrganisationDetailsComponent,
    OpportunityDetailsComponent,
    SideNavOpportunityDetailsComponent,
    OpportunityDetailsComponent,
    SideNavOpportunityDetailsComponent,
    AddNewOpportunityComponent,
    AddNewOpportunityComponent,
    AddressOrganisationComponent,
    AddressOrganisationDetailsComponent,
    ActionsListComponent,
    SearchActionComponent,
    AddActionComponent,
    DetailActionComponent,
    ClaimsListComponent,
    SideNavActionComponent,
    AddClaimComponent,
    CalendarComponent,
    SideNavClaimComponent,
    DetailClaimComponent,
    ClaimSearchAndFilterComponent,
    ReminderComponent,
    PopupElementComponent,
    OrganisationCardViewComponent,
    ContactCardViewComponent,
    FileListComponent,
    FileAddComponent,
    PopupAddFileComponent,
    ListNoteComponent,
    AddNoteComponent,
    OrganizationFilterComponent,
    HistoryListComponent,
    PagerCrmComponent,
    ActionArchivingComponent,
    ContactArchivingComponent,
    OpportunityArchivingComponent,
    OrganisationArchivingComponent,
    ClaimArchivingComponent,
    PipelineListComponent,
    SettingCategoryAndDropdownsComponent,
    PermissionComponent,
    ArchivePopupComponent,
    ActionReminderComponent,
    ReminderEventComponent,
    ActionRelatedItemsComponent,
    ContactRelatedItemsComponent,
    ClaimRelatedItemsComponent,
    OpportunityRelatedItemsComponent,
    OrganisationRelatedItemsComponent,
    DatesToRememberDropDownComponent,
    AddStatusComponent,
    DatesToRememberDropDownComponent,
    EventComponent,
    AddStatusComponent,
    ListDropdownsComponent,
    AddDropdownsComponent,
    AddStatusComponent,
    AddCampaignComponent,
    ListCampaignComponent,
    StepperComponent,
    FiltreCampaignComponent,
    ContactPhoneComponent
  ],
  providers: [
    SkillsService,
    EmployeeSkillsService,
    OpportunityService,
    ErrorHandlerService,
    DatePipe,
    CategoryService,
    OpportunityService,
    CurrencyService,
    ColumnResizingService,
    DatePipe,
    FeedBackService,
    ContactCrmService,
    UploadFileService,
    OrganisationSideNavService,
    OrganisationService,
    UpdateServiceService,
    OpportunityFilterService,
    CanDeactivateGuard,
    ClaimCrmService,
    LeaveService,
    ActionSidNavService,
    FileService,
    AttachmentService,
    NoteService,
    GenericCrmService,
    ClaimSideNavService,
    HistoryService,
    PipelineService,
    PermissionService,
    ClaimSideNavService,
    SendMailService,
    MarkingEventItemsService,
    TemplateEmailService,
    AttchmentServiceService,
    CurrencyRateService,
    UrlServicesService,
    EventService,
    DropdownService,
    CampaignService,
    DropdownService,
    EmployeeTeamService

  ],
  entryComponents: [PopupAddStatusOpportunityComponent, AddProspectComponent, AddCurrencyComponent, AddDateToRememberComponent,
    CompanySkillsComponent, AddActionComponent, DetailActionComponent, DetailsUserCredentialsComponent,
    PopupAddOpporttunityComponent, StatusChangeComponent, FileAddComponent, PopupSendMailComponent,
    ArchivePopupComponent, ReminderEventComponent, OpportunityDetailsComponent, DetailContactCrmComponent, OrganisationDetailsComponent, EventComponent],
  exports: [RouterModule, PopupAddStatusOpportunityComponent]
})

export class CrmModule {
  constructor() {
  }
}
