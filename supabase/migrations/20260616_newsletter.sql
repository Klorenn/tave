-- Create newsletter table
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Allow anon inserts
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert newsletter" ON newsletter
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated admins can read
CREATE POLICY "Only admins can read newsletter" ON newsletter
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only admins can read contact messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'is_admin' = 'true');
