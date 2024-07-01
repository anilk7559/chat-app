import { mediaService } from '@services/media.service';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ImageBox from 'src/components/conversation/image-box';

interface IProps {
  items: any;
  type: string;
  download?: boolean;
}

function MediaContent({ items, type, download = true }: IProps) {
  const [activeImage, setActiveImage] = useState('');

  const handleDownloadFile = async (mediaId: string) => {
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
  };

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
                  handleDownloadFile(item._id);
                }
              }}
            >
              {/* type = photo */}
              {type === 'photo' && <img alt="media_thumb" className="img-fluid rounded" src={item?.thumbUrl} />}
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
