// Mock data for demonstration
let posts = [
    {
        id: 1,
        title: "The Future of Web Development: Trends to Watch in 2025",
        author: "Sarah Johnson",
        category: "Technology",
        image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
        excerpt: "Explore the cutting-edge technologies and methodologies that will shape web development in the coming year.",
        content: "Web development continues to evolve at a rapid pace, with new technologies and frameworks emerging regularly. In 2025, we can expect to see several key trends that will reshape how we build and interact with web applications.\n\nOne of the most significant trends is the rise of AI-powered development tools. These tools are becoming increasingly sophisticated, helping developers write code more efficiently and catch bugs before they make it to production.\n\nAnother important trend is the growing emphasis on web performance and user experience. With users expecting faster load times and smoother interactions, developers are focusing more on optimization techniques and modern performance metrics.\n\nThe adoption of progressive web apps (PWAs) is also accelerating, as businesses recognize the benefits of app-like experiences that work across all devices and platforms.",
        date: "2024-12-15",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Building Scalable Applications with Modern Architecture",
        author: "Michael Chen",
        category: "Development",
        image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
        excerpt: "Learn how to design and implement applications that can grow with your business needs.",
        content: "Scalability is one of the most critical aspects of modern application development. As your user base grows and your application becomes more complex, having a solid architectural foundation becomes essential.\n\nMicroservices architecture has gained significant popularity due to its ability to scale individual components independently. This approach allows teams to work on different services simultaneously and deploy updates without affecting the entire system.\n\nContainer orchestration platforms like Kubernetes have made it easier to manage and scale containerized applications. These platforms provide automated scaling, load balancing, and fault tolerance.\n\nDatabase scalability is another crucial consideration. Techniques like database sharding, read replicas, and caching strategies can help maintain performance as data volume increases.",
        date: "2024-12-12",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "UX Design Principles for Better User Engagement",
        author: "Emily Rodriguez",
        category: "Design",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
        excerpt: "Discover the fundamental principles that make interfaces intuitive and engaging for users.",
        content: "User experience design is both an art and a science. Creating interfaces that are not only beautiful but also functional and intuitive requires understanding fundamental design principles and user psychology.\n\nOne of the most important principles is simplicity. Users should be able to accomplish their goals with minimal effort and confusion. This means eliminating unnecessary elements and focusing on what truly matters.\n\nConsistency is another crucial aspect of good UX design. When interface elements behave predictably across your application, users can develop mental models that make navigation more intuitive.\n\nFeedback and responsiveness are essential for user engagement. Users need to understand that their actions have been registered and what the system is doing in response.",
        date: "2024-12-10",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Digital Transformation Strategies for Modern Businesses",
        author: "David Kim",
        category: "Business",
        image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
        excerpt: "Explore effective strategies for implementing digital transformation in your organization.",
        content: "Digital transformation is no longer optional for businesses that want to remain competitive. It's a comprehensive approach to leveraging technology to improve operations, enhance customer experiences, and create new value propositions.\n\nSuccessful digital transformation starts with a clear strategy and strong leadership commitment. Organizations need to identify specific goals and metrics that will guide their transformation efforts.\n\nEmployee training and change management are critical components often overlooked. Technology is only as effective as the people using it, so investing in skill development and cultural change is essential.\n\nData-driven decision making becomes possible when organizations implement proper analytics and reporting systems. This enables more informed strategic decisions and better understanding of customer needs.",
        date: "2024-12-08",
        readTime: "7 min read"
    }
];

let currentEditingPost = null;
let filteredPosts = [...posts];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const postsGrid = document.getElementById('postsGrid');
const postDetail = document.getElementById('postDetail');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const adminPostsList = document.getElementById('adminPostsList');
const newPostBtn = document.getElementById('newPostBtn');
const postModal = document.getElementById('postModal');
const closeModal = document.getElementById('closeModal');
const postForm = document.getElementById('postForm');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');

// Initialize the application
function init() {
    showPage('home');
    renderPosts();
    renderAdminPosts();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            setActiveNavLink(link);
            showPage(page);
        });
    });

    // Search functionality
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // Admin functionality
    if (newPostBtn) {
        newPostBtn.addEventListener('click', () => {
            currentEditingPost = null;
            openPostModal();
        });
    }

    // Modal controls
    if (closeModal) {
        closeModal.addEventListener('click', closePostModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePostModal);
    }
    
    // Close modal when clicking outside
    if (postModal) {
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) {
                closePostModal();
            }
        });
    }

    // Form submission
    if (postForm) {
        postForm.addEventListener('submit', handlePostSubmit);
    }
}

// Navigation functions
function setActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function showPage(pageName) {
    pages.forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update page title
    const titles = {
        home: 'TechBlog - Learn Today\'s Most In-Demand Skills',
        about: 'About - TechBlog',
        contact: 'Contact - TechBlog',
        admin: 'Admin Dashboard - TechBlog'
    };
    document.title = titles[pageName] || 'TechBlog';
}

