import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-variable-validity-period',
  templateUrl: './manage-variable-validity-period.component.html',
  styleUrls: ['./manage-variable-validity-period.component.scss']
})
export class ManageVariableValidityPeriodComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() isFirstElement: boolean;
  @Input() isVariable: boolean;

  constructor() { }

  ngOnInit() {
  }


}
