import { DiscussionChat } from './discussion-chat.model';
import { User } from '../administration/user.model';
import { MessageChat } from './message-chat.model';

export class UserDiscussionChat {
    public Id: number;
    public IdUser: number;
    public IdDiscussion: number;
    public NumberOfDiscussionMember: number;
    public IdDiscussionNavigation: DiscussionChat;
    public IdUserNavigation: User;
    public MessageChat: Array<MessageChat>;
    public HasNotif: boolean;
}
