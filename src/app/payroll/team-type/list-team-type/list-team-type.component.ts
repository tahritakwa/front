import {Component, OnInit} from '@angular/core';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IModalDialogOptions} from 'ngx-modal-dialog';
import {State} from '@progress/kendo-data-query';
import {ColumnSettings} from '../../../shared/utils/column-settings.interface';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {ValidationService} from '../../../shared/services/validation/validation.service';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TeamType} from '../../../models/payroll/team-type.model';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import {TeamTypeService} from '../../services/team-type/team-type.service';

@Component({
  selector: 'app-list-team-type',
  templateUrl: './list-team-type.component.html',
  styleUrls: ['./list-team-type.component.scss']
})
export class ListTeamTypeComponent implements OnInit {
  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
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
      field: TeamConstant.LABEL,
      title: TeamConstant.LABEL_TITLE,
      filterable: true
    },
    {
      field: TeamConstant.DESCRIPTION,
      title: TeamConstant.DESCRIPTION_TITLE,
      filterable: true
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private editedRowIndex: number;

  constructor(public teamTypeService: TeamTypeService,
              private swalWarrings: SwalWarring, private validationService: ValidationService) {
  }

  dialogInit(options: Partial<IModalDialogOptions<any>>) {
    this.dialogOptions = options;
    this.isModal = true;
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  initGridDataSource() {
    this.teamTypeService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      );
  }

  public addHandler({sender}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Label: new FormControl('', Validators.required),
      Description: new FormControl('')
    });
    sender.addRow(this.formGroup);
  }

  public cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  public removeHandler({dataItem}) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.teamTypeService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      const teamType: TeamType = formGroup.value;
      this.teamTypeService.save(teamType, isNew).subscribe(() => {
        this.initGridDataSource();
      });
      sender.closeRow(rowIndex);
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  public editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    this.formGroup = new FormGroup({
      Id: new FormControl(dataItem.Id),
      Label: new FormControl(dataItem.Label, Validators.required),
      Description: new FormControl(dataItem.Description)
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.formGroup);
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }
}
