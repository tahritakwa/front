import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-claim-related-items',
  templateUrl: './claim-related-items.component.html',
  styleUrls: ['./claim-related-items.component.scss']
})
export class ClaimRelatedItemsComponent {

  public noteElementsCount = 0;
  public fileElementsCount = 0;
  @Input() source: String;
  @Input() sourceId: number;
  @Input() data;
  @Input() isArchivingMode;
  public entityType = "CLAIM";
  constructor() {
  }

  recount(e) {
    this.fileElementsCount = e;
  }

  nbrNoteEvent($event) {
    this.noteElementsCount = $event;
  }
}
