import { createContext, useContext, useState, ReactNode } from "react";

type BookCountContextType = {
  count: number;
  setCount: (count: number) => void;
};

const BookCountContext = createContext<BookCountContextType | undefined>(
  undefined
);

export const BookCountProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);

  return (
    <BookCountContext.Provider value={{ count, setCount }}>
      {children}
    </BookCountContext.Provider>
  );
};

export const useBookCount = () => {
  const context = useContext(BookCountContext);
  if (!context) {
    throw new Error("useBookCount must be used within a BookCountProvider");
  }
  return context;
};
