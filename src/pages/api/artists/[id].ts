import { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '../../../framework/lib/db';
import sql from 'mssql';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Artist ID is required' });
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
              name,
              genre,
              country,
              bio,
              website,
              profileImageUrl,
              birthDate,
              createdAt,
              updatedAt,
              isActive
            FROM [Iftekhari].[Artists]
            WHERE id = @id AND isActive = 1
          `);

          if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
          }

          const artist = result.recordset[0];
          const responseArtist = {
            id: artist.id?.toString(),
            name: artist.name || 'Unknown Artist',
            genre: artist.genre || '',
            country: artist.country || '',
            bio: artist.bio || '',
            website: artist.website || '',
            profileImageUrl: artist.profileImageUrl || '',
            birthDate: artist.birthDate || '',
            createdAt: artist.createdAt || new Date().toISOString(),
          };

          res.status(200).json(responseArtist);
        } catch (error) {
          console.error('Error fetching artist:', error);
          res.status(500).json({ message: 'Failed to fetch artist' });
        }
        break;

      case 'PUT':
        try {
          const { name, genre, country, bio, website, profileImageUrl, birthDate } = req.body;

          if (!name) {
            return res.status(400).json({ message: 'Name is required' });
          }

          // First check if artist exists
          const checkRequest = pool.request();
          checkRequest.input('id', sql.Int, parseInt(id));
          const checkResult = await checkRequest.query(`
            SELECT id FROM [Iftekhari].[Artists] WHERE id = @id AND isActive = 1
          `);

          if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
          }

          // Update the artist
          const request = pool.request();
          request.input('id', sql.Int, parseInt(id));
          request.input('name', sql.NVarChar, name);
          request.input('genre', sql.NVarChar, genre || '');
          request.input('country', sql.NVarChar, country || '');
          request.input('bio', sql.NVarChar, bio || '');
          request.input('website', sql.NVarChar, website || '');
          request.input('profileImageUrl', sql.NVarChar, profileImageUrl || '');
          request.input('birthDate', sql.DateTime2, birthDate ? new Date(birthDate) : null);
          request.input('updatedAt', sql.DateTime2, new Date());

          const result = await request.query(`
            UPDATE [Iftekhari].[Artists] 
            SET 
              name = @name,
              genre = @genre,
              country = @country,
              bio = @bio,
              website = @website,
              profileImageUrl = @profileImageUrl,
              birthDate = @birthDate,
              updatedAt = @updatedAt
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.genre, INSERTED.country, 
                   INSERTED.bio, INSERTED.website, INSERTED.profileImageUrl, INSERTED.birthDate, INSERTED.updatedAt
            WHERE id = @id AND isActive = 1
          `);

          if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Artist not found or update failed' });
          }

          const updatedArtist = result.recordset[0];
          const responseArtist = {
            id: updatedArtist.id?.toString(),
            name: updatedArtist.name,
            genre: updatedArtist.genre || '',
            country: updatedArtist.country || '',
            bio: updatedArtist.bio || '',
            website: updatedArtist.website || '',
            profileImageUrl: updatedArtist.profileImageUrl || '',
            birthDate: updatedArtist.birthDate || '',
            updatedAt: updatedArtist.updatedAt,
          };

          res.status(200).json(responseArtist);
        } catch (error) {
          console.error('Error updating artist:', error);
          res.status(500).json({ message: 'Failed to update artist' });
        }
        break;

      case 'DELETE':
        try {
          // Check if artist exists
          const checkRequest = pool.request();
          checkRequest.input('id', sql.Int, parseInt(id));
          const checkResult = await checkRequest.query(`
            SELECT id FROM [Iftekhari].[Artists] WHERE id = @id AND isActive = 1
          `);

          if (checkResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Artist not found' });
          }

          // Soft delete the artist (set isActive to false)
          const request = pool.request();
          request.input('id', sql.Int, parseInt(id));
          request.input('updatedAt', sql.DateTime2, new Date());

          await request.query(`
            UPDATE [Iftekhari].[Artists] 
            SET 
              isActive = 0,
              updatedAt = @updatedAt
            WHERE id = @id
          `);

          res.status(200).json({ message: 'Artist deleted successfully' });
        } catch (error) {
          console.error('Error deleting artist:', error);
          res.status(500).json({ message: 'Failed to delete artist' });
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
