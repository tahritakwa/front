import { Component, OnInit } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { FormGroup} from '@angular/forms';
import { DataStateChangeEvent} from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { RoleService } from '../../services/role/role.service';

@Component({
  selector: 'app-list-role-advanced',
  templateUrl: './list-role-advanced.component.html',
  styleUrls: ['./list-role-advanced.component.scss']
})
export class ListRoleAdvancedComponent implements OnInit {

  public predicate: PredicateFormat;
  public formGroup: FormGroup;
  public gridState: State = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: RoleConstant.ID,
      title: RoleConstant.ID,
      filterable: true
    },
    {
      field: RoleConstant.CODE,
      title: RoleConstant.CODE,
      filterable: true
    },
    {
      field: RoleConstant.ROLE_NAME,
      title: RoleConstant.DESIGNATION,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private swalWarrings: SwalWarring,
    public roleService: RoleService,
    private router: Router) { }

  ngOnInit() {
    this.initGridDataSource();
  }

  /**
  * Data changed listener
  * @param state
  */
  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridSettings.state = state;
    this.initGridDataSource();
  }
  initGridDataSource() {
    this.roleService.reloadServerSideData(this.gridSettings.state)
      .subscribe(data => {
        this.gridSettings.gridData = data;
      }
      );
  }
  /**
   * Remove handler
   * @param param0
   */
  public removeHandler({ dataItem }) {
    this.swalWarrings.CreateSwal().then((result) => {
      if (result.value) {
        this.roleService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(RoleConstant.URL_ROLE_ADVANCED_EDIT.concat(dataItem.Id), { queryParams: dataItem, skipLocationChange: true });
  }
}