// Post rendering functions
function renderPosts(postsToRender = filteredPosts) {
    if (!postsGrid) return;
    
    if (postsToRender.length === 0) {
        postsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>No posts found</h3>
                <p>Try adjusting your search criteria or browse different categories.</p>
            </div>
        `;
        return;
    }

    postsGrid.innerHTML = postsToRender.map(post => `
        <article class="laptop" onclick="showPost(${post.id})">
            <img src="${post.image}" alt="${post.title}" class="laptop-img" loading="lazy">
            <div style="display: flex; flex-direction: column; gap: 12px; flex-grow: 1;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <span class="post-category">${post.category}</span>
                    <span style="font-size: 14px; color: var(--text-light);">${post.date}</span>
                    <span style="font-size: 14px; color: var(--text-light);">${post.readTime}</span>
                </div>
                <h3 style="font-size: 22px; font-family: Arial, Helvetica, sans-serif; color: var(--primary-color); line-height: 1.3; margin-bottom: 12px;">${post.title}</h3>
                <p style="font-size: 16px; font-family: Arial, Helvetica, sans-serif; color: var(--text-secondary); flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${post.excerpt}</p>
                <div style="margin-top: auto;">
                    <p style="font-size: 14px; font-weight: 500; color: var(--primary-color);">By ${post.author}</p>
                </div>
            </div>
        </article>
    `).join('');
}

function showPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post || !postDetail) return;

    postDetail.innerHTML = `
        <a href="#" class="back-btn" onclick="showPage('home'); setActiveNavLink(document.querySelector('[data-page=\"home\"]'))">
            ← Back to posts
        </a>
        <img src="${post.image}" alt="${post.title}" class="post-detail-image">
        <div class="post-detail-content">
            <h1 class="post-detail-title">${post.title}</h1>
            <div class="post-detail-meta">
                <span class="post-category">${post.category}</span>
                <span>By ${post.author}</span>
                <span>${post.date}</span>
                <span>${post.readTime}</span>
            </div>
            <div class="post-detail-text">
                ${post.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
        </div>
    `;

    showPage('post');
    document.title = `${post.title} - TechBlog`;
}

// Search functionality
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredPosts = [...posts];
        renderPosts();
        return;
    }

    filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query)
    );

    renderPosts();
}

// Category filtering
function filterByCategory(category) {
    filteredPosts = posts.filter(post => post.category === category);
    renderPosts();
    
    // Scroll to posts section
    const postsSection = document.getElementById('featuredPosts');
    if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to featured posts
function scrollToFeaturedPosts() {
    const postsSection = document.getElementById('featuredPosts');
    if (postsSection) {
        postsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Admin functions
function renderAdminPosts() {
    if (!adminPostsList) return;
    
    if (posts.length === 0) {
        adminPostsList.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Create your first post to get started.</p>
            </div>
        `;
        return;
    }

    adminPostsList.innerHTML = posts.map(post => `
        <div class="admin-post-item">
            <div class="admin-post-info">
                <h4>${post.title}</h4>
                <p>By ${post.author} • ${post.category} • ${post.date}</p>
            </div>
            <div class="admin-actions">
                <button class="btn btn-secondary btn-small" onclick="editPost(${post.id})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deletePost(${post.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openPostModal(post = null) {
    if (!postModal) return;
    
    currentEditingPost = post;
    
    if (post) {
        modalTitle.textContent = 'Edit Post';
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postAuthor').value = post.author;
        document.getElementById('postCategory').value = post.category;
        document.getElementById('postImage').value = post.image;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;
    } else {
        modalTitle.textContent = 'Create New Post';
        postForm.reset();
    }
    
    postModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePostModal() {
    if (!postModal) return;
    
    postModal.classList.remove('active');
    document.body.style.overflow = '';
    if (postForm) {
        postForm.reset();
    }
    currentEditingPost = null;
}

function editPost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        openPostModal(post);
    }
}

function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts = posts.filter(p => p.id !== postId);
        filteredPosts = filteredPosts.filter(p => p.id !== postId);
        renderPosts();
        renderAdminPosts();
    }
}

function handlePostSubmit(e) {
    e.preventDefault();
    
    const postData = {
        title: document.getElementById('postTitle').value,
        author: document.getElementById('postAuthor').value,
        category: document.getElementById('postCategory').value,
        image: document.getElementById('postImage').value || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        date: new Date().toISOString().split('T')[0],
        readTime: calculateReadTime(document.getElementById('postContent').value)
    };

    if (currentEditingPost) {
        // Edit existing post
        const index = posts.findIndex(p => p.id === currentEditingPost.id);
        posts[index] = { ...currentEditingPost, ...postData };
        
        // Update filtered posts if the edited post is in the current filter
        const filteredIndex = filteredPosts.findIndex(p => p.id === currentEditingPost.id);
        if (filteredIndex !== -1) {
            filteredPosts[filteredIndex] = { ...currentEditingPost, ...postData };
        }
    } else {
        // Create new post
        const newPost = {
            id: Math.max(...posts.map(p => p.id)) + 1,
            ...postData
        };
        posts.unshift(newPost);
        filteredPosts.unshift(newPost);
    }

    renderPosts();
    renderAdminPosts();
    closePostModal();
}

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);