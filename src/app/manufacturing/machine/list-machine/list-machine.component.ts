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
import { filter } from 'rxjs/operators';
import { NomenclaturesConstant } from '../../../constant/manufuctoring/nomenclature.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import {SectionService} from '../../service/section.service';
import {Subscription} from 'rxjs/Subscription';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import { UserService } from '../../../administration/services/user/user.service';

@Component({
  selector: 'app-list-machine',
  templateUrl: './list-machine.component.html',
  styleUrls: ['./list-machine.component.scss']
})
export class ListMachineComponent implements OnInit {

  private  size = NumberConstant.TEN;
  private currentPage = NumberConstant.ZERO;
  public value = '';
  private subscription$: Subscription;
  private machineList: any = [];

  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;


  public gridState: DataSourceRequestState = {
    skip: NumberConstant.ZERO,
    take: this.size,
    filter: { // Initial filter descriptor
      logic: 'and',
      filters: []
    }
  };

  formGroup: FormGroup;
  public columnsConfig: ColumnSettings[] = [
    {
      field: MachineConstant.REFERENCE_FIELD,
      title: MachineConstant.REFERENCE_TITLE,
      tooltip: MachineConstant.REFERENCE_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED
    },
    {
      field: MachineConstant.DESCRPTION_FIELD,
      title: MachineConstant.DESCRPTION_TITLE,
      tooltip: MachineConstant.DESCRPTION_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED
    },
    {
      field: MachineConstant.FULLNAME,
      title: MachineConstant.RESPONSIBLE_TITLE,
      tooltip: MachineConstant.RESPONSIBLE_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED
    },
    {
      field: MachineConstant.STATUS_FIELD,
      title: MachineConstant.STATUS_TITLE,
      tooltip: MachineConstant.STATUS_TITLE,
      filterable: true,
      width: NumberConstant.ONE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig
  };

  constructor(private machineService: MachineService,
    private userService : UserService,
    private sectionService: SectionService,
    private swalWarrings: SwalWarring,
    private router: Router, private growlService: GrowlService,
    private translate: TranslateService) {
  }

  ngOnInit() {

    this.initGridDataSource();
  }

  /*get list off all machine*/
  initGridDataSource(pageFilter?: number) {
    if (pageFilter != null) {
      this.currentPage = pageFilter;
    }

    this.subscription$ = this.machineService.getJavaGenericService().getEntityList(MachineConstant.PAGEABLE +
      `?searchValue=${this.value}&page=${this.currentPage}&size=${this.size}`)
      .flatMap(result => {
      this.machineList = result;
      const idEmployees: Array<number> = [];
      const employessList : Array<any> = [];
      result.content.forEach( (element) => {
        idEmployees.push(element.responsibleId);
      });
      return this.userService.getUsersFromListId(idEmployees);
      }).subscribe(employees => {
        this.machineList.content.forEach(machine => {
          employees.forEach( (employee) => {
            if (employee.Id === machine.responsibleId) {
              machine.FullName = employee.FullName;
            }
          });
          if (machine.section != null) {
            machine.sectionName = machine.section.designation;
          }
        });
        this.gridSettings.gridData = { data: this.machineList.content, total: this.machineList.totalElements };
      });
  }

  /*delete machine*/
  public removeHandler(event) {

    this.swalWarrings.CreateSwal().then((result) => {

      if (result.value) {

        this.machineService.getJavaGenericService()

          .deleteEntity( event.id , MachineConstant.MACHINE_URL)

          .subscribe(() => {

            this.growlService.successNotification(this.translate.instant(NomenclaturesConstant.SUCCESS_OPERATION));

            this.initGridDataSource();

          }, () => {

            this.growlService.ErrorNotification(this.translate.instant(NomenclaturesConstant.FAILURE_OPERATION));

          });

      }

    });

  }

/*navigate to edit machine page*/
  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(MachineConstant.URI_ADVANCED_EDIT.concat(dataItem.id), { queryParams: filter, skipLocationChange: true });
  }




   /**
   * when the page change , the active page change
   * @param state
   */
  dataStateChange(state: DataStateChangeEvent) {
    this.gridSettings.state = state;
  }


  /**
   * load data when the page change with pagination
   * @param event
   */
  onPageChange(event: PageChangeEvent) {
    this.currentPage = (event.skip)  / event.take;
    this.size = event.take;
    this.goPage();
    this.initGridDataSource();
  }

  /**
 * load data into active page
 */
  goPage() {
    this.sectionService.getJavaGenericService().getEntityList(
      MachineConstant.PAGEABLE + `?page=${this.currentPage}&size=${this.size}`).subscribe(data => {
        this.gridSettings.gridData.data = data.content;
      });
  }

  /**
   *filter on list machine page by desription
   */
  onSearch() {
    if (this.value === '') {
      this.initGridDataSource();
    } else {
      this.initGridDataSource(0);
    }
  }

  exportListMachine() {
    const machineIdResponsibleNameMap = {};
    let machines;
    this.subscription$ = this.machineService.getJavaGenericService().getEntityList(MachineConstant.MACHINE_LIST_NOT_DELETED)
      .flatMap((data) => {
        machines = data;
        const idEmployees: Array<number> = [];
        const employessList : Array<any> = [];
        machines.forEach( (element) => {
          idEmployees.push(element.responsibleId);
        });
        return this.userService.getUsersFromListId(idEmployees);
      }).flatMap (employees => {
        machines.forEach( machine => {
          employees.forEach(emp => {
            if (machine.responsibleId === emp.Id) {
              machineIdResponsibleNameMap[machine.id] = emp.FullName;
            }
          });
        });
        return this.machineService.readReport(MachineConstant.MACHINE_LIST_REPORT, machineIdResponsibleNameMap);
      }).subscribe((response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(blob);
          window.open(fileURL, '_blank');
        });
  }
}
