import { Resource } from '../shared/ressource.model';
import { FileDrive } from './file-drive.model';

export class FileDriveSharedDocument extends Resource {
    SubmissionDate: Date;
    IdEmployee: number;
    AttachmentUrl: string;
    FilesInfos: Array<FileDrive>;
    EncryptFile: boolean;
}
