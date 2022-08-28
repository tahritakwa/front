import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../administration/services/user/user.service';
import {State} from '@progress/kendo-data-query';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {GridSettings} from '../../../shared/utils/grid-settings.interface';
import {TranslateService} from '@ngx-translate/core';
import {ExitEmployeeConstant} from '../../../constant/payroll/exit-employee.constant';
import {ExitEmployeeService} from '../../services/exit-employee/exit-employee.service';
import {Filter, Operation, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {AdministrativeDocumentStatusEnumerator} from '../../../models/enumerators/administrative-document-status.enum';
import {ExitEmployee} from '../../../models/payroll/exit-employee.model';
import {ExitActionEmployeeService} from '../../services/exit-action-employee/exit-action-employee.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-exit-employee-desactivate',
  templateUrl: './exit-employee-desactivate.component.html',
  styleUrls: ['./exit-employee-desactivate.component.scss']
})
export class ExitEmployeeDesactivateComponent implements OnInit {
  @Input() employeeExit: ExitEmployee;
  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);
  public listOfActions: any[] = [];
  public statusCode = AdministrativeDocumentStatusEnumerator;
  public exitEmployeeAccountInformation: any;
  public exitEmployeeContractInformation: any;
  public exitEmployeeRelationInformation: any;
  public exitEmployeeTeamInformation: any;

  /**
   * Predicate
   */
  public predicate: PredicateFormat;
  gridState: State = {
    skip: NumberConstant.ZERO,
    take: NumberConstant.TWENTY,
    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public gridSettings: GridSettings = {
    state: this.gridState,
  };

  constructor(public userService: UserService, public exitActionEmployeeService: ExitActionEmployeeService,
              public translate: TranslateService, public exitEmployeeService: ExitEmployeeService) {
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.preparePredicate();
    this.exitActionEmployeeService.reloadServerSideData(this.gridSettings.state, this.predicate)
      .subscribe(data => {
          this.gridSettings.gridData = data;
        }
      );
  }

  /**
   * choose method according to idAction
   */
  ChooseMethodAccordingToAction(IdExitAction: number, employeeExit: ExitEmployee) {
    this.exitEmployeeService.ChooseMethodAccordingToAction(IdExitAction, this.employeeExit).subscribe(() => {
      this.initGridDataSource();
    });
  }

  /**
   * load actions details
   * @param event
   */
  public loadActionsInformation(event: any) {
    this.exitActionEmployeeService.getExitActionEmployeeInformation(event.dataItem)
      .subscribe(data => {
        if (data.Action == ExitEmployeeConstant.DESACTIVATED_ACTION) {
          this.exitEmployeeAccountInformation = data;
        } else if (data.Action == ExitEmployeeConstant.CONTRACT_ACTION) {
          this.exitEmployeeContractInformation = data;
        } else if (data.Action == ExitEmployeeConstant.SUPERVISOR_ACTION) {
          this.exitEmployeeRelationInformation = data;
        } else if (data[NumberConstant.ZERO].Action == ExitEmployeeConstant.TEAM_ACTION) {
          this.exitEmployeeTeamInformation = data;
        }

      });
  }

  /**
   * prepare predicate
   */
  private preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation,
      [new Relation(ExitEmployeeConstant.ID_ACTIONS_NAVIGATION)]);
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(ExitEmployeeConstant.ID_EXIT_EMPLOYEE, Operation.eq, this.employeeExit.Id));
  }
}
