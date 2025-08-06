import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../../framework/lib/db';
import sql from 'mssql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Track ID is required' });
  }

  try {
    const pool = await getConnection();

    switch (method) {
      case 'GET':
        try {
          const request = pool.request();
          request.input('id', sql.Int, parseInt(id));
          
          const result = await request.query(`
            SELECT 
              id,
              title,
              artist,
              albumId,
              genre,
              audioUrl,
              coverImage,
              duration,
              durationFormatted,
              trackNumber,
              createdAt,
              updatedAt,
              isActive
            FROM [Iftekhari].[Tracks]
            WHERE id = @id AND isActive = 1
          `);

          if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Track not found' });
          }

          const track = result.recordset[0];
          const responseTrack = {
            id: track.id?.toString(),
            title: track.title || 'Unknown Title',
            artist: track.artist || 'Unknown Artist',
            albumTitle: track.artist || 'Unknown Album', // Keep for backward compatibility
            albumId: track.albumId?.toString() || '',
            genre: track.genre || '',
            audioUrl: track.audioUrl || '',
            coverImage: track.coverImage || '',
            duration: track.durationFormatted || track.duration || '',
            trackNumber: track.trackNumber || 1,
            createdAt: track.createdAt || new Date().toISOString(),
          };

          res.status(200).json(responseTrack);
        } catch (error) {
          console.error('Error fetching track:', error);
          res.status(500).json({ message: 'Failed to fetch track' });
        }
        break;

      case 'PUT':
        try {
          const { title, artist, albumId, genre, audioUrl, coverImage, duration, trackNumber } = req.body;

          if (!title) {
            return res.status(400).json({ message: 'Title is required' });
          }

          if (!artist) {
            return res.status(400).json({ message: 'Artist is required' });
          }

          if (!audioUrl) {
            return res.status(400).json({ message: 'Audio URL is required' });
          }

          // Convert duration from mm:ss to seconds if provided, otherwise use default
          let durationInSeconds = 1; // Default to 1 second if no duration provided (DB constraint requires duration > 0)
          
          if (duration) {
            if (typeof duration === 'string' && duration.includes(':')) {
              // Duration is in mm:ss format
              const [minutes, seconds] = duration.split(':').map(Number);
              if (!isNaN(minutes) && !isNaN(seconds)) {
                durationInSeconds = minutes * 60 + seconds;
              }
            } else if (!isNaN(Number(duration))) {
              // Duration is in seconds
              durationInSeconds = Number(duration);
            }
          }
          
          // Ensure duration is positive (DB constraint requires duration > 0)
          if (durationInSeconds <= 0) {
            durationInSeconds = 1;
          }

          const request = pool.request();
          request.input('id', sql.Int, parseInt(id));
          request.input('title', sql.NVarChar, title);
          request.input('artist', sql.NVarChar, artist);
          request.input('albumId', sql.Int, albumId && parseInt(albumId) || null);
          request.input('genre', sql.NVarChar, genre || '');
          request.input('audioUrl', sql.NVarChar, audioUrl);
          request.input('coverImage', sql.NVarChar, coverImage || '');
          request.input('duration', sql.Int, durationInSeconds);
          request.input('trackNumber', sql.Int, trackNumber ? parseInt(trackNumber, 10) : null);
          request.input('updatedAt', sql.DateTime2, new Date());

          const updateResult = await request.query(`
            UPDATE [Iftekhari].[Tracks]
            SET 
              title = @title,
              artist = @artist,
              albumId = @albumId,
              genre = @genre,
              audioUrl = @audioUrl,
              coverImage = @coverImage,
              duration = @duration,
              trackNumber = @trackNumber,
              updatedAt = @updatedAt
            WHERE id = @id AND isActive = 1
          `);

          if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Track not found' });
          }

          // Fetch the updated track
          const selectResult = await request.query(`
            SELECT 
              id,
              title,
              artist,
              albumId,
              genre,
              audioUrl,
              coverImage,
              duration,
              durationFormatted,
              trackNumber,
              createdAt,
              updatedAt
            FROM [Iftekhari].[Tracks]
            WHERE id = @id AND isActive = 1
          `);

          const updatedTrack = selectResult.recordset[0];
          const responseTrack = {
            id: updatedTrack.id?.toString(),
            title: updatedTrack.title,
            artist: updatedTrack.artist,
            albumTitle: updatedTrack.artist, // Keep for backward compatibility
            albumId: updatedTrack.albumId?.toString() || '',
            genre: updatedTrack.genre || '',
            audioUrl: updatedTrack.audioUrl || '',
            coverImage: updatedTrack.coverImage || '',
            duration: updatedTrack.durationFormatted || updatedTrack.duration || '',
            trackNumber: updatedTrack.trackNumber,
            createdAt: updatedTrack.createdAt,
            updatedAt: updatedTrack.updatedAt,
          };

          res.status(200).json(responseTrack);
        } catch (error) {
          console.error('Error updating track:', error);
          res.status(500).json({ message: 'Failed to update track' });
        }
        break;

      case 'DELETE':
        try {
          const request = pool.request();
          request.input('id', sql.Int, parseInt(id));
          request.input('updatedAt', sql.DateTime2, new Date());

          // Soft delete by setting isActive to false
          const result = await request.query(`
            UPDATE [Iftekhari].[Tracks]
            SET 
              isActive = 0,
              updatedAt = @updatedAt
            WHERE id = @id AND isActive = 1
          `);

          if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Track not found' });
          }

          res.status(200).json({ message: 'Track deleted successfully' });
        } catch (error) {
          console.error('Error deleting track:', error);
          res.status(500).json({ message: 'Failed to delete track' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
}
