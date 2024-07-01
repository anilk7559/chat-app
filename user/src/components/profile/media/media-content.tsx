import Loading from '@components/common-layout/loading/loading';
import { sellItemService } from '@services/sell-item.service';
import { useEffect, useState } from 'react';
import {
  Col, Row, Tab, Tabs
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import MainPaginate from 'src/components/paginate/main-paginate';
import UpdateMediaModal from 'src/components/profile/media/update-media-modal';

interface IProps {
  openMedia: Function;
}

function MediaContent({
  openMedia
}: IProps) {
  const [type, setType] = useState('');
  const [itemsPhoto, setItemsPhoto] = useState([] as any);
  const [totalPhoto, setTotalPhoto] = useState(0);
  const [pagePhoto, setPagePhoto] = useState(1);
  const [itemsVideo, setItemsVideo] = useState([] as any);
  const [totalVideo, setTotalVideo] = useState(0);
  const [pageVideo, setPageVideo] = useState(1);
  const [isUpdateShow, setIsUpdateShow] = useState(false);
  const [itemUpdate, setItemUpdate] = useState(null as any);
  const [loading, setLoading] = useState(false);
  const take = 9;

  const getSellItemPhoto = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMySellItem({ page: pagePhoto, mediaType: 'photo', take });
      setItemsPhoto(resp.data.items);
      setTotalPhoto(resp.data.count);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelfotos ist fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const getSellItemVideo = async () => {
    try {
      setLoading(true);
      const resp = await sellItemService.getMySellItem({ page: pageVideo, mediaType: 'video', take });
      setItemsVideo(resp.data.items);
      setTotalVideo(resp.data.count);
    } catch (e) {
      const err = await e;
      toast.error(err?.message || 'Das Laden meines Verkaufsartikelvideos ist fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  const handelUpdate = async (data: any) => {
    if (type === 'photo') {
      try {
        await sellItemService.updateSellItem(data.id, data.data);
        getSellItemPhoto();
        toast.success('Das Aktualisieren des Artikelfotos war erfolgreich');
      } catch (e) {
        const error = await e;
        toast.success(error?.message || 'Das Aktualisieren des Artikelfotos ist fehlgeschlagen.');
      }
    }
    if (type === 'video') {
      try {
        await sellItemService.updateSellItem(data.id, data.data);
        toast.success('Das Aktualisieren des Artikelvideos war erfolgreich.');
        getSellItemVideo();
      } catch (e) {
        const error = await e;
        toast.success(error?.message || 'Das Aktualisieren des Artikelvideos ist fehlgeschlagen');
      }
    }
  };

  const handleRemove = async (itemId: string, key: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Artikel löschen möchten?')) {
      if (key === 'photo') {
        try {
          await sellItemService.removeSellItem(itemId);
          getSellItemPhoto();
          toast.success('Das Entfernen des Artikelfotos war erfolgreich.');
        } catch (e) {
          const error = await e;
          toast.success(error?.message || 'Das Entfernen des Artikelfotos ist fehlgeschlagen');
        }
      }
      if (key === 'video') {
        try {
          await sellItemService.removeSellItem(itemId);
          toast.success('Das Entfernen des Artikelvideos war erfolgreich.');
          getSellItemVideo();
        } catch (e) {
          const error = await e;
          toast.success(error?.message || 'Das Entfernen des Artikelvideos ist fehlgeschlagen.');
        }
      }
    }
  };

  const handleOpenModalUpdate = (item: string, key: string) => {
    setType(key);
    setItemUpdate(item);
    setIsUpdateShow(true);
  };

  const handleOpenMedia = (item: any) => {
    openMedia(item);
  };

  const onChangeTab = (key) => {
    if (key === 'photo') {
      setPagePhoto(1);
    }
    if (key === 'video') {
      setPageVideo(1);
    }
  };

  useEffect(() => {
    getSellItemPhoto();
  }, [pagePhoto]);

  useEffect(() => {
    getSellItemVideo();
  }, [pageVideo]);

  return (
    <div className="card mb-3">
      {/* <div className="card-header">
        <h6 className="mb-1">Your Gallery</h6>
        <p className="mb-0 text-muted small">Update your photos & videos</p>
      </div> */}
      <UpdateMediaModal
        isModalShow={isUpdateShow}
        setModalShow={setIsUpdateShow}
        item={itemUpdate}
        handleUpdate={handelUpdate}
      />
      <div className="card-body">
        <Tabs defaultActiveKey="photo" transition={false} id="tab-media-content" onSelect={(key: any) => onChangeTab(key)}>
          <Tab eventKey="photo" title={`Fotos (${totalPhoto})`}>
            {loading && <Loading />}
            {!loading && itemsPhoto.length > 0
              ? (
                <Row>
                  {itemsPhoto.map((item: any, index: any) => (
                    <Col xs={6} sm={6} md={6} lg={4} key={item._id + index as any} data-toggle="tooltip" title={item.name}>
                      <div className="image-box mt-1 mb-1 active">
                        <img alt="media_thumb_photo" src={item?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'} style={{ height: '100%' }} />
                        <h5>
                          <i className="far fa-eye" />
                          {' '}
                          Vorschau
                        </h5>
                        <a className="edit" onClick={() => handleOpenModalUpdate(item, 'photo')}>
                          <i className="fas fa-pencil-alt" />
                        </a>
                        <a className="remove" onClick={() => handleRemove(item._id, 'photo')}>
                          <i className="fas fa-trash" />
                        </a>
                        <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}>{}</a>
                        <div className="overlay" />
                      </div>
                      <div className="media-name">
                        {item.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : <p className="text-alert-danger">Sie haben kein Foto verfügbar!</p>}
            {itemsPhoto.length > 0 && totalPhoto > 0 && totalPhoto > take && <MainPaginate currentPage={pagePhoto} pageTotal={totalPhoto} pageNumber={take} setPage={setPagePhoto} />}
          </Tab>
          <Tab eventKey="video" title={`Videos (${totalVideo})`}>
            {loading && <Loading />}
            {!loading && itemsVideo.length > 0
              ? (
                <Row>
                  {itemsVideo.map((item: any, index: any) => (
                    <Col xs={6} sm={6} md={6} lg={4} key={item._id + index as any} data-toggle="tooltip" title={item.name}>
                      <div className="image-box mt-1 mb-1 active pt-100">
                        <img
                          alt="media_thumb_video"
                          className="thumb-video"
                          src={item?.media?.thumbUrl || '/images/default_thumbnail_video.png'}
                        />
                        <h5>
                          <i className="far fa-eye" />
                          {' '}
                          Vorschau
                        </h5>
                        <a className="edit" onClick={() => handleOpenModalUpdate(item, 'video')}>
                          <i className="fas fa-pencil-alt" />
                        </a>
                        <a className="remove" onClick={() => handleRemove(item._id, 'video')}>
                          <i className="fas fa-trash" />
                        </a>
                        <a href="#" className="popup" role="button" onClick={() => handleOpenMedia(item)}>{}</a>
                        <div className="overlay" />
                      </div>
                      <div className="media-name">
                        {item.name}
                      </div>
                    </Col>
                  )) }
                </Row>
              ) : <p className="text-alert-danger">Sie haben kein Video verfügbar!</p>}
            {itemsVideo.length > 0 && totalVideo > 0 && totalVideo > take && <MainPaginate currentPage={pageVideo} pageTotal={totalVideo} pageNumber={take} setPage={setPageVideo} />}
          </Tab>
        </Tabs>

      </div>
    </div>
  );
}

export default MediaContent;
