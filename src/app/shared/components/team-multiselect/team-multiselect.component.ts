import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import {TeamService} from '../../../payroll/services/team/team.service';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import { PredicateFormat, OrderBy, OrderByDirection } from '../../../shared/utils/predicate';
import { ReducedTeam } from '../../../models/payroll/reduced-team.model';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { AuthService } from '../../../login/Authentification/services/auth.service';
import { PermissionConstant } from '../../../Structure/permission-constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { ComponentsConstant } from '../../../constant/shared/components.constant';

@Component({
  selector: 'app-team-multiselect',
  templateUrl: './team-multiselect.component.html',
  styleUrls: ['./team-multiselect.component.scss']
})
export class TeamMultiselectComponent implements OnInit {

  @Output() Selected = new EventEmitter<any>();
  @Input() allowCustom;
  @Input() form: FormGroup;
  @Input() allTeam;
  @Input() IdTeam: string;
  @Input() showFromFilter = false;
  public selectedValueMultiSelect = [];

  public teamDataSource: ReducedTeam[];
  public teamFiltredDataSource: ReducedTeam[];
  public name;
  public dropdownSettings = {};

  constructor(private teamService: TeamService, public translate: TranslateService, private authService: AuthService) { }

  ngOnInit() {
    this.initCheckboxDropdownMode();
    if (this.showFromFilter) {
      this.allTeam = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.VALIDATE_LEAVE);
    }
    this.initDataSource();
    if (!this.IdTeam) {
      this.IdTeam = TeamConstant.ID_TEAM;
    }
  }

  prepareTeamPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.OrderBy.push.apply(myPredicate.OrderBy, [new OrderBy(TeamConstant.NAME, OrderByDirection.asc)]);
    return myPredicate;
  }

  initDataSource(): void {
    if (this.allTeam) {
      this.teamService.listdropdownWithPerdicate(this.prepareTeamPredicate()).subscribe((data: any) => {
        this.teamDataSource = data.listData;
        this.teamFiltredDataSource = this.teamDataSource.slice(NumberConstant.ZERO);
      });
    } else {
      this.teamService.getEmployeeTeamDropdown( ).subscribe(data => {
        this.teamDataSource = data;
        this.teamFiltredDataSource = this.teamDataSource.slice(NumberConstant.ZERO);
      });
    }
  }
  handleFilter(value: string): void {
    this.teamFiltredDataSource = this.teamDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(event): void {
    this.Selected.emit(event.selectedValueMultiSelect.map(x => x.Id));
  }

  onDeSelectAll() {
    this.Selected.emit();
  }
  /**
   * select all items
   * @param $event
   */
  onSelectAll() {
    const allSelectedIds =  this.teamDataSource.map(x => x.Id);
    this.Selected.emit(allSelectedIds);
  }
  public initCheckboxDropdownMode() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: ComponentsConstant.ID,
      textField: TeamConstant.NAME,
      selectAllText: this.translate.instant(ComponentsConstant.SELECT_ALL),
      unSelectAllText: this.translate.instant(ComponentsConstant.DESELECT_ALL),
      allowSearchFilter: true
    };
  }
}
