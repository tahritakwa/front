import { Injectable, Inject } from '@angular/core';
import { FileInfo as FInfo } from '../../../models/shared/objectToSend';
import { FileInfo } from '../../../models/sales/file-info.model';
import { ResourceService } from '../resource/resource.service';
import { Resource } from '../../../models/shared/ressource.model';
import { AppConfig } from '../../../../COM/config/app.config';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FileService extends ResourceService<FileInfo>{

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'Files', 'Files', 'Sales');
  }

  /**
   * Download file By index
   * @param i
   */
  downloadFile(i: number, service: ResourceService<Resource>, fileToUpload: Array<FInfo>) {
    const fileinfo = fileToUpload[i];
    if (fileinfo.FileData) {
      this.downLoadFile(fileinfo);
    } else {
      service.uploadFile(fileinfo).subscribe(data => {
        this.downLoadFile(data);
      });
    }
}

/**
   * Method is use to download file.
   * file info
   */
  downLoadFile(fileinfo: FInfo) {
  let byteArray: any ;
  if (fileinfo.FileData) {
    byteArray = new Buffer(fileinfo.FileData, 'base64');
  } else {
    byteArray = new Buffer(fileinfo.Data.toString(), 'base64');
  }
  const downloadLink = document.createElement('a');
  downloadLink.href = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
  downloadLink.download = fileinfo.Name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  }
}
