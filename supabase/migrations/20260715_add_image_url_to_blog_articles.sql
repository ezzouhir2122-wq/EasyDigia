-- Migration: add image_url column to blog_articles
-- Apply in Supabase Dashboard → SQL Editor

ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS image_url TEXT;
