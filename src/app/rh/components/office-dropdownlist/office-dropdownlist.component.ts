import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OfficeService} from '../../../administration/services/office/office.service';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat} from '../../../shared/utils/predicate';
import {OfficeConstant} from '../../../constant/shared/office.constant';
import {ReducedOffice} from '../../../models/rh/reduced-office.model';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-office-dropdownlist',
  templateUrl: './office-dropdownlist.component.html',
  styleUrls: ['./office-dropdownlist.component.scss']
})
export class OfficeDropdownlistComponent implements OnInit {
  @Input() group: FormGroup;
  @Input() idOfficeColName: string;
  @Input() officeToIgnore: number;
  @Input() disabled: boolean;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  public officeDataSource: ReducedOffice[];
  public officeFiltredDataSource: ReducedOffice[];

  constructor(private translate: TranslateService, private officeService: OfficeService) {
  }

  ngOnInit() {
    if (!this.idOfficeColName) {
      this.idOfficeColName = OfficeConstant.ID_OFFICE;
    }
    this.initDataSource();
  }

  initDataSource(): void {
    this.officeService.listdropdownWithPerdicate(this.preparePredicate()).subscribe((data: any) => {
      this.officeDataSource = data.listData;
      this.officeFiltredDataSource = this.officeDataSource;
    });
  }

  public preparePredicate(): PredicateFormat {
    let myPrediacte = new PredicateFormat();
    myPrediacte.OrderBy = new Array<OrderBy>();
    myPrediacte.OrderBy.push.apply(myPrediacte.OrderBy,
      [new OrderBy(OfficeConstant.OFFICE_NAME, OrderByDirection.asc)]);
    myPrediacte.Filter = new Array<Filter>();
    if (this.officeToIgnore) {
      myPrediacte.Filter.push(new Filter(OfficeConstant.ID, Operation.neq, this.officeToIgnore));
    }
    return myPrediacte;
  }

  handleFilter(value: string): void {
    this.officeFiltredDataSource = this.officeDataSource.filter((s) =>
      s.OfficeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onSelect($event) {
    const selectedOffice = this.officeFiltredDataSource.filter(x => x.Id === this.group.get(this.idOfficeColName).value)[0];
    this.selected.emit(selectedOffice);
  }
}
