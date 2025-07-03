import { useState } from 'react';
import Link from '@components/ui/link';
import { useSession } from 'next-auth/react';
import { 
  FiSettings, 
  FiChevronDown, 
  FiEdit3, 
  FiPlus, 
  FiList,
  FiFileText,
  FiUsers
} from 'react-icons/fi';

export default function AdminMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show admin menu if user is authenticated and has admin role
  if (!session?.user?.email || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-accent transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <FiSettings className="w-4 h-4" />
        <span className="hidden md:inline">Admin</span>
        <FiChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* Blog Management Section */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Blog Management
            </div>
            
            <Link
              href="/admin/blogs"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiList className="w-4 h-4" />
              <div>
                <div className="font-medium">Manage Blogs</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">View, edit & delete blogs</div>
              </div>
            </Link>

            <Link
              href="/admin/blogs/create"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <div>
                <div className="font-medium">Create New Blog</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Write a new article</div>
              </div>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>

          {/* Quick Actions */}
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Quick Actions
            </div>
            
            <Link
              href="/blogs"
              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-accent hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiFileText className="w-4 h-4" />
              <div>
                <div className="font-medium">View Public Blogs</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">See how visitors see blogs</div>
              </div>
            </Link>
          </div>

          {/* Admin Badge */}
          <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2 px-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FiUsers className="w-3 h-3" />
              <span>Logged in as: {session.user.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
