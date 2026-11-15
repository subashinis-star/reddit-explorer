
export const communities = [
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

function Sidebar({ subreddit, onSelectCommunity }) {
  return (
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
          onClick={() => onSelectCommunity(community.name)}
        >
          <span className="community-icon">{community.icon}</span>
          <span>r/{community.name}</span>
          <span className="community-arrow">›</span>
        </button>
      ))}

      <div className="sidebar-note">
        <span>💡</span>
        <p>Discover something new every day.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
