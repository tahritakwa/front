import { Component, OnInit, ViewContainerRef, ViewChild, ComponentRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PagerSettings, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Skills } from '../../../models/payroll/skills.model';
import { SkillsService } from '../../../payroll/services/skills/skills.service';
import { ValidationService, unique } from '../../../shared/services/validation/validation.service';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { SkillsConstant } from '../../../constant/payroll/skills.constant';
import { SkillsFamilyComponent } from '../skills-family/skills-family.component';
import { FormModalDialogService } from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import { SkillsFamilyDropdownComponent } from '../../../shared/components/skills-family-dropdown/skills-family-dropdown.component';
import { SkillsFamilyConstant } from '../../../constant/payroll/skills-family.constant';
import { IModalDialogOptions, IModalDialog } from 'ngx-modal-dialog';
import { Subject } from 'rxjs/Subject';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { Observable } from 'rxjs/Observable';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-company-skills',
  templateUrl: './company-skills.component.html',
  styleUrls: ['./company-skills.component.scss']
})
export class CompanySkillsComponent implements OnInit, OnDestroy {
  @ViewChild(SkillsFamilyDropdownComponent) SkillsFamilyDropdownComponent;
  /**
   * Form Group
   */
  skillsFormGroup: FormGroup;
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  // predicate
  public predicate: PredicateFormat;
  /*
   * If modal=true
   */
  public isModal: boolean;
  /*
   * dialog subject
   */
  dialogOptions: Partial<IModalDialogOptions<any>>;
  public closeDialogSubject: Subject<any>;
  /**
  * Grid state
  */
  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };
  public data = {};
  /**
   * Grid columns
   */
  public columnsConfig: ColumnSettings[] = [
    {
      field: SkillsConstant.LABEL,
      title: SkillsConstant.LABEL_UPPERCASE,
      filterable: true
    },
    {
      field: SkillsConstant.DESCRIPTION,
      title: SkillsConstant.DESCRIPTION_UPPERCASE,
      filterable: true
    },
    {
      field: SkillsConstant.FAMILY,
      title: SkillsConstant.FAMILY_UPPERCASE,
      filterable: true
    }
  ];

    // Grid settings
    public gridSettings: GridSettings = {
      state: this.gridState,
      columnsConfig: this.columnsConfig
    };
    // Edited Row index
    private editedRowIndex: number;
    private editedRow: Skills;
    private subscriptions: Subscription[]= [];

    public hasAddPermission: boolean;
    public hasUpdatePermission: boolean;
    public hasDeletePermission: boolean;
    constructor(public skillsService: SkillsService,
       private fb: FormBuilder,
       private validationService: ValidationService,
       private swalWarrings: SwalWarring,
       private formModalDialogService: FormModalDialogService,
       private viewRef: ViewContainerRef,
       private authService: AuthService) { }

    ngOnInit() {
      this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_SKILLS);
      this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_SKILLS);
      this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_SKILLS);
      this.preparePredicate();
      this.initGridDataSource();
    }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
    this.dialogOptions = options;
    this.closeDialogSubject = options.closeDialogSubject;
    this.data = this.dialogOptions.data;
  }

    preparePredicate() {
      this.predicate = new PredicateFormat();
      this.predicate.Relation = new Array<Relation>();
      this.predicate.Relation.push.apply(this.predicate.Relation,
        [new Relation(SkillsConstant.ID_FAMILY_NAVIGATION)]);
    }
    /**
     * init grid data
     */
    initGridDataSource() {
      this.subscriptions.push(this.skillsService.reloadServerSideData(this.gridSettings.state, this.predicate)
        .subscribe(res => {
          this.gridSettings.gridData = res;
        }));
    }

   /**
    * Remove handler
    * @param param0
    */
      public removeHandler({dataItem}) {
        this.swalWarrings.CreateSwal().then((result) => {
          if (result.value) {
            this.subscriptions.push(this.skillsService.remove(dataItem).subscribe(() => {
              this.initGridDataSource();
              this.data = {SkillsListChanged: true};
            }));
          }
        });
      }
      /**
      * Quick add
      * @param param0
      */
      public addHandler({ sender }) {
          this.closeEditor(sender);
          this.skillsFormGroup = new FormGroup({
            Id: new FormControl(0),
            Code: new FormControl(''),
            Label: new FormControl('', { validators: Validators.required,
              asyncValidators: unique(SkillsConstant.LABEL, this.skillsService, String(NumberConstant.ZERO)),
            updateOn: 'blur'}),
            Description: new FormControl(''),
            IsDeleted: new FormControl(false),
            IdFamily: new FormControl(null)
          });
          sender.addRow(this.skillsFormGroup);

      }
        /**
   * Quick edit
   * @param param0
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.skillsFormGroup = this.fb.group({
      Id: [dataItem.Id],
      Code: [dataItem.Code, Validators.required],
      Label: [dataItem.Label, { validators: Validators.required,
        asyncValidators: unique(SkillsConstant.LABEL, this.skillsService, String(dataItem.Id)),
      updateOn: 'blur'}],
      Description: [dataItem.Description],
      IdFamily: [dataItem.IdFamily]
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = new Skills();
    Object.assign(this.editedRow, dataItem);
    sender.editRow(rowIndex, this.skillsFormGroup);
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({ sender, rowIndex, formGroup, isNew }) {
        if ((formGroup as FormGroup).valid) {
          let skills: Skills;
          if (this.editedRow) {
            Object.assign(this.editedRow, formGroup.getRawValue());
            skills = this.editedRow;
          } else {
            skills = formGroup.getRawValue();
          }
          this.subscriptions.push(this.skillsService.save(skills, isNew).subscribe(() => {
            this.initGridDataSource();
            this.data = {SkillsListChanged: true};
          }));  
          sender.closeRow(rowIndex);
          this.skillsFormGroup = undefined;
        } else {
          this.validationService.validateAllFormFields(formGroup as FormGroup);
        }
    }

      /**
     * Cancel
     * @param param0
     */
      public cancelHandler({ sender, rowIndex }) {
        this.closeEditor(sender, rowIndex);
      }

    /**
    * Close editor
    * @param grid
    * @param rowIndex
    */
    private closeEditor(grid, rowIndex = this.editedRowIndex) {
      if (rowIndex !== undefined) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.editedRow = undefined;
        this.skillsFormGroup = undefined;
      }
  }
  /**
  * Data changed listener
  * @param state
  */
    public dataStateChange(state: DataStateChangeEvent): void {
      this.gridSettings.state = state;
      this.subscriptions.push(this.skillsService.reloadServerSideData(state).subscribe(data => this.gridSettings.gridData = data));

    }

    /** Open Add Family in modal */
    public addFamilyEvent() {
    const modalTitle = SkillsFamilyConstant.ADD_SKILLS_FAMILY;
    this.formModalDialogService.openDialog(modalTitle, SkillsFamilyComponent, this.viewRef, this.initFamilyDataSource.bind(this),
      null, null, SharedConstant.MODAL_DIALOG_SIZE_M);
    }
    /**
     * Init source in the expense dropdown
     */
    public initFamilyDataSource() {
      this.SkillsFamilyDropdownComponent.initDataSource();
    }
    
    isFormChanged(): boolean {
      return this.skillsFormGroup && this.skillsFormGroup.touched;  
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
