import { useEffect, useState } from 'react';
import {
  Col, Row, Tab, Tabs
} from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { connect, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from 'src/components/common-layout/loader/loader';
// Child Component
import ViewMediaItem from 'src/components/media/view-media-item';
import MainPaginate from 'src/components/paginate/main-paginate';
// Actions
import { purchaseItem } from 'src/redux/purchase-item/actions';
import { getSellItem } from 'src/redux/sell-item/actions';

interface IProps {
  authUser?: any;
  items?: any; // media list
  total?: number;
  contact: any;
  isFriend: boolean;
  getSellItemStore?: {
    requesting: boolean;
    success: boolean;
    error: any;
  };
}
function ContactFooter({
  authUser = null,
  items = null,
  total = 0,
  contact,
  isFriend,
  getSellItemStore = {
    requesting: false,
    success: false,
    error: null
  }
}: IProps) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('Foto');
  const [isOpenMedia, setIsOpenMedia] = useState(false);
  const [mediaItem, setMediaItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [titleModal, setTitleModal] = useState('');
  const take = 8;

  const dispatch = useDispatch();

  const gettSellItemRequesting = () => {
    setIsLoading(getSellItemStore.requesting);
  };

  const loadSellItems = () => {
    if (contact && contact._id) {
      dispatch(getSellItem({
        page, mediaType: type, modelId: contact._id, take
      }));
    }
  };
  useEffect(() => {
    gettSellItemRequesting();
  }, [getSellItemStore.requesting]);

  useEffect(() => {
    loadSellItems();
  }, [page, contact?._id]);

  useEffect(() => {
    setPage(1);
    loadSellItems();
  }, [type]);

  const handlePurchase = (item: any) => {
    if (authUser.type === 'model') {
      toast.error('Es tut uns leid. Nur Benutzer können Premium-Inhalte erwerben.');
    } else if (window.confirm('Sind Sie sicher, dass Sie dieses Element kaufen möchten?')) {
      dispatch(purchaseItem({ sellItemId: item._id }));
    }
  };
  const handleView = async (e, item: any) => {
    e.preventDefault();
    if (!item.isPurchased && !item.free) return;
    await setMediaItem(item.media);
    setTitleModal(item?.name);
    setIsOpenMedia(true);
  };

  return (
    <div className="tab-box">
      <Tabs defaultActiveKey="photo" transition={false} id="tab-sell-item" onSelect={(key: any) => setType(key)}>
        <Tab eventKey="photo" title="Fotos">
          {isLoading && <Loader />}
          {!isLoading && items && items.length > 0 && (
            <div className="row min-h ">
                {items.map((item) => (
                  <div className="col-xs-6 col-sm-4 col-md-3 responsive-width" key={item._id}>
                    <div className={item.isPurchased || item.free ? 'image-box mt-3 active' : 'image-box mt-3'}>
                      <img alt="" src={item.isPurchased || item.free ? item.media?.thumbUrl || '/images/default_thumbnail_photo.jpg' : item.media?.blurUrl || '/images/default_thumbnail_photo.jpg'} />
                      <h5>
                        {item.isPurchased || item.free ? (
                          <span>
                            <i className="far fa-eye" />
                            {' '}
                            Vorschau
                          </span>
                        ) : (
                          <span>
                            <NumericFormat thousandSeparator value={item.price} displayType="text" />
                            {' '}
                            Tokens
                          </span>
                        )}
                      </h5>
                      <a
                        aria-hidden
                        className="btn btn-primary pointer"
                        onClick={() => (isFriend ? handlePurchase(item) : toast.error('Bitte fügen Sie das Modell zu Ihren Favoriten hinzu, um den Artikel zu kaufen.'))}
                      >
                        Jetzt kaufen
                      </a>
                      <a
                        aria-hidden
                        className="popup"
                        role="button"
                        onClick={(e) => handleView(e, item)}
                        style={{ cursor: `${item.isPurchased || item.free ? 'pointer' : 'unset'}` } as any}
                      >
                        {}
                      </a>
                      <div className="overlay" />
                    </div>
                    <div className="media-name" data-toggle="tooltip" data-placement="top" title={item.name}>
                      {item.name}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Tab>
        <Tab eventKey="video" title="Videos">
          {isLoading && <Loader />}
          {!isLoading && items && items.length > 0 && (

            <Row className="min-h">
              {items.map((item) => (
                <Col xs={6} sm={3} md={3} xxl={4} className="responsive-width" key={item._id}>
                  <div className={item.isPurchased || item.free ? 'image-box mt-3 active' : 'image-box mt-3'}>
                    <img alt="" src={item?.media?.thumbUrl || '/images/default_thumbnail_video.png'} />
                    <h5>
                      {item.isPurchased || item.free ? (
                        <span>
                          <i className={`far fa-eye ${item.isPurchased || item.free ? 'mt-3' : ''}`} />
                          {' '}
                          Vorschau
                        </span>
                      ) : (
                        <span>
                          <NumericFormat thousandSeparator value={item.price} displayType="text" />
                          {' '}
                          Tokens
                        </span>
                      )}
                    </h5>
                    <a
                      href="#"
                      className="btn btn-primary"
                      onClick={() => (isFriend ? handlePurchase(item) : toast.error('Bitte fügen Sie das Modell zu Ihren Favoriten hinzu, um den Artikel zu kaufen'))}
                    >
                      Jetzt kaufen
                    </a>
                    <a
                      aria-hidden
                      className="popup"
                      role="button"
                      onClick={(e) => handleView(e, item)}
                      style={{ cursor: `${item.isPurchased || item.free ? 'pointer' : 'unset'}` } as any}
                    >
                      <div className="flex justify-content-center">
                        <i className={`icon-play ${item.isPurchased || item.free ? 'purchased-free ' : ''}`} />
                      </div>
                    </a>
                    <div className="overlay" />
                  </div>
                  <div className="media-name" data-toggle="tooltip" data-placement="top" title={item.name}>
                    {item.name}
                  </div>

                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
      {!isLoading && (!items || (items && items.length === 0)) && (
        <p className="text-alert-danger">
          nein
          {' '}
          {type}
          s
          {' '}
          sind verfügbar!
        </p>
      )}
      {total > 0 && total > take ? <MainPaginate currentPage={page} pageTotal={total} pageNumber={take} setPage={setPage} /> : null}
      <ViewMediaItem
        titleModal={titleModal}
        mediaItem={mediaItem}
        isOpenMedia={isOpenMedia}
        closeMedia={setIsOpenMedia.bind(this)}
      />
    </div>
  );
}

const mapStateToProps = (state: any) => ({ ...state.sellItem, authUser: state.auth.authUser });

export default connect(mapStateToProps)(ContactFooter);
