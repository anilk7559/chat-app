import { conversationService } from '@services/conversation.service';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';
import { toast } from 'react-toastify';

const mapStates = (state: any) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authUser: state.auth.authUser
});

const connector = connect(mapStates);

type PropsFromRedux = ConnectedProps<typeof connector>;

type IProps = {
  user: any;
  chidren?: ReactNode;
  isFriend: boolean;
};

function ChatButton({
  authUser,
  user,
  isLoggedIn,
  isFriend,
  chidren = null
}: IProps & PropsFromRedux) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * redirect to chat page
   */
  const handleChat = async () => {
    try {
      if (authUser.type === 'model') {
        toast.error('Es tut uns leid. Nur Benutzer können mit Modellen chatten.');
        return;
      }
      if (!isLoggedIn) {
        toast.error('Bitte melden Sie sich an, um diese Aktion auszuführen!');
        return;
      }
      // if (!isFriend) {
      //   toast.error(`Bitte fügen Sie ${user.type}  zu Ihren Favoriten hinzu, um zu chatten.`);
      //   return;
      // }
      setLoading(true);
      const conversation = await conversationService.create({ userId: user?._id });
      router.push({
        pathname: '/conversation/[id]',
        query: {
          id: conversation.data._id
        }
      });
    } catch (e) {
      const err = await e;
      toast.error(err?.data?.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut!');
    }
  };

  return (
    <OverlayTrigger
      placement="top"
      overlay={(
        <Tooltip id="tooltip">
          <span className="text-tooltip">Chatten</span>
        </Tooltip>
    )}
    >
      <button
        className="mx-1 btn btn-primary"
        type="button"
        onClick={handleChat}
        disabled={loading}
      >
        {!!chidren || (
        <>
          <i className="far fa-comments" />
          <span className="ml-1 text-chat">Chatten</span>
        </>
        )}

      </button>
    </OverlayTrigger>
  );
}

export default connector(ChatButton);
