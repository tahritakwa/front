import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-folder-modal-starkdrive',
  templateUrl: './folder-modal-starkdrive.component.html',
  styleUrls: ['./folder-modal-starkdrive.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FolderModalStarkdriveComponent implements OnInit {
  folderName: string;

  constructor(public dialogRef: MatDialogRef<FolderModalStarkdriveComponent>) {
  }

  ngOnInit() {
  }
}
