import { Resource } from '../shared/ressource.model';
import { DocumentRequestType } from './document-request-type.model';
import { AdministrativeDocumentStatusEnumerator } from '../enumerators/administrative-document-status.enum';
import { Employee } from './employee.model';
import { Comment } from '../../models/shared/comment.model';
import { FileInfo } from '../shared/objectToSend';

export class DocumentRequest extends Resource {
  Label: string;
  SubmissionDate: Date;
  TreatmentDate?: Date;
  TreatedBy?: number;
  TreatedByNavigation?: Employee;
  DeadLine: Date;
  Description: Date;
  Status: AdministrativeDocumentStatusEnumerator;
  IdEmployee: number;
  IdDocumentRequestType: number;
  IdDocumentRequestTypeNavigation: DocumentRequestType;
  IdEmployeeNavigation: Employee;
  Comments: Array<Comment>;
  Code: string;
  AttachmentUrl: string;
  FilesInfos: Array<FileInfo>;
  EncryptFile: boolean;
}
