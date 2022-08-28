import {Component, EventEmitter, Input, OnInit, Output, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BonusConstant} from '../../../constant/payroll/bonus.constant';
import {Filter, Operation, OrderBy, OrderByDirection, PredicateFormat, Relation} from '../../../shared/utils/predicate';
import {ReducedBonus} from '../../../models/payroll/reduced-bonus.model';
import {BonusService} from '../../../payroll/services/bonus/bonus.service';
import {TranslationKeysConstant} from '../../../constant/shared/translation-keys.constant';
import {AddBonusComponent} from '../../../payroll/bonus/add-bonus/add-bonus.component';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {FormModalDialogService} from '../../services/dialog/form-modal-dialog/form-modal-dialog.service';

@Component({
  selector: 'app-bonus-dropdown',
  templateUrl: './bonus-dropdown.component.html',
  styleUrls: ['./bonus-dropdown.component.scss']
})
export class BonusDropdownComponent implements OnInit {

  @Input() group: FormGroup;
  @Input() isFixeBonusInput;
  @Input() idBonusColName;
  @Input() allowCustom;
  @Input() addNewInput = true;
  @Output() Selected = new EventEmitter<ReducedBonus>();
  // The data input of the combobox
  public bonusesList: ReducedBonus[];
  public bonusesFiltredData: ReducedBonus[];
  // is FixeBonus
  public isFixeBonus;

  constructor(private bonusService: BonusService, private viewRef: ViewContainerRef,
              private formModalDialogService: FormModalDialogService) {
  }

  ngOnInit() {
    // default bonus is fixe
    this.isFixeBonus = 1;

    // if isFixeBonusInput specified
    if (this.isFixeBonusInput) {
      this.isFixeBonus = this.isFixeBonusInput;
    }

    // if the id bonus col name is not specified
    if (!this.idBonusColName) {
      this.idBonusColName = BonusConstant.ID_BONUS;
    }
    this.initData();
  }

  /**
   * prepare Team Predicate
   * */
  prepareBonusPredicate() {
    const myPredicate = new PredicateFormat();
    myPredicate.Filter = new Array<Filter>();
    myPredicate.Relation = new Array<Relation>();
    myPredicate.OrderBy = new Array<OrderBy>();
    myPredicate.Filter.push(new Filter(BonusConstant.IS_FIXE, Operation.eq, this.isFixeBonus));
    myPredicate.Relation.push.apply(myPredicate.Relation, [new Relation(BonusConstant.BONUS_VALIDITY_PERIOD)]);
    myPredicate.OrderBy.push(new OrderBy(BonusConstant.NAME, OrderByDirection.asc));
    return myPredicate;
  }

  /**
   * initData
   * */
  public initData() {
    this.bonusService.readDropdownPredicateData(this.prepareBonusPredicate()).subscribe((data: any) => {
      this.bonusesList = data;
      this.bonusesFiltredData = this.bonusesList;
    });
  }

  /**
   * handleFilter
   * @param value
   */
  handleFilter(value: string): void {
    this.bonusesFiltredData = this.bonusesList.filter((x) =>
      (x.Name.toLowerCase().includes(value.toLowerCase()) ||
        x.Code.toLowerCase().includes(value.toLowerCase()))
    );
  }

  handleChange($event): void {
    this.bonusesList.forEach(element => {
      if (element.Id === $event) {
        this.Selected.emit(element);
      }
    });
  }

  /**
   * add New
   * */
  addNew(): void {
    const TITLE = TranslationKeysConstant.ADD_BONUS;
    this.formModalDialogService.openDialog(TITLE, AddBonusComponent,
      this.viewRef, this.initData.bind(this), null, true, SharedConstant.MODAL_DIALOG_SIZE_M);
  }

}
