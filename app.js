// ===== STATE MANAGEMENT =====
let allBooks = [];
let filteredBooks = [];
let userData = {};

// ===== DOM ELEMENTS =====
const bookGrid = document.getElementById('bookGrid');
const searchInput = document.getElementById('searchInput');
const genreFilter = document.getElementById('genreFilter');
const themeFilter = document.getElementById('themeFilter');
const statusFilter = document.getElementById('statusFilter');
const sortBy = document.getElementById('sortBy');
const resetFiltersBtn = document.getElementById('resetFilters');
const noResults = document.getElementById('noResults');
const totalBooksEl = document.getElementById('totalBooks');
const booksReadEl = document.getElementById('booksRead');
const averageRatingEl = document.getElementById('averageRating');
const recommendationsSection = document.getElementById('recommendationsSection');
const recommendationsGrid = document.getElementById('recommendationsGrid');

// ===== LOCAL STORAGE FUNCTIONS =====
function loadUserData() {
    const stored = localStorage.getItem('poetryBookTracker');
    if (stored) {
        try {
            userData = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading user data:', e);
            userData = {};
        }
    }
}

function saveUserData() {
    localStorage.setItem('poetryBookTracker', JSON.stringify(userData));
}

function getUserBookData(bookId) {
    return userData[bookId] || { read: false, rating: 0 };
}

function setUserBookData(bookId, data) {
    userData[bookId] = { ...getUserBookData(bookId), ...data };
    saveUserData();
    updateStats();
    updateRecommendations();
}

// ===== DATA LOADING =====
async function loadBooks() {
    try {
        const response = await fetch('books.json');
        const data = await response.json();
        allBooks = data.books;
        filteredBooks = [...allBooks];

        populateFilters();
        renderBooks();
        updateStats();
        updateRecommendations();
    } catch (error) {
        console.error('Error loading books:', error);
        bookGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Error loading books. Please refresh the page.</p>';
    }
}

// ===== FILTER POPULATION =====
function populateFilters() {
    // Get unique genres and themes
    const genres = new Set();
    const themes = new Set();

    allBooks.forEach(book => {
        book.genres.forEach(genre => genres.add(genre));
        book.themes.forEach(theme => themes.add(theme));
    });

    // Sort and populate genre filter
    const sortedGenres = Array.from(genres).sort();
    sortedGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    // Sort and populate theme filter
    const sortedThemes = Array.from(themes).sort();
    sortedThemes.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeFilter.appendChild(option);
    });
}

