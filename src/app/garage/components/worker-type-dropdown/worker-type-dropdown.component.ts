import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GarageConstant } from '../../../constant/garage/garage.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';

@Component({
  selector: 'app-worker-type-dropdown',
  templateUrl: './worker-type-dropdown.component.html',
  styleUrls: ['./worker-type-dropdown.component.scss']
})
export class WorkerTypeDropdownComponent implements OnInit {

  @Input() itemForm: FormGroup;
  @Output() Selected = new EventEmitter<any>();
  public workersStates: { value: any, name: string }[] = [{
    value: 1,
    name: this.translate.instant(GarageConstant.RESPONSIBLE_TITLE)
  }
    ,
  {
    value: 0,
    name: this.translate.instant(GarageConstant.WORKER_TITLE)
  },
  {
    value: '',
    name: this.translate.instant(GarageConstant.ALL_WORKERS)
  }];
  public defaultWorkersState = this.workersStates[NumberConstant.TWO];
  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
  }
  /**
     * filter active or deactivated users
     * @param state
     */
  public onCheckAllWorkers(state?: boolean) {
    this.Selected.emit(state);
  }

}
