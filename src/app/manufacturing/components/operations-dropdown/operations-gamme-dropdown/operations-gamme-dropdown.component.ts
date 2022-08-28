import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PagerSettings } from '@progress/kendo-angular-grid';
import { SharedConstant } from '../../../../constant/shared/shared.constant';
import { NumberConstant } from '../../../../constant/utility/number.constant';
import { GammeService } from '../../../service/gamme.service';

@Component({
  selector: 'app-operations-gamme-dropdown',
  templateUrl: './operations-gamme-dropdown.component.html',
  styleUrls: ['./operations-gamme-dropdown.component.scss']
})
export class OperationsGammeDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Output() selectedOperation = new EventEmitter<boolean>();
  @Output() firstOperation = new EventEmitter<any>();
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public operationFiltredList = [];
  public ids = [];
  public idOperation: any;
  @Input()
  public idGamme: number;
  public defaultItem: any = { displayName: 'None', value: null };

  constructor(public translate: TranslateService, private gammeService: GammeService) {
  }

  public initDataSource() {
    this.gammeService.getListOperationsByGamme(this.idGamme)
      .subscribe((data) => {
        this.ids = data;
        this.operationFiltredList = this.ids.slice(0);
        this.firstOperation.emit(this.operationFiltredList[0].id);
      });
      
  }

  handleFilterParentCode(value): void {
    this.operationFiltredList = this.ids.filter((s) =>
      s.description.toLocaleLowerCase().includes(value.toLowerCase()));
  }

  public onSelect(value): void {
    this.selectedOperation.emit(value);
  }

  ngOnInit() {
    this.initDataSource();
  }

 

}
