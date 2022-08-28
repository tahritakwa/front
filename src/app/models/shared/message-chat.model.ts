import { Resource } from './ressource.model';
import { UserDiscussionChat } from './user-discussion-chat.model';

export class MessageChat extends Resource {
    public Text: string;
    public AttachedFilesLink: string;
    public Date: Date;
    public IdUserDiscussion: number;
    public IdUserDiscussionNavigation: UserDiscussionChat;
}
