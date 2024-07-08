// import React, { Component } from 'react';
// import Searchbar from './Searchbar/Searchbar';
// import Notiflix from 'notiflix';

// const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';

// export class App extends Component {
//   state = {
//     images: [],
//     query: new URLSearchParams(window.location.search).get('query') || '',
//   };

//   componentDidMount() {
//     const { query } = this.state;
//     if (query) {
//       this.fetchImages(query);
//     }
//   }

//   fetchImages = query => {
//     const API_URL = `https://pixabay.com/api/?q=${query}&page=1&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

//     fetch(API_URL)
//       .then(response => response.json())
//       .then(data => {
//         if (data.hits.length === 0) {
//           Notiflix.Notify.failure('No images found for your search term');
//           return;
//         }
//         this.setState({ images: data.hits });
//       })
//       .catch(error => {
//         console.error('Error fetching images:', error);
//         Notiflix.Notify.failure('Something went wrong. Please try again.');
//       });
//   };

//   handleSubmit = e => {
//     e.preventDefault();
//     const query = e.target.elements.searchQuery.value.trim();

//     if (!query) {
//       Notiflix.Notify.warning('Please enter a search term');
//       return;
//     }

//     this.setState({ query }, () => {
//       this.updateQueryParam(query);
//       this.fetchImages(query);
//     });
//   };

//   updateQueryParam = query => {
//     const url = new URL(window.location);
//     url.searchParams.set('query', query);
//     window.history.pushState({}, '', url);
//   };

//   render() {
//     const { images, query } = this.state;

//     return (
//       <>
//         <Searchbar onSubmit={this.handleSubmit} initialQuery={query} />
//         {query && <h2>Results for "{query}"</h2>}
//         <div>
//           {images.map(image => (
//             <img key={image.id} src={image.webformatURL} alt={image.tags} />
//           ))}
//         </div>
//       </>
//     );
//   }
// }

// export default App;

import { useEffect, useState } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import Modal from './Modal/Modal';
import Notiflix from 'notiflix';

const API_KEY = '41167755-70f3c314cd8390efeff4b47a8';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search).get('query') || ''
  );
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (query) {
      fetchImages(query, page);
    }
  }, [query, page]);

  const fetchImages = async (query, page) => {
    setLoading(true);

    const API_URL = `https://pixabay.com/api/?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.hits.length === 0) {
        Notiflix.Notify.failure('No images found for your search term');
        return;
      }

      setImages(prevImages => [...prevImages, ...data.hits]);
    } catch (error) {
      console.error('Error fetching images:', error);
      Notiflix.Notify.failure('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const query = e.target.elements.searchQuery.value.trim();

    if (!query) {
      Notiflix.Notify.warning('Please enter a search term');
      return;
    }

    setQuery(query);
    setImages([]);
    setPage(1);
    updateQueryParam(query);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const updateQueryParam = query => {
    const url = new URL(window.location);
    url.searchParams.set('query', query);
    window.history.pushState({}, '', url);
  };

  const openModal = (largeImageURL, alt) => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
    setAlt(alt);
  };

  const closeModal = () => {
    setShowModal(false);
    setLargeImageURL('');
    setAlt('');
  };

  return (
    <>
      <Searchbar onSubmit={handleSubmit} initialQuery={query} />
      {query && <h2>Results for "{query}"</h2>}
      {loading && <Loader />}
      <ImageGallery images={images} onImageClick={openModal} />
      {images.length > 0 && !loading && <Button onClick={handleLoadMore} />}
      {showModal && (
        <Modal largeImageURL={largeImageURL} alt={alt} onClose={closeModal} />
      )}
    </>
  );
};

export default App;
