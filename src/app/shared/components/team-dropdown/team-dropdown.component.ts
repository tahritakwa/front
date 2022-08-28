import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {DropDownComponent} from '../../interfaces/drop-down-component.interface';
import {FormControl, FormGroup} from '@angular/forms';
import {TeamService} from '../../../payroll/services/team/team.service';
import {ReducedTeam} from '../../../models/payroll/reduced-team.model';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {AddTeamComponent} from '../../../payroll/team/add-team/add-team.component';
import {TeamConstant} from '../../../constant/payroll/team.constant';
import {PermissionConstant} from '../../../Structure/permission-constant';
import { AuthService } from '../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-team-dropdown',
  templateUrl: './team-dropdown.component.html',
  styleUrls: ['./team-dropdown.component.scss']
})
export class TeamDropdownComponent implements OnInit, DropDownComponent {

  @Input() formGroup: FormGroup;
  @Input() allowCustom;
  @Output() selected = new EventEmitter<boolean>();
  public hasAddTeamPermission = false;
  public teamDataSource: ReducedTeam[];
  public teamFiltredDataSource: ReducedTeam[];

  constructor(private teamService: TeamService,
              private formModalDialogService: FormModalDialogService,
              private authService: AuthService,
              private viewRef: ViewContainerRef) {
  }

  get IdTeam(): FormControl {
    return this.formGroup.get('IdTeam') as FormControl;
  }

  ngOnInit() {
    this.hasAddTeamPermission = this.authService.hasAuthority(PermissionConstant.RHAndPaiePermissions.ADD_TEAM);
    this.initDataSource();
  }

  initDataSource(): void {
    this.teamService.listdropdown().subscribe((data: any) => {
      this.teamDataSource = data.listData;
      this.teamFiltredDataSource = this.teamDataSource.slice(0);
    });
  }

  /**
   * filter by Name
   * @param value
   */
  handleFilter(value: string): void {
    this.teamFiltredDataSource = this.teamDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase())
    );
  }

  addNew(): void {
    this.formModalDialogService.openDialog(TeamConstant.ADD_TEAM, AddTeamComponent,
      this.viewRef, this.initDataSource.bind(this), true, true, SharedConstant.MODAL_DIALOG_SIZE_ML);
  }

  /**
   * Fire Change Type
   *  Slected
   * @param $event
   */
  public teamSelected($event) {
    this.selected.emit($event);
  }

}
