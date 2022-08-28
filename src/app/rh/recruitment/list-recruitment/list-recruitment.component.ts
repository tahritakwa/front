import {Component, OnInit} from '@angular/core';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {RecruitmentConstant} from '../../../constant/rh/recruitment.constant';
import {RecruitmentType} from '../../../models/enumerators/recruitment-type.enum';


@Component({
  selector: 'app-list-recruitment',
  templateUrl: './list-recruitment.component.html',
  styleUrls: ['./list-recruitment.component.scss']
})
export class ListRecruitmentComponent implements OnInit {

  recruitmentType = NumberConstant.ZERO;

  constructor(private router: Router, public translate: TranslateService) {
    const url = this.router.url.split(SharedConstant.SLASH);
    if (url[NumberConstant.THREE] === RecruitmentConstant.REQUIRMENT_REQUEST) {
      this.recruitmentType = RecruitmentType.Request;
    }
    if (url[NumberConstant.THREE] === RecruitmentConstant.REQUIRMENT_OFFER) {
      this.recruitmentType = RecruitmentType.Offer;
    }
    if (url[NumberConstant.THREE] === RecruitmentConstant.RECRUITMENT) {
      this.recruitmentType = RecruitmentType.RecruitmentSession;

    }
  }

  ngOnInit() {
  }


}
