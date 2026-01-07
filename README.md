# AI & Tech News Aggregator

A modern, responsive web application that aggregates and displays the latest AI and technology news from various sources.

## Features

- **Real-time News Aggregation**: Fetches latest tech and AI news from Hacker News and other sources
- **Smart Filtering**: Filter news by category (All, AI, Tech)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Auto-categorization**: Automatically categorizes articles as AI or Tech based on content
- **Time-based Display**: Shows news from today and yesterday with relative timestamps
- **Refresh Functionality**: Manual refresh to get the latest news

## How to Use

1. **Open the webpage**: Simply open `index.html` in your web browser
2. **Browse news**: Scroll through the news cards displayed on the page
3. **Filter by category**: Click on "All News", "AI", or "Tech" buttons to filter articles
4. **Refresh**: Click the refresh button to fetch the latest news
5. **Read full article**: Click on any article title to open the full story in a new tab

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **JavaScript (ES6+)**: Vanilla JavaScript with async/await for API calls
- **Hacker News API**: Free API for tech news (no API key required)

## News Sources

Currently aggregating from:
- Hacker News (via Firebase API)
- Mock data for demonstration purposes

## Customization

### Adding More News Sources

You can extend the news aggregator by adding more sources in `script.js`:

```javascript
async fetchAllNews() {
    const allNews = [];

    // Add your custom news source here
    const customNews = await this.fetchYourCustomSource();
    allNews.push(...customNews);

    // ... rest of the code
}
```

### Modifying Categories

Update the `categorizeStory()` method in `script.js` to adjust keyword matching:

```javascript
categorizeStory(title) {
    const titleLower = title.toLowerCase();
    const aiKeywords = ['your', 'custom', 'keywords'];
    // ... categorization logic
}
```

### Styling

All styles are contained in `styles.css`. You can customize:
- Colors: Modify CSS variables in `:root`
- Layout: Adjust grid and flexbox properties
- Animations: Customize transitions and keyframes

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential improvements:
- Integration with NewsAPI, Reddit API, or other news sources
- Search functionality
- Bookmark/save articles feature
- Dark mode toggle
- Email notifications for specific topics
- Pagination for older articles
- Social sharing capabilities

## License

This project is open source and available for personal and commercial use.

## Credits

Created with modern web technologies. News data provided by Hacker News and various tech news sources.
