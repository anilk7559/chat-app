import { formatNumber } from '@lib/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

interface IProps {
  username: string;
  type: string
  logout: Function
  avatarUrl: string;
  balance: number;
  handleClickToMenu: Function;
}
function UserMenu({
  username,
  type,
  logout,
  avatarUrl,
  balance,
  handleClickToMenu
}: IProps) {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState(null);

  const onClickMenu = (url: string, pathname: string) => {
    handleClickToMenu();
    return router.push(url, pathname, { shallow: true });
  };

  const handleRouteChange = (path) => setActiveRoute(path);

  useEffect(() => {
    handleRouteChange(router.pathname);

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, []);

  return (
    <Dropdown drop="down">
      <Dropdown.Toggle
        variant="link"
        className="nav-link dropdown-toggle dropdown-profile-menu"
        id="navbarDropdownMenuLink"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <img alt="avatar_user" src={avatarUrl || '/images/user.jpg'} />
        <div className="username hide-mobile">{username || ' N/A '}</div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-link dropdown-menu-profile" aria-labelledby="navbarDropdownMenuLink">
        <Dropdown.Item className="show-mobile">
          <img alt="avatar_user" src={avatarUrl || '/images/user.jpg'} />
          <div className="username ">{username || ' N/A '}</div>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => onClickMenu('/profile/update', '/profile/update')}
          active={activeRoute === '/profile/update'}
        >
         Mein Profil
        </Dropdown.Item>
        {type === 'model' && (
          <>
            <Dropdown.Item
              className="show-mobile"
              onClick={() => onClickMenu('/profile/payout-request', '/payout-request')}
              active={['/profile/payout-request', '/payout-request'].includes(activeRoute)}
            >
              <a
                className="show-mobile w-100 my-1  btn btn-outline-primary "
              >
                <i className="fa fa-heart mr-1" />
                {formatNumber(balance)}
              </a>
            </Dropdown.Item>
            <Dropdown.Item
          onClick={() => onClickMenu('/blogs/allblogs', '/blogs/allblogs')}
          active={activeRoute === '/blogs/allblogs'}
        >
         Blog Posts
        </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/profile/media-content', '/media-content')}
              active={['/profile/media-content', '/media-content'].includes(activeRoute)}

            >
              Medieninhalt
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/profile/payout-request', '/payout-request')}
              active={['/profile/payout-request', '/payout-request'].includes(activeRoute)}
            >
              Auszahlungsantrag

            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/earning', '/earning')}
              active={activeRoute === '/earning'}
            >
              Verdienen

            </Dropdown.Item>
          </>
        )}
        {type === 'user' && (
          <>
            <Dropdown.Item
              className="show-mobile"
              onClick={() => onClickMenu('/tokens', '/tokens')}
              active={['/tokens', '/tokens'].includes(activeRoute)}
            >
              <a
                className={`w-100 my-1 nav-link btn btn-outline-primary no-box-shadow ${activeRoute === 'tokens' ? 'active' : ''}`}
              >
                <i className="fa fa-heart  mr-1" />
                {formatNumber(balance)}
              </a>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/profile/purchased-media', '/purchased-media')}
              active={['/profile/purchased-media', '/purchased-media'].includes(activeRoute)}
            >
              Gekaufte Medien
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/profile/bookmarked-messages', '/bookmarked-messages')}
              active={['/profile/bookmarked-messages', '/bookmarked-messages'].includes(activeRoute)}

            >
              Lesezeichen Nachrichten
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/tokens/history', '/token-history')}
              active={['/tokens/history', '/token-history'].includes(activeRoute)}
            >
              Token Geschichte
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => onClickMenu('/payment-history', '/payment-history')}
              active={activeRoute === '/payment-history'}
            >
              Zahlungsverhalten
            </Dropdown.Item>
          </>
        )}
        <Dropdown.Item
          onClick={() => onClickMenu('/contact-us', '/contact-us')}
          active={activeRoute === '/contact-us'}
        >
          Kontakt Verwaltung
        </Dropdown.Item>
        <Dropdown.Item onClick={() => logout()}>Abmeldung</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserMenu;
