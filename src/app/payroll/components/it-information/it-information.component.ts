import { Component, OnInit, Input } from '@angular/core';
import { Active } from '../../../models/immobilization/active.model';
import { ExitEmployeeConstant } from '../../../constant/payroll/exit-employee.constant';
import { PredicateFormat } from '../../../shared/utils/predicate';
import { ExitEmployeeService } from '../../services/exit-employee/exit-employee.service';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { ExitEmployee } from '../../../models/payroll/exit-employee.model';
import { ExitEmployeeStatusEnum } from '../../../models/enumerators/exit-employee-status-enum';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-it-information',
  templateUrl: './it-information.component.html',
  styleUrls: ['./it-information.component.scss']
})
export class ItInformationComponent implements OnInit {
  @Input() employeeExit: ExitEmployee;

  // predicate Related To the grid
  public predicate: PredicateFormat;
  historyResult: Active[];
  isUpdateMode = false;
  public isEmptyActif: boolean;
  public statusCode = ExitEmployeeStatusEnum;
  isDisabled = false;
  /**
 * formatDate
 * */
   public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  constructor(public exitEmployeeService: ExitEmployeeService, private translate: TranslateService) { }

  ngOnInit() {
    this.isEmptyActif = true;
    if (this.employeeExit && this.employeeExit.History.length > NumberConstant.ZERO) {
      this.historyResult = this.employeeExit.History.map(x => x.IdActiveNavigation);
      this.isEmptyActif = false;
      this.isDisabled = this.employeeExit.RecoveredMaterial && this.employeeExit.Status === this.statusCode.Accepted;
    }
  }

  setEmployeeRecoveredMaterials() {
    this.employeeExit.RecoveredMaterial = !this.employeeExit.RecoveredMaterial;
    this.exitEmployeeService.save(this.employeeExit, false).subscribe(res => {
      this.isDisabled = true;
    });
  }
}
