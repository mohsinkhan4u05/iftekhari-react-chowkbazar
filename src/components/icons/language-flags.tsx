import React from "react";

export const EnglishFlag = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-blue-600`}>
    <span className="text-white font-bold text-xs">EN</span>
  </div>
);

export const UrduFlag = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-green-600`}>
    <span className="text-white font-bold text-xs">اردو</span>
  </div>
);

export const ArabicFlag = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-green-700`}>
    <span className="text-white font-bold text-xs">عربی</span>
  </div>
);

export const PersianFlag = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} rounded-full overflow-hidden flex items-center justify-center bg-red-600`}>
    <span className="text-white font-bold text-xs">فارسی</span>
  </div>
);

export const getLanguageFlag = (languageName: string, className?: string) => {
  const langLower = languageName.toLowerCase();
  
  if (langLower.includes('english')) {
    return <EnglishFlag className={className} />;
  } else if (langLower.includes('اردو') || langLower.includes('urdu')) {
    return <UrduFlag className={className} />;
  } else if (langLower.includes('arabic') || langLower.includes('عربی')) {
    return <ArabicFlag className={className} />;
  } else if (langLower.includes('persian') || langLower.includes('فارسی')) {
    return <PersianFlag className={className} />;
  }
  
  // Default flag
  return <EnglishFlag className={className} />;
};
