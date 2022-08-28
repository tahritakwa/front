import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { EmployeeConstant } from '../../../constant/payroll/employee.constant';
import { CandidacyConstant } from '../../../constant/rh/candidacy.constant';
import { RecruitmentConstant } from '../../../constant/rh/recruitment.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { RecruitmentState } from '../../../models/enumerators/recruitment-state.enum';
import { Candidacy } from '../../../models/rh/candidacy.model';
import { SwalWarring } from '../../../shared/components/swal/swal-popup';
import { ColumnSettings } from '../../../shared/utils/column-settings.interface';
import { GridSettings } from '../../../shared/utils/grid-settings.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../../shared/utils/predicate';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { CandidacyService } from '../../services/candidacy/candidacy.service';
import { RecruitmentService } from '../../services/recruitment/recruitment.service';

@Component({
  selector: 'app-hiring',
  templateUrl: './hiring.component.html',
  styleUrls: ['./hiring.component.scss']
})
export class HiringComponent implements OnInit {

  @Output() actionSelected = new EventEmitter<boolean>();
  @Input() recruitmentId;
  public recruitmentStateEnum = RecruitmentState;
  public recruitmentState: number;
  public hasFullRecuitmentPermission: boolean;
  public hasEmployeeShowOrUpdatePermission: boolean;
  // begin gridSettings
  gridState: State = {
    skip: 0,
    take: 5
  };
  public columnsConfig: ColumnSettings[] = [
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_FULL_NAME,
      title: RecruitmentConstant.CANDIDATE_UPPERCASE,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    },
    {
      field: RecruitmentConstant.CANDIDATE_NAVIGATION_EMAIL,
      title: RecruitmentConstant.EMAIL,
      filterable: true,
      _width: NumberConstant.THREE_HUNDRED
    }
  ];
  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  private allCandidacyList: Candidacy[];
  private predicate: PredicateFormat;

  // end gridSettings
  constructor(private candidacyService: CandidacyService, private swalWarrings: SwalWarring, public authService: AuthService,
    private recruitmentService: RecruitmentService) {
  }

  ngOnInit() {
    this.hasFullRecuitmentPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.FULL_RECRUITMENT);
    this.hasEmployeeShowOrUpdatePermission = this.authService.hasAuthorities([PermissionConstant.RHAndPaiePermissions.SHOW_EMPLOYEE,
      PermissionConstant.RHAndPaiePermissions.UPDATE_EMPLOYEE]);
    this.initGridDataSource();
  }

  public initGridDataSource(): void {
    this.preparePredicate();
    this.candidacyService.reloadServerSideData(this.gridSettings.state, this.predicate).subscribe((data) => {
      this.gridSettings.gridData = data;
      this.allCandidacyList = data.data;
      this.dataStateChange(this.gridSettings.state);
    });
    this.initRecruitmentState();
  }

  initRecruitmentState(): any {
    this.recruitmentService.getById(this.recruitmentId).subscribe(result => {
      this.recruitmentState = result.State;
    });
  }

  dataStateChange(state: State) {
    this.gridSettings.state = state;
    const listCandidacy = Object.assign([], this.allCandidacyList);
    this.gridSettings.gridData = process(listCandidacy, state);
  }

  isCurrentRecruitmentCompleted(): boolean {
    return this.recruitmentState === RecruitmentState.Closed;
  }

  generateEmployeeCard(candidacy: Candidacy) {
    if (candidacy) {
      this.swalWarrings.CreateSwal(CandidacyConstant.GENERATE_EMPLOYEE_CARD_FROM_CANDIDACY_ASSERTION_UPPER_CASE,
        undefined, CandidacyConstant.GENERATE_UPPER_CASE).then((result) => {
        if (result.value) {
          this.candidacyService.generateEmployeeFromCandidacy(candidacy).subscribe(employeeId => {
            this.actionSelected.emit();
            if (employeeId && this.hasEmployeeShowOrUpdatePermission) {
              window.open(EmployeeConstant.EMPLOYEE_EDIT_URL.concat(employeeId), SharedConstant.TARGET_BLANK);
            }
          });
        }
      });
    }
  }

  private preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Filter.push(new Filter(RecruitmentConstant.CANDIDACY_ID_RECRUITMENT, Operation.eq, this.recruitmentId));
    this.predicate.Filter.push(new Filter(RecruitmentConstant.STATE, Operation.gte, RecruitmentState.Hiring));
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(RecruitmentConstant.ID_CANDIDATE_NAVIGATION)]);
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push.apply(this.predicate.OrderBy,
      [new OrderBy(RecruitmentConstant.CANDIDATE_NAVIGATION_FIRST_NAME, OrderByDirection.asc)]);
  }
}
