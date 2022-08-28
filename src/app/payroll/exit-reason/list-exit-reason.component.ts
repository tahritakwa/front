import {Component, ComponentRef, OnDestroy, OnInit} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../constant/shared/shared.constant';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PredicateFormat} from '../../shared/utils/predicate';
import {ExitReason} from '../../models/payroll/exit-reason.model';
import {IModalDialog, IModalDialogOptions} from 'ngx-modal-dialog';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../constant/utility/number.constant';
import {ColumnSettings} from '../../shared/utils/column-settings.interface';
import {ExitReasonConstant} from '../../constant/payroll/exit-reason.constant';
import {GridSettings} from '../../shared/utils/grid-settings.interface';
import {ExitReasonService} from '../services/exit-reason/exit-reason.service';
import {unique, ValidationService} from '../../shared/services/validation/validation.service';
import {SwalWarring} from '../../shared/components/swal/swal-popup';
import {Router} from '@angular/router';
import {PermissionConstant} from '../../Structure/permission-constant';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { AuthService } from '../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-exit-reason',
  templateUrl: './list-exit-reason.component.html',
  styleUrls: ['./list-exit-reason.component.scss']
})
export class ListExitReasonComponent implements OnInit, OnDestroy {
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public formGroup: FormGroup;
  public predicate: PredicateFormat;
  public isModal: boolean;
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
      field: ExitReasonConstant.LABEL,
      title: ExitReasonConstant.LABEL_UPPERCASE,
      filterable: true
    },
    {
      field: ExitReasonConstant.DESCRIPTION,
      title: ExitReasonConstant.DESCRIPTION_UPPERCASE,
      filterable: true
    },
    {
      field: SharedConstant.TYPE,
      title: SharedConstant.TYPE_TITLE,
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
  private editedRow: ExitReason;
  private subscriptions: Subscription[] = [];

  constructor(public exitReasonService: ExitReasonService, private validationService: ValidationService
    , private swalWarrings: SwalWarring, private router: Router,
              private authService: AuthService) {
  }

  /**
   * Inialise Modal
   * @param reference
   * @param options
   */
  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.isModal = true;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_EXITREASON);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_EXITREASON);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_EXITREASON);
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.subscriptions.push(this.exitReasonService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      ));

  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Label: new FormControl('', {
        validators: Validators.required,
        asyncValidators: unique(ExitReasonConstant.LABEL, this.exitReasonService, String(NumberConstant.ZERO)), updateOn: 'blur'
      }),
      Description: new FormControl(''),
      Type: new FormControl('', {validators: Validators.required, updateOn: 'blur'})
    });
    sender.addRow(this.formGroup);
  }

  /**
   *
   * @param param0
   */
  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  /**
   *
   * @param param
   */
  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.subscriptions.push(this.exitReasonService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        }));
      }
    });
  }

  /**
   *
   * @param param
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      let exitReason: ExitReason;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.getRawValue());
        exitReason = this.editedRow;
      } else {
        exitReason = formGroup.getRawValue();
      }
      this.subscriptions.push(this.exitReasonService.save(exitReason, isNew).subscribe(() => {
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
      Label: new FormControl(dataItem.Label, {
        validators: Validators.required,
        asyncValidators: unique(ExitReasonConstant.LABEL, this.exitReasonService, String(NumberConstant.ZERO)), updateOn: 'blur'
      }),
      Description: new FormControl(dataItem.Description),
      Type: new FormControl(dataItem.Type, {validators: Validators.required, updateOn: 'blur'}),
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
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
    this.subscriptions.push(this.exitReasonService.reloadServerSideData(this.gridSettings.state, this.predicate)
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
    this.editedRow = undefined;
    this.formGroup = undefined;
  }
}
