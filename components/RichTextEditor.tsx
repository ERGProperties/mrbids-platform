"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[250px] p-5 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="border rounded-2xl overflow-hidden">
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded border ${
            editor.isActive("bold") ? "bg-black text-white" : "bg-white"
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded border ${
            editor.isActive("italic") ? "bg-black text-white" : "bg-white"
          }`}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1 rounded border ${
            editor.isActive("heading", { level: 2 })
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded border ${
            editor.isActive("bulletList")
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded border ${
            editor.isActive("orderedList")
              ? "bg-black text-white"
              : "bg-white"
          }`}
        >
          1. List
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}