import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  ButtonGroup,
  Chip,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { getPosts } from '../services/api';

/**
 * TaskPlanet-style home/feed page
 * Vibrant filter buttons and modern layout
 */
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getPosts(pageNum, 10);
      
      if (append) {
        setPosts((prev) => [...prev, ...response.data]);
      } else {
        setPosts(response.data);
      }
      
      setHasMore(response.pagination.hasMore);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePostCreated = () => {
    setPage(1);
    fetchPosts(1);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handleRefresh = () => {
    setPage(1);
    fetchPosts(1);
  };

  if (loading && posts.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={50} sx={{ color: '#0D7EFF' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      {/* Create Post Card */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Filter Buttons - TaskPlanet Style */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Chip
            label="All Post"
            onClick={() => setActiveFilter('all')}
            sx={{
              backgroundColor: activeFilter === 'all' ? '#0D7EFF' : '#F7FAFC',
              color: activeFilter === 'all' ? '#FFFFFF' : '#718096',
              fontWeight: 700,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              borderRadius: '20px',
              cursor: 'pointer',
              border: activeFilter === 'all' ? 'none' : '1px solid #E2E8F0',
              '&:hover': {
                backgroundColor: activeFilter === 'all' ? '#0961CC' : '#E2E8F0',
              },
            }}
          />
          <Chip
            label="For You"
            onClick={() => setActiveFilter('foryou')}
            sx={{
              backgroundColor: activeFilter === 'foryou' ? '#0D7EFF' : '#F7FAFC',
              color: activeFilter === 'foryou' ? '#FFFFFF' : '#718096',
              fontWeight: 700,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              borderRadius: '20px',
              cursor: 'pointer',
              border: activeFilter === 'foryou' ? 'none' : '1px solid #E2E8F0',
              '&:hover': {
                backgroundColor: activeFilter === 'foryou' ? '#0961CC' : '#E2E8F0',
              },
            }}
          />
          <Chip
            label="Most Liked"
            onClick={() => setActiveFilter('liked')}
            sx={{
              backgroundColor: activeFilter === 'liked' ? '#0D7EFF' : '#F7FAFC',
              color: activeFilter === 'liked' ? '#FFFFFF' : '#718096',
              fontWeight: 700,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              borderRadius: '20px',
              cursor: 'pointer',
              border: activeFilter === 'liked' ? 'none' : '1px solid #E2E8F0',
              '&:hover': {
                backgroundColor: activeFilter === 'liked' ? '#0961CC' : '#E2E8F0',
              },
            }}
          />
          <Chip
            label="Most Commented"
            onClick={() => setActiveFilter('commented')}
            sx={{
              backgroundColor: activeFilter === 'commented' ? '#0D7EFF' : '#F7FAFC',
              color: activeFilter === 'commented' ? '#FFFFFF' : '#718096',
              fontWeight: 700,
              fontSize: '0.9rem',
              px: 2,
              py: 2.5,
              borderRadius: '20px',
              cursor: 'pointer',
              border: activeFilter === 'commented' ? 'none' : '1px solid #E2E8F0',
              '&:hover': {
                backgroundColor: activeFilter === 'commented' ? '#0961CC' : '#E2E8F0',
              },
            }}
          />
        </Box>

        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{
            color: '#0D7EFF',
            fontWeight: 600,
            borderRadius: '12px',
            px: 2,
            '&:hover': {
              backgroundColor: '#E3F2FD',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 3,
            backgroundColor: '#FFF5F5',
            border: '1px solid #FF4757',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 6,
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              fontSize: '4rem',
              mb: 2,
            }}
          >
            📝
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3748', mb: 1 }}>
            No posts yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#718096' }}>
            Be the first to create a post and start the conversation!
          </Typography>
        </Paper>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{
                  px: 5,
                  py: 1.5,
                  backgroundColor: '#0D7EFF',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(13, 126, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: '#0961CC',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(13, 126, 255, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: '#E2E8F0',
                    color: '#A0AEC0',
                  },
                }}
              >
                {loadingMore ? (
                  <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                ) : (
                  'Load More'
                )}
              </Button>
            </Box>
          )}

          {!hasMore && posts.length > 0 && (
            <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#A0AEC0', fontWeight: 600 }}>
                🎉 You've reached the end!
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;