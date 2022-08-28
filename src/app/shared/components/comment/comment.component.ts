import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseRequestConstant } from '../../../constant/purchase/purchase-request.constant';
import { LanguageService } from '../../services/language/language.service';
import { UserCurrentInformationsService } from '../../services/utility/user-current-informations.service';
import {LocalStorageService} from '../../../login/Authentification/services/local-storage-service';
const pipe = new DatePipe('en-US');
@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input('comments-data') commentsData;
  @Output() deletedComment = new EventEmitter<any>();
  @Output() editedComment = new EventEmitter<any>();
  language: string;

  constructor(private translate: TranslateService, private localStorageService : LocalStorageService) {
     this.language = this.localStorageService.getLanguage();
  }

  /**
   * prepare creation date
   * @param creationDate
   */
  private creationDateToReadableString(creationDate: Date): string {
    const now = new Date();
    const date = new Date(creationDate);
    date.setHours(date.getHours() - 1);
    const dayDiff = Math.abs((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    const diffH = Math.abs(now.getHours() - date.getHours());
    const diffMin = Math.abs(now.getMinutes() - date.getMinutes());
    if (dayDiff < 1) {
      if (0 < diffH && diffH <= 5) {
        return diffH.toString().concat(PurchaseRequestConstant.HOURS);
      }
      if (6 < diffH && diffH <= 24) {
        if (this.language === 'fr') {
          return pipe.transform(date, PurchaseRequestConstant.SHORT_TIME_FR).toString();
        } else {
          return pipe.transform(date, PurchaseRequestConstant.SHORT_TIME_EN).toString();
        }
      }
      if (0 >= diffH && diffMin > 0) {
        return diffMin.toString().concat(PurchaseRequestConstant.MINUTES);
      }
      if (0 >= diffH && diffMin <= 0) {
        return `${this.translate.instant('NOTIFICATION_JUST_NOW')}`;
      }
    }
    if (this.language === 'fr') {
      return pipe.transform(date, PurchaseRequestConstant.FULL_DATE_FR).toString();
    } else if (this.language === 'en') {
      return pipe.transform(date, PurchaseRequestConstant.FULL_DATE_EN).toString();
    }
  }

  ngOnInit() {

  }
  deletecomment(id: number) {
    this.deletedComment.emit(id);
  }
  Editcomment(id: number) {
    this.editedComment.emit(id);
  }

}
