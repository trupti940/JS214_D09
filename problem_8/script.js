const apiKey = 'your-omdb-api-key';
let currentPage = 1;
let totalResults = 0;

document.getElementById('search-button').addEventListener('click', () => {
    currentPage = 1;
    fetchMovies();
});

document.getElementById('prev-button').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies();
    }
});

document.getElementById('next-button').addEventListener('click', () => {
    if (currentPage < Math.ceil(totalResults / 10)) {
        currentPage++;
        fetchMovies();
    }
});

async function fetchMovies() {
    const movieTitle = document.getElementById('movie-title').value.trim();
    if (!movieTitle) {
        alert('Please enter a movie title.');
        return;
    }

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(movieTitle)}&page=${currentPage}&apikey=${apiKey}`);
        const data = await response.json();

        if (data.Response === 'False') {
            throw new Error(data.Error);
        }

        totalResults = parseInt(data.totalResults, 10);
        displayMovies(data.Search);
        updatePagination();
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('movies-container').innerHTML = `<p>${error.message}</p>`;
    }
}

function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies-container');
    moviesContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <p>${movie.Plot || 'Plot summary not available'}</p>
        `;

        moviesContainer.appendChild(movieCard);
    });
}

function updatePagination() {
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${Math.ceil(totalResults / 10)}`;

    document.getElementById('prev-button').disabled = currentPage === 1;
    document.getElementById('next-button').disabled = currentPage === Math.ceil(totalResults / 10);
}
