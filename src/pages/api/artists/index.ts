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
            WHERE isActive = 1
            ORDER BY name ASC
          `);

          const artists = result.recordset.map((artist) => ({
            id: artist.id?.toString(),
            name: artist.name || 'Unknown Artist',
            genre: artist.genre || '',
            country: artist.country || '',
            bio: artist.bio || '',
            website: artist.website || '',
            profileImageUrl: artist.profileImageUrl || '',
            birthDate: artist.birthDate || '',
            createdAt: artist.createdAt || new Date().toISOString(),
          }));

          res.status(200).json(artists);
        } catch (error) {
          console.error('Error fetching artists:', error);
          res.status(500).json({ message: 'Failed to fetch artists' });
        }
        break;

      case 'POST':
        try {
          const { name, genre, country, bio, website, profileImageUrl, birthDate } = req.body;

          if (!name) {
            return res.status(400).json({ message: 'Name is required' });
          }

          const request = pool.request();
          request.input('name', sql.NVarChar, name);
          request.input('genre', sql.NVarChar, genre || '');
          request.input('country', sql.NVarChar, country || '');
          request.input('bio', sql.NVarChar, bio || '');
          request.input('website', sql.NVarChar, website || '');
          request.input('profileImageUrl', sql.NVarChar, profileImageUrl || '');
          request.input('birthDate', sql.DateTime2, birthDate ? new Date(birthDate) : null);
          request.input('isActive', sql.Bit, true);
          request.input('createdAt', sql.DateTime2, new Date());
          request.input('updatedAt', sql.DateTime2, new Date());

          const result = await request.query(`
            INSERT INTO [Iftekhari].[Artists] 
            (name, genre, country, bio, website, profileImageUrl, birthDate, isActive, createdAt, updatedAt)
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.genre, INSERTED.country, 
                   INSERTED.bio, INSERTED.website, INSERTED.profileImageUrl, INSERTED.birthDate, INSERTED.createdAt
            VALUES (@name, @genre, @country, @bio, @website, @profileImageUrl, @birthDate, @isActive, @createdAt, @updatedAt)
          `);

          const newArtist = result.recordset[0];
          const responseArtist = {
            id: newArtist.id?.toString(),
            name: newArtist.name,
            genre: newArtist.genre || '',
            country: newArtist.country || '',
            bio: newArtist.bio || '',
            website: newArtist.website || '',
            profileImageUrl: newArtist.profileImageUrl || '',
            birthDate: newArtist.birthDate || '',
            createdAt: newArtist.createdAt,
          };

          res.status(201).json(responseArtist);
        } catch (error) {
          console.error('Error creating artist:', error);
          res.status(500).json({ message: 'Failed to create artist' });
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
