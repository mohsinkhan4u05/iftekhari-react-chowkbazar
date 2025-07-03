import React, { useState } from 'react';
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from 'react-share';
import { FiCopy, FiX, FiCheck } from 'react-icons/fi';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  summary?: string;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  summary,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const shareText = summary || title;
  const iconSize = 48;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Share this article
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Choose your preferred platform to share
          </p>
        </div>

        {/* Social Media Share Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center">
            <TwitterShareButton
              url={url}
              title={title}
              hashtags={['blog', 'article']}
              className="hover:scale-110 transition-transform"
            >
              <TwitterIcon size={iconSize} round />
            </TwitterShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">Twitter</span>
          </div>

          <div className="flex flex-col items-center">
            <FacebookShareButton
              url={url}
              quote={shareText}
              className="hover:scale-110 transition-transform"
            >
              <FacebookIcon size={iconSize} round />
            </FacebookShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">Facebook</span>
          </div>

          <div className="flex flex-col items-center">
            <LinkedinShareButton
              url={url}
              title={title}
              summary={shareText}
              source="Blog"
              className="hover:scale-110 transition-transform"
            >
              <LinkedinIcon size={iconSize} round />
            </LinkedinShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">LinkedIn</span>
          </div>

          <div className="flex flex-col items-center">
            <WhatsappShareButton
              url={url}
              title={shareText}
              separator=" - "
              className="hover:scale-110 transition-transform"
            >
              <WhatsappIcon size={iconSize} round />
            </WhatsappShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">WhatsApp</span>
          </div>

          <div className="flex flex-col items-center">
            <TelegramShareButton
              url={url}
              title={shareText}
              className="hover:scale-110 transition-transform"
            >
              <TelegramIcon size={iconSize} round />
            </TelegramShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">Telegram</span>
          </div>

          <div className="flex flex-col items-center">
            <EmailShareButton
              url={url}
              subject={title}
              body={shareText}
              className="hover:scale-110 transition-transform"
            >
              <EmailIcon size={iconSize} round />
            </EmailShareButton>
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">Email</span>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Or copy the link:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {copied ? (
                <>
                  <FiCheck className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <FiCopy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
