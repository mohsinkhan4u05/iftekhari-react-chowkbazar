"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { lowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
// Note: BulletList, OrderedList, ListItem, and Blockquote are included in StarterKit
import { useEffect, useState } from "react";

import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";

// Safely register languages
try {
  lowlight.registerLanguage("js", javascript);
  lowlight.registerLanguage("html", html);
  lowlight.registerLanguage("css", css);
  lowlight.registerLanguage("python", python);
} catch (error) {
  console.warn("Error registering highlight languages:", error);
}

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onError?: () => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure built-in extensions for better styling
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'ml-4',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 py-2 italic bg-gray-50 dark:bg-gray-800 dark:border-gray-600',
          },
        },
      }),
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[350px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: () => {
      setIsEditorReady(true);
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && isEditorReady) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor, isEditorReady]);

  // Don't render anything on server side
  if (!isClient) {
    return (
      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
            Initializing editor...
          </div>
        </div>
      </div>
    );
  }

  const ask = (label: string) => window.prompt(label) || "";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-500">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("bold")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Bold"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3h5a3 3 0 110 6H5V3zM5 11h6a3 3 0 110 6H5v-6z" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("italic")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Italic"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 1h3l-2 14H6l2-14z" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("strike")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Strikethrough"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 9h14v2H3V9zm2-3h10a1 1 0 000-2H5a1 1 0 000 2zm0 8h10a1 1 0 000-2H5a1 1 0 000 2z" />
              </svg>
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-500">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-500">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Bullet List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 6a2 2 0 100-4 2 2 0 000 4zM4 12a2 2 0 100-4 2 2 0 000 4zM4 18a2 2 0 100-4 2 2 0 000 4zM8 5h10a1 1 0 000-2H8a1 1 0 000 2zM8 11h10a1 1 0 000-2H8a1 1 0 000 2zM8 17h10a1 1 0 000-2H8a1 1 0 000 2z" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Numbered List"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Quote"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 7C4.67 7 4 7.67 4 8.5v3C4 12.33 4.67 13 5.5 13S7 12.33 7 11.5V10h1.5C9.33 10 10 9.33 10 8.5S9.33 7 8.5 7H5.5zM12.5 7c-.83 0-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10H15c.83 0 1.5-.67 1.5-1.5S15.83 7 15 7h-2.5z" />
              </svg>
            </button>
          </div>

          {/* Code */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-500">
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("code")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Inline Code"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.5 7.5L4 10l2.5 2.5M13.5 7.5L16 10l-2.5 2.5" stroke="currentColor" strokeWidth={2} fill="none" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("codeBlock")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Code Block"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Insert Elements */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-500">
            <button
              onClick={() => {
                const url = ask("Enter link URL:");
                if (url) {
                  const text = ask("Enter link text (optional):") || url;
                  editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("link")
                  ? "bg-accent text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
              title="Insert Link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            
            {/* Image Upload */}
            <label className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-pointer" title="Upload Image">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append("file", file);

                  try {
                    const res = await fetch("/api/upload-image", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();
                    editor.chain().focus().setImage({ src: data.url }).run();
                  } catch (err) {
                    console.error("Image upload failed", err);
                    alert("Failed to upload image");
                  }
                }}
              />
            </label>

            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Insert Table"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V10z" />
              </svg>
            </button>

            <button
              onClick={() => {
                const url = ask("Enter YouTube URL:");
                if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
              }}
              className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              title="Embed YouTube"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-xl focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-colors">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 min-h-[400px] prose prose-lg dark:prose-invert max-w-none focus:outline-none">
          <EditorContent 
            editor={editor} 
            className="focus:outline-none min-h-[350px]"
          />
        </div>
        
        {/* Editor Footer */}
        <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-b-xl">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span>Start typing to create your content...</span>
            </div>
            <div className="flex items-center gap-4">
              {editor && (
                <span>{editor.storage.characterCount?.characters() || 0} characters</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
