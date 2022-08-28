import { Component, OnInit } from '@angular/core';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { FormGroup } from '@angular/forms';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { Router } from '@angular/router';
import { GrowlService } from '../../../../COM/Growl/growl.service';
import { TranslateService } from '@ngx-translate/core';
import { DataStateChangeEvent, PagerSettings, PageChangeEvent } from '@progress/kendo-angular-grid';
import { MachineConstant } from '../../../constant/manufuctoring/machine.constant';
import { MachineService } from '../../service/machine.service';
import { EmployeeService } from '../../../payroll/services/employee/employee.service';
import { filter } from 'rxjs/operators';
import { NomenclaturesConstant } from '../../../constant/manufuctoring/nomenclature.constant';
import { AreaService } from '../../service/area.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {SectionConstant} from '../../../constant/manufuctoring/section.constant';
import {SectionService} from '../../service/section.service';
import {StockDocumentConstant} from '../../../constant/inventory/stock-document.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-list-machine',
  templateUrl: './list-section.component.html',
  styleUrls: ['./list-section.component.scss']
})
export class ListSectionComponent implements OnInit {
  private  size = NumberConstant.TWENTY;
  private currentPage = NumberConstant.ZERO;
  public value = '';

  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.size,
    filter: {
      logic: 'and',
      filters: []
    }
  };

  public columnsConfig: ColumnSettings[] = [
    {
      field: SectionConstant.REFERENCE_FIELD,
      title: SectionConstant.REFERENCE_TITLE,
      filterable: true,
    },
    {
      field: SectionConstant.DESIGNATION_FIELD,
      title: SectionConstant.DESIGNATION_TITLE,
      filterable: true
    },
    {
      field: SectionConstant.AREA_FIELD,
      title: SectionConstant.AREA_TITLE,
      filterable: true,
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;

  constructor(private machineService: MachineService,
              private sectionService: SectionService,
              private areaService: AreaService,
              private swalWarring: SwalWarring,
              private router: Router,
              private growlService: GrowlService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.initGridDataSource();
  }

  initGridDataSource(pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }
    this.sectionService.getJavaGenericService().getEntityList(MachineConstant.PAGEABLE +
      `?designation=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .subscribe((data) => {
        data.content.forEach(element => {
          element.areaDesignation = element.area.designation;
        });
        this.gridSettings.gridData = { data: data.content, total: data.totalElements };
      });
  }

  goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(SectionConstant.URI_ADVANCED_EDIT.concat(dataItem.id), { queryParams: filter, skipLocationChange: true });
  }

  removeHandler(dataItem) {
    this.swalWarring.CreateSwal(SectionConstant.SECTION_DELETE_TEXT_MESSAGE, SectionConstant.DELETE_SECTION_MESSAGE).then((result) => {
      if (result.value) {
        this.sectionService.getJavaGenericService()
          .deleteEntity(dataItem.id , SectionConstant.SECTION_URL)
          .subscribe(() => {
            this.growlService.successNotification(this.translate.instant(SectionConstant.SUCCESS_OPERATION_MACHINE_UNASSIGNED));
            this.gridSettings.gridData.data = this.gridSettings.gridData.data.filter(row => row.id !==  dataItem.id);
          }, () => {
            this.growlService.ErrorNotification(this.translate.instant(SectionConstant.FAILURE_OPERATION));
          });
      }
    });
  }

  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip)  / event.take;
    this.size = event.take;
    this.initGridDataSource();
  }

  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }

  onSearch() {
    if (this.value === '') {
      this.initGridDataSource();
    } else {
      this.initGridDataSource(0);
    }
  }

}
