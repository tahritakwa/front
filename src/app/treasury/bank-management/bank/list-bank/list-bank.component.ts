import {Component, OnInit} from '@angular/core';
import {DataStateChangeEvent, PagerSettings} from '@progress/kendo-angular-grid';
import {DataSourceRequestState, SortDescriptor, State} from '@progress/kendo-data-query';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Bank} from '../../../../models/shared/bank.model';
import {SharedConstant} from '../../../../constant/shared/shared.constant';
import {PredicateFormat, Relation} from '../../../../shared/utils/predicate';
import {ColumnSettings} from '../../../../shared/utils/column-settings.interface';
import {TreasuryConstant} from '../../../../constant/treasury/treasury.constant';
import {GridSettings} from '../../../../shared/utils/grid-settings.interface';
import {BankService} from '../../../services/bank.service';
import {SwalWarring} from '../../../../shared/components/swal/swal-popup';
import {unique, ValidationService} from '../../../../shared/services/validation/validation.service';
import {NumberConstant} from '../../../../constant/utility/number.constant';
import { MediaConstant } from '../../../../constant/utility/Media.constant';
import { PermissionConstant } from '../../../../Structure/permission-constant';
import { AuthService } from '../../../../login/Authentification/services/auth.service';

@Component({
  selector: 'app-list-bank',
  templateUrl: './list-bank.component.html',
  styleUrls: ['./list-bank.component.scss']
})
export class ListBankComponent implements OnInit {

  public actionColumnWidth  = SharedConstant.COLUMN_ACTIONS_WIDTH;
  public actionColumnTitle = SharedConstant.COLUMN_ACTIONS_TITLE;
  private id = 0;
  // button Advanced Edit visibility
  private btnEditVisible: boolean;

  private editedRowIndex: number;

  editedRow: Bank;
  // button add item to the list clicked and not closed
  private isAddItemNotClosed = false;

  // pager settings
  pagerSettings: PagerSettings = SharedConstant.DEFAULT_PAGER_SETTINGS;
  public predicate: PredicateFormat ;

  public gridState: DataSourceRequestState = {
    skip: 0,
    take: 10,
    // Initial filter descriptor
    filter: {
      logic: SharedConstant.LOGIC_AND,
      filters: []
    }
  };
  public hasAddPermission: boolean;
  public hasShowPermission: boolean;
  public hasDeletePermission: boolean;
  public hasUpdatePermission: boolean;

  // Grid quick add
  public formGroup: FormGroup;

  public columnsConfig: ColumnSettings[] = [
    {
      field: TreasuryConstant.NAME,
      title: TreasuryConstant.NAME.toUpperCase(),
      tooltip:  TreasuryConstant.BANK_NAME,
      filterable: false,
      _width: 240
    },
    {
      field: TreasuryConstant.EMAIL,
      title: TreasuryConstant.EMAIL.toUpperCase(),
      tooltip:  TreasuryConstant.BANK_EMAIL,
      filterable: false,
      _width: 200
    },
    {
      field: TreasuryConstant.PHONE,
      title: TreasuryConstant.PHONE.toUpperCase(),
      tooltip:  TreasuryConstant.BANK_PHONE,
      filterable: false,
      _width: 150
    },
    {
      field: TreasuryConstant.ADDRESS,
      title: TreasuryConstant.ADDRESS.toUpperCase(),
      tooltip:  TreasuryConstant.BANK_ADDRESS,
      filterable: false,
      _width: 280
    }
  ];

  public gridSettings: GridSettings = {
    state: this.gridState,
    columnsConfig: this.columnsConfig,
  };
  public sort: SortDescriptor[] = [{
    field: TreasuryConstant.NAME,
    dir: undefined
  }];


  constructor(
    public bankService: BankService,
    private router: Router,
    private fb: FormBuilder,
    private swalWarrings: SwalWarring,
    private authService: AuthService,
    private validationService: ValidationService) {
    this.preparePredicate();
    this.btnEditVisible = true;
  }

