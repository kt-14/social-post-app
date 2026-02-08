import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  ButtonGroup,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  EmojiEmotions as EmojiIcon,
  BarChart as ChartIcon,
  VolumeUp as VolumeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { createPost } from '../services/api';

/**
 * TaskPlanet-style post creation component
 * Vibrant design with multiple interaction buttons
 */
const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  /**
   * Handle image file selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should not exceed 5MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  /**
   * Remove selected image
   */
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  /**
   * Handle post submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!content.trim() && !image) {
      setError('Please add either text content or an image');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (content.trim()) {
        formData.append('content', content.trim());
      }
      if (image) {
        formData.append('image', image);
      }

      await createPost(formData);

      setContent('');
      setImage(null);
      setImagePreview(null);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#2D3748' }}>
            Create Post
          </Typography>
          
          <ButtonGroup variant="contained" sx={{ borderRadius: '12px' }}>
            <Button
              onClick={() => setActiveTab('all')}
              sx={{
                backgroundColor: activeTab === 'all' ? '#0D7EFF' : '#F7FAFC',
                color: activeTab === 'all' ? '#FFFFFF' : '#718096',
                '&:hover': {
                  backgroundColor: activeTab === 'all' ? '#0961CC' : '#E2E8F0',
                },
              }}
            >
              All Posts
            </Button>
            <Button
              onClick={() => setActiveTab('promotions')}
              sx={{
                backgroundColor: activeTab === 'promotions' ? '#0D7EFF' : '#F7FAFC',
                color: activeTab === 'promotions' ? '#FFFFFF' : '#718096',
                '&:hover': {
                  backgroundColor: activeTab === 'promotions' ? '#0961CC' : '#E2E8F0',
                },
              }}
            >
              Promotions
            </Button>
          </ButtonGroup>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
              },
            }}
          />

          {imagePreview && (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  border: '2px solid rgba(0, 0, 0, 0.08)',
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: '#FF4757',
                    color: '#FFFFFF',
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Action Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="label"
                sx={{
                  color: '#0D7EFF',
                  '&:hover': { backgroundColor: '#E3F2FD' },
                }}
              >
                <PhotoIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </IconButton>
              
              <IconButton
                sx={{
                  color: '#FFB800',
                  '&:hover': { backgroundColor: '#FFF4E6' },
                }}
              >
                <EmojiIcon />
              </IconButton>
              
              <IconButton
                sx={{
                  color: '#00D9A5',
                  '&:hover': { backgroundColor: '#E8F5E9' },
                }}
              >
                <ChartIcon />
              </IconButton>
              
              <IconButton
                sx={{
                  color: '#9B59B6',
                  '&:hover': { backgroundColor: '#F3E5F5' },
                }}
              >
                <VolumeIcon />
              </IconButton>
              
              <Button
                sx={{
                  color: '#0D7EFF',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: '#E3F2FD' },
                }}
              >
                Promote
              </Button>
            </Box>

            {/* Post Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || (!content.trim() && !image)}
              sx={{
                px: 4,
                py: 1.2,
                backgroundColor: loading ? '#CBD5E0' : '#E2E8F0',
                color: loading ? '#718096' : '#2D3748',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#0D7EFF',
                  color: '#FFFFFF',
                },
                '&:disabled': {
                  backgroundColor: '#F7FAFC',
                  color: '#A0AEC0',
                },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#718096' }} /> : 'Post'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;