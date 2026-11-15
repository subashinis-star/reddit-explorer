
function PostCard({ post, currentVote, onVote, onOpen }) {
  const voteCount = post.ups + currentVote;

  return (
    <article
      className="post"
      onClick={() => onOpen(post)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onOpen(post);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="post-votes">
        <button
          className={
            currentVote === 1
              ? 'vote-button voted'
              : 'vote-button'
          }
          aria-label="Upvote"
          onClick={(event) => onVote(event, post.id, 1)}
        >
          ▲
        </button>

        <strong>{voteCount.toLocaleString()}</strong>

        <button
          className={
            currentVote === -1
              ? 'vote-button downvoted'
              : 'vote-button'
          }
          aria-label="Downvote"
          onClick={(event) => onVote(event, post.id, -1)}
        >
          ▼
        </button>
      </div>

      <div className="post-content">
        <div className="post-meta">
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
}

export default PostCard;
