import {Component} from '@angular/core';
import {FileDrive} from '../../../models/rh/file-drive.model';
import {StarkdriveFileService} from '../../services/starkdrive-file/starkdrive-file.service';
import {Observable} from 'rxjs/Observable';
import {NumberConstant} from '../../../constant/utility/number.constant';
import {TranslateService} from '@ngx-translate/core';
import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';
import {ProgressBar} from '../../../models/payroll/progress-bar.model';

@Component({
  selector: 'app-explorer-starkdrive',
  templateUrl: './explorer-starkdrive.component.html',
  styleUrls: ['./explorer-starkdrive.component.scss'],
})
export class ExplorerStarkdriveComponent {
  public fileElements: Observable<FileDrive[]>;
  files: FileDrive[];
  public data: FileDrive[];
  public sortedData: FileDrive[];
  public dataElement: FileDrive[];
  currentRoot: FileDrive;
  currentPath: string;
  canNavigateUp = false;
  documentWillBeSorted = false;
  parentId: number;
  sortBy: string;
  sortOrder: string;
  progression: ProgressBar;

  constructor(public starkdriveFileService: StarkdriveFileService, public translate: TranslateService) {
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.displayDocuments();
    this.progression = new ProgressBar();
  }

  displayDocuments() {
    if (!this.documentWillBeSorted) {
      this.starkdriveFileService.list().subscribe(res => {
        this.data = res;
        if (this.data !== null) {
          this.data.forEach(file => {
            if (file.IdParent == null) {
              file.parent = StarkdriveConstant.ROOT;
              this.starkdriveFileService.add(file);
              this.updateFileDriveQuery();
            }
          });
        }
      });
    } else {
      this.fileElements.subscribe((dataFileElements) => {
        this.dataElement = dataFileElements;
      });
      this.dataElement.forEach(file => {
        this.starkdriveFileService.delete(file.randomId);
        this.updateFileDriveQuery();
      });
      this.starkdriveFileService.list().subscribe(res => {
        this.sortedData = res;

        switch (this.sortBy) {
          case this.translate.instant(StarkdriveConstant.NAME):
            this.sortedData.sort((currentFileName, FileNameToCompare) => currentFileName.Name.localeCompare(FileNameToCompare.Name));
            break;
          case this.translate.instant(StarkdriveConstant.SIZE):
            this.sortedData.sort((currentFileSize, FileSizeToCompare) => currentFileSize.Size - FileSizeToCompare.Size);
            break;
          default:
            break;
        }
        if (this.sortOrder === this.translate.instant(StarkdriveConstant.DESCENDING)) {
          this.sortedData.reverse();
        }

        if (this.sortedData !== null) {
          this.sortedData.forEach(file => {
            if (file.IdParent == null) {
              file.parent = StarkdriveConstant.ROOT;
              this.starkdriveFileService.add(file);
              this.updateFileDriveQuery();
            }
          });
        }
      });
    }
  }

  addFolder(folder: FileDrive) {
    folder.parent = this.currentRoot ? this.currentRoot.randomId : StarkdriveConstant.ROOT;
    this.starkdriveFileService.add(folder);
    this.updateFileDriveQuery();
  }

  /**
   * Delete element
   * @param element
   */
  selectedValue(value: any[]) {
    this.documentWillBeSorted = true;
    this.sortBy = value[NumberConstant.ZERO].Name;
    this.sortOrder = value[NumberConstant.ONE].Order;
    this.displayDocuments();
  }

  removeElement(element: FileDrive) {
    this.starkdriveFileService.delete(element.randomId);
    this.updateFileDriveQuery();
  }

  /**
   * Navigate into folder
   * @param element
   */
  navigateToFolder(element: FileDrive) {
    this.currentRoot = element;
    this.updateFileDriveQuery();
    this.currentPath = this.pushToPath(this.currentPath, element.Name);
    this.parentId = element.Id;
    this.canNavigateUp = true;
    this.starkdriveFileService.list().subscribe(res => {
      this.data = res;
      this.data.forEach(file => {
        if (file.IdParent === element.Id) {
          file.parent = this.currentRoot.randomId;
          this.starkdriveFileService.add(file);
        }
        this.updateFileDriveQuery();
      });
    });
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === StarkdriveConstant.ROOT) {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileDriveQuery();
    } else {
      this.currentRoot = this.starkdriveFileService.get(this.currentRoot.parent);
      this.updateFileDriveQuery();
    }
    this.currentPath = this.popFromPath(this.currentPath);
    this.parentId = null;

  }

  moveElement(event: { element: FileDrive; moveTo: FileDrive; }) {
    this.starkdriveFileService.update(event.element.randomId, {parent: event.moveTo.randomId});
    this.updateFileDriveQuery();
  }

  renameElement(element: FileDrive) {
    this.starkdriveFileService.update(element.randomId, {Name: element.Name});
    this.updateFileDriveQuery();
  }

  updateFileDriveQuery() {
    this.fileElements = this.starkdriveFileService.queryInFolder(
      this.currentRoot ? this.currentRoot.randomId : StarkdriveConstant.ROOT
    );
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    const split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }
}
