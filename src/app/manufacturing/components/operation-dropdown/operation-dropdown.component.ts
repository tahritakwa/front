import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {OperationService} from '../../service/operation.service';

@Component({
  selector: 'app-operation-dropdown',
  templateUrl: './operation-dropdown.component.html',
  styleUrls: ['./operation-dropdown.component.scss']
})
export class OperationDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() selectedOperationId = new EventEmitter<boolean>();
  public operationFiltredList = [];
  public operationId = [];

  constructor(public translate: TranslateService, private operationService: OperationService) {
  }

  public initDataSource() {
    this.operationService.getJavaGenericService().getEntityList()
      .subscribe((data) => {
        this.operationId = data;
        this.operationFiltredList = this.operationId.slice(0);
      });
  }

  handleFilterParentCode(value): void {
    this.operationFiltredList = this.operationId.filter((s) =>
      s.description.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(event): void {
    this.selectedOperationId.emit(event);
  }

  ngOnInit() {
    this.initDataSource();
  }

}
