import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStateChangeEvent, PagerSettings } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { IModalDialogOptions } from 'ngx-modal-dialog';
import { LanguageConstant } from '../../../constant/Administration/language.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Language } from '../../../models/shared/Language.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { LanguageKnowledgeService } from '../../../shared/services/language-knowledge/language-knowledge.service';
import { unique, ValidationService } from '../../../shared/services/validation/validation.service';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-language',
  templateUrl: './list-language.component.html',
  styleUrls: ['./list-language.component.scss']
})
export class ListLanguageComponent implements OnInit , OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  private editedRowIndex: number;
  public isModal = false;
  private subscriptions: Subscription[]= [];
  dialogOptions: Partial<IModalDialogOptions<any>>;

  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: LanguageConstant.ID,
      title: LanguageConstant.ID,
      filterable: true
    },
    {
      field: LanguageConstant.NAME,
      title: LanguageConstant.NAME_TITLE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  constructor(
    public languageKnowledgeService: LanguageKnowledgeService,
    private swalWarrings: SwalWarring,
    private validationService: ValidationService,
    private authService: AuthService
  ) { }

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }
  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_LANGUAGE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_LANGUAGE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_LANGUAGE);
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.subscriptions.push(this.languageKnowledgeService
      .reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }));
  }

  public addHandler({ sender }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Name: new FormControl('',
       { validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED), Validators.pattern('[a-zA-Z-ñÑáéíóúÁÉÍÓÚç]*')],
          asyncValidators: unique(LanguageConstant.NAME, this.languageKnowledgeService, String(NumberConstant.ZERO)),
        updateOn: 'blur'}),
    });
    sender.addRow(this.formGroup);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then(result => {
      if (result.value) {
        this.subscriptions.push(this.languageKnowledgeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
    if ((formGroup as FormGroup).valid) {
      const language: Language = formGroup.value;
      this.subscriptions.push(this.languageKnowledgeService
        .save(language, isNew, this.predicate)
        .subscribe(() => {
          this.initGridDataSource();
        }));
      sender.closeRow(rowIndex);
      this.formGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.languageKnowledgeService
      .reloadServerSideData(state, this.predicate)
      .subscribe(data => (this.gridSettings.gridData = data)));
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Name: new FormControl(dataItem.Name, { validators: [Validators.required, Validators.maxLength(NumberConstant.ONE_HUNDRED),
          Validators.pattern('[a-zA-Z-ñÑáéíóúÁÉÍÓÚç]*')],
        asyncValidators: unique(LanguageConstant.NAME, this.languageKnowledgeService, String(dataItem.Id)), updateOn: 'blur'})
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  isFormChanged(): boolean {
    return this.formGroup && this.formGroup.touched;  
  }
  /**
  * this method will be called by CanDeactivateGuard service to check the leaving component possibility
  */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  ngOnDestroy(): void {
    if (this.subscriptions !== undefined) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }
}
