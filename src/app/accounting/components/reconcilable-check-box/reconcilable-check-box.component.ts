import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-reconcilable-check-box',
  templateUrl: './reconcilable-check-box.component.html',
  styleUrls: ['./reconcilable-check-box.component.scss']
})
export class ReconcilableCheckBoxComponent implements OnInit {
  @Input() status: boolean;
  constructor() {
  }

  ngOnInit() {
  }

}
