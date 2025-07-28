import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import errorIcon from './img/icon.svg';

const form = document.querySelector('.form');
const loadingMessage = document.getElementById('loading-message');

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = form.elements['search-text'].value.trim();
  if (!query) {
    iziToast.warning({
      message: 'Please enter a search term',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  showLoader();
  loadingMessage?.classList.remove('hidden');

  try {
    const data = await getImagesByQuery(query);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        backgroundColor: '#ef4040',
        iconUrl: errorIcon,
        messageColor: '#fff',
      });
    } else {
      createGallery(data.hits);
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadingMessage?.classList.add('hidden');
  }

  form.reset();
});

window.addEventListener('load', () => {
  hideLoader();
  loadingMessage?.classList.add('hidden');
});
