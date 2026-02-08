import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Collapse,
  Chip,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { toggleLike, addComment, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * TaskPlanet-style post card component
 * Vibrant colors, modern shadows, rounded corners
 */
const PostCard = ({ post, onPostUpdate, onPostDelete }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(
    post.likes?.some((like) => like.username === user?.username) || false
  );
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [comments, setComments] = useState(post.comments || []);

  /**
   * Handle like/unlike action
   */
  const handleLike = async () => {
    try {
      const response = await toggleLike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(response.data.likesCount);
      
      if (onPostUpdate) {
        onPostUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  /**
   * Handle comment submission
   */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await addComment(post._id, commentText.trim());
      setComments(response.data.comments);
      setCommentText('');
      
      if (onPostUpdate) {
        onPostUpdate(response.data);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  /**
   * Handle post deletion
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
        if (onPostDelete) {
          onPostDelete(post._id);
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  /**
   * Format timestamp
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* User Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar 
              sx={{ 
                width: 50,
                height: 50,
                backgroundColor: '#0D7EFF',
                fontWeight: 700,
                border: '3px solid #FFFFFF',
                boxShadow: '0 0 0 2px #0D7EFF',
              }}
            >
              {post.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2D3748' }}>
                {post.username}
              </Typography>
              <Typography variant="caption" sx={{ color: '#718096', fontWeight: 500 }}>
                @{post.username.toLowerCase().replace(/\s+/g, '')}
              </Typography>
              <Typography variant="caption" display="block" sx={{ color: '#A0AEC0', fontSize: '0.8rem' }}>
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {user?.username === post.username && (
              <IconButton 
                size="small" 
                onClick={handleDelete}
                sx={{
                  color: '#FF4757',
                  '&:hover': {
                    backgroundColor: '#FFE5E8',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#0D7EFF',
                borderRadius: '20px',
                px: 2.5,
                py: 0.8,
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0961CC',
                },
              }}
            >
              Follow
            </Button>
          </Box>
        </Box>

        {/* Post Content */}
        {post.content && (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              whiteSpace: 'pre-wrap',
              color: '#2D3748',
              lineHeight: 1.6,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Post Image */}
        {post.imageUrl && (
          <CardMedia
            component="img"
            image={`http://localhost:3000${post.imageUrl}`}
            alt="Post image"
            sx={{ 
              borderRadius: 3,
              mb: 2,
              maxHeight: 500,
              objectFit: 'cover',
              border: '2px solid rgba(0, 0, 0, 0.05)',
            }}
          />
        )}

        {/* Interaction Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={handleLike}
              size="small"
              sx={{
                color: isLiked ? '#FF4757' : '#718096',
                '&:hover': {
                  backgroundColor: isLiked ? '#FFE5E8' : '#F7FAFC',
                },
              }}
            >
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#718096' }}>
              {likesCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={() => setShowComments(!showComments)}
              size="small"
              sx={{
                color: '#718096',
                '&:hover': {
                  backgroundColor: '#F7FAFC',
                },
              }}
            >
              <CommentIcon />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#718096' }}>
              {comments.length}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              sx={{
                color: '#718096',
                '&:hover': {
                  backgroundColor: '#F7FAFC',
                },
              }}
            >
              <ShareIcon />
            </IconButton>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#718096' }}>
              0
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Comments Section */}
        <Collapse in={showComments}>
          {comments.length > 0 && (
            <List sx={{ mb: 2, maxHeight: '300px', overflow: 'auto' }}>
              {comments.map((comment, index) => (
                <ListItem 
                  key={comment._id || index} 
                  alignItems="flex-start" 
                  sx={{ 
                    px: 0,
                    py: 1.5,
                    borderBottom: index < comments.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#00D9A5',
                        width: 36,
                        height: 36,
                        fontWeight: 700,
                      }}
                    >
                      {comment.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2D3748' }}>
                        {comment.username}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography 
                          variant="body2" 
                          component="span"
                          sx={{ color: '#4A5568', display: 'block', mt: 0.5 }}
                        >
                          {comment.text}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          display="block" 
                          sx={{ color: '#A0AEC0', mt: 0.5 }}
                        >
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          {/* Add Comment Form */}
          <Box 
            component="form" 
            onSubmit={handleCommentSubmit} 
            sx={{ 
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: '#0D7EFF',
                width: 36,
                height: 36,
                fontWeight: 700,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={submittingComment}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                },
              }}
            />
            <IconButton
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              sx={{
                backgroundColor: '#0D7EFF',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#0961CC',
                },
                '&:disabled': {
                  backgroundColor: '#E2E8F0',
                  color: '#A0AEC0',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Collapse>

        {/* View Comments Button */}
        {!showComments && comments.length > 0 && (
          <Button
            fullWidth
            onClick={() => setShowComments(true)}
            startIcon={<CommentIcon />}
            sx={{
              color: '#0D7EFF',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#E3F2FD',
              },
            }}
          >
            View {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;