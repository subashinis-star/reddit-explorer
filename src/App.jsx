
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Header from './components/Header';
import Sidebar, { communities } from './components/Sidebar';
import PostCard from './components/PostCard';
import PostModal from './components/PostModal';

import {
  fetchPosts,
  fetchComments,
  setSubreddit,
  selectPost,
  closePost,
} from './features/posts/postsSlice';

import './App.css';

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
      [postId]:
        previousVotes[postId] === direction ? 0 : direction,
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

      {/* Header */}
      <Header />

      <div className="layout">

        {/* Sidebar */}
        <Sidebar
          subreddit={subreddit}
          onSelectCommunity={(communityName) => {
            setSearch('');
            dispatch(setSubreddit(communityName));
          }}
        />

        {/* Main Content */}
        <main className="main">

          {/* Welcome Section */}
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

          {/* Feed Heading and Search */}
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

          {/* Loading State */}
          {loading && (
            <p className="message">
              Loading posts...
            </p>
          )}

          {/* Error State */}
          {error && (
            <p className="message error">
              {error}. Please try again.
            </p>
          )}

          {/* Empty Search State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No posts found</h3>
              <p>Try another search term.</p>
            </div>
          )}

          {/* Posts */}
          <div className="posts">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentVote={votes[post.id] || 0}
                onVote={handleVote}
                onOpen={openPost}
              />
            ))}
          </div>

        </main>
      </div>

      {/* Post Details Modal */}
      <PostModal
        selectedPost={selectedPost}
        comments={comments}
        commentsLoading={commentsLoading}
        onClose={() => dispatch(closePost())}
      />

    </div>
  );
}

export default App;
