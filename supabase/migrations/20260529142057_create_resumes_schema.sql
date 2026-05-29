/*
  # AI Resume Builder - Initial Schema

  ## New Tables

  ### resumes
  Stores all user-created resumes with full JSON content.
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users)
  - `title` (text) - Resume title/name
  - `template` (text) - Template ID (minimal, modern, dark)
  - `accent_color` (text) - User selected accent color
  - `font` (text) - Selected font family
  - `content` (jsonb) - Full resume data (personal, education, experience, etc.)
  - `ats_score` (integer) - Computed ATS score 0-100
  - `is_public` (boolean) - Whether resume is publicly shareable
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on resumes
  - Users can only read/write their own resumes
*/

CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Resume',
  template text NOT NULL DEFAULT 'minimal',
  accent_color text NOT NULL DEFAULT '#6366f1',
  font text NOT NULL DEFAULT 'inter',
  content jsonb NOT NULL DEFAULT '{}',
  ats_score integer NOT NULL DEFAULT 0,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_updated_at_idx ON resumes(updated_at DESC);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
