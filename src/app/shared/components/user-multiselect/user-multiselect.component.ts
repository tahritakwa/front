import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { Role } from '../../../models/administration/role.model';

const ID = 'Id';
const USER_ROLE = 'UserRole';

@Component({
  selector: 'app-user-multiselect',
  templateUrl: './user-multiselect.component.html',
  styleUrls: ['./user-multiselect.component.scss']
})
export class UserMultiselectComponent implements OnInit, DropDownComponent{
  @Input() form: FormGroup;
  @Input() isDisabled: boolean;
  public roleDataSource: Role[];
  public roleFiltredDataSource: Role[];

  public selectedValues: number[];
  constructor() { }

  ngOnInit() {
  }

  initDataSource(): void {
  }
  
  /**
   * filter by code taxe and label
   * @param value
   */
  handleFilter(value: string): void {
    this.roleFiltredDataSource = this.roleDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
  get UserRole(): FormControl {
    return <FormControl>this.form.get(USER_ROLE);
  }
}


