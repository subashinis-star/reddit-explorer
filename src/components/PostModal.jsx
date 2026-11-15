
function PostModal({
  selectedPost,
  comments,
  commentsLoading,
  onClose,
}) {
  if (!selectedPost) {
    return null;
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <section
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close"
          onClick={onClose}
          aria-label="Close post"
        >
          ×
        </button>

        <p className="post-meta">
          🌐 r/{selectedPost.subreddit} • u/{selectedPost.author}
        </p>

        <h2>{selectedPost.title}</h2>

        <p className="modal-description">
          {selectedPost.selftext ||
            'No additional text for this post.'}
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
          <p className="message">
            Loading comments...
          </p>
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
  );
}

export default PostModal;
