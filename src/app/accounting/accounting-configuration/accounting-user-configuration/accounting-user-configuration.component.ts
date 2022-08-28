import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddJournalComponent } from '../../journal/add-journal/add-journal.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { SharedAccountingConstant } from '../../../constant/accounting/sharedAccounting.constant';
import { JournalConstants } from '../../../constant/accounting/journal.constant';
import { JournalService } from '../../services/journal/journal.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { StarkRolesService } from '../../../stark-permissions/service/roles.service';
import { GenericAccountingService } from '../../services/generic-accounting.service';
import { StyleConfigService } from '../../../shared/services/styleConfig/style-config.service';
import { RoleConfigConstant } from '../../../Structure/_roleConfigConstant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
import {AccountingConfigurationService} from '../../services/configuration/accounting-configuration.service';
import {AccountingConfigurationConstant} from '../../../constant/accounting/accounting-configuration.constant';

@Component({
  selector: 'app-accounting-user-configuration',
  templateUrl: './accounting-user-configuration.component.html',
  styleUrls: ['./accounting-user-configuration.component.scss']
})
export class AccountingUserConfigurationComponent implements OnInit {
  defaultJournalByUserForm: FormGroup;

  private userId: number;
  public journalUser: any = this.activatedRoute.snapshot.data['journals'];
  public journalUserFiltred: any = this.activatedRoute.snapshot.data['journals'];
  private currentFiscalYearId : number;

  @Output() Selected = new EventEmitter<boolean>();
  @Input() selectedValue;
  public SettingsAccountingPermissions = PermissionConstant.SettingsAccountingPermissions;
  public AccountingPermissions = PermissionConstant.AccountingPermissions;

  constructor(private fb: FormBuilder, private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private journalService: JournalService, private growlService: GrowlService,
    private translate: TranslateService, private validationService: ValidationService,
    public authService: AuthService, private styleConfigService: StyleConfigService, private localStorageService : LocalStorageService, private accountingConfigurationService : AccountingConfigurationService) {
    this.userId = this.localStorageService.getUserId();
  }

  ngOnInit() {
    this.defaultJournalByUserForm = this.initDefaultJournalByUserForm();
    this.getDataToUpdate();
    this.getCurrentFiscalYear();
  }


  getCurrentFiscalYear(){
    this.accountingConfigurationService.getJavaGenericService().getEntityList(AccountingConfigurationConstant.CURRENT_FISCAL_YEAR_URL)
      .subscribe(currentFiscalYear =>{
        this.currentFiscalYearId = currentFiscalYear.id;
      })
  }
  private getDataToUpdate() {
    this.journalService.getJavaGenericService().getEntityById(this.userId, JournalConstants.DEFAULT_JOURNAL_BY_USER).subscribe(data => {
      this.defaultJournalByUserForm.patchValue(data);
    }, () => { }, () => {
      if (!this.authService.hasAuthority(this.AccountingPermissions.ACCOUNTING_SETTINGS)) {
        this.defaultJournalByUserForm.disable();
      }
    });
  }
  private initDefaultJournalByUserForm() {
    return this.fb.group({
      id: [0],
      userId: [this.userId, [Validators.required]],
      journalId: ['', [Validators.required]],
      currentFiscalYearId : ['', Validators.required]
    });
  }

  handleFilterJournal(writtenValue) {
    this.journalUser = this.journalUserFiltred.filter((s) =>
      s.label.toLowerCase().includes(writtenValue.toLowerCase())
      || s.label.toLocaleLowerCase().includes(writtenValue.toLowerCase())
    );
  }

  public onSelect($event): void {
    this.Selected.emit($event);
  }

  addNewJournal() {
    this.formModalDialogService.openDialog('ADD_NEW_JOURNAL', AddJournalComponent, this.viewRef, null
      , null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  save() {
    if (this.defaultJournalByUserForm.valid) {
      this.defaultJournalByUserForm.patchValue({'currentFiscalYearId' : this.currentFiscalYearId});
      this.journalService.getJavaGenericService().saveEntity(this.defaultJournalByUserForm.getRawValue(), JournalConstants.DEFAULT_JOURNAL_BY_USER).subscribe(() => {
        this.growlService.successNotification(this.translate.instant(SharedAccountingConstant.SUCCESS_OPERATION));
      });
    } else {
      this.validationService.validateAllFormFields(this.defaultJournalByUserForm);
    }
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
}
