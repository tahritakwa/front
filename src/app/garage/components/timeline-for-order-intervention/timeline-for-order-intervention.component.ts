import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-for-order-intervention',
  templateUrl: './timeline-for-order-intervention.component.html',
  styleUrls: ['./timeline-for-order-intervention.component.scss']
})
export class TimelineForOrderInterventionComponent  {

  @Input() historyInterventionList = [];

  GoToLink(item) {
    window.open(item.MainLink, '_blank');
  }

}
