import {Component, OnInit} from '@angular/core';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {DropdownConstant} from '../../../../constant/crm/dropdown.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {PagerSettings} from '@progress/kendo-angular-grid';
import {CrmConstant} from '../../../../constant/crm/crm.constant';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import {DropdownService} from '../../../services/dropdowns/dropdown.service';
import {PipelineConstant} from '../../../../constant/crm/pipeline.constant';
import {Router} from '@angular/router';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list-dropdowns',
  templateUrl: './list-dropdowns.component.html',
  styleUrls: ['./list-dropdowns.component.scss']
})
export class ListDropdownsComponent implements OnInit {
  public formGroup;
  private pipelineList = [];
  private pageSize = NumberConstant.TEN;
  public gridState: State = {
    skip: NumberConstant.ZERO,
    take: this.pageSize,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: DropdownConstant.NAME_FIELD,
      title: DropdownConstant.NAME_TITLE,
      filterable: false,
      _width: 160
    },
    {
      field: DropdownConstant.ENTITY_FIELD,
      title: DropdownConstant.ENTITY_TITLE,
      filterable: false,
      _width: 160
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };

  pagerSettings: PagerSettings = CrmConstant.PAGER_SETTINGS;

  constructor(private dropdownService: DropdownService,
              private router: Router,
              private swalWarrings: SwalWarring,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.initGridDataSource(this.gridState.skip);
  }

  initGridDataSource(page) {
    this.dropdownService.getJavaGenericService().getEntityList(DropdownConstant.PAGINATION_URL, page + NumberConstant.ONE)
      .subscribe(data => {

          for (const dropdown of data.dropdownConfigDtoPage) {
            dropdown.name = this.translate.instant(dropdown.name);
            dropdown.dropdownType = this.translate.instant(dropdown.dropdownType);
          }


          this.gridSettings.gridData = {
            data: data.dropdownConfigDtoPage,
            total: data.totalElements
          };
        }
      );
  }

  goToDetails(dataItem) {
    this.router.navigateByUrl(DropdownConstant.DETAILS_URL.concat(dataItem.id));
  }

  public removeHandler(event) {
    let deleted = false;
    this.swalWarrings.CreateSwal(this.translate.instant(PipelineConstant.PUP_UP_DELETE_PIPELINE_TEXT)).then((result) => {
      if (result.value) {
        this.dropdownService.getJavaGenericService().deleteEntity(event.id).subscribe((data) => {
          if (data) {
            deleted = true;
          }
        }, () => {

        }, () => {
          if (deleted) {
            this.initGridDataSource(this.gridState.skip);
          }
        });
      }
    });
  }

  onPageChange(event) {
    this.pageSize = event.take;
    this.gridState.skip = event.skip / NumberConstant.TEN;
    this.initGridDataSource(this.gridState.skip);
  }
}
