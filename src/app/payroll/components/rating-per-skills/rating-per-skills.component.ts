import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Options} from 'ng5-slider';
import {SkillsDropdownComponent} from '../../../shared/components/skills-dropdown/skills-dropdown.component';

@Component({
  selector: 'app-rating-per-skills',
  templateUrl: './rating-per-skills.component.html',
  styleUrls: ['./rating-per-skills.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RatingPerSkillsComponent implements OnInit {

  @ViewChild(SkillsDropdownComponent) SkillsDropdownComponent;
  @Input() skillsFamilySelected: number[];
  @Input() form;
  @Output() formChanged = new EventEmitter<boolean>();
  @Output() formChanged2 = new EventEmitter<boolean>();
  @Output() skillsConfigChanged = new EventEmitter<boolean>();
  public showSlider = false;
  // Slider Properties
  options: Options = {
    floor: 0,
    ceil: 6,
    step: 1,
    getPointerColor: (value: number): string => 'rgba(154, 186, 199, 0.85)',
    getSelectionBarColor: (value: number): string => 'rgba(154, 186, 199, 0.85)',
  };

  constructor() {
  }

  ngOnInit() {
  }

  valueChanged($event) {
    this.formChanged.emit($event);
    this.showSlider = true;
  }

  valueChanged2($event) {
    this.formChanged2.emit($event);
  }

  // When Family is selected
  public getSkillsRelatedToFamily(families) {
    this.SkillsDropdownComponent.getSkillsRelatedToFamily(families);
  }

  public skillsConfigChangedEvent() {
    this.skillsConfigChanged.emit(true);
  }
}
