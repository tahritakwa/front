import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Active } from '../../../models/immobilization/active.model';
import { ActiveService } from '../../services/active/active.service';
import { DropDownComponent } from '../../../shared/interfaces/drop-down-component.interface';
import { ReducedActive } from '../../../models/immobilization/reduced-active.model';


@Component({
  selector: 'app-active-dropdown',
  templateUrl: './active-dropdown.component.html',
  styleUrls: ['./active-dropdown.component.scss']
})
export class ActiveDropdownComponent implements OnInit, DropDownComponent {
  @Input() form: FormGroup;
  @Input() valueChange;
  @Input() allowCustom;
  @Input() onlyDMSactive : boolean;
  public activeDataSource: ReducedActive[];
  public activeFiltredDataSource: ReducedActive[];
  constructor(private activeService: ActiveService) { }
  ngOnInit() {
    this.initDataSource();
  }
  initDataSource(): void {
    this.activeService.listdropdown().subscribe((data: any) => {
      this.activeDataSource =this.onlyDMSactive? data.listData.filter(x => x.ServiceDate != null) :data.listData;
      this.activeFiltredDataSource = this.activeDataSource.slice(0);
    });
  }
  /**
   * filter by label && description && code
   * @param value
   */
  handleFilter(value: string): void {
    this.activeFiltredDataSource = this.activeDataSource.filter((s) =>
      s.Code.toLowerCase().includes(value.toLowerCase())
      || s.Label.toLowerCase().includes(value.toLowerCase())
    );
  }
  addNew(): void {
    throw new Error('Method not implemented.');
  }
  get IdActive(): FormControl {
    return this.form.get('IdActive') as FormControl;
  }
}
