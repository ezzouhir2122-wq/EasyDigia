-- Migration: create blog_scheduler table
-- Apply this in the Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS blog_scheduler (
  id           INTEGER PRIMARY KEY DEFAULT 1,
  theme_index  INTEGER NOT NULL DEFAULT 0,
  last_run_at  TIMESTAMPTZ,
  last_slug    TEXT,
  last_title   TEXT,
  run_count    INTEGER NOT NULL DEFAULT 0
);

-- Single row initialized (id=1 constraint ensures only one row)
INSERT INTO blog_scheduler (id, theme_index, run_count)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;
