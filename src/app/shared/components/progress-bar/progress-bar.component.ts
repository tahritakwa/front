import { Component, OnInit, Input } from '@angular/core';
import { ProgressBar } from '../../../models/payroll/progress-bar.model';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  @Input()
  progress: ProgressBar;

  constructor() { }

  ngOnInit() {
  }

}
