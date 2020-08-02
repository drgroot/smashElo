import '../base.css';
import '../template/template';
import moment from 'moment';

const progress = document.getElementById('progress');

const chunkArray = (arr, size) => {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
};

const getFileBuffer = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    resolve(e.target.result);
  };
});

const upload = (rawImages, finished = []) => Promise.all([
  Promise.all(
    rawImages
      .filter(({ type }) => {
        if (type === 'image/jpeg' || type === 'image/jpg') {
          return true;
        }

        finished.push(false);
        return false;
      })
      .map((file) => getFileBuffer(file)
        .then((content) => ({
          name: file.name,
          type: file.type,
          date: (/^\d{16}-\w+\.\w+$/.test(file.name)) ? moment(file.name.split('-')[0], 'YYYYMMDDHHmmssSS').toDate() : new Date(file.lastModified),
          content,
          src: content,
          error: 'Image rejected',
          data: [],
          status: 'error',
        }))),
  ),
  import(
    /* webpackPrefetch: true */
    /* webpackChunkName: "request" */
    '../lib/request'
  ),
])
  .then(([images, { post }]) => Promise.all(
    chunkArray(images, 5)
      .map(
        (chunk) => post('/api/ultimate/profile/uploadGames', { images: chunk, sync: false })
          .catch(() => chunk)
          .then((data) => data.forEach((d) => finished.push(d)))
          .then(() => {
            progress.innerText = `Uploaded ${finished.length} of ${rawImages.length}`;
          }),
      ),
  ))
  .then(() => {
    progress.innerText = `Finished processsing ${finished.length} files!`;
    progress.classList.remove('bg-blue-300');
    progress.classList.add('bg-green-300');
  });

document.getElementById('uploadFiles').addEventListener('click', () => {
  document.getElementById('imageupload').click();
});

document.getElementById('imageupload')
  .addEventListener('change', (e) => {
    progress.classList.add('bg-blue-300');
    progress.classList.remove('bg-green-300', 'hidden');
    upload(Array.from(e.target.files));
  });
