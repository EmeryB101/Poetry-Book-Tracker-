# Female Poetry Book Tracker

A beautiful, interactive web application for tracking and rating poetry books by female authors. Featuring 100 classic and modern poetry collections spanning various genres, themes, and time periods.

## Features

- **100 Curated Poetry Books**: Carefully selected collection of female-authored poetry from classics like Emily Dickinson and Sylvia Plath to contemporary voices like Ocean Vuong and Claudia Rankine
- **Smart Filtering**: Filter by genre, theme, reading status, and search by title or author
- **Rating System**: Rate books with an intuitive 5-star rating system
- **Reading Tracker**: Mark books as read/unread
- **Statistics Dashboard**: Track your total books, books read, and average rating
- **Local Storage**: All your data is saved locally in your browser - no account needed
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile devices
- **GitHub Pages Ready**: Optimized for deployment on GitHub Pages

## Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern, responsive design with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JavaScript for all functionality
- **Local Storage API**: For persistent data storage

## Setup & Deployment

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Poetry-Book-Tracker-.git
   cd Poetry-Book-Tracker-
   ```

2. Open `index.html` in your browser, or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js http-server
   npx http-server
   ```

3. Visit `http://localhost:8000` in your browser

### GitHub Pages Deployment

1. Push the repository to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit: Female Poetry Book Tracker"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select source branch (usually `main`)
   - Select folder: `/ (root)`
   - Click Save

3. Your site will be live at: `https://yourusername.github.io/Poetry-Book-Tracker-/`

## File Structure

```
Poetry-Book-Tracker-/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js              # JavaScript functionality
├── books.json          # Database of 100 poetry books
└── README.md           # Documentation
```

## How to Use

1. **Browse Books**: Scroll through the collection of 100 poetry books
2. **Search**: Use the search bar to find books by title or author
3. **Filter**:
   - Select a genre (Confessional, Contemporary, Feminist, etc.)
   - Select a theme (Love, Identity, Nature, etc.)
   - Filter by reading status (Read/Unread/All)
4. **Sort**: Sort books by title, author, year, or your rating
5. **Rate**: Click the stars to rate a book (1-5 stars)
6. **Track**: Check the "Mark as Read" box to track your progress
7. **View Stats**: See your reading statistics at the top of the page

## Data Structure

Each book in `books.json` contains:
- `id`: Unique identifier
- `title`: Book title
- `author`: Author name
- `year`: Year of publication
- `genres`: Array of genre classifications
- `themes`: Array of thematic tags

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

All data is stored locally in your browser using the Local Storage API. No data is sent to any server. Your ratings and reading status are private and only accessible on your device.

## Contributing

Feel free to:
- Add more books to the collection
- Suggest new features
- Report bugs
- Improve the design

## License

This project is open source and available under the MIT License.

## Acknowledgments

This project celebrates the incredible contributions of women poets throughout history and today. The collection spans from Victorian-era poets to contemporary voices, representing diverse backgrounds, experiences, and perspectives.

---

**Note**: To preserve your data when switching devices, you can export your browser's local storage or manually recreate your ratings on the new device. A future enhancement could include import/export functionality.
