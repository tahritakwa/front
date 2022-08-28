import {Component, OnInit} from '@angular/core';
import {StarkdriveFileService} from '../../services/starkdrive-file/starkdrive-file.service';
import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {SharedConstant} from '../../../constant/shared/shared.constant';


@Component({
  selector: 'app-treeview-starkdrive',
  templateUrl: './treeview-starkdrive.component.html',
  styleUrls: ['./treeview-starkdrive.component.scss'],
})

export class TreeviewStarkdriveComponent implements OnInit {
  public data: any[];
  public searchText: string;
  public parsedData: any[] = this.data;
  isSelected: boolean = true;


  constructor(public starkdriveFileService: StarkdriveFileService) {
  }

  initGridDataSource() {
    this.starkdriveFileService.getFileList().subscribe(res => {
      this.data = res;
      this.parsedData = res;
    });
  }

  ngOnInit() {
    this.initGridDataSource();
  }

  public iconClass({Name}: any): any {
    var extension = Name.substring(Name.indexOf(SharedConstant.DOT) + NumberConstant.ONE);

    switch (extension) {
      case StarkdriveConstant.PDF_EXTENSION:
        return StarkdriveConstant.FA_FILE_PDF_O;

      case StarkdriveConstant.WORD_EXTENSION:
      case StarkdriveConstant.OFFICE_WORD_EXTENSION:
        return StarkdriveConstant.FA_FILE_WORD_O;

      case StarkdriveConstant.PNG_EXTENSION:
      case StarkdriveConstant.JPG_EXTENSION:
        return StarkdriveConstant.FA_FILE_IMAGE;

      case StarkdriveConstant.MP3_EXTENSION:
        return StarkdriveConstant.FA_MUSIC;

      case StarkdriveConstant.POWER_POINT_EXTENSION:
      case StarkdriveConstant.OFFICE_PPT_EXTENSION:
      case StarkdriveConstant.POWER_POINT_X_EXTENSION:
        return StarkdriveConstant.FA_FILE_POWERPOINT_O;

      case StarkdriveConstant.EXCEL_EXTENSION:
        return StarkdriveConstant.FA_FILE_EXCEL_O;

      case StarkdriveConstant.TXT_EXTENSION:
        return StarkdriveConstant.FA_FILE_TEXT_O;

      case StarkdriveConstant.ZIP_EXTENSION:
        return StarkdriveConstant.FA_FILE_ARCHIVE;

      case StarkdriveConstant.TXT_EXTENSION:
        return StarkdriveConstant.FA_FILE_TEXT_O;

      case StarkdriveConstant.TRASH:
        return StarkdriveConstant.FA_TRASH;

      default:
        return StarkdriveConstant.FA_FOLDER;
    }
  }

  public contains(Text: string, term: string): boolean {
    return Text.toLowerCase().indexOf(term ? term.toLowerCase() : '') >= NumberConstant.ZERO;
  }


  public onkeyup(value: string, isFromPopup?: boolean): void {
    this.searchText = value;
    this.parsedData = this.search(this.data, value);
  }

  public search(Items: any[], term: string): any[] {
    return Items.reduce((acc, item) => {
      if (this.contains(item.Name, term)) {
        acc.push(item);
      } else if (item.InverseIdParentNavigation && item.InverseIdParentNavigation.length > NumberConstant.ZERO) {
        const newItems = this.search(item.InverseIdParentNavigation, term);
        if (newItems.length > NumberConstant.ZERO) {
          acc.push({
            Id: item.Id,
            Name: item.Name,
            CreatedBy: item.CreatedBy,
            CreationDate: item.CreationDate,
            Type: item.Type,
            IdParent: item.IdParent,
            Size: item.Size,
            Path: item.Path,
            InverseIdParentNavigation: newItems
          });
        }
      }
      return acc;
    }, []);
  }
}
