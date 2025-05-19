'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type IBookFormValues, bookFormSchema, BookFormValues } from '../../@types/book/bookFormValues';
import type { IBook } from '../../@types/book/book';
import {
  TextField,
  Button,
  Box,
  LinearProgress,
  CircularProgress,
  Grid,
  Card,
  Typography,
  CardMedia,
} from '@mui/material';

interface BookFormProps {
  onSubmit : (values : IBookFormValues) => void;
  defaultValues ?: IBook;
  isLoading ?: boolean;
  submitButtonText ?: string;
  onCancel ?: () => void;
}

export const BookForm = ({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitButtonText = 'Submit',
  onCancel,
} : BookFormProps) => {

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IBookFormValues>({
    defaultValues: BookFormValues(defaultValues),
    resolver: zodResolver(bookFormSchema),
    mode: 'onChange',
  });

  const watchedCoverImageUrl = watch('coverImageUrl');

  useEffect(() => {
      reset(BookFormValues(defaultValues));
  }, [defaultValues, reset]);

  return (
    <Card sx={{ p: 10 }}>
        <Typography variant='h5' component='h2' gutterBottom>{submitButtonText}</Typography>
        <Box component='form' onSubmit={e => void handleSubmit(onSubmit)(e)} sx={{ mt: 1 }}>
            {isLoading && <LinearProgress sx={{ mb: 2 }}/>}
            <Grid container spacing={2}>
                <TextField
                    required
                    fullWidth
                    id='title'
                    label='Title'
                    {...register('title')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isLoading}
                    variant='outlined'
                />

                <TextField
                    required
                    fullWidth
                    id='author'
                    label='Author'
                    {...register('author')}
                    error={!!errors.author}
                    helperText={errors.author?.message}
                    disabled={isLoading}
                    variant='outlined'
                />

                <TextField
                    fullWidth
                    id='isbn'
                    label='ISBN'
                    {...register('isbn')}
                    error={!!errors.isbn}
                    helperText={errors.isbn?.message}
                    disabled={isLoading}
                    variant='outlined'
                />

                <TextField
                    fullWidth
                    id='publicationYear'
                    label='Publication Year (Optional)'
                    type='number'
                    {...register('publicationYear', { valueAsNumber: true })}
                    error={!!errors.publicationYear}
                    helperText={errors.publicationYear?.message}
                    disabled={isLoading}
                    variant='outlined'
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    fullWidth
                    id='description'
                    label='Description (Optional)'
                    multiline
                    rows={4}
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isLoading}
                    variant='outlined'
                />

                <TextField
                    fullWidth
                    id='genre'
                    label='Genre (Optional)'
                    {...register('genre')}
                    error={!!errors.genre}
                    helperText={errors.genre?.message}
                    disabled={isLoading}
                    variant='outlined'
                />

                <TextField
                    fullWidth
                    id='coverImageUrl'
                    label='Cover Image URL (Optional)'
                    type='url'
                    {...register('coverImageUrl')}
                    error={!!errors.coverImageUrl}
                    helperText={errors.coverImageUrl?.message}
                    disabled={isLoading}
                    variant='outlined'
                    placeholder='https://example.com/image.png'
                />
                <Grid container spacing={2} direction={'column'}>
                    <Typography variant='h6' component='h2' gutterBottom>{'Preview:'}</Typography>                    
                    <Card>
                    <CardMedia
                        component='img'
                        height='200'
                        image={watchedCoverImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                        alt={'Book Cover'}
                        sx={{
                            width: '100%', // Ensure it takes the full width of the card
                            aspectRatio: '2/3', // Enforce a portrait book shape (width/height)
                            objectFit: 'contain', // Ensures the whole image fits, letterboxed if necessary
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], // Shows the defined aspect ratio box
                        }}
                    />
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                {onCancel && (
                <Button
                    variant='outlined'
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                )}
                <Button
                type='submit'
                variant='contained'
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color='inherit' /> : null}
                >
                {isLoading ? 'Submitting...' : submitButtonText}
                </Button>
            </Box>
        </Box>
    </Card>
  );
};