  ngOnInit() {
    this.hasAddPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.ADD_BANK);
    this.hasShowPermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.SHOW_BANK);
    this.hasDeletePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.DELETE_BANK);
    this.hasUpdatePermission = this.authService.hasAuthority(PermissionConstant.SettingsRHAndPaiePermissions.UPDATE_BANK);
    this.initGridDataSource();
  }

  /**
   * dataStateChange
   * @param state
   */
  public dataStateChange(state: DataStateChangeEvent): void {
    if (!state.sort[NumberConstant.ZERO] || (state.sort[NumberConstant.ZERO] && !state.sort[NumberConstant.ZERO].dir)) {
      state.sort = [];
    }
    this.gridState = state;
    this.initGridDataSource();
  }

  /**
   * initGridDataSource
   */
  public initGridDataSource(): void {
    this.bankService.reloadServerSideData(this.gridState, this.predicate).subscribe(data => {
        this.prepareList(data);
      }
    );
  }

  /**
   * prepare bank predicate
   */
  public preparePredicate(){
    this.predicate = new PredicateFormat();
    this.predicate.Relation = new Array<Relation>();
    this.predicate.Relation.push(new Relation(TreasuryConstant.ID_COUNTRY_NAVIGATION));
  }

  /**
   * Quick add
   * @param param0
   */
  public addHandler({ sender }) {
    this.isAddItemNotClosed = true;
    this.closeEditor(sender);

    this.formGroup = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: [''],
      Address: [''],
    });
    sender.addRow(this.formGroup);
    this.btnEditVisible = false;
  }

  /**
   * Close editor
   * @param grid
   * @param rowIndex
   */
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
    this.btnEditVisible = true;
  }

  public removeHandler(dataItem) {
    this.swalWarrings.CreateSwal(TreasuryConstant.BANK_DELETE_TEXT_MESSAGE, TreasuryConstant.BANK_DELETE_TITLE_MESSAGE).then((result) => {
      if (result.value) {
        this.bankService.remove(dataItem).subscribe(() => {
          this.initGridDataSource();
        });
      }
    });
  }

  public goToAdvancedEdit(dataItem) {
    this.router.navigateByUrl(TreasuryConstant.BANK_EDIT_URL.concat(dataItem.Id));
  }

  /**
   * Save handler
   * @param param0
   */
  public saveHandler({sender, rowIndex, formGroup, isNew}) {
    if ((formGroup as FormGroup).valid) {
      let item: Bank;
      if (this.editedRow) {
        Object.assign(this.editedRow, formGroup.value);
        item = this.editedRow;
      } else {
        item = this.formGroup.value;
      }
      this.bankService.save(item, isNew).subscribe(() => {
        this.initGridDataSource();
      });
      sender.closeRow(rowIndex);
      this.btnEditVisible = true;
      if (this.isAddItemNotClosed) {
        this.isAddItemNotClosed = false;
      }
    } else {
      this.validationService.validateAllFormFields(formGroup as FormGroup);
    }
  }

  /**
   * Cancel
   * @param param0
   */
  public cancelHandler({ sender, rowIndex }) {
    this.isAddItemNotClosed = false;
    this.closeEditor(sender, rowIndex);
    this.btnEditVisible = true;
  }

  public editHandler({sender, rowIndex, dataItem}) {
    if (this.isAddItemNotClosed) {
      this.closeEditor(sender, NumberConstant.MINUS_ONE);
    }
    this.closeEditor(sender);
    this.formGroup = this.fb.group({
      Id: [dataItem.Id, Validators.required],
      Name: new FormControl(dataItem.Name, Validators.required),
      Email: new FormControl(
        dataItem.Email,
        [Validators.required, Validators.email],
        unique(TreasuryConstant.EMAIL, this.bankService, String(dataItem.Id))
      ),
      Phone: new FormControl(dataItem.Phone),
      Address: new FormControl(dataItem.Address)
    });
    this.editedRowIndex = rowIndex;
    this.editedRow = dataItem;
    sender.editRow(rowIndex, this.formGroup);
    this.isAddItemNotClosed = false;
    this.btnEditVisible = false;
  }

  public receiveData(event: any) {
    const predicates: PredicateFormat = Object.assign({}, null, event.predicate);
    this.predicate = predicates;
    this.gridState.skip = NumberConstant.ZERO;
    this.initGridDataSource();
  }
  public sortChange(sort: SortDescriptor[]){
    this.sort = sort
  }
  prepareList(result) {
    // get first picture
    if (result) {
      const data = result.data;
      this.loadBankPicture(data);
      data.forEach(bank => {
        bank.image = MediaConstant.PLACEHOLDER_PICTURE;
      });
    }
    this.gridSettings.gridData = result;
  }

  private loadBankPicture(bankList: Bank[]) {
    var bankPicturesUrls = [];
    bankList.forEach((family: Bank) => {
      bankPicturesUrls.push(family.AttachmentUrl);
    });
    if (bankPicturesUrls.length > NumberConstant.ZERO) {
      this.bankService.getPictures(bankPicturesUrls, false).subscribe(bankPictures => {
        this.fillBankPictures(bankList, bankPictures);
      });
    }
  }
  private fillBankPictures(bankList, bankPictures) {
    bankList.map((bank: Bank) => {
      if (bank.AttachmentUrl) {
        let dataPicture = bankPictures.objectData.find(value => value.FulPath === bank.AttachmentUrl);
        if (dataPicture) {
          bank.image = `${SharedConstant.PICTURE_BASE}${dataPicture.Data}`;
        }
      }
    });
  }
}
