import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { SalaryStructureConstant } from '../../../constant/payroll/salary-structure.constant';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { SalaryStructure } from '../../../models/payroll/salary-structure.model';
import { SalaryStructureService } from '../../../payroll/services/salary-structure/salary-structure.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation } from '../../utils/predicate';

@Component({
  selector: 'app-salary-structure-dropdown',
  templateUrl: './salary-structure-dropdown.component.html',
  styleUrls: ['./salary-structure-dropdown.component.scss']
})
export class SalaryStructureDropdownComponent implements OnInit, DropDownComponent {
  @Input() group;
  @Input() allowCustom;
  @Input() notWithRoot: boolean;
  @Input() idCurrent;
  @Input() parent: boolean;
  @Input() disabled: boolean;
  @Output() Selected = new EventEmitter<any>();
  @Input() unableEdit;
  @Input() selectedSalaryStructure: number;
  public salaryStructureDataSource: SalaryStructure[];
  public salaryStructureFiltredDataSource: SalaryStructure[];
  private predicate: PredicateFormat;
  @ViewChild(ComboBoxComponent) public salaryStructureDropdownComponent: ComboBoxComponent;

  constructor(private salaryStructureService: SalaryStructureService) { }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.predicate = new PredicateFormat();
    this.predicate.Filter = new Array<Filter>();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.Relation.push.apply(this.predicate.Relation, [new Relation(SalaryStructureConstant.SALARY_STRUCTURE_VALIDITY_PERIOD)]);
    if (this.notWithRoot) {
      this.predicate.Filter.push(new Filter(SalaryStructureConstant.SALARY_STRUCTURE_ORDER, Operation.neq, NumberConstant.ZERO));
    }
    if (this.idCurrent) {
      this.predicate.Filter.push(new Filter(SharedConstant.ID, Operation.neq, this.idCurrent));
    }
    this.predicate.OrderBy.push(new OrderBy(SalaryStructureConstant.SALARY_STRUCTURE_REFERENCE, OrderByDirection.asc));
    this.salaryStructureService.readPredicateData(this.predicate).subscribe(data => {
      this.salaryStructureDataSource = data;
      this.salaryStructureFiltredDataSource = this.salaryStructureDataSource.slice(0);
    });
  }

  /**
   * filter by name and salary reference
   * @param value
   */
  handleFilter(value: string): void {
    this.salaryStructureFiltredDataSource = this.salaryStructureDataSource.filter((s) =>
      s.Name.toLowerCase().includes(value.toLowerCase())
      || s.SalaryStructureReference.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  /**
   * get SalaryStructName By Id
   * @param idSalaryStruct
   */
  getSalaryStructReferenceById(idSalaryStruct: number): string {
    return this.salaryStructureFiltredDataSource.find(x => x.Id === idSalaryStruct)
      ? this.salaryStructureFiltredDataSource.find(x => x.Id === idSalaryStruct).SalaryStructureReference : '';
  }

  /**
   * onChangeValue
   * @param value
   */
  onValueChange(value: any): void {
    // this.group.setControl(EmployeeConstant.SALARY_STRUCTURE_NAME, new FormControl(this.getSalaryStructReferenceById(value)));
    this.Selected.emit(this.salaryStructureFiltredDataSource.filter(x => x.Id === value)[NumberConstant.ZERO]);
  }

}
