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

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false,
      files: [],
      added: 0,
      total: 0,
      progress: 0,
    };
  }

  uploadFiles(eventFiles) {
    const files = Array.from(eventFiles);
    this.setState({ uploading: true, total: files.length }, async () => {
      const jobs = [];

      for (const file of files) {
        if (file.type.indexOf('image') > -1) {
          // eslint-disable-next-line no-await-in-loop
          const src = await getFileBuffer(file);

          let date = new Date(file.lastModified);
          if (/^\d{16}-\w+\.\w+$/.test(file.name)) {
            date = moment(file.name.split('-')[0], 'YYYYMMDDHHmmssSS').toDate();
          }

          jobs.push(
            post(
              '/game/ultimate/profile/uploadGames',
              {
                images: [{
                  name: file.name,
                  type: file.type,
                  date,
                  content: src,
                  src,
                  error: 'Image rejected. Please enter data in manually',
                  data: [],
                  status: 'error',
                }],
              },
            )
              .then((res) => {
                let { added, progress } = this.state;
                progress += 1;

                if (typeof res.data[0] === 'string') {
                  added += 1;
                }

                this.setState({
                  added,
                  progress,
                });

                return res.data;
              }),
          );
        }
      }

      Promise.all(jobs)
        .then((results) => {
          const newImages = [];
          results.flatMap((result) => {
            if (typeof result !== 'string' && result[0].content) {
              newImages.push({ ...result[0], src: result[0].content });
            }
          });

          this.setState({
            uploading: false,
            files: newImages,
          });
        });
    });
  }

  actionHandler(e, action, item) {
    e.stopPropagation();
    const { files } = this.state;
    const [stateItem] = files.filter((f) => f.name === item.name);
    const index = files.indexOf(stateItem);
    files.splice(index, 1);

    if (action === 'save') {
      post('/game/ultimate/profile/saveGame', {
        image: {
          name: item.name,
          date: item.date,
          content: item.content,
          data: item.data,
        },
      })
        .then((res) => {
          if (res.data !== 'added') {
            files.push({
              ...item,
              error: res.data.error,
            });
          }

          this.setState({
            files,
          });
        });
    } else if (action === 'delete') {
      this.setState({
        files,
      });
    }
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
