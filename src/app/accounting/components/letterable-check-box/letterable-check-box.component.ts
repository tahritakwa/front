import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-letterable-check-box',
  templateUrl: './letterable-check-box.component.html',
  styleUrls: ['./letterable-check-box.component.scss']
})
export class LetterableCheckBoxComponent implements OnInit {
  @Input() status: boolean;
  constructor() {
  }

  ngOnInit() {
  }

}
