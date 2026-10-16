'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link2, Link2Off, Undo2, Redo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Rich text editor for admin-authored copy. The HTML is mirrored into a hidden
 * input so the surrounding server-action form keeps working with plain
 * FormData. It is sanitised server side on save, never trusted as typed.
 */
export function RichTextEditor({
  name,
  defaultValue = '',
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Link.configure({ openOnClick: false, autolink: false }),
    ],
    content: toInitialHtml(defaultValue),
    // Rendering the editor on the server then hydrating it warns in React 18.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose-admin min-h-[9rem] w-full px-4 py-3 text-ink-900 focus:outline-none',
      },
    },
    onUpdate: ({ editor: e }) => setHtml(e.isEmpty ? '' : e.getHTML()),
  });

  if (!editor) {
    // Matches the editor's footprint so the form doesn't jump on hydration.
    return (
      <div className="min-h-[12.5rem] w-full border border-ink-400 bg-background" />
    );
  }

  return (
    <div className="w-full border border-ink-400 bg-background focus-within:border-2 focus-within:border-ink-950">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-200 px-2 py-1.5">
        <ToolbarButton
          editor={editor}
          label="Bold"
          icon={Bold}
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Italic"
          icon={Italic}
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <Divider />
        <ToolbarButton
          editor={editor}
          label="Bullet list"
          icon={List}
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Numbered list"
          icon={ListOrdered}
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <Divider />
        <ToolbarButton
          editor={editor}
          label="Add link"
          icon={Link2}
          active={editor.isActive('link')}
          onClick={() => {
            const previous = editor.getAttributes('link').href as string | undefined;
            const url = window.prompt('Link URL', previous ?? 'https://');
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
        />
        <ToolbarButton
          editor={editor}
          label="Remove link"
          icon={Link2Off}
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        />
        <Divider />
        <ToolbarButton
          editor={editor}
          label="Undo"
          icon={Undo2}
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          editor={editor}
          label="Redo"
          icon={Redo2}
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      <div className="relative">
        {editor.isEmpty && placeholder ? (
          <p className="pointer-events-none absolute left-4 top-3 text-ink-400">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-ink-200" aria-hidden />;
}

function ToolbarButton({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  editor: Editor;
  label: string;
  icon: typeof Bold;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-950',
        active
          ? 'border-ink-950 bg-ink-950 text-white'
          : 'border-transparent text-ink-600 hover:border-ink-400 hover:text-ink-950',
        disabled && 'cursor-not-allowed opacity-40 hover:border-transparent',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

/**
 * Descriptions saved before this editor existed are plain text with newlines.
 * Wrap them in paragraphs so they open as readable content rather than one run.
 */
function toInitialHtml(value: string): string {
  if (!value) return '';
  if (/<(p|ul|ol|li|strong|em|a|br)\b/i.test(value)) return value;
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((block) => `<p>${escapeHtml(block.trim()).replace(/\r?\n/g, '<br>')}</p>`)
    .join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