// ===== BOOK RENDERING =====
function renderBooks() {
    if (filteredBooks.length === 0) {
        bookGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    bookGrid.style.display = 'grid';
    noResults.style.display = 'none';

    bookGrid.innerHTML = filteredBooks.map(book => createBookCard(book)).join('');

    // Attach event listeners after rendering
    attachEventListeners();
}

function createBookCard(book) {
    const userBookData = getUserBookData(book.id);
    const isRead = userBookData.read;
    const rating = userBookData.rating;

    return `
        <div class="book-card ${isRead ? 'read' : ''}" data-book-id="${book.id}" role="listitem">
            <div class="book-header">
                <h2 class="book-title">${escapeHtml(book.title)}</h2>
                <p class="book-author">${escapeHtml(book.author)}</p>
                <p class="book-year">${book.year}</p>
            </div>

            <div class="book-haiku">
                <p class="haiku-text">${escapeHtml(book.haiku)}</p>
            </div>

            <div class="book-genres">
                <div class="tag-container">
                    ${book.genres.map(genre => `<span class="tag genre-tag">${escapeHtml(genre)}</span>`).join('')}
                </div>
            </div>

            <div class="book-themes">
                <div class="tag-container">
                    ${book.themes.map(theme => `<span class="tag theme-tag">${escapeHtml(theme)}</span>`).join('')}
                </div>
            </div>

            <div class="book-actions">
                <div class="rating-section">
                    <span class="rating-label">Your Rating:</span>
                    <div class="stars" data-book-id="${book.id}">
                        ${[1, 2, 3, 4, 5].map(star =>
                            `<span class="star ${star <= rating ? 'active' : ''}" data-rating="${star}" tabindex="0" role="button" aria-label="Rate ${star} stars">★</span>`
                        ).join('')}
                    </div>
                </div>

                <div class="read-status">
                    <div class="checkbox-wrapper">
                        <input
                            type="checkbox"
                            id="read-${book.id}"
                            data-book-id="${book.id}"
                            ${isRead ? 'checked' : ''}
                        >
                        <label for="read-${book.id}">Mark as Read</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    // Star rating
    document.querySelectorAll('.stars').forEach(starsContainer => {
        const bookId = parseInt(starsContainer.dataset.bookId);
        const stars = starsContainer.querySelectorAll('.star');

        stars.forEach((star, index) => {
            // Click event
            star.addEventListener('click', () => {
                const rating = parseInt(star.dataset.rating);
                setUserBookData(bookId, { rating });
                updateStarDisplay(starsContainer, rating);
            });

            // Keyboard event
            star.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const rating = parseInt(star.dataset.rating);
                    setUserBookData(bookId, { rating });
                    updateStarDisplay(starsContainer, rating);
                }
            });

            // Hover effect
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.classList.add('hovered');
                    } else {
                        s.classList.remove('hovered');
                    }
                });
            });
        });

        // Remove hover effect when leaving stars container
        starsContainer.addEventListener('mouseleave', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });
    });

    // Read checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const bookId = parseInt(e.target.dataset.bookId);
            const read = e.target.checked;
            setUserBookData(bookId, { read });

            // Update card appearance
            const card = e.target.closest('.book-card');
            if (read) {
                card.classList.add('read');
            } else {
                card.classList.remove('read');
            }
        });
    });
}

function updateStarDisplay(starsContainer, rating) {
    const stars = starsContainer.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ===== FILTERING & SORTING =====
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;
    const selectedTheme = themeFilter.value;
    const selectedStatus = statusFilter.value;

    filteredBooks = allBooks.filter(book => {
        // Search filter
        const matchesSearch = searchTerm === '' ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);

        // Genre filter
        const matchesGenre = selectedGenre === '' ||
            book.genres.includes(selectedGenre);

        // Theme filter
        const matchesTheme = selectedTheme === '' ||
            book.themes.includes(selectedTheme);

        // Status filter
        let matchesStatus = true;
        if (selectedStatus === 'read') {
            matchesStatus = getUserBookData(book.id).read;
        } else if (selectedStatus === 'unread') {
            matchesStatus = !getUserBookData(book.id).read;
        }

        return matchesSearch && matchesGenre && matchesTheme && matchesStatus;
    });

    applySorting();
    renderBooks();
}

function applySorting() {
    const sortValue = sortBy.value;

    filteredBooks.sort((a, b) => {
        switch (sortValue) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'author':
                return a.author.localeCompare(b.author);
            case 'year':
                return a.year - b.year;
            case 'year-desc':
                return b.year - a.year;
            case 'rating':
                const ratingA = getUserBookData(a.id).rating;
                const ratingB = getUserBookData(b.id).rating;
                return ratingB - ratingA;
            default:
                return 0;
        }
    });
}

function resetFilters() {
    searchInput.value = '';
    genreFilter.value = '';
    themeFilter.value = '';
    statusFilter.value = '';
    sortBy.value = 'title';
    applyFilters();
}

// ===== STATISTICS =====
function updateStats() {
    // Total books
    totalBooksEl.textContent = allBooks.length;

    // Books read
    const readBooks = allBooks.filter(book => getUserBookData(book.id).read);
    booksReadEl.textContent = readBooks.length;

    // Average rating (only for rated books)
    const ratedBooks = allBooks.filter(book => {
        const rating = getUserBookData(book.id).rating;
        return rating > 0;
    });

    if (ratedBooks.length > 0) {
        const totalRating = ratedBooks.reduce((sum, book) => {
            return sum + getUserBookData(book.id).rating;
        }, 0);
        const avgRating = (totalRating / ratedBooks.length).toFixed(1);
        averageRatingEl.textContent = avgRating;
    } else {
        averageRatingEl.textContent = '-';
    }
}

// ===== RECOMMENDATIONS =====
function generateRecommendations() {
    // Get all books with ratings of 4 or 5 stars
    const highlyRatedBooks = allBooks.filter(book => {
        const rating = getUserBookData(book.id).rating;
        return rating >= 4;
    });

    // If no highly rated books, don't show recommendations
    if (highlyRatedBooks.length === 0) {
        return [];
    }

    // Collect genres and themes from highly rated books
    const preferredGenres = {};
    const preferredThemes = {};

    highlyRatedBooks.forEach(book => {
        const rating = getUserBookData(book.id).rating;
        const weight = rating; // 4 or 5 star weight

        book.genres.forEach(genre => {
            preferredGenres[genre] = (preferredGenres[genre] || 0) + weight;
        });

        book.themes.forEach(theme => {
            preferredThemes[theme] = (preferredThemes[theme] || 0) + weight;
        });
    });

    // Score all unread books based on matching genres/themes
    const unreadBooks = allBooks.filter(book => {
        const userData = getUserBookData(book.id);
        return !userData.read; // Not marked as read
    });

    const scoredBooks = unreadBooks.map(book => {
        let score = 0;

        // Add points for matching genres
        book.genres.forEach(genre => {
            if (preferredGenres[genre]) {
                score += preferredGenres[genre] * 2; // Genres weighted more heavily
            }
        });

        // Add points for matching themes
        book.themes.forEach(theme => {
            if (preferredThemes[theme]) {
                score += preferredThemes[theme];
            }
        });

        return {
            book,
            score
        };
    });

    // Sort by score and return top 6
    scoredBooks.sort((a, b) => b.score - a.score);
    return scoredBooks.slice(0, 6).filter(item => item.score > 0);
}

function updateRecommendations() {
    const recommendations = generateRecommendations();

    if (recommendations.length === 0) {
        recommendationsSection.style.display = 'none';
        return;
    }

    recommendationsSection.style.display = 'block';
    recommendationsGrid.innerHTML = recommendations.map(({ book, score }) => {
        const userBookData = getUserBookData(book.id);
        const rating = userBookData.rating;

        return `
            <div class="recommendation-card book-card" data-book-id="${book.id}" role="listitem">
                <div class="book-header">
                    <h2 class="book-title">${escapeHtml(book.title)}</h2>
                    <p class="book-author">${escapeHtml(book.author)}</p>
                    <p class="book-year">${book.year}</p>
                    <span class="recommendation-score">${Math.round(score)}% Match</span>
                </div>

                <div class="book-haiku">
                    <p class="haiku-text">${escapeHtml(book.haiku)}</p>
                </div>

                <div class="book-genres">
                    <div class="tag-container">
                        ${book.genres.map(genre => `<span class="tag genre-tag">${escapeHtml(genre)}</span>`).join('')}
                    </div>
                </div>

                <div class="book-themes">
                    <div class="tag-container">
                        ${book.themes.map(theme => `<span class="tag theme-tag">${escapeHtml(theme)}</span>`).join('')}
                    </div>
                </div>

                <div class="book-actions">
                    <div class="rating-section">
                        <span class="rating-label">Your Rating:</span>
                        <div class="stars" data-book-id="${book.id}">
                            ${[1, 2, 3, 4, 5].map(star =>
                                `<span class="star ${star <= rating ? 'active' : ''}" data-rating="${star}" tabindex="0" role="button" aria-label="Rate ${star} stars">★</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="read-status">
                        <div class="checkbox-wrapper">
                            <input
                                type="checkbox"
                                id="read-${book.id}"
                                data-book-id="${book.id}"
                                ${userBookData.read ? 'checked' : ''}
                            >
                            <label for="read-${book.id}">Mark as Read</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Reattach event listeners for recommendation cards
    attachEventListeners();
}

// ===== EVENT LISTENERS SETUP =====
searchInput.addEventListener('input', applyFilters);
genreFilter.addEventListener('change', applyFilters);
themeFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);
sortBy.addEventListener('change', () => {
    applySorting();
    renderBooks();
});
resetFiltersBtn.addEventListener('click', resetFilters);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    loadBooks();
});
