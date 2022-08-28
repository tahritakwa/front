import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { TeamType } from '../../../models/payroll/team-type.model';
import { TeamConstant } from '../../../constant/payroll/team.constant';
import { ListTeamTypeComponent } from '../../../payroll/team-type/list-team-type/list-team-type.component';
import { TeamTypeService } from '../../../payroll/services/team-type/team-type.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';

@Component({
  selector: 'app-team-type-dropdown',
  templateUrl: './team-type-dropdown.component.html',
  styleUrls: ['./team-type-dropdown.component.scss']
})
export class TeamTypeDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() disabled;
  public teamTypeDataSource: TeamType[];
  public teamTypeFiltredDataSource: TeamType[];
  private predicate: PredicateFormat;

  constructor(private teamTypeService: TeamTypeService,
    private formModalDialogService: FormModalDialogService, private viewRef: ViewContainerRef) { }

  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.preparePredicate();
    this.teamTypeService.listdropdownWithPerdicate(this.predicate).toPromise().then((data: any) => {
      this.teamTypeDataSource = data.listData;
      this.teamTypeFiltredDataSource = this.teamTypeDataSource.slice(0);
    });
  }
  public preparePredicate() {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy(SharedConstant.LABEL, OrderByDirection.asc));
  }

  /**
   * filter by code and label
   * @param value
   */
  handleFilter(value: string): void {
    this.teamTypeFiltredDataSource = this.teamTypeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLocaleLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    this.formModalDialogService.openDialog(TeamConstant.ADD_TEAM_TYPE, ListTeamTypeComponent,
      this.viewRef, this.initDataSource.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
}
