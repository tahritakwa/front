import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MailingRoutingModule, routes} from './mailing-routing.module';
import {SharedModule} from '../shared/shared.module';
import {BarRatingModule} from 'ngx-bar-rating';
import {DragulaModule} from 'ng2-dragula';
import {TooltipModule} from '@progress/kendo-angular-tooltip';
import {AdministrationModule} from '../administration/administration.module';
import {TranslateModule} from '@ngx-translate/core';
import {TreeTableModule} from 'ng-treetable';
import {TableModule} from 'primeng/table';
import {BodyModule, RowFilterModule} from '@progress/kendo-angular-grid';
import {SortableModule} from '@progress/kendo-angular-sortable';
import {ColorPickerModule} from 'ngx-color-picker';
import {LayoutModule} from '@angular/cdk/layout';
import {ScheduleModule} from 'primeng/schedule';
import {AppAsideModule} from '@coreui/angular';
import {ButtonModule} from 'primeng/button';
import {TemplateEmailService} from './services/template-email/template-email.service';
import {AddTemplateEmailComponent} from './components/template-email/add-template-email/add-template-email.component';
import {ListTemplateEmailComponent} from './components/template-email/list-template-email/list-template-email.component';
import {PopupSendMailComponent} from './components/template-email/popup-send-mail/popup-send-mail.component';
import {ChipsModule} from 'primeng/chips';
import {SendMailService} from './services/send-mail/send-mail.service';
import {SideNavTemplateEmailComponent} from './components/template-email/side-nav-template-email/side-nav-template-email.component';
import {TemplateEmailSideNavService} from './services/template-email-side-nav/template-email-side-nav.service';
import {DetailTemplateEmailComponent} from './components/template-email/detail-template-email/detail-template-email.component';
import {MailingSettingsComponent} from './components/mailing-settings/mailing-settings/mailing-settings.component';
import {SettingsMailService} from './services/settings-mail/settings-mail-service';
import {UploadFilesComponent} from './components/upload-files/upload-files.component';
import {AttchmentServiceService} from './services/send-mail/attchment-service.service';
import {UserMailingSettingsComponent} from './components/mailing-settings/user-mailing-settings/list-user-credentials/user-mailing-settings.component';
import {DetailsUserCredentialsComponent} from './components/mailing-settings/user-mailing-settings/details-user-credentials/details-user-credentials.component';
import {PopupUserSettingsComponent} from './components/mailing-settings/user-mailing-settings/popup-user-settings/popup-user-settings.component';
import {ServerSettingsService} from './services/settings-server/server-settings.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';
import {GenericMailingService} from './services/generic-mailing.service';


@NgModule({
    imports: [
        MailingRoutingModule,
        RouterModule.forChild(routes),
        SharedModule, BarRatingModule, DragulaModule.forRoot(),
        TooltipModule,
        AdministrationModule,
        TranslateModule,
        TreeTableModule,
        TableModule,
        RowFilterModule,
        BodyModule,
        SortableModule,
        ColorPickerModule,
        LayoutModule,
        ScheduleModule,
        AppAsideModule,
        ButtonModule,
        ChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
    ],
  declarations: [
    AddTemplateEmailComponent,
    ListTemplateEmailComponent,
    PopupSendMailComponent,
    SideNavTemplateEmailComponent,
    DetailTemplateEmailComponent,
    MailingSettingsComponent,
    UploadFilesComponent,
    UserMailingSettingsComponent,
    DetailsUserCredentialsComponent,
    PopupUserSettingsComponent
  ],
  providers: [
    TemplateEmailService,
    SendMailService,
    TemplateEmailSideNavService,
    SettingsMailService,
    AttchmentServiceService,
    ServerSettingsService,
    CanDeactivateGuard,
    GenericMailingService
  ],
  entryComponents: [PopupSendMailComponent, PopupUserSettingsComponent],
  exports: [RouterModule, PopupSendMailComponent, MatFormFieldModule,
    MatIconModule, MatInputModule]
})
export class MailingModule {
  constructor() {
  }
}
