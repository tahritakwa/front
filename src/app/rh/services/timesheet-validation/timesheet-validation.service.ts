import {Injectable} from '@angular/core';
import {TimeSheetService} from '../timesheet/timesheet.service';
import {TimeSheetConstant} from '../../../constant/rh/timesheet.constant';
import {StarkPermissionsService} from '../../../stark-permissions/stark-permissions.module';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {SwalWarring} from '../../../shared/components/swal/swal-popup';
import {TimeSheetStatusEnumerator} from '../../../models/enumerators/timeSheet-status-enumerator.enum';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {GrowlService} from '../../../../COM/Growl/growl.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class TimesheetValidationService {

  constructor(private timeSheetService: TimeSheetService, private permissionsService: StarkPermissionsService,
              private swalWarrings: SwalWarring, private growlService: GrowlService, private translate: TranslateService) {
  }

  public SendMail(id: number, date: Date) {
    this.timeSheetService.sendMail(id, date).subscribe(res => {
      switch (res) {
        case TimeSheetStatusEnumerator.ToDo:
          this.growlService.InfoNotification(this.translate.instant(TimeSheetConstant.TO_DO_INFO));
          break;
        case TimeSheetStatusEnumerator.Draft:
          this.growlService.InfoNotification(this.translate.instant(TimeSheetConstant.DRAFT_INFO));
          break;
        case TimeSheetStatusEnumerator.ToReWork:
          this.growlService.InfoNotification(this.translate.instant(TimeSheetConstant.TO_REWORK_INFO));
          break;
        case TimeSheetStatusEnumerator.Sended:
          this.growlService.InfoNotification(this.translate.instant(TimeSheetConstant.SENDED_INFO));
          break;
        case TimeSheetStatusEnumerator.PartiallyValidated:
          this.growlService.InfoNotification(this.translate.instant(TimeSheetConstant.SENDED_INFO));
          break;
      }
    });
  }

  public checkIfConnectedUserHasRightToValidate(): Observable<any> {
    const subject = new Subject<boolean>();
    this.permissionsService.hasPermission(TimeSheetConstant.VALIDATE_FUNCTIONALITY_NAME).then(x => {
      subject.next(x);
    });
    return subject.asObservable();
  }

  public isInEmployeesHierarchy(id: number, employeeHierarchy: number[]) {
    return (employeeHierarchy.indexOf(id) > -1);
  }

  public validateCRA(dataItem, allIds?) {
    this.swalWarrings.CreateSwal(SharedConstant.ARE_YOU_SURE_TO_CONTINUE,
      TimeSheetConstant.TITLE_SWAL_WARRING_VALIDATE_TIMESHEET, SharedConstant.VALIDATE, SharedConstant.NO).then((result) => {
      if (result.value) {
        this.timeSheetService.definitiveValidate(dataItem.IdEmployee, dataItem.IdTimeSheet)
          .subscribe(() => {
            if (dataItem.TimesheetStatus) {
              dataItem.TimesheetStatus = TimeSheetStatusEnumerator.Validated;
            }
            if (dataItem.IdTimeSheetNavigation) {
              dataItem.IdTimeSheetNavigation.Status = TimeSheetStatusEnumerator.Validated;
            }
            if (allIds) {
              if (dataItem.EntityName === SharedConstant.CONTRACT) {
                allIds.push(dataItem.Id);
              } else {
                allIds.push(dataItem.IdEmployee);
              }
            }
          });
      }
    });
  }
}
