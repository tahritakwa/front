import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaxeGroup} from '../../../models/administration/taxe-group.model';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {State, DataSourceRequestState, DataResult} from '@progress/kendo-data-query';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {TaxeGroupService} from '../../services/taxe-group/taxe-group.service';
import {TaxeService} from '../../services/taxe/taxe.service';
import {TaxeGroupConfig} from '../../../models/administration/taxe-group-config';
import {ActivatedRoute, Router} from '@angular/router';
import {TaxeGroupConstant} from '../../../constant/Administration/taxe-group.constant';
import {TaxeDropdownComponent} from '../../components/taxe-dropdown/taxe-dropdown.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {AddTaxeComponent} from '../../taxe/add-taxe/add-taxe.component';
import {Observable} from 'rxjs/Observable';
import {StyleConfigService} from '../../../shared/services/styleConfig/style-config.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { DataStateChangeEvent, PagerSettings, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslateService } from '@ngx-translate/core';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';


@Component({
  selector: 'app-add-group-taxe',
  templateUrl: './add-group-taxe.component.html',
  styleUrls: ['./add-group-taxe.component.scss']
})
export class AddGroupTaxeComponent implements OnInit {

  @ViewChild(TaxeDropdownComponent) TaxeDropdownComponent;

  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public formGroupTaxeGroupConfig: FormGroup;
  public isUpdateMode: boolean;
  private editedRowIndex: number;
  dataToSend: TaxeGroupConfig[] = [];
  id: number;
  // pager settings
   pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  private isSaveOperation = false;
  public groupTaxeListURL = TaxeGroupConstant.TAXE_GROUP_LIST_URL;
  public hasAddGroupTaxPermission: boolean;
  public hasUpdateGroupTaxPermission: boolean;
  public columnsConfig: ColumnSettings[] = [
    {
      field: TaxeGroupConstant.Value,
      title: TaxeGroupConstant.VALUE,
      filterable: false,
      _width : 300
    },
    {
      field: TaxeGroupConstant.LABEL_TAXE,
      title: TaxeGroupConstant.DESIGNATION,
      filterable: true,
      _width : 300
    },
    {
      field: TaxeGroupConstant.IdTaxe,
      title: TaxeGroupConstant.ID_TAXE,
      filterable: false,
    },
    {
      field: TaxeGroupConstant.IsDeleted,
      title: TaxeGroupConstant.IsDeleted,
      filterable: false,
    }

  ];
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
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public gridData: GridDataResult;
  public pageSize = NumberConstant.TEN;
  public skip = NumberConstant.ZERO;
  public data: TaxeGroupConfig[] = [];
  private createAddForm(): void {
    this.formGroup = this.fb.group({
      Id: [0],
      Code: new FormControl('', Validators.required),
      Label: new FormControl('', Validators.required),
      TaxeGroupTiersConfig: this.fb.array([])
    });
  }

  /**
  * Build TaxeGroupTiersConfig form
  */
  private buildTaxeGroupTiersConfigForm(): FormGroup {
    this.formGroupTaxeGroupConfig = this.fb.group({
      Id: [0],
      IdTaxe: ['', Validators.required],
      Value: [0, [Validators.required, Validators.min(TaxeGroupConstant.MIN_VALUE)
        , Validators.max(TaxeGroupConstant.MAX_VALUE)]],
      LabelTaxe: [''],
      IsDeleted: [false],
    });
    return this.formGroupTaxeGroupConfig;
  }
   /**
   * Data changed listener
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.predicate.pageSize = state.take;
    this.getDataToUpdate();
  }
  public addTaxEvent() {
    const modalTitle = TaxeGroupConstant.ADD_TAX;
    this.formModalDialogService.openDialog(modalTitle, AddTaxeComponent,
      this.viewRef, this.closeTaxModal.bind(this), null, null, SharedConstant.MODAL_DIALOG_SIZE_L);
  }

  closeTaxModal() {
    this.TaxeDropdownComponent.closeModal();
  }

  /**
  * generate TaxeGroupTiersConfig form
  */
  private generateTaxeGroupTiersConfigForm(groupTaxeConfig: TaxeGroupConfig): FormGroup {
    this.taxeService.getById(groupTaxeConfig.IdTaxe)
    .subscribe(data => {
      if(!data.IsCalculable){
        this.formGroupTaxeGroupConfig.controls['Value'].setValidators([Validators.required, Validators.min(TaxeGroupConstant.MIN_VALUE)]);
      } else {
        this.formGroupTaxeGroupConfig.controls['Value'].setValidators([Validators.required, Validators.min(TaxeGroupConstant.MIN_VALUE)
          , Validators.max(TaxeGroupConstant.MAX_VALUE)]);
      }
      this.formGroupTaxeGroupConfig.controls['Value'].updateValueAndValidity();
    });
    this.formGroupTaxeGroupConfig = this.fb.group({
      Id: [groupTaxeConfig.Id],
      IdTaxe: [groupTaxeConfig.IdTaxe],
      Value: [groupTaxeConfig.Value],
      LabelTaxe: [groupTaxeConfig.LabelTaxe, Validators.required],
      IsDeleted: [groupTaxeConfig.IsDeleted],
    });
    //this.formGroupTaxeGroupConfig.controls['Value'].disable();

    return this.formGroupTaxeGroupConfig;
  }
  get TaxeGroupTiersConfig() {
    return this.formGroup.get(TaxeGroupConstant.TaxeGroupTiersConfig) as FormArray;
  }


