import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FileService} from '../../../services/file/file.service';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-popup-add-file',
  templateUrl: './popup-add-file.component.html',
  styleUrls: ['./popup-add-file.component.scss']
})
export class PopupAddFileComponent implements OnInit, OnChanges {

  public isSave = false;
  shouldBeOpen = false;
  classPopup: String = 'modal fade';
  @ViewChild('childModal') public childModal: ModalDirective;
  @Input() showModal: boolean;
  @Input() concerned;
  @Input() fileDetails;
  @Input() source: String;
  @Input() sourceId;
  @Input() contactCrm;
  @Output() modelClosed = new EventEmitter<boolean>();

  constructor(private fileService: FileService) {
  }

  ngOnInit() {
  }

  closeModal() {
    this.fileDetails = null;
    this.modelClosed.emit();
    this.fileService.addFile.next(false);
  }

  ngOnChanges() {
    if (this.showModal) {
      this.classPopup = 'modal fade show';
      const e: HTMLElement = document.getElementById('openPopup') as HTMLElement;
      e.click();
    } else {
      this.hidePopUp();
    }
  }

  save() {
    this.fileService.addFile.next(true);
  }
  hidePopUp() {
    this.isSave = false;
    this.classPopup = 'modal fade';
    const c: HTMLElement = document.getElementById('hidePopup') as HTMLElement;
    if (c) {
      c.click();
    }
  }
}

