'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

interface BookEditorProps {
  initialData?: {
    title?: string
    subtitle?: string
    summary?: string
    content?: string
  }
}

export function BookEditor({ initialData }: BookEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    author: '',
    isbn: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    genres: '',
    summary: initialData?.summary || '',
    coverImage: '',
    pageCount: 0,
    freePreviewPages: 20,
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your book content here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Underline,
    ],
    content: initialData?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
      },
    },
  })

  const MenuButton = ({
    onClick,
    isActive,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded p-2 hover:bg-accent',
        isActive && 'bg-accent text-accent-foreground'
      )}
      title={title}
    >
      {children}
    </button>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const content = editor?.getHTML() || ''
      
      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content,
          genres: formData.genres.split(',').map((g) => g.trim()),
        }),
      })

      if (!response.ok) throw new Error('Failed to create book')

      toast.success('Book created successfully!')
      router.push('/admin/books')
    } catch (error) {
      toast.error('Failed to create book')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicationYear">Publication Year</Label>
              <Input
                id="publicationYear"
                type="number"
                value={formData.publicationYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publicationYear: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genres">Genres (comma-separated)</Label>
              <Input
                id="genres"
                value={formData.genres}
                onChange={(e) =>
                  setFormData({ ...formData, genres: e.target.value })
                }
                placeholder="Fiction, Classic, Romance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageCount">Page Count</Label>
              <Input
                id="pageCount"
                type="number"
                value={formData.pageCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pageCount: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="freePreviewPages">Free Preview Pages</Label>
              <Input
                id="freePreviewPages"
                type="number"
                value={formData.freePreviewPages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freePreviewPages: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="border-b bg-muted/50 p-2">
              <div className="flex flex-wrap gap-1">
                <MenuButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive('bold')}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive('italic')}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive('underline')}
                  title="Underline"
                >
                  <UnderlineIcon className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive('strike')}
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleCode().run()}
                  isActive={editor.isActive('code')}
                  title="Code"
                >
                  <Code className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive('heading', { level: 1 })}
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <MenuButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive('orderedList')}
                  title="Ordered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  isActive={editor.isActive('blockquote')}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <MenuButton
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  title="Align Left"
                >
                  <AlignLeft className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                  }
                  isActive={editor.isActive({ textAlign: 'center' })}
                  title="Align Center"
                >
                  <AlignCenter className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  title="Align Right"
                >
                  <AlignRight className="h-4 w-4" />
                </MenuButton>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <MenuButton
                  onClick={() => editor.chain().focus().undo().run()}
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                  onClick={() => editor.chain().focus().redo().run()}
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </MenuButton>
              </div>
            </div>

            <EditorContent editor={editor} />
          </div>

          <p className="text-muted-foreground mt-2 text-sm">
            Character count: {editor.storage.characterCount?.characters() || 0}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Book'}
        </Button>
      </div>
    </form>
  )
}
