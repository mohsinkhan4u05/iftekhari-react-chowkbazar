import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../../framework/lib/db';
import sql from 'mssql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    const pool = await getConnection();

    switch (method) {
      case 'GET':
        try {
          const request = pool.request();
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
            WHERE isActive = 1
            ORDER BY createdAt DESC
          `);

          const tracks = result.recordset.map((track) => ({
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
          }));

          res.status(200).json(tracks);
        } catch (error) {
          console.error('Error fetching tracks:', error);
          res.status(500).json({ message: 'Failed to fetch tracks' });
        }
        break;

      case 'POST':
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
          request.input('title', sql.NVarChar, title);
          request.input('artist', sql.NVarChar, artist);
          request.input('albumId', sql.Int, albumId || null);
          request.input('genre', sql.NVarChar, genre || '');
          request.input('audioUrl', sql.NVarChar, audioUrl);
          request.input('coverImage', sql.NVarChar, coverImage || '');
          request.input('duration', sql.Int, durationInSeconds);
          request.input('trackNumber', sql.Int, trackNumber ? parseInt(trackNumber, 10) : null);
          request.input('views', sql.Int, 0);
          request.input('likes', sql.Int, 0);
          request.input('downloads', sql.Int, 0);
          request.input('isBookmarked', sql.Bit, false);
          request.input('isActive', sql.Bit, true);
          request.input('uploadDate', sql.DateTime2, new Date());
          request.input('createdAt', sql.DateTime2, new Date());
          request.input('updatedAt', sql.DateTime2, new Date());
          request.input('playCount', sql.Int, 0);

          const result = await request.query(`
            INSERT INTO [Iftekhari].[Tracks] 
            (title, artist, albumId, genre, audioUrl, coverImage, duration, trackNumber, views, likes, downloads, isBookmarked, isActive, uploadDate, createdAt, updatedAt, playCount)
            OUTPUT INSERTED.id, INSERTED.title, INSERTED.artist, INSERTED.albumId, 
                   INSERTED.genre, INSERTED.audioUrl, INSERTED.coverImage, INSERTED.duration,
                   INSERTED.trackNumber, INSERTED.createdAt
            VALUES (@title, @artist, @albumId, @genre, @audioUrl, @coverImage, @duration, @trackNumber, @views, @likes, @downloads, @isBookmarked, @isActive, @uploadDate, @createdAt, @updatedAt, @playCount)
          `);

          const newTrack = result.recordset[0];
          const responseTrack = {
            id: newTrack.id?.toString(),
            title: newTrack.title,
            artist: newTrack.artist,
            albumTitle: newTrack.artist, // Keep for backward compatibility
            albumId: newTrack.albumId?.toString() || '',
            genre: newTrack.genre || '',
            audioUrl: newTrack.audioUrl || '',
            coverImage: newTrack.coverImage || '',
            duration: newTrack.durationFormatted || newTrack.duration || '',
            trackNumber: newTrack.trackNumber,
            createdAt: newTrack.createdAt,
          };

          res.status(201).json(responseTrack);
        } catch (error) {
          console.error('Error creating track:', error);
          res.status(500).json({ message: 'Failed to create track' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
}
