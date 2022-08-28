import { Component, OnInit, Input } from '@angular/core';
import { TrainingSession } from '../../../models/rh/training-session.model';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-training-session-abstract',
  templateUrl: './training-session-abstract.component.html',
  styleUrls: ['./training-session-abstract.component.scss']
})
export class TrainingSessionAbstractComponent implements OnInit {
  @Input() trainingSession: TrainingSession;
  @Input() isUpdateMode: boolean;

  public formatDate = this.translate.instant(SharedConstant.DATE_FORMAT);

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }
}
