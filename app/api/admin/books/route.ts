/**
 * Books Management API (Admin Only)
 * 
 * MVP Feature - Phase 1 (Simple Admin Panel)
 * Handles book CRUD operations for admin panel
 */

import { requireAdmin } from "@/lib/api/middleware"
import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { error, user, supabase } = await requireAdmin()
  if (error) return error

  try {
    const formData = await request.formData()

    // Get form data
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const description = formData.get("description") as string
    const language = formData.get("language") as string
    const difficulty_level = formData.get("difficulty_level") as string
    const is_published = formData.get("is_published") === "true"
    const cover = formData.get("cover") as File

    // Validate required fields
    if (!title || !language || !difficulty_level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Upload cover image if provided
    let cover_url = null
    if (cover) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("book-covers")
        .upload(`${Date.now()}-${cover.name}`, cover)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = await supabase.storage
        .from("book-covers")
        .getPublicUrl(uploadData.path)

      cover_url = publicUrl
    }

    // Insert book data (using blueprint schema)
    const { data: book, error: insertError } = await supabase!
      .from("books")
      .insert({
        title,
        author, // TODO: Should be author_id in Phase 2
        summary: description,
        language,
        difficulty_level,
        status: is_published ? 'published' : 'draft',
        cover_image_url: cover_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    logger.info("Book created", {
      context: "POST /api/admin/books",
      metadata: {
        userId: user!.id,
        bookId: book.id
      }
    })

    return NextResponse.json(book)
  } catch (error) {
    logger.error("Error creating book", error, {
      context: "POST /api/admin/books"
    })
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)

    let query = supabase
      .from("books")
      .select(`
        *,
        book_statistics (
          total_readers,
          completed_readers,
          average_progress
        )
      `)

    // Apply filters
    const search = searchParams.get("search")
    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    const language = searchParams.get("language")
    if (language) {
      query = query.eq("language", language)
    }

    const difficulty = searchParams.get("difficulty")
    if (difficulty) {
      query = query.eq("difficulty_level", difficulty)
    }

    const published = searchParams.get("published")
    if (published !== null) {
      query = query.eq("is_published", published === "true")
    }

    // Apply sorting
    const sort = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"
    query = query.order(sort, { ascending: order === "asc" })

    // Apply pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const start = (page - 1) * limit
    query = query.range(start, start + limit - 1)

    const { data: books, error: queryError, count } = await query

    if (queryError) throw queryError

    return NextResponse.json({
      books,
      total: count,
      page,
      limit
    })
  } catch (error) {
    logger.error("Error fetching books", error, {
      context: "GET /api/admin/books"
    })
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const { error, supabase } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Book ID is required" },
        { status: 400 }
      )
    }

    // Get book cover URL before deletion
    const { data: book } = await supabase!
      .from("books")
      .select("cover_image_url")
      .eq("id", id)
      .single()

    // Delete book cover if exists
    if (book?.cover_image_url) {
      const fileName = book.cover_image_url.split("/").pop()
      if (fileName) {
        await supabase!.storage
          .from("book-covers")
          .remove([fileName])
      }
    }

    // Delete book
    const { error: deleteError } = await supabase!
      .from("books")
      .delete()
      .eq("id", id)

    if (deleteError) throw deleteError

    logger.info("Book deleted", {
      context: "DELETE /api/admin/books",
      metadata: {
        bookId: id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Error deleting book", error, {
      context: "DELETE /api/admin/books"
    })
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    )
  }
}