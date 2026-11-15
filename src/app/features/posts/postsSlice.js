
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load posts from Reddit, or use sample posts if Reddit blocks access
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit) => {
    try {
      const response = await fetch(
        `/reddit-api/r/${subreddit}.json?limit=30`
      );

      if (!response.ok) {
        throw new Error('Unable to load Reddit posts');
      }

      const data = await response.json();
      return data.data.children.map((item) => item.data);
    } catch (error) {
      console.log('Using sample posts because Reddit is unavailable.');

      return [
        {
          id: 'demo1',
          title: 'Welcome to Reddit Explorer!',
          subreddit,
          author: 'Explorer',
          ups: 1250,
          num_comments: 45,
          selftext:
            'Explore communities and discover interesting conversations.',
          thumbnail: '',
          permalink: '#',
        },
        {
          id: 'demo2',
          title: 'What technology are you learning today?',
          subreddit,
          author: 'Developer',
          ups: 890,
          num_comments: 32,
          selftext:
            'Share your favourite programming tools and technologies.',
          thumbnail: '',
          permalink: '#',
        },
        {
          id: 'demo3',
          title: 'Share something interesting with the community',
          subreddit,
          author: 'CommunityMember',
          ups: 560,
          num_comments: 18,
          selftext:
            'Discover new ideas and connect with other people.',
          thumbnail: '',
          permalink: '#',
        },
      ];
    }
  }
);

// Load comments
export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async (permalink) => {
    try {
      if (!permalink || permalink === '#') {
        return [];
      }

      const response = await fetch(
        `/reddit-api${permalink}.json?limit=20`
      );

      if (!response.ok) {
        throw new Error('Unable to load comments');
      }

      const data = await response.json();

      return data[1].data.children.map((item) => item.data);
    } catch (error) {
      return [];
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',

  initialState: {
    posts: [],
    comments: [],
    selectedPost: null,
    loading: false,
    commentsLoading: false,
    error: null,
    subreddit: 'popular',
  },

  reducers: {
    setSubreddit: (state, action) => {
      state.subreddit = action.payload;
      state.selectedPost = null;
      state.comments = [];
    },

    selectPost: (state, action) => {
      state.selectedPost = action.payload;
    },

    closePost: (state) => {
      state.selectedPost = null;
      state.comments = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })

      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchComments.pending, (state) => {
        state.commentsLoading = true;
      })

      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload;
      })

      .addCase(fetchComments.rejected, (state) => {
        state.commentsLoading = false;
        state.comments = [];
      });
  },
});

export const {
  setSubreddit,
  selectPost,
  closePost,
} = postsSlice.actions;

export default postsSlice.reducer;
