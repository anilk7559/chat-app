import moment from 'moment';
import MediaContent from './media-content';

interface IProps {
  items?: any;
  authUser?: any;
}
const now = moment(new Date(), 'DD/MM/YYYY HH:mm:ss');

function ChatContent({ items = null, authUser = null }: IProps) {

  const renderDate = (date: any) => {
    const diff = now.diff(date);
    const duration = moment.duration(diff);
    const hour = duration.asHours();
    const year = duration.asYears();
    if (hour < 24) {
      return moment(date).format('HH:mm');
    }
    if (year < 1) {
      return moment(date).format('HH:mm DD/MM');
    }
    return moment(date).format('HH:mm DD/MM/YY');
  };
  return (
    <>
      {/* <!-- Chat Content Start--> */}
      <div className="container" style={{ paddingBottom: 70 }}>
        {/* <!-- Message Day Start --> */}
        <div className="message-day">
          {items?.map((message: any, index: number) => (
            <div className={authUser._id === message.senderId ? 'message self' : 'message'} key={index as any}>
              <div className="message-wrapper">
                <div className={`message-content + ${message.type === 'text' && 'bg-primary-custom'}`}>
                  {message.type === 'text' && <span>{message.text}</span>}
                  {(message.type === 'photo' || message.type === 'video') && message.files && (
                  <MediaContent messageLength={items.length} sender={message.sender} type={message.type} items={message.files} download />
                  )}
                  {message.type === 'file' && message.files && (
                  <div className="document">
                    <div className="btn btn-primary btn-icon rounded-circle text-light mr-2">
                      <svg className="hw-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  )}
                </div>
              </div>
              <div className="message-options">
                {authUser._id !== message.senderId && (
                <div className="avatar avatar-sm">
                  <img alt="" src={message.sender.avatarUrl || '/images/user1.jpg'} />
                </div>
                )}
                <span className="message-date">{renderDate(message.createdAt)}</span>
              </div>

            </div>
          ))}
        </div>
        {/* <!-- Message Day End --> */}
      </div>
      {/* <!-- Chat Content End--> */}
    </>
  );
}

export default ChatContent
