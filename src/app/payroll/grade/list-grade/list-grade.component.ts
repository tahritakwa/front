import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {State} from '@progress/kendo-data-query';
import {PredicateFormat} from '../../../shared/utils/predicate';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {Grade} from '../../../models/payroll/grade.model';
import {GradeService} from '../../services/grade/grade.service';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {IModalDialogOptions} from 'ngx-modal-dialog';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {Observable} from 'rxjs/Observable';
import {PermissionConstant} from '../../../Structure/permission-constant';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-grade',
  templateUrl: './list-grade.component.html',
  styleUrls: ['./list-grade.component.scss']
})
export class ListGradeComponent implements OnInit, OnDestroy {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public isModal = false;
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
      field: 'Designation',
      title: 'DESIGNATION',
      filterable: true
    },
    {
      field: 'Description',
      title: 'DESCRIPTION',
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public hasAddPermission: boolean;
  public hasUpdatePermission: boolean;
  public hasDeletePermission: boolean;
  private editedRowIndex: number;
  private subscriptions: Subscription[] = [];

  constructor(public gradeService: GradeService, private swalWarrings: SwalWarring, private validationService: ValidationService,
              private authService: AuthService) {
  }

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_GRADE);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_GRADE);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_GRADE);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.gradeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  /**
   * Ann new row in grid for add new Grade type
   * @param param0
   */
  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Designation: new FormControl('', Validators.required),
      Description: new FormControl('')
    });
    sender.addRow(this.formGroup);
  }

  /**
   * Cancel the add or update of new Grade type
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   * Remove an item of Grade type
   * @param param
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.gradeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   * Save the new Grade type
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const grade: Grade = formGroup.value;
      this.subscriptions.push(this.gradeService.save(grade, isNew, this.predicate).subscribe(() => {
        this.initGridDataSource();
      }));
      sender.closeRow(rowIndex);
      this.formGroup = undefined;
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Edit the column on which the user clicked
   * @param param
   */
  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Designation: new FormControl(dataItem.Designation, Validators.required),
      Description: new FormControl(dataItem.Description)
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

  /**
   * this method is invoked if the page number or filter has changed
   * @param state
   */
  public dataStateChange(state: State): void {
    this.gridSettings.state = state;
    this.subscriptions.push(this.gradeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));
  }

  /**
   * Close the editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
