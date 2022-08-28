import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { SharedConstant } from '../../constant/shared/shared.constant';

@Component({
  selector: 'app-skills-career-menu',
  templateUrl: './skills-career-menu.component.html',
  styleUrls: ['./skills-career-menu.component.scss']
})
export class SkillsCareerMenuComponent implements DoCheck {
  isSkillLink: boolean;

  constructor(private router: Router) { }

  ngDoCheck() {
    this.idRhForm();
  }

  idRhForm() {
    if (this.router.url.indexOf(SharedConstant.TEAM) || this.router.url.indexOf(SharedConstant.SKILLS_MATRIX)
    || this.router.url.indexOf(SharedConstant.CANDIDATE) || this.router.url.indexOf(SharedConstant.RECRUITMENT)) {
      this.isSkillLink = true;
    } else {
      this.isSkillLink = false;
    }
  }
}
