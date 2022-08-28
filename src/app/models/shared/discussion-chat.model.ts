import { UserDiscussionChat } from './user-discussion-chat.model';
import { MessageChat } from './message-chat.model';
import { Resource } from './ressource.model';

export class DiscussionChat extends Resource {
    public Name: string;
    public NumberOfDiscussionMember: number;
    public UserDiscussionChat: Array<UserDiscussionChat>;
    public HasNotif: boolean;
    public LastMsg: MessageChat;
    public DateLastNotif: Date;

}
