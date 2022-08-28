import { AfterViewInit, Component, ComponentRef, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FileInfo, MediaInfo } from '../../../models/shared/objectToSend';
import { ContactConstants } from '../../../constant/crm/contact.constant';
import { SwalWarring } from '../swal/swal-popup';
import { IModalDialog, IModalDialogOptions } from 'ngx-modal-dialog';
import { MediaConstant } from '../../../constant/utility/Media.constant';
import { NumberConstant } from '../../../constant/utility/number.constant';
import { EmbedVideoService } from 'ngx-embed-video/dist';
import { isUndefined } from 'util';
import { isNotNullOrUndefinedAndNotEmptyValue } from '../../../stark-permissions/utils/utils';
import { SharedConstant } from '../../../constant/shared/shared.constant';

@Component({
  selector: 'app-gallery-card',
  templateUrl: './gallery-card.component.html',
  styleUrls: ['./gallery-card.component.scss']
})
export class GalleryCardComponent implements OnInit, AfterViewInit {
  public pictureFileInfo;
  /**
   * array of media info picture & video
   */
  @Input() mediaInfos: MediaInfo[];
  @Input() cannotUpdateFile: boolean;
  public dataModal: any;
  @ViewChild('videoPlayer') videoplayer: ElementRef;
  @ViewChild('alertRead') alertRead: ElementRef;
  public alertReadFile;
  public placeholderVideo = MediaConstant.PLACEHOLDER_VIDEO;

  constructor(private swalWarrings: SwalWarring, private embedService: EmbedVideoService) {

  }

  ngOnInit() {
  }

  dialogInit(reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) {
    this.dataModal = options.data;
    this.mediaInfos = this.dataModal.mediaInfos;
    this.cannotUpdateFile = this.dataModal.cannotUpdateFile;
  }

  public onSelectFiles(event) {
    for (const file of event.target.files) {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        if(file.type.startsWith("image/") || file.type.startsWith("video/")){
        reader.onload = () => {
          this.pictureFileInfo = new FileInfo();
          this.pictureFileInfo.Name = file.name;
          this.pictureFileInfo.Extension = file.type;
          this.pictureFileInfo.FileData = (<string>reader.result).split(',')[NumberConstant.ONE];
          this.mediaInfos.push(new MediaInfo(this.pictureFileInfo, reader.result));
        };
      }
      }
    }
  }

  public removeMedia(event, index) {
    event.preventDefault();
    const mediaToRemove = isUndefined(this.mediaInfos[index].embededIframe) && !this.isVideoFile(index) ?
      MediaConstant.PICTURE : MediaConstant.VIDEO;
    this.swalWarrings.CreateDeleteSwal(mediaToRemove, ContactConstants.PRONOUN_CETTE).then((result) => {
      if (result.value) {
        this.mediaInfos.splice(index, NumberConstant.ONE);
      }
    });
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  ngAfterViewInit(): void {
    this.alertReadFile = this.alertRead.nativeElement.innerHTML;
    this.mediaInfos.forEach(data => {
      if (isUndefined(data.fileInfo.Extension)) {
        if (isNotNullOrUndefinedAndNotEmptyValue(this.getEmbededIframe(data.src))) {
          data.embededIframe = this.getEmbededIframe(data.src);
        } else {
          data.embededIframe = this.alertReadFile;
        }
      }
    });
  }

  isVideoFile(index: number) {
    return this.mediaInfos[index] && this.mediaInfos[index].fileInfo &&
      (this.mediaInfos[index].fileInfo.Extension === MediaConstant.EXTENSION_TYPE_MP4 ||
        this.mediaInfos[index].fileInfo.Extension === MediaConstant.DOT_MP4);
  }

  isEmptyExtension(index: number) {
    return this.mediaInfos[index] && this.mediaInfos[index].fileInfo &&
      this.mediaInfos[index].fileInfo.Extension === SharedConstant.EMPTY;
  }

  getEmbededIframe(src: string) {
    return this.embedService.embed(src);
  }
  openImage(media : MediaInfo){
    var win = window.open();
    win.document.write('<iframe src="' + media.src  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}
