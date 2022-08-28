import { FileInfo } from '../shared/objectToSend';
import { Resource } from '../shared/ressource.model';
import { Employee } from './employee.model';
import { DocumentRequestType } from './document-request-type.model';
import { User } from '../administration/user.model';

export class SharedDocument extends Resource {
    SubmissionDate: Date;
    IdEmployee: number;
    IdType:  number;
    AttachmentUrl: string;
    FilesInfos: Array<FileInfo>;
    EncryptFile: boolean;

    IdEmployeeNavigation: Employee;
    IdTypeNavigation:  DocumentRequestType;
    TransactionUser: User;
  }
