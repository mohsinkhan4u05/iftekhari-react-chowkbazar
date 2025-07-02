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
import { useEffect } from "react";

import javascript from "highlight.js/lib/languages/javascript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";

lowlight.registerLanguage("js", javascript);
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("python", python);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return <p>Loading editor...</p>;

  const ask = (label: string) => window.prompt(label) || "";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50 dark:bg-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "btn-active" : "btn"}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "btn-active" : "btn"}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="btn"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="btn"
        >
          Code
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="btn"
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="btn"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="btn"
        >
          ↩️
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="btn"
        >
          ↪️
        </button>
        <button
          onClick={() => {
            const url = ask("Enter link URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className="btn"
        >
          🔗
        </button>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
              .run()
          }
          className="btn"
        >
          📊
        </button>
        <button
          onClick={() => {
            const url = ask("Enter YouTube URL:");
            if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }}
          className="btn"
        >
          📺
        </button>

        {/* Image Upload */}
        <label className="btn cursor-pointer">
          📤
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
      </div>

      {/* Editor Content */}
      <div className="border rounded p-3 bg-white dark:bg-gray-900 min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
