import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListTemplateEmailComponent} from './components/template-email/list-template-email/list-template-email.component';
import {AddTemplateEmailComponent} from './components/template-email/add-template-email/add-template-email.component';
import {PopupSendMailComponent} from './components/template-email/popup-send-mail/popup-send-mail.component';
import {MailingSettingsComponent} from './components/mailing-settings/mailing-settings/mailing-settings.component';
import {UploadFileComponent} from '../shared/components/upload-file/upload-file.component';
import {UserMailingSettingsComponent} from './components/mailing-settings/user-mailing-settings/list-user-credentials/user-mailing-settings.component';
import {DetailsUserCredentialsComponent} from './components/mailing-settings/user-mailing-settings/details-user-credentials/details-user-credentials.component';
import {CanDeactivateGuard} from './services/can-deactivate-guard.service';

export const routes: Routes = [
  {
    path: 'templateEmail',
    children: [
      {
        path: '',
        component: ListTemplateEmailComponent
      },
      {
        path: 'add',
        component: AddTemplateEmailComponent,
      },
      {
        path: 'sendMail',
        component: PopupSendMailComponent
      },
      {
        path: 'upload',
        component: UploadFileComponent
      }
    ],
  },
  {
    path: 'settings',
    children: [
      {
        path: '',
        component:  MailingSettingsComponent,
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  },
  {
    path: 'settingsUser',
    children: [
      {
        path: 'listUsercredentials',
        component: UserMailingSettingsComponent
      },
      {
        path: 'detailsAccount',
        component: DetailsUserCredentialsComponent
      },
      {
        path: 'settingsAccount',
        component: PopupSendMailComponent
      }
    ]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailingRoutingModule { }
