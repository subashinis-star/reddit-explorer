
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPosts,
  fetchComments,
  setSubreddit,
  selectPost,
  closePost,
} from './features/posts/postsSlice';
import './App.css';

const communities = [
  { name: 'popular', icon: '🔥' },
  { name: 'technology', icon: '💻' },
  { name: 'programming', icon: '👨‍💻' },
  { name: 'gaming', icon: '🎮' },
  { name: 'science', icon: '🔬' },
  { name: 'worldnews', icon: '🌍' },
  { name: 'food', icon: '🍕' },
  { name: 'javascript', icon: '🟨' },
  { name: 'reactjs', icon: '⚛️' },
];

function App() {
  const dispatch = useDispatch();

  const {
    posts,
    comments,
    selectedPost,
    loading,
    commentsLoading,
    error,
    subreddit,
  } = useSelector((state) => state.posts);

  const [search, setSearch] = useState('');
  const [votes, setVotes] = useState({});

  useEffect(() => {
    dispatch(fetchPosts(subreddit));
  }, [dispatch, subreddit]);

  const openPost = (post) => {
    dispatch(selectPost(post));
    dispatch(fetchComments(post.permalink));
  };

  const handleVote = (event, postId, direction) => {
    event.stopPropagation();

    setVotes((previousVotes) => ({
      ...previousVotes,
      [postId]: previousVotes[postId] === direction ? 0 : direction,
    }));
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCommunity = communities.find(
    (community) => community.name === subreddit
  );

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="/">
          <span className="logo-icon">●</span>
          Reddit Explorer
        </a>

        <div className="header-right">
          <span>Discover communities</span>
          <div className="profile-icon">S</div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h3>YOUR COMMUNITIES</h3>

          {communities.map((community) => (
            <button
              key={community.name}
              className={
                subreddit === community.name
                  ? 'community active'
                  : 'community'
              }
              onClick={() => {
                setSearch('');
                dispatch(setSubreddit(community.name));
              }}
            >
              <span className="community-icon">
                {community.icon}
              </span>

              <span>r/{community.name}</span>

              <span className="community-arrow">›</span>
            </button>
          ))}

          <div className="sidebar-note">
            <span>💡</span>
            <p>Discover something new every day.</p>
          </div>
        </aside>

        <main className="main">
          <section className="welcome">
            <div className="welcome-content">
              <p className="eyebrow">YOUR COMMUNITY FEED</p>
              <h1>Explore what's happening.</h1>
              <p>
                Discover conversations, ideas and communities
                from Reddit.
              </p>
            </div>

            <div className="welcome-decoration">✦</div>
          </section>

          <section className="feed-heading">
            <div>
              <div className="feed-community">
                <span className="feed-icon">
                  {selectedCommunity?.icon || '🌐'}
                </span>
                <h2>r/{subreddit}</h2>
              </div>
              <p>Latest community posts</p>
            </div>

            <input
              className="search"
              type="search"
              placeholder="🔍  Search posts..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </section>

          {loading && (
            <p className="message">Loading posts...</p>
          )}

          {error && (
            <p className="message error">
              {error}. Please try again.
            </p>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No posts found</h3>
              <p>Try another search term.</p>
            </div>
          )}

          <div className="posts">
            {filteredPosts.map((post) => {
              const currentVote = votes[post.id] || 0;
              const voteCount = post.ups + currentVote;

              return (
                <article
                  className="post"
                  key={post.id}
                  onClick={() => openPost(post)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') openPost(post);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="post-votes">
                    <button
                      className={currentVote === 1 ? 'vote-button voted' : 'vote-button'}
                      aria-label="Upvote"
                      onClick={(event) =>
                        handleVote(event, post.id, 1)
                      }
                    >
                      ▲
                    </button>

                    <strong>{voteCount.toLocaleString()}</strong>

                    <button
                      className={currentVote === -1 ? 'vote-button downvoted' : 'vote-button'}
                      aria-label="Downvote"
                      onClick={(event) =>
                        handleVote(event, post.id, -1)
                      }
                    >
                      ▼
                    </button>
                  </div>

                  <div className="post-content">
                    <div className="post-meta">
                      <span className="post-community-icon">
                        {selectedCommunity?.icon || '🌐'}
                      </span>
                      <strong>r/{post.subreddit}</strong>
                      <span>•</span>
                      <span>u/{post.author}</span>
                    </div>

                    <h3>{post.title}</h3>

                    {post.selftext && (
                      <p className="post-description">
                        {post.selftext}
                      </p>
                    )}

                    <div className="post-footer">
                      <span className="post-action">
                        💬 {post.num_comments} comments
                      </span>

                      <span className="post-action read-action">
                        Read post →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>

      {selectedPost && (
        <div
          className="modal-backdrop"
          onClick={() => dispatch(closePost())}
        >
          <section
            className="modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => dispatch(closePost())}
              aria-label="Close post"
            >
              ×
            </button>

            <p className="post-meta">
              🌐 r/{selectedPost.subreddit} • u/{selectedPost.author}
            </p>

            <h2>{selectedPost.title}</h2>

            <p className="modal-description">
              {selectedPost.selftext || 'No additional text for this post.'}
            </p>

            {selectedPost.permalink !== '#' && (
              <a
                className="original-link"
                href={`https://www.reddit.com${selectedPost.permalink}`}
                target="_blank"
                rel="noreferrer"
              >
                View original Reddit post ↗
              </a>
            )}

            <div className="comments-heading">
              <h3>Comments</h3>
              <span>{comments.length} comments</span>
            </div>

            {commentsLoading && (
              <p className="message">Loading comments...</p>
            )}

            {!commentsLoading && comments.length === 0 && (
              <div className="empty-comments">
                <span>💬</span>
                <p>No comments available yet.</p>
              </div>
            )}

            {comments.map((comment) =>
              comment.body ? (
                <div className="comment" key={comment.id}>
                  <strong>u/{comment.author}</strong>
                  <p>{comment.body}</p>
                  <small>▲ {comment.ups}</small>
                </div>
              ) : null
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
