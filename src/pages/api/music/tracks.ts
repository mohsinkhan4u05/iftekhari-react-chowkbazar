import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../../../framework/lib/db";
import sql from "mssql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      genre = '',
      artist = ''
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const pool = await getConnection();
    const request = pool.request();

    // Build WHERE clause
    let whereClause = "WHERE isActive = 1";
    
    if (search) {
      whereClause += " AND (title LIKE @search OR artist LIKE @search OR genre LIKE @search)";
      request.input('search', sql.VarChar, `%${search}%`);
    }
    
    if (genre) {
      whereClause += " AND genre = @genre";
      request.input('genre', sql.VarChar, genre);
    }
    
    if (artist) {
      whereClause += " AND artist = @artist";
      request.input('artist', sql.VarChar, artist);
    }

    // Validate sort parameters
    const validSortFields = ['title', 'artist', 'genre', 'createdAt', 'playCount', 'likes', 'views'];
    const validSortOrders = ['asc', 'desc'];
    const orderByField = validSortFields.includes(sortBy as string) ? sortBy : 'createdAt';
    const orderDirection = validSortOrders.includes(sortOrder as string) ? sortOrder : 'desc';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM [Iftekhari].[Tracks]
      ${whereClause}
    `;
    
    const countResult = await request.query(countQuery);
    const total = countResult.recordset[0]?.total || 0;

    // Get paginated data
    request.input('limit', sql.Int, Number(limit));
    request.input('offset', sql.Int, offset);
    
    const dataQuery = `
      SELECT 
        id,
        title,
        artist,
        albumId,
        genre,
        duration,
        durationFormatted,
        trackNumber,
        audioUrl,
        coverImage,
        description,
        lyrics,
        views,
        likes,
        downloads,
        isBookmarked,
        isActive,
        uploadDate,
        createdAt,
        updatedAt,
        uploadedBy,
        playCount,
        lastPlayedAt
      FROM [Iftekhari].[Tracks]
      ${whereClause}
      ORDER BY ${orderByField} ${orderDirection.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const result = await request.query(dataQuery);
    
    const tracks = result.recordset.map((track) => ({
      id: track.id?.toString(),
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      album: track.albumId || '',
      duration: track.durationFormatted || track.duration || 0,
      url: track.audioUrl || '',
      audioUrl: track.audioUrl || '',
      cover: track.coverImage || '',
      coverImage: track.coverImage || '',
      albumId: track.albumId
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPreviousPage = Number(page) > 1;

    res.status(200).json({
      data: tracks,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: total,
        itemsPerPage: Number(limit),
        hasNextPage,
        hasPreviousPage
      },
      filters: {
        search: search || '',
        sortBy: orderByField,
        sortOrder: orderDirection,
        genre: genre || '',
        artist: artist || ''
      }
    });
  } catch (error) {
    console.error("Tracks API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
