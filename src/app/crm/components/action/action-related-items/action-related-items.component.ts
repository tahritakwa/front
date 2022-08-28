import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-action-related-items',
  templateUrl: './action-related-items.component.html',
  styleUrls: ['./action-related-items.component.scss']
})
export class ActionRelatedItemsComponent {

  public noteElementsCount = 0;
  public fileElementsCount = 0;
  @Input() source: String;
  @Input() sourceId: number;
  @Input() data;
  @Input() isArchivingMode;
  entityType='ACTION';
  constructor() {
  }

  recount(e) {
    this.fileElementsCount = e;
  }

  nbrNoteEvent($event) {
    this.noteElementsCount = $event;
  }

}
