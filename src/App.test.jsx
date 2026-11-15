
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    posts: [
      { id: '1', title: 'Learn React', permalink: '/post/1' },
      { id: '2', title: 'Learn JavaScript', permalink: '/post/2' },
    ],
    comments: [],
    selectedPost: null,
    loading: false,
    commentsLoading: false,
    error: null,
    subreddit: 'popular',
  },
}));

vi.mock('react-redux', () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector({ posts: mocks.state }),
}));

vi.mock('./components/Header', () => ({
  default: () => <header>Reddit Explorer</header>,
}));

vi.mock('./components/Sidebar', () => ({
  default: () => <aside>Communities</aside>,
  communities: [{ name: 'popular', icon: '🔥' }],
}));

vi.mock('./components/PostCard', () => ({
  default: ({ post }) => <article>{post.title}</article>,
}));

vi.mock('./components/PostModal', () => ({
  default: () => null,
}));

import App from './App';

describe('Reddit Explorer App', () => {
  beforeEach(() => {
    mocks.dispatch.mockClear();
    mocks.state.posts = [
      { id: '1', title: 'Learn React', permalink: '/post/1' },
      { id: '2', title: 'Learn JavaScript', permalink: '/post/2' },
    ];
  });

  it('displays the application heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /explore what's happening/i })
    ).toBeInTheDocument();
  });

  it('displays posts', () => {
    render(<App />);

    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('Learn JavaScript')).toBeInTheDocument();
  });

  it('filters posts using the search box', () => {
    render(<App />);

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'React' },
    });

    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.queryByText('Learn JavaScript')).not.toBeInTheDocument();
  });
});
