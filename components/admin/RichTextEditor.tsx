'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value?: string;
  content?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, content, onChange, placeholder = 'Start writing your blog post...' }: RichTextEditorProps) {
  const actualContent = value || content || '';
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-bloompink hover:text-bloom-pink-dark underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: actualContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && actualContent !== editor.getHTML()) {
      editor.commands.setContent(actualContent);
    }
  }, [actualContent, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Bold
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Italic
        </button>

        <div className="w-px h-6 bg-gray-300 self-center mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 }) 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 }) 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-gray-300 self-center mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-300 self-center mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          " Quote
        </button>

        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('link') 
              ? 'bg-bloom-dark text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          🔗 Link
        </button>

        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
        >
          🖼️ Image
        </button>

        <div className="w-px h-6 bg-gray-300 self-center mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors"
        >
          — Line
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          ↶ Undo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="px-3 py-1 rounded text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          ↷ Redo
        </button>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Character count */}
      <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-600">
        {editor.storage.characterCount?.characters() || 0} characters
      </div>
    </div>
  );
}