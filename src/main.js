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
const loadMoreBtn = document.getElementById('load-more-btn');

let currentPage = 250;
let currentQuery = '';
let totalHits = 0;

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

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();
  loadingMessage.classList.remove('hidden');

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      hideLoadMoreButton();
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
      if (totalHits > 20) {
        showLoadMoreButton();
      }
    }
  } catch (error) {
    hideLoadMoreButton();
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadingMessage.classList.add('hidden');
  }

  form.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    scrollPage();

    const totalPages = Math.ceil(totalHits / 20);
    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    }
  } catch (error) {
    hideLoadMoreButton();
    iziToast.error({
      message: 'Failed to load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}

function scrollPage() {
  const card = document.querySelector('.gallery-item');
  if (card) {
    const { height: cardHeight } = card.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

window.addEventListener('load', () => {
  hideLoader();
  loadingMessage?.classList.add('hidden');
});
