import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';
import {FileDrive} from '../../../models/rh/file-drive.model';
import {StarkdriveFileService} from '../../services/starkdrive-file/starkdrive-file.service';
import {SharedConstant} from '../../../constant/shared/shared.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {groupBy, GroupResult} from '@progress/kendo-data-query';

@Component({
  selector: 'app-toolbar-starkdrive',
  templateUrl: './toolbar-starkdrive.component.html',
  styleUrls: ['./toolbar-starkdrive.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ToolbarStarkdriveComponent implements OnInit {
  public fileDriveInfo: Array<FileDrive>;


  @Output() modifiedText = new EventEmitter<[{ Name: string }, { Order: string }]>();

  public dropdownButtonData: Array<any> = [
    {
      text: StarkdriveConstant.NAME, subcategory: this.translate.instant(StarkdriveConstant.SORTED_BY), value: false
    },
    {
      text: StarkdriveConstant.SIZE, subcategory: this.translate.instant(StarkdriveConstant.SORTED_BY), value: false
    },
    {
      text: StarkdriveConstant.MODIFIED, subcategory: this.translate.instant(StarkdriveConstant.SORTED_BY), value: false
    },
    {
      text: StarkdriveConstant.ASCENDING, subcategory: this.translate.instant(StarkdriveConstant.SORT_ORDER), value: false
    },
    {
      text: StarkdriveConstant.DESCENDING, subcategory: this.translate.instant(StarkdriveConstant.SORT_ORDER), value: false
    },
  ];
  public selectedValue: any[];
  public groupeData: GroupResult[] = groupBy(this.dropdownButtonData, [{field: StarkdriveConstant.SUBCATEGORY}]);
  @Output() folderAdded = new EventEmitter<{ name: string }>();

  constructor(public dialog: MatDialog, public translate: TranslateService, public starkdriveFileService: StarkdriveFileService) {
    this.fileDriveInfo = new Array<FileDrive>();
  }

  public itemDisabled(itemArgs: { dataItem: any, index: number }) {

    return itemArgs.dataItem.value;
  }

  ngOnInit() {
    this.initDataSource();
  }

  initDataSource(): void {
    this.dropdownButtonData.forEach(elem => {

      this.translate.get(elem.text.toUpperCase()).subscribe(transText => elem.text = transText);
      this.translate.get(elem.subcategory.toUpperCase()).subscribe(transText => elem.subcategory = transText);

    });

  }

  itemValue(selectedItem: any) {
    if (selectedItem.length !== NumberConstant.ZERO) {
      var itemSortedBy = selectedItem[NumberConstant.ZERO].text;


      switch (itemSortedBy) {
        case this.translate.instant(StarkdriveConstant.NAME):
          this.dropdownButtonData[NumberConstant.ONE].value = true;
          this.dropdownButtonData[NumberConstant.TWO].value = true;
          break;
        case this.translate.instant(StarkdriveConstant.SIZE):
          this.dropdownButtonData[NumberConstant.ZERO].value = true;
          this.dropdownButtonData[NumberConstant.TWO].value = true;
          break;
        case this.translate.instant(StarkdriveConstant.MODIFIED):
          this.dropdownButtonData[NumberConstant.ZERO].value = true;
          this.dropdownButtonData[NumberConstant.ONE].value = true;
        default:
          this.dropdownButtonData[NumberConstant.ZERO].value = false;
          this.dropdownButtonData[NumberConstant.ONE].value = false;
          this.dropdownButtonData[NumberConstant.ONE].value = false;
          break;
      }
      if (selectedItem[NumberConstant.ONE] == null) {
        this.dropdownButtonData[NumberConstant.FOUR].value = false;
        this.dropdownButtonData[NumberConstant.THREE].value = false;
      }
      var itemSortedType = selectedItem[NumberConstant.ONE].text;

      if (itemSortedType === this.translate.instant(StarkdriveConstant.ASCENDING)) {
        this.dropdownButtonData[NumberConstant.FOUR].value = true;
      } else {
        this.dropdownButtonData[NumberConstant.THREE].value = true;
      }

      this.modifiedText.emit([{Name: selectedItem[NumberConstant.ZERO].text}, {Order: selectedItem[NumberConstant.ONE].text}]);
    } else {
      this.dropdownButtonData.forEach(element => {
        element.value = false;
      });
    }
  }

}
