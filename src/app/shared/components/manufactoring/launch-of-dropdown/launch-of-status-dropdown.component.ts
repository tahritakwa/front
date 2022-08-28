import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EnumValues} from 'enum-values';
import {OfStatus} from '../../../../models/enumerators/of-status.enum';
import {TranslateService} from '@ngx-translate/core';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {OfStatusFilterLaunchOfEnum} from '../../../../models/enumerators/of-status-filter-launch-of.enum';


@Component({
  selector: 'app-launch-of-status-dropdown',
  templateUrl: './launch-of-status-dropdown.component.html',
})
export class LaunchOfStatusDropdownComponent implements OnInit {
  @Input() group;
  @Input() allowCustom;
  @Input() disabled: boolean;
  @Output() Selected: EventEmitter<any> = new EventEmitter();
  @ViewChild(ComboBoxComponent) public ofStatusDropdownComponent: ComboBoxComponent;
  ofStatusEnumerator = EnumValues.getNamesAndValues(OfStatusFilterLaunchOfEnum);
  public ofStatusDataSource: any;
  constructor(public translateService: TranslateService) {
  }
  ngOnInit(): void {
    this.initDataSource();
  }
  public onValueChanged(event): void {
    this.Selected.emit(event);
  }
  initDataSource(): void {
    this.ofStatusDataSource = [];
    this.ofStatusEnumerator.forEach(element => {
      const elem = element;
      elem.name = this.translateService.instant(elem.name.toUpperCase());
      this.ofStatusDataSource.push(elem);
    });
  }


}
