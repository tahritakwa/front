import {Inject, Injectable} from '@angular/core';
import {v4} from 'uuid';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {FileDrive} from '../../../models/rh/file-drive.model';
import {ResourceService} from '../../../shared/services/resource/resource.service';
import {HttpClient} from '@angular/common/http';
import {AppConfig} from '../../../../COM/config/app.config';
import {Operation} from '../../../../COM/Models/operations';
import {StarkdriveConstant} from '../../../constant/rh/starkdrive.constant';
import {ObjectToSend} from '../../../models/sales/object-to-save.model';
import { ResourceServiceRhPaie } from '../../../shared/services/resource/resource.service.rhpaie';

@Injectable()
export class StarkdriveFileService extends ResourceServiceRhPaie<FileDrive> {
  private querySubject: BehaviorSubject<FileDrive[]>;
  private mapElement = new Map<string, FileDrive>();

  constructor(@Inject(HttpClient) httpClient, @Inject(AppConfig) appConfig) {
    super(httpClient, appConfig, 'fileDrive', 'FileDrive', 'RH');
  }


  public getFileList(): Observable<any> {
    return this.callService(Operation.GET, StarkdriveConstant.GET_FILE_DRIVE_LIST);
  }

  add(fileElement: FileDrive) {
    fileElement.randomId = v4();
    this.mapElement.set(fileElement.randomId, this.clone(fileElement));
    return fileElement;
  }

  delete(id: string) {
    this.mapElement.delete(id);
  }

  update(id: string, update: Partial<FileDrive>) {
    let element = this.mapElement.get(id);
    element = Object.assign(element, update);
    this.mapElement.set(element.randomId, element);
  }

  queryInFolder(folderId: string) {
    const result: FileDrive[] = [];
    this.mapElement.forEach((element) => {
      if (element.parent === folderId) {
        result.push(this.clone(element));
      }
    });
    if (!this.querySubject) {
      this.querySubject = new BehaviorSubject(result);
    } else {
      this.querySubject.next(result);
    }
    return this.querySubject.asObservable();
  }

  get(id: string) {
    return this.mapElement.get(id);
  }

  clone(element: FileDrive) {
    return JSON.parse(JSON.stringify(element));
  }

  public uploadFileDrive(fileDrive: FileDrive, hideSpinner?: boolean): Observable<FileDrive> {
    return this.callService(Operation.POST, 'uploadFileDrive', fileDrive) as Observable<FileDrive>;
  }

  public moveElement(element: Array<FileDrive>, moveTo: FileDrive): Observable<any> {
    const data: any = {};
    data['element'] = element;
    data['moveTo'] = moveTo;
    const objectToSend: ObjectToSend = new ObjectToSend(data, null);
    return this.callService(Operation.POST, 'moveFileDrive', objectToSend) as Observable<any>;
  }

  public permanantDelete(element: Array<FileDrive>, hideSpinner?: boolean): Observable<FileDrive> {
    return this.callService(Operation.POST, 'permanantDelete', element) as Observable<FileDrive>;
  }
}
