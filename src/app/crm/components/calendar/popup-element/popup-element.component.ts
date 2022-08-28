import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActionConstant} from '../../../../constant/crm/action.constant';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-popup-element',
  templateUrl: './popup-element.component.html',
  styleUrls: ['./popup-element.component.scss']
})
export class PopupElementComponent implements OnInit, OnChanges {

  eventTypes: String[] = [];
  eventType;
  @Input() showModal: boolean;
  @Input() selectedDate;
  @Output() saveAndClose = new EventEmitter<boolean>();
  @Output() closeModel = new EventEmitter<boolean>();
  public saveType = ActionConstant.ACTION;

  save: Subject<any> = new Subject<void>();
  closePopUp: Subject<any> = new Subject<void>();


  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.eventType = this.translate.instant('CALENDAR.POPUP.TYPE_EVENT.ACTION');
    this.eventTypes = [
      this.translate.instant('CALENDAR.POPUP.TYPE_EVENT.ACTION')];
  }

  closeP() {
    this.showModal = false;
    this.saveAndClose.emit();
    const element: HTMLElement = document.getElementById('closeModal') as HTMLElement;
    element.click();
  }

  closeModal() {
    this.showModal = false;
    this.closeModel.emit();
    this.emitEventToClosePopUp();
  }

  ngOnChanges(changes: SimpleChanges) {
     if (this.showModal) {
      const e: HTMLElement = document.getElementById('openPopup') as HTMLElement;
      e.click();
    }
  }

  /**
   * This is done to send an event in order to save an action or remind
   */
  emitEventToSaveAction() {
    this.save.next({type: this.saveType, value: true});
  }

  /**
   * This is done to send an event to inform popup closure
   */
  emitEventToClosePopUp() {
    this.closePopUp.next({type: this.saveType, value: true});
  }

  changeShowingMode(saveType) {
    this.saveType = saveType;
  }
}

