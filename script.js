// News Aggregator Application
class NewsAggregator {
    constructor() {
        this.newsData = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadNews();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadNews();
        });
    }

    handleFilterClick(button) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        // Apply filter
        this.currentFilter = button.dataset.filter;
        this.filterNews();
    }

    async loadNews() {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const newsContainer = document.getElementById('newsContainer');

        loading.style.display = 'block';
        error.style.display = 'none';
        newsContainer.innerHTML = '';

        try {
            // Fetch from multiple sources
            const news = await this.fetchAllNews();
            this.newsData = news;
            this.displayNews(news);
            this.updateLastUpdated();
        } catch (err) {
            console.error('Error loading news:', err);
            error.textContent = 'Failed to load news. Please try again later.';
            error.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    }

    async fetchAllNews() {
        const allNews = [];

        // Fetch from Hacker News
        try {
            const hnNews = await this.fetchHackerNews();
            allNews.push(...hnNews);
        } catch (err) {
            console.error('Error fetching Hacker News:', err);
        }

        // Fetch from additional mock sources for demonstration
        const mockNews = this.getMockNews();
        allNews.push(...mockNews);

        // Sort by date (most recent first)
        allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        return allNews;
    }

    async fetchHackerNews() {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();

        // Get first 30 stories
        const stories = await Promise.all(
            storyIds.slice(0, 30).map(async (id) => {
                const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return storyResponse.json();
            })
        );

        // Filter for AI and tech related stories
        const techKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'tech', 'technology',
                             'software', 'programming', 'developer', 'startup', 'code', 'data', 'cloud',
                             'security', 'crypto', 'blockchain', 'web', 'app', 'mobile', 'llm', 'gpt',
                             'neural', 'deep learning', 'computer', 'algorithm', 'google', 'microsoft',
                             'apple', 'amazon', 'meta', 'openai', 'anthropic'];

        const filteredStories = stories.filter(story => {
            if (!story || !story.title) return false;
            const titleLower = story.title.toLowerCase();
            return techKeywords.some(keyword => titleLower.includes(keyword));
        });

        // Convert to our format
        return filteredStories.map(story => {
            const category = this.categorizeStory(story.title);
            return {
                title: story.title,
                description: story.title,
                url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                source: 'Hacker News',
                publishedAt: new Date(story.time * 1000).toISOString(),
                category: category,
                image: null
            };
        });
    }

    categorizeStory(title) {
        const titleLower = title.toLowerCase();
        const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt',
                           'neural', 'deep learning', 'openai', 'anthropic', 'claude', 'chatgpt'];

        const hasAI = aiKeywords.some(keyword => titleLower.includes(keyword));
        return hasAI ? 'ai' : 'tech';
    }

    getMockNews() {
        const now = new Date();
        const yesterday = new Date(now - 24 * 60 * 60 * 1000);

        return [
            {
                title: 'New AI Model Achieves Breakthrough in Natural Language Understanding',
                description: 'Researchers have developed a new AI model that demonstrates unprecedented capabilities in understanding context and nuance in human language.',
                url: '#',
                source: 'TechCrunch',
                publishedAt: now.toISOString(),
                category: 'ai',
                image: null
            },
            {
                title: 'Major Cloud Provider Announces New AI Infrastructure',
                description: 'Leading cloud computing company unveils new infrastructure specifically designed for training large language models and AI applications.',
                url: '#',
                source: 'VentureBeat',
                publishedAt: yesterday.toISOString(),
                category: 'ai',
                image: null
            },
            {
                title: 'Startup Raises $100M for AI-Powered Development Tools',
                description: 'A promising startup focused on AI-assisted software development has secured significant funding to expand its platform.',
                url: '#',
                source: 'TechCrunch',
                publishedAt: yesterday.toISOString(),
                category: 'tech',
                image: null
            },
            {
                title: 'New Framework Released for Building Scalable Web Applications',
                description: 'Popular open-source project releases major update with improved performance and developer experience.',
                url: '#',
                source: 'The Verge',
                publishedAt: now.toISOString(),
                category: 'tech',
                image: null
            }
        ];
    }

    displayNews(news) {
        const newsContainer = document.getElementById('newsContainer');
        const noResults = document.getElementById('noResults');

        if (news.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        newsContainer.innerHTML = '';

        news.forEach(article => {
            const card = this.createNewsCard(article);
            newsContainer.appendChild(card);
        });
    }

    createNewsCard(article) {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.dataset.category = article.category;

        const timeAgo = this.getTimeAgo(article.publishedAt);

        card.innerHTML = `
            ${article.image ? `<img src="${article.image}" alt="${article.title}" class="news-image">` : '<div class="news-image"></div>'}
            <div class="news-content">
                <span class="news-category ${article.category}">${article.category}</span>
                <h2 class="news-title">
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                        ${article.title}
                    </a>
                </h2>
                <p class="news-description">${article.description}</p>
                <div class="news-meta">
                    <span class="news-source">${article.source}</span>
                    <span class="news-time">${timeAgo}</span>
                </div>
            </div>
        `;

        return card;
    }

    filterNews() {
        const cards = document.querySelectorAll('.news-card');
        const noResults = document.getElementById('noResults');
        let visibleCount = 0;

        cards.forEach(card => {
            if (this.currentFilter === 'all' || card.dataset.category === this.currentFilter) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
            }
        }

        return 'Just now';
    }

    updateLastUpdated() {
        const lastUpdated = document.getElementById('lastUpdated');
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        lastUpdated.textContent = `Last updated: ${timeString}`;
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NewsAggregator();
});
