-- Migration: Dashboard Statistics Function
-- Purpose: Optimized function to calculate all user reading statistics in a single query
-- Agent 2 (Performance): Reduces multiple queries to one efficient database function
-- Created: 2025-01-24

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_reading_stats(UUID);

-- Create optimized statistics function
CREATE OR REPLACE FUNCTION get_user_reading_stats(p_user_id UUID)
RETURNS TABLE (
  total_books INT,
  completed_books INT,
  total_pages INT,
  total_reading_time INT,
  books_this_week INT,
  pages_this_week INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_books AS (
    SELECT 
      ul.book_id,
      ul.status,
      ul.current_page,
      ul.updated_at,
      b.total_pages
    FROM user_library ul
    LEFT JOIN books b ON b.id = ul.book_id
    WHERE ul.user_id = p_user_id
  ),
  reading_data AS (
    SELECT
      rs.pages_read,
      rs.duration_minutes,
      rs.created_at
    FROM reading_sessions rs
    WHERE rs.user_id = p_user_id
  )
  SELECT
    -- Total books in library
    COUNT(DISTINCT ub.book_id)::INT AS total_books,
    
    -- Completed books (100% progress or status = completed)
    COUNT(DISTINCT CASE 
      WHEN ub.status = 'completed' 
      THEN ub.book_id 
    END)::INT AS completed_books,
    
    -- Total pages read across all books
    COALESCE(SUM(ub.current_page), 0)::INT AS total_pages,
    
    -- Total reading time in minutes
    COALESCE(SUM(rd.duration_minutes), 0)::INT AS total_reading_time,
    
    -- Books read this week (updated in last 7 days)
    COUNT(DISTINCT CASE 
      WHEN ub.updated_at >= NOW() - INTERVAL '7 days' 
      THEN ub.book_id 
    END)::INT AS books_this_week,
    
    -- Pages read this week
    COALESCE(SUM(CASE 
      WHEN rd.created_at >= NOW() - INTERVAL '7 days' 
      THEN rd.pages_read 
      ELSE 0 
    END), 0)::INT AS pages_this_week
    
  FROM user_books ub
  CROSS JOIN reading_data rd;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_reading_stats(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION get_user_reading_stats(UUID) IS 
'Calculates comprehensive reading statistics for a user including total books, completed books, pages read, reading time, and weekly activity. Optimized for dashboard performance.';

-- Create index on reading_sessions for better performance
CREATE INDEX IF NOT EXISTS idx_reading_sessions_user_created 
ON reading_sessions(user_id, created_at DESC);

-- Create index on user_library for better performance
CREATE INDEX IF NOT EXISTS idx_user_library_user_updated 
ON user_library(user_id, updated_at DESC);

-- Test the function (optional - comment out in production)
-- SELECT * FROM get_user_reading_stats('00000000-0000-0000-0000-000000000000');
