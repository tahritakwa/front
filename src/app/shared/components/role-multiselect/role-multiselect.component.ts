import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { Role } from '../../../models/administration/role.model';
import { RoleService } from '../../../administration/services/role/role.service';
import { OrderBy, OrderByDirection, PredicateFormat } from '../../utils/predicate';
import { RoleConstant } from '../../../constant/Administration/role.constant';
import { RoleJavaService } from '../../../administration/services/role/role.java.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';

const ID = 'Id';
const USER_ROLE = 'UserRole';

@Component({
  selector: 'app-role-multiselect',
  templateUrl: './role-multiselect.component.html',
  styleUrls: ['./role-multiselect.component.scss']
})
export class RoleMultiselectComponent implements OnInit, DropDownComponent {
  @Input() form: FormGroup;
  @Input() isDisabled: boolean;
  @Input() userRoleIdsDataSource: number[];
  @Input() isMultiSelect: true;

  @Output() selectedNames: EventEmitter<any> = new EventEmitter<any>();

  public roleDataSource: Role[];
  public roleFiltredDataSource: Role[];
  public selectedValues: number[];
  public predicate: PredicateFormat;

  lastConnectedCompanyCode = this.localStorageService.getCompanyCode();
  constructor(private roleJavaService: RoleJavaService, private localStorageService : LocalStorageService) { }

  ngOnInit() {
    this.initDataSource();
    if (this.userRoleIdsDataSource) {
      this.selectedValues = this.userRoleIdsDataSource;
    }
  }
  initDataSource(): void {
    this.roleJavaService.getJavaGenericService().getEntityList(`roles?companyCode=${this.lastConnectedCompanyCode}`)
      .subscribe((allRoles: Array<Role>) => {
        this.roleDataSource = allRoles;
        this.roleFiltredDataSource = this.roleDataSource.slice(0);
      });

  }

  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.roleFiltredDataSource = this.roleDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()) || s.RoleName.toLowerCase().includes(value.toLowerCase())
    );
    if (this.UserRole){
    this.roleFiltredDataSource = this.roleDataSource.filter((s) =>
      s.RoleName.toLowerCase().includes(value.toLowerCase()));
    }
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
  get UserRole(): FormControl {
    return <FormControl>this.form.get(USER_ROLE);
  }
  get MasterRoleUser(): FormControl {
    return <FormControl>this.form.get('MasterRoleUser');
  }
  public handleValue($event): void {
    if(!this.isMultiSelect){
      const result = this.roleDataSource.filter(x => x.Id ==$event).map(x => x.RoleName);
      this.selectedNames.emit(result);
    }else {
    const result = this.roleDataSource.filter(x => $event.includes(x.Id)).map(x => x.RoleName);
    this.selectedNames.emit(result);
  }
  }
}


