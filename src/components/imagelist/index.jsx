import React, { useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Box, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { UploadImage } from 'utils/firebaseutils';
import Loader from 'components/Loader';
import { toast } from 'react-toastify';

export default function StandardImageList({ updateImage, setupdateImage, collection }) {
  const [loading, setLoading] = useState(false);
  const handleDeleteImage = (index) => {
    const updatedImages = [...updateImage];
    updatedImages.splice(index, 1);
    if (setupdateImage) {
      setupdateImage(updatedImages);
    }
  };

  const handleUploadImage = async (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    if (files.length > 0) {
      setLoading(true);
      try {
        const uploadPromises = files.map((file) => UploadImage(collection + '/', file));
        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((res) => res.success).map((res) => res.data);

        setupdateImage((prevImages) => [...prevImages, ...successfulUploads]);
      } catch (error) {
        toast.error('Error uploading Images');
      } finally {
        setLoading(false);
      }
    }
  };

  if (updateImage?.length === 0) {
    return (
      <>
        {loading && <Loader />}
        <Box>
          <Button variant="contained" color={'indigo'} component="label" startIcon={<AddPhotoAlternateIcon />} sx={{ marginBottom: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" multiple onChange={handleUploadImage} />
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      {loading && <Loader />}

      <Box>
        <Button variant="contained" color={'indigo'} component="label" startIcon={<AddPhotoAlternateIcon />} sx={{ marginBottom: 2 }}>
          Upload Image
          <input type="file" hidden accept="image/*" multiple onChange={handleUploadImage} />
        </Button>
        <ImageList sx={{ width: '100%', height: 200 }} cols={2} rowHeight={164}>
          {updateImage.map((item, index) => (
            <ImageListItem key={item}>
              <Box position="absolute">
                <img
                  key={item}
                  srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item}?w=164&h=164&fit=crop&auto=format`}
                  loading="lazy"
                  alt="uploaded"
                  style={{ width: '96%', height: '90%', objectFit: 'cover' }}
                />
                <IconButton sx={{ position: 'absolute', top: 8, right: 8 }} onClick={() => handleDeleteImage(index)}>
                  <DeleteIcon sx={{ color: 'red' }} />
                </IconButton>
              </Box>
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </>
  );
}