  constructor(public taxeGroupService: TaxeGroupService, private taxeService: TaxeService, private fb: FormBuilder
    , private swalWarrings: SwalWarring, private validationService: ValidationService,
    private viewRef: ViewContainerRef, private formModalDialogService: FormModalDialogService,
    private activatedRoute: ActivatedRoute, private router: Router,private styleConfigService: StyleConfigService,
      private translate: TranslateService, private growlService: GrowlService, public authService: AuthService,) {
    this.activatedRoute.params.subscribe(params => { this.id = +params['id'] || 0; });
  }

  ngOnInit() {
    this.hasAddGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.ADD_GROUP_TAX);
    this.hasUpdateGroupTaxPermission = this.authService.hasAuthority(PermissionConstant.SettingsCommercialPermissions.UPDATE_GROUP_TAX);
    this.createAddForm();
    this.isUpdateMode = this.id > TaxeGroupConstant.MIN_VALUE;
    if (this.isUpdateMode) {
      this.getDataToUpdate();
    }
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter('Id', Operation.eq, this.id));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(TaxeGroupConstant.TaxeGroupTiersConfig)]);
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.gridData = {
      data: this.dataToSend.slice(this.skip, this.skip + this.pageSize),
      total: this.dataToSend.length
  };
}
  /**
  * Get Item to update
  */
  private getDataToUpdate() {
    this.preparePredicate();
    this.taxeGroupService.getModelByCondition(this.predicate).subscribe((data) => {
      if (data.TaxeGroupTiersConfig !== null) {
        data.TaxeGroupTiersConfig.forEach(element => {
          this.taxeService.getById(element.IdTaxe)
            .subscribe(taxeData => {
              element.LabelTaxe = taxeData.Label;
            });
        });
        this.formGroup.patchValue(data);
        this.dataToSend = data.TaxeGroupTiersConfig;
        this.gridData = {
          data: data.TaxeGroupTiersConfig.slice(this.skip, this.skip + this.pageSize),
          total: data.TaxeGroupTiersConfig.length
      };
      } else {
        this.formGroup.patchValue({
          Id: data.Id,
          Code: data.Code,
          Label: data.Label
        });
      }
    if (!this.hasUpdateGroupTaxPermission) {
      this.formGroup.disable();
    }
    });
  }

  initGridDataSource() {
    this.taxeGroupService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      });
  }

  /**
   * Add new row in grid for the TaxeGroupConfig
   * @param param0
   */
  public addHandler({ sender }) {
    sender.addRow(this.buildTaxeGroupTiersConfigForm());
  }
  /**
   * Cancel the add or update of the TaxeGroupConfig
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }
  /**
   * Remove row for the TaxeGroupConfig data
   * @param param
   */
  public removeHandler(event) {
    this.swalWarrings.CreateSwal(TaxeGroupConstant.TAXE_GROUP_VALUE_TEXT_MESSAGE, TaxeGroupConstant.TAXE_GROUP_VALUE_TITLE_MESSAGE)
      .then((result) => {
      if (result.value) {
        if (event.dataItem.Id === 0) {
          this.dataToSend.splice(event.rowIndex, 1);
        } else {
          this.formGroupTaxeGroupConfig = this.generateTaxeGroupTiersConfigForm(event.dataItem);
          this.formGroupTaxeGroupConfig.value.IsDeleted = true;
          Object.assign(
            this.dataToSend.find(({ Id }) =>
              Id === event.dataItem.Id),
            this.formGroupTaxeGroupConfig.value
          );

        }
        this.data = this.dataToSend.filter(x => x.IsDeleted !== true);
        this.gridData = {
          data: this.data.slice(this.skip, this.skip + this.pageSize),
          total: this.data.length
      };
      }
    });

  }
  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroupTaxeGroupConfig = undefined;
  }
  /**
   * Save row for the TaxeGroupConfig data
   * @param param
   */
  public saveHandler({ sender, rowIndex, isNew }) {
    if (this.formGroupTaxeGroupConfig.valid) {
      this.taxeService.getById(this.formGroupTaxeGroupConfig.controls[TaxeGroupConstant.IdTaxe].value)
        .subscribe(data => {
          if (data) {
            this.formGroupTaxeGroupConfig.value.LabelTaxe = data.Label;
            if (isNew) {
              this.dataToSend.splice(0, 0, this.formGroupTaxeGroupConfig.value);
            } else {
              this.dataToSend[rowIndex] = this.formGroupTaxeGroupConfig.value;
            }
            sender.closeRow(rowIndex);
          }
          this.data = this.dataToSend.filter(x => x.IsDeleted !== true);
          this.gridData = {
            data: this.data.slice(this.skip, this.skip + this.pageSize),
            total: this.data.length
        };
        });
      this.isSaveOperation = true;
    } else {
      this.validationService.validateAllFormFields(this.formGroupTaxeGroupConfig as FormGroup);
    }
  }
  checkDuplicatedTax():boolean {
    const taxeGroupTiers = this.dataToSend;
    const lookup= taxeGroupTiers.reduce((a,e)=>{
      a[e.IdTaxe] = ++a[e.IdTaxe] ||'';
      return a;
    },{});
    return taxeGroupTiers.filter(e => lookup[e.IdTaxe]).length > 0;
  }
  /**
   * Save or update row for TaxeGroupConfig depending on isUpdateMode value
   * @param param
   */
  public save() {
    if (this.dataToSend !== null) {
      if(this.checkDuplicatedTax()){
        this.growlService.ErrorNotification(this.translate.instant(TaxeGroupConstant.DUPLICATE_TAXE));
        return;
      }
      while (this.TaxeGroupTiersConfig.length) {
        this.TaxeGroupTiersConfig.removeAt(NumberConstant.ZERO);
      }
      this.dataToSend.forEach(element => {
        this.TaxeGroupTiersConfig.push(this.generateTaxeGroupTiersConfigForm(element));
      });
    }
    if (this.formGroup.valid) {
      const item: TaxeGroup = this.formGroup.value;
      this.taxeGroupService.save(item, !this.isUpdateMode).subscribe(data => {
        this.router.navigateByUrl(TaxeGroupConstant.TAXE_GROUP_LIST_URL);
        this.isSaveOperation = true;
      });
    } else {
      this.validationService.validateAllFormFields(this.formGroup as FormGroup);
    }
  }
  /**
   * Edit row for TaxeGroupConfig
   * @param param
   */
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.generateTaxeGroupTiersConfigForm(dataItem));
  }
  /**
   * this method will be called by CanDeactivateGuard service to check the leaving component possibility
   */
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isSaveOperation) {
      this.isSaveOperation = false;
      return true;
    }
    return this.validationService.handleCanDeactivateToLeaveCurrentComponent(this.isFormChanged.bind(this));
  }

  isFormChanged(): boolean {
    return this.formGroup.touched;
  }

  getFooterClass(): string {
    return this.styleConfigService.getFooterClassSettingLayoutAddComponent();
  }
  selectTaxe(event) {
    if (event && Number(event)) {
      this.formGroupTaxeGroupConfig.controls["IdTaxe"].setValue(event);
      this.taxeService.getById(event).subscribe(data => {
        if (!data.IsCalculable) {
          this.Value.setValidators([Validators.required, Validators.min(TaxeGroupConstant.MIN_VALUE)]);
        } else {
          this.Value.setValidators([Validators.required, Validators.min(TaxeGroupConstant.MIN_VALUE)
            , Validators.max(TaxeGroupConstant.MAX_VALUE)]);
        }
        this.Value.updateValueAndValidity();
      });
    } else {
      this.Value.setValidators(Validators.required);
    }
  }

  get Value(): FormGroup {
    return this.formGroupTaxeGroupConfig.get(SharedConstant.VALUE) as FormGroup;
  }
}
