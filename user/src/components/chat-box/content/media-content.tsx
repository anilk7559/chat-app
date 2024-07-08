// import { purchaseItem } from '@redux/purchase-item/actions';
// import { mediaService } from '@services/media.service';
// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import ImageBox from 'src/components/conversation/image-box';

// interface IProps {
//   items: any;
//   type: string;
//   download?: boolean;
// }

// function MediaContent({ items, type, download = true }: IProps) {
//   const [activeImage, setActiveImage] = useState('');

//   console.log('====================================');
//   console.log(items, "items");
//   console.log('====================================');
//   const dispatch = useDispatch();
//   const handleDownloadFile = async (mediaId: string) => {
//     try {
//       const resp = await mediaService.download(mediaId);
//       const a = document.createElement('a');
//       a.href = resp.data.href;
//       a.target = '_blank';
//       a.click();
//     } catch (e) {
//       const error = await e;
//       toast.error(error?.message || 'Datei konnte nicht heruntergeladen werden!');
//     }
//   };
//  let authUser = {
//   type: 'user'
//  }
//   const handlePurchase = (item: any) => {
//     if (authUser.type === 'model') {
//       toast.error('Es tut uns leid. Nur Benutzer können Premium-Inhalte erwerben.');
//     } else if (window.confirm('Sind Sie sicher, dass Sie dieses Element kaufen möchten?')) {
//       dispatch(purchaseItem({ sellItemId: item.sellItemId }));
//     }
//   };

//   return (
//     <>
//       <div className="form-row">
//         {items?.map((item) => (
//           <div className="col m-auto" key={item?._id}>
//             <a
//               aria-hidden
//               className="popup-media"
//               onClick={() => {
//                 if (type === 'video') {
//                   return;
//                 }
//                 setActiveImage(`${item?.fileUrl}`);
//                 if (download) {
//                   handleDownloadFile(item._id);
//                 } handlePurchase(item);
//               }}
//             >
//               {/* type = photo */}
//               {type === 'photo' && (
//                 <div className={`${item && item.isPurchased  === true && item.isFree === false ? '' : 'image-box mt-3'}`}>
//                   <img alt="media_thumb" className={`img-fluid rounded`} src={item?.thumbUrl} />
//                   <div className='overlay'></div>
//                 </div>
//                 )}
//               {/* type = video */}
//               {type === 'video' && (
//               <video controls src={`${item?.fileUrl}`} width="100%" />
//               )}
//             </a>
//           </div>
//         ))}
//       </div>

//       <ImageBox image={activeImage} />
//     </>
//   );
// }

// export default MediaContent;



import { purchaseItem } from '@redux/purchase-item/actions';
import { mediaService } from '@services/media.service';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ImageBox from 'src/components/conversation/image-box';

interface IProps {
  items: any;
  type: string;
  download?: boolean;
  sender?: {
    type: string;
  }
}

function MediaContent({ items, type, sender, download = true }: IProps) {
  const [activeImage, setActiveImage] = useState('');
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('');
  const handleDownloadFile = async (mediaId: string, item: any) => {
    if((item.sellItemId && item.isPurchased === true) || (item.sellItemId === false)){
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
    } 
     else{
      toast.error('Sie sind nicht berechtigt, diese Inhalte zu erwerben.');
    }
  };
 let authUser = {
  type: 'user'
 }
  const handlePurchase = (item: any) => {
    if (authUser.type === 'model') {
      toast.error('Es tut uns leid. Nur Benutzer können Premium-Inhalte erwerben.');
    } else if (window.confirm('Sind Sie sicher, dass Sie dieses Element kaufen möchten?')) {
      dispatch(purchaseItem({ sellItemId: item.sellItemId }));
    }
  };

  useEffect(()=> {
    const userType = JSON.parse(localStorage.getItem('userType') || '');
    setUserType(userType);
  }, [])

  return (
    <>
      <div className="form-row">
        {items?.map((item) => (
          <div className="col m-auto" key={item?._id}>
            <a
              aria-hidden
              className="popup-media"
              onClick={() => {
                if (type === 'video') {
                  return;
                }
                setActiveImage(`${item?.fileUrl}`);
                if (download) {
                  handleDownloadFile(item._id, item);
                }
                //  handlePurchase(item);
              }}
            > 
            {userType === 'model' || item.isFree === true ? (
              <img alt="media_thumb" src={item?.thumbUrl} />
            ): 
              <div className={item && item.isPurchased  === true && item.isFree === false ? 'image-box mt-3 active' : 'image-box mt-3'}>
                      <img alt=""  className={`img-fluid rounded`} src={item && item.isPurchased  === true && item.isFree === false ? item?.thumbUrl || '/images/default_thumbnail_photo.jpg' : item.media?.blurUrl || '/images/default_thumbnail_photo.jpg'} />
                      <h5>
                        {item && item.isPurchased  === true && item.isFree === false ? (
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
                      { <a
                        aria-hidden
                        className="btn btn-primary pointer"
                        onClick={() =>  handlePurchase(item)}
                      >
                        Jetzt kaufen
                      </a>}
                      <div className="overlay" />
                    </div>
            }
              {/* type = video */}
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
