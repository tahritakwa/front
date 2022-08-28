import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { LoginService } from './services/login.service';
import { AppRoutingModule } from '../../app.route';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ChatService } from '../shared/services/signalr/chat/chat.service';
import { StarkPermissionsGuard } from '../stark-permissions/stark-permissions.module';
import { AuthGuard } from './Authentification/services/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [LoginComponent],
  providers: [AuthGuard, LoginService, ChatService, StarkPermissionsGuard],
})
export class LoginModule { }

