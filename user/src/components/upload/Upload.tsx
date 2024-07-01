import { Component, createRef } from 'react';
import { toast } from 'react-toastify';
import { authService } from 'src/services/auth.service';

import Dropzone from './Dropzone';
import Progress from './Progress';

interface IUploadConfig {
  multiple?: boolean;
  accept?: string;
}
interface IProps {
  url: string;
  // eslint-disable-next-line react/require-default-props
  onComplete?: Function;
  // eslint-disable-next-line react/require-default-props
  onCompletedAll?: Function;
  // eslint-disable-next-line react/require-default-props
  config?: IUploadConfig;
  // eslint-disable-next-line react/require-default-props
  customFields?: any; // add custom field in form data
  // eslint-disable-next-line react/require-default-props
  onRemove?: Function;
}
class Upload extends Component<IProps, any> {
  private zoneRef: any = createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      files: [],
      uploading: false,
      uploadProgress: {},
      successfullUploaded: false
    };

    this.onFilesAdded = this.onFilesAdded.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }

  onFilesAdded(files: any) {
    const notMulti = this.props.config && !this.props.config.multiple;
    this.setState(
      (state: any) => ({
        files: notMulti ? files : state.files.concat(files)
      }),
      () => this.uploadFiles()
    );
  }

  async uploadFiles() {
    this.setState({ uploadProgress: {}, uploading: true });
    const promises = [] as any;
    this.state.files.forEach((file: any) => {
      promises.push(this.sendRequest(file));
    });
    try {
      const res = await Promise.all(promises);
      this.props.onCompletedAll && this.props.onCompletedAll(res);
      this.setState({ successfullUploaded: true, uploading: false });
    } catch (e) {
      toast.error('Upload fehlgeschlagen! Bitte überprüfen Sie es.');

      // Not Production ready! Do some error handling here instead...
      this.setState({ successfullUploaded: true, uploading: false });
    }
  }

  sendRequest(file: any) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: 'pending',
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      // eslint-disable-next-line consistent-return
      req.addEventListener('load', () => {
        const success = req.status >= 200 && req.status < 300;
        if (!success) {
          // eslint-disable-next-line react/no-access-state-in-setstate
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: 'error', percentage: 0 };
          this.setState({ uploadProgress: copy });
          return reject(req.response);
        }

        // eslint-disable-next-line react/no-access-state-in-setstate
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: 'done', percentage: 100 };

        this.setState({ uploadProgress: copy });
        const res = req.response;
        if (this.props.onComplete) {
          this.props.onComplete(res);
        }

        resolve(res);
      });

      req.upload.addEventListener('error', () => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: 'error', percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append('file', file, file.name);

      // check if have custom fields
      if (this.props.customFields) {
        Object.keys(this.props.customFields).forEach((key) => formData.append(key, this.props.customFields[key]));
      }

      req.responseType = 'json';
      req.open('POST', this.props.url);

      const accessToken = authService.getToken() || '';
      if (accessToken) {
        req.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }
      req.send(formData);
    });
  }

  // eslint-disable-next-line consistent-return, react/sort-comp
  renderProgress(file: any) {
    const uploadProgress = this.state.uploadProgress[file.name];
    if (this.state.uploading || this.state.successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="/images/baseline-check_circle_outline-24px.svg"
            style={{
              opacity: uploadProgress && uploadProgress.state === 'done' ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  }

  removeItem(evt: any, index: any) {
    evt.preventDefault();
    const { files } = this.state;
    const { onRemove } = this.props;
    files.splice(index, 1);
    this.setState(
      {
        uploading: false,
        uploadProgress: {},
        successfullUploaded: false,
        files
      },
      () => {
        if (!files.length) {
          this.zoneRef.current.resetFileInput();
        }
      }
    );
    onRemove && onRemove(files);
  }

  render() {
    return (
      <div className="file-upload">
        <Dropzone
          onFilesAdded={this.onFilesAdded}
          disabled={this.state.uploading || this.state.successfullUploaded}
          config={this.props.config}
          ref={this.zoneRef}
        />
        <div className="file-upload-content">
          {this.state.files.map((file: any, index: number) => {
            const img = URL.createObjectURL(file);
            return (
              <div key={file.name} className="Row">
                {file.type.indexOf('image') > -1 && (
                  <>
                    <img src={img} alt="img" className="file-upload-image" />
                    <button type="button" onClick={(evt) => this.removeItem(evt, index)} className="remove-image">
                    Entfernen
                      {' '}
                      <span className="image-title">Hochgeladenes Bild</span>
                    </button>
                  </>
                )}
                <span className="Filename">{file.name}</span>
                {this.renderProgress(file)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Upload;
