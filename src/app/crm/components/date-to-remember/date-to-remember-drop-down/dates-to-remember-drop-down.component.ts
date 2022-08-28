import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../../../shared/services/dialog/form-modal-dialog/form-modal-dialog.service';
import {FormGroup} from '@angular/forms';
import {AddDateToRememberComponent} from '../add-date-to-remember/add-date-to-remember.component';
import {DateToRemConstants} from '../../../../constant/crm/dateToRemConstants';
import {MarkingEventItemsService} from '../../../services/markingEventsItems/marking-event-items.service';

@Component({
  selector: 'app-marking-events-drop-down',
  templateUrl: './dates-to-remember-drop-down.component.html',
  styleUrls: ['./dates-to-remember-drop-down.component.scss']
})
export class DatesToRememberDropDownComponent implements OnInit {

  @Input() readonly = false;
  @Input() disabled = false;
  @Output() Selected = new EventEmitter<any>();
  @Input() group: FormGroup;
  public itemsList = [];
  public selectedItem;
  private selectedItemNameInModal;
  public selectedItemFromFG;

  /***
   *
   * @param translate
   * @param formModalDialogService
   * @param viewRef
   * @param markingEventItemsService
   */
  constructor(private translate: TranslateService,
              private formModalDialogService: FormModalDialogService,
              private viewRef: ViewContainerRef,
              private markingEventItemsService: MarkingEventItemsService) {
  }

  ngOnInit() {
    this.getSavedDates();
    if (this.group.controls['eventName'].value) {
      this.selectedItemFromFG = this.group.controls['eventName'].value;
    }
  }

  private getSavedDates(name ?) {
    this.selectedItemNameInModal = name;
    this.getAllItems();
  }

  private getAllItems() {
    this.markingEventItemsService.getJavaGenericService().getEntityList().subscribe((data) => {
      if (data) {
        this.itemsList = data;
        this.translateValues();
      }
    }, () => {

    }, () => {
      if (this.selectedItemNameInModal) {
        this.setDefaultValueToEventsList();
      }
    });
  }

  private setDefaultValueToEventsList() {
    const selected = this.itemsList.find(date => date.name === this.selectedItemNameInModal);
    if (selected && selected.name) {
      this.selectedItem = selected.name;

    }
  }

  private translateValues() {
    this.itemsList = this.itemsList.map((dateToReturn: any) => {
      return dateToReturn = {
        name: this.translate.instant(dateToReturn.name),
        description: dateToReturn.description
      };
    });
  }

  public addNew(): void {
    const title = DateToRemConstants.ADD_MARKING_EVENT;
    this.formModalDialogService.openDialog(this.translate.instant(title), AddDateToRememberComponent,
      this.viewRef, this.getSavedDates.bind(this), {},
      true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

  handleFilter(value: string): void {

  }

}
