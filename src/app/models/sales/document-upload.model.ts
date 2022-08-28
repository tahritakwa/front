
import { Resource } from '../shared/ressource.model';
import { FileInfo } from '../shared/objectToSend';

export class DocumentUpload extends Resource {
    fileInfoViewModel: FileInfo;
    documentType: string;
}
