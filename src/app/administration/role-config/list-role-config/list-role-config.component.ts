import { Component, OnInit } from '@angular/core';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { State } from '@progress/kendo-data-query';
import { FormGroup} from '@angular/forms';
import { DataStateChangeEvent} from '@progress/kendo-angular-grid';
import { Router } from '@angular/router';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { RoleConfigConstant } from '../../../constant/Administration/role-config.constant';
import { RoleConfigService } from '../../services/role-config/role-config.service';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-list-role-config',
  templateUrl: './list-role-config.component.html',
  styleUrls: ['./list-role-config.component.scss']
})
export class ListRoleConfigComponent implements OnInit {

  public predicate: PredicateFormat;
  public formGroup: FormGroup;
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
      field: RoleConfigConstant.ID,
      title: RoleConfigConstant.ID,
      filterable: true
    },
    {
      field: RoleConfigConstant.CODE,
      title: RoleConfigConstant.CODE,
      filterable: true
    },
    {
      field: RoleConfigConstant.ROLE_NAME,
      title: RoleConfigConstant.DESIGNATION,
      filterable: true
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  constructor(private swalWarrings: SwalWarring,
    public roleConfigService: RoleConfigService,
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
    this.roleConfigService.reloadServerSideData(this.gridSettings.state)
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
        this.roleConfigService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(RoleConfigConstant.URL_ROLE_CONFIG_EDIT.concat(dataItem.Id), { queryParams: dataItem, skipLocationChange: true });
  }
}
