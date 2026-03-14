CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  content VARCHAR(250) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO messages (content)
VALUES
  ('Pierwsza wiadomosc z bazy danych'),
  ('Druga wiadomosc - stack dziala!');
