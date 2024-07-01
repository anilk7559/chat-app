import PageTitle from '@components/page-title';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import { withAuth } from 'src/redux/withAuth';

import styles from './index.module.scss';

const PurchaseTokenList = dynamic(() => import('src/components/token/token-packages'));

function TopupTokens() {
  return (
    <div className={classNames('funds_token_box', styles.funds_token_box)}>
      <PageTitle title="Topup tokens" />
      <div className={classNames('chats', styles.chats)}>
        <div className="chat-body p-3">
          <div className="row m-0 mb-4">
            <p className={classNames('heading_title', styles.heading_title)}>
              <span className={classNames('heading_left', styles.heading_left)}>Mehr Token kaufen</span>
              <span className={classNames('heading_right', styles.heading_right)}>[Token können verwendet werden für  Einkauf Modell Inhalt[Videos, Galerie, Produkte] und Trinkgeld Modelle auf dieser Plattform.]</span>
            </p>
          </div>
          <PurchaseTokenList />
        </div>
      </div>
    </div>
  );
}

export default withAuth(TopupTokens);
