CREATE TABLE IF NOT EXISTS reflection_comments (
 id uuid PRIMARY KEY,
 slug text NOT NULL,
 language text NOT NULL CHECK (language IN ('fr','en')),
 pseudonym text NOT NULL CHECK (char_length(pseudonym) BETWEEN 2 AND 40),
 body text NOT NULL CHECK (char_length(body) BETWEEN 3 AND 2000),
 quote text NOT NULL DEFAULT '' CHECK (char_length(quote) <= 1000),
 prefix text NOT NULL DEFAULT '',
 suffix text NOT NULL DEFAULT '',
 delete_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reflection_comments_article ON reflection_comments(slug, language, created_at DESC, id);
CREATE TABLE IF NOT EXISTS reflection_comment_limits (
 key text PRIMARY KEY,
 count integer NOT NULL,
 expires_at timestamptz NOT NULL
);
