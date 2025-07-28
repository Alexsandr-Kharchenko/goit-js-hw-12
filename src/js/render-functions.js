import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const galleryEl = document.querySelector('.gallery');
const loaderContainer = document.getElementById('loader-container');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="gallery-info">
            <p><strong>Likes:</strong> ${likes}</p>
            <p><strong>Views:</strong> ${views}</p>
            <p><strong>Comments:</strong> ${comments}</p>
            <p><strong>Downloads:</strong> ${downloads}</p>
          </div>
        </li>
      `
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryEl.innerHTML = '';
}

export function showLoader() {
  loaderContainer.classList.remove('hidden');
}

export function hideLoader() {
  loaderContainer.classList.add('hidden');
}
