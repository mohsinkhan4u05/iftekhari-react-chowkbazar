import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface BookmarkState {
  bookmarks: { [bookId: number]: boolean };
  loading: boolean;
  checkedPages: Set<string>; // Track which pages/queries have been checked
}

type BookmarkAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_BOOKMARKS'; payload: { [bookId: number]: boolean } }
  | { type: 'UPDATE_BOOKMARK'; payload: { bookId: number; isBookmarked: boolean } }
  | { type: 'ADD_CHECKED_PAGE'; payload: string }
  | { type: 'RESET' };

const initialState: BookmarkState = {
  bookmarks: {},
  loading: false,
  checkedPages: new Set(),
};

function bookmarkReducer(state: BookmarkState, action: BookmarkAction): BookmarkState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOOKMARKS':
      return {
        ...state,
        bookmarks: { ...state.bookmarks, ...action.payload },
        loading: false,
      };
    case 'UPDATE_BOOKMARK':
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          [action.payload.bookId]: action.payload.isBookmarked,
        },
      };
    case 'ADD_CHECKED_PAGE':
      return {
        ...state,
        checkedPages: new Set([...state.checkedPages, action.payload]),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface BookmarkContextType {
  bookmarks: { [bookId: number]: boolean };
  loading: boolean;
  isBookmarked: (bookId: number) => boolean;
  updateBookmark: (bookId: number, isBookmarked: boolean) => void;
  batchCheckBookmarks: (bookIds: number[], pageKey?: string) => Promise<void>;
  toggleBookmark: (bookId: number) => Promise<boolean>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(bookmarkReducer, initialState);

  // Reset state when user session changes
  React.useEffect(() => {
    if (!session) {
      dispatch({ type: 'RESET' });
    }
  }, [session]);

  const isBookmarked = useCallback((bookId: number): boolean => {
    return state.bookmarks[bookId] || false;
  }, [state.bookmarks]);

  const updateBookmark = useCallback((bookId: number, isBookmarked: boolean) => {
    dispatch({ type: 'UPDATE_BOOKMARK', payload: { bookId, isBookmarked } });
  }, []);

  const batchCheckBookmarks = useCallback(async (bookIds: number[], pageKey?: string) => {
    if (!session || bookIds.length === 0) return;

    // Create a unique key for this set of book IDs
    const key = pageKey || `batch_${bookIds.sort().join('_')}`;
    
    // Skip if we've already checked this page/query
    if (state.checkedPages.has(key)) {
      return;
    }

    // Filter out book IDs we already know about
    const unknownBookIds = bookIds.filter(id => !(id in state.bookmarks));
    
    if (unknownBookIds.length === 0) {
      dispatch({ type: 'ADD_CHECKED_PAGE', payload: key });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await axios.post('/api/user/bookmarks/batch-check', {
        bookIds: unknownBookIds,
      });

      if (response.data.success) {
        dispatch({ type: 'SET_BOOKMARKS', payload: response.data.bookmarks });
        dispatch({ type: 'ADD_CHECKED_PAGE', payload: key });
      }
    } catch (error) {
      console.error('Batch bookmark check failed:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [session?.user?.email]);

  const toggleBookmark = useCallback(async (bookId: number): Promise<boolean> => {
    if (!session) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await axios.post('/api/user/bookmarks/toggle', {
        bookId,
      });

      const newBookmarkState = response.data.bookmarked;
      updateBookmark(bookId, newBookmarkState);
      return newBookmarkState;
    } catch (error) {
      console.error('Toggle bookmark failed:', error);
      throw error;
    }
  }, [session, updateBookmark]);

  const value: BookmarkContextType = {
    bookmarks: state.bookmarks,
    loading: state.loading,
    isBookmarked,
    updateBookmark,
    batchCheckBookmarks,
    toggleBookmark,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};
