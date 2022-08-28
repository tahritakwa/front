import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatStepper} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {GrowlService} from '../../../../../COM/Growl/growl.service';
import {ExitEmployeeConstant} from '../../../../constant/payroll/exit-employee.constant';
import {ExitEmployeeStatusEnum} from '../../../../models/enumerators/exit-employee-status-enum';
import {ExitEmployee} from '../../../../models/payroll/exit-employee.model';
import {ListMeetingExitEmployeeComponent} from '../../../meeting-exit-employee/list-meeting-exit-employee/list-meeting-exit-employee.component';
import {ExitEmployeeDesactivateComponent} from '../../exit-employee-desactivate/exit-employee-desactivate.component';
import {ExitEmployeePayComponent} from '../../exit-employee-pay/exit-employee-pay.component';
import {ItInformationComponent} from '../../it-information/it-information.component';
import {RhInformationComponent} from '../../rh-information/rh-information.component';

@Component({
  selector: 'app-exit-employee-steper',
  templateUrl: './exit-employee-steper.component.html',
  styleUrls: ['./exit-employee-steper.component.scss']
})
export class ExitEmployeeSteperComponent implements OnInit {
  isLinear = true;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild(RhInformationComponent) rhInformationViewChild;
  @ViewChild(ItInformationComponent) itInformationViewChild;
  @ViewChild(ListMeetingExitEmployeeComponent) listMeetingExitEmployeeViewChild;
  @ViewChild(ExitEmployeeDesactivateComponent) exitEmployeeDesactivateComponentViewChild;
  @ViewChild(ExitEmployeePayComponent) exitEmployeePayComponentViewChild;
  @Input() employeeExit: ExitEmployee;
  public statusCode = ExitEmployeeStatusEnum;

  constructor(private growService: GrowlService, private translate: TranslateService) {
  }

  ngOnInit() {
  }

  checkIfExitEmployeeIsAccepted() {
    if (this.employeeExit && this.employeeExit.Status === this.statusCode.Waiting) {
      this.growService.ErrorNotification(this.translate.instant(ExitEmployeeConstant.VALIDATE_EXIT_EPLOYEE_BEFORE_CHOOSING_ANOTHER_STEP));
    }
  }
}
