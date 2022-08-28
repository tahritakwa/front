import {Component, Input, OnInit, Output, EventEmitter, ViewContainerRef, ViewChild} from '@angular/core';
import { PredicateFormat, Filter, Operation, OrderBy, OrderByDirection } from '../../utils/predicate';
import { FormGroup } from '@angular/forms';
import { Contact } from '../../../models/shared/contact.model';
import { Tiers } from '../../../models/achat/tiers.model';
import { ContactService } from '../../../purchase/services/contact/contact.service';
import { DropDownComponent } from '../../interfaces/drop-down-component.interface';
import { FormModalDialogService } from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';
import { ContactComponent } from '../../../shared/components/contact/contact.component';
import { SharedConstant } from '../../../constant/shared/shared.constant';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
const ID_TIERS = 'IdTiers';
const CONTACT_COMBOBOX = 'contact';
@Component({
  selector: 'app-contact-dropdown',
  templateUrl: './contact-dropdown.component.html',
  styleUrls: ['./contact-dropdown.component.scss']
})
export class ContactDropdownComponent implements DropDownComponent {

  @ViewChild(CONTACT_COMBOBOX) contactCombobox : ComboBoxComponent;
  @Input() allowCustom;
  @Input() itemForm: FormGroup;
  @Output() selectedContact: EventEmitter<number> = new EventEmitter<number>();
  public contactDataSource: Contact[];
  public contactFiltredDataList: Contact[];
  @Input() idTiers: any;
  client: Tiers;
  predicate: PredicateFormat;
  isModal: boolean;
  @Input() showAddNew: boolean;
  constructor(private contactService: ContactService, private formModalDialogService: FormModalDialogService,
    private viewRef: ViewContainerRef) { }

  public SetContact(client: Tiers) {
    if (client) {
      this.client = client;
      this.initDataSource();
    }
  }
  preparePredicate(): void {
    this.predicate = new PredicateFormat();
    this.predicate.OrderBy = new Array<OrderBy>();
    this.predicate.OrderBy.push(new OrderBy( SharedConstant.FIRSTNAME,OrderByDirection.asc));
    this.predicate.Filter = new Array<Filter>();
    if (this.client) {
      if (this.client.Id) {
        this.predicate.Filter.push(new Filter(ID_TIERS, Operation.eq, this.client.Id));
      } else {
        this.predicate.Filter.push(new Filter(ID_TIERS, Operation.eq, this.client));
      }
    }
  }

  initDataSource(): void {
    this.preparePredicate();
    this.contactService.readDropdownPredicateData(this.predicate).subscribe(data => {
      data.forEach((contact: Contact) => {
        if (!contact.LastName || contact.LastName === null) {
          contact.LastName = '';
        } if (!contact.FirstName || contact.FirstName === null) {
          contact.FirstName = '';
        }
        contact.FullName = contact.FirstName.concat(' ' + contact.LastName);
      });
      this.contactDataSource = data;
      this.contactFiltredDataList = this.contactDataSource.slice(0);
    });
  }

  focus() {
    this.contactCombobox.toggle(true);
    this.initDataSource();
  }
  handleFilter(value: string): void {
    this.contactFiltredDataList = this.contactDataSource.filter((s) =>
      s.FirstName.toLowerCase().includes(value.toLowerCase())
      || s.LastName.toLowerCase().includes(value.toLowerCase()));
  }
  addNew(): void {
    this.isModal = true;
    this.formModalDialogService.openDialog(SharedConstant.ADD_CONTACT, ContactComponent, this.viewRef, this.initDataSource.bind(this)
      , this.client, null, SharedConstant.MODAL_DIALOG_SIZE_M);
  }
  public initialiseContactDropdown(): void {
    this.showAddNew = false;
    this.client = new Tiers();
    this.predicate = new PredicateFormat();
    this.contactDataSource = [];
    this.contactFiltredDataList = [];
  }
  public receiveSupplier(event) {
    this.selectedContact.emit(event);
  }
}
