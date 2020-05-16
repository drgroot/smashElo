import React from 'react';
import moment from 'moment';
import { Container, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages } from '@fortawesome/free-solid-svg-icons';
import { post } from '../lib/request';
import './upload.css';

const getFileBuffer = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    resolve(e.target.result);
  };
});

const chunkArray = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      added: 0,
      total: 0,
      progress: 0,
    };
  }

  uploadFiles(eventFiles) {
    const files = Array.from(eventFiles);
    this.setState({
      uploading: true, total: files.length, added: 0, progress: 0,
    }, async () => Promise.all(
      chunkArray(files, 5)
        .map((chunk) => Promise.all(chunk
          .filter(({ type }) => type === 'image/jpeg' || type === 'image/jpg')
          .map(async (file) => {
            const content = await getFileBuffer(file);

            let date = new Date(file.lastModified);
            if (/^\d{16}-\w+\.\w+$/.test(file.name)) {
              date = moment(file.name.split('-')[0], 'YYYYMMDDHHmmssSS').toDate();
            }

            return {
              name: file.name,
              type: file.type,
              date,
              content,
              src: content,
              error: 'Image rejected. Please enter data in manually',
              data: [],
              status: 'error',
            };
          }))
          .then((images) => post('/game/ultimate/profile/uploadGames', { images })
            .then(({ data }) => {
              let { added, progress } = this.state;

              progress += images.length;
              added += data
                .filter((e) => typeof e === 'string')
                .length;

              this.setState({ added, progress });
            }))),
    )
      .then(() => this.setState({ uploading: false })));
  }

  render() {
    const {
      uploading, added, total, progress,
    } = this.state;

    return (
      <Container>
        {added !== 0 && (
          <Alert>{`Successfully added ${added} games!`}</Alert>
        )}
        <div id="uploadImageContainer">
          <label htmlFor="imageUpload">
            <FontAwesomeIcon icon={faImages} size="10x" />
            <div>
              {(!uploading) ? <span>Click to Upload Images</span>
                : (
                  <div>
                    <Spinner />
                    <span>{` Process ${progress} of ${total}`}</span>
                  </div>
                )}
            </div>
            <input
              id="imageUpload"
              type="file"
              onChange={(e) => this.uploadFiles(e.target.files)}
              multiple
            />
          </label>
        </div>
      </Container>
    );
  }
}

export default Upload;
