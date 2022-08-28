import { DiscussionChat } from './discussion-chat.model';
import { User } from '../administration/user.model';
export class UserDetailChat {
    public Id: number;
    public ConnectionsIds:  Array<string>;
    public FullName: string;
    public UserMail: string;
    public Picture = '';
}
