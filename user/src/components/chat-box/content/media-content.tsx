import { purchaseItem } from '@redux/purchase-item/actions';
import { mediaService } from '@services/media.service';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ImageBox from 'src/components/conversation/image-box';

interface IProps {
  items: any;
  type: string;
  download?: boolean;
  sender?: {
    type: string;
  };
}

function MediaContent({ items, type, sender, download = true }: IProps) {
  const [activeImage, setActiveImage] = useState('');
  const dispatch = useDispatch();
  const authUser = useSelector((state: any) => state.auth.authUser);
  const [mediaItems, setMediaItems] = useState(items);

  const handleDownloadFile = async (mediaId: string, item: any) => {
    if ((item.sellItemId && item.isPurchased === true) || item.sellItemId === false) {
      try {
        const resp = await mediaService.download(mediaId);
        const a = document.createElement('a');
        a.href = resp.data.href;
        a.target = '_blank';
        a.click();
      } catch (e) {
        const error = await e;
        toast.error(error?.message || 'Datei konnte nicht heruntergeladen werden!');
      }
    } else {
      toast.error('Sie sind nicht berechtigt, diese Inhalte zu erwerben.');
    }
  };

  const handlePurchase = (item: any) => {
    if (authUser.type === 'model') {
      toast.error('Es tut uns leid. Nur Benutzer können Premium-Inhalte erwerben.');
    } else if (window.confirm('Sind Sie sicher, dass Sie dieses Element kaufen möchten?')) {
      dispatch(purchaseItem({ sellItemId: item.sellItemId }))
        .then(() => {
          const updatedItems = mediaItems.map((mediaItem) => {
            if (mediaItem._id === item._id) {
              return { ...mediaItem, isPurchased: true };
            }
            return mediaItem;
          });
          setMediaItems(updatedItems);
        })
        .catch(() => {
          toast.error('Der Kauf ist fehlgeschlagen.');
        });
    }
  };

  useEffect(() => {
    // Ensure that the new items have correct isPurchased and blur state
    const updatedItems = items.map((item) => {
      if (authUser.type === 'user' && item.sellItemId && !item.isPurchased) {
        return {
          ...item,
          isPurchased: false, // Initially set isPurchased to false for paid items
        };
      }
      return item;
    });
    setMediaItems(updatedItems);
  }, [items, authUser.type]);

  return (
    <>
      <div className="form-row">
        {mediaItems?.map((item) => (
          <div className="col m-auto" key={item?._id}>
            <a
              aria-hidden
              className="popup-media"
              onClick={() => {
                if (type === 'video') {
                  return;
                }
                setActiveImage(`${item?.fileUrl}`);
              }}
            >
              {authUser.type === 'model' || item.isFree === true || item.sellItemId === null ? (
                <img alt="media_thumb" src={item?.thumbUrl} />
              ) : (
                <div className={item.isPurchased === true && item.isFree === false ? 'image-box mt-3 active' : 'image-box mt-3'}>
                  <img
                    onClick={() => {
                      if (download) {
                        handleDownloadFile(item._id, item);
                      }
                    }}
                    alt=""
                    className="img-fluid rounded"
                    src={item.isPurchased === true && item.isFree === false ? item?.thumbUrl || '/images/default_thumbnail_photo.jpg' : item.media?.blurUrl || '/images/default_thumbnail_photo.jpg'}
                  />
                  <h5>
                    {item.isPurchased === true && item.isFree === false ? (
                      <span>
                        <i className="far fa-eye" /> Vorschau
                      </span>
                    ) : (
                      <span>
                        <NumericFormat thousandSeparator value={item.price} displayType="text" /> Tokens
                      </span>
                    )}
                  </h5>
                  {<a
                    aria-hidden
                    className="btn btn-primary pointer"
                    onClick={() => handlePurchase(item)}
                  >
                    Jetzt kaufen
                  </a>}
                  <div className="overlay" />
                </div>
              )}
              {type === 'video' && (
                <video controls src={`${item?.fileUrl}`} width="100%" />
              )}
            </a>
          </div>
        ))}
      </div>

      <ImageBox image={activeImage} />
    </>
  );
}

export default MediaContent;
