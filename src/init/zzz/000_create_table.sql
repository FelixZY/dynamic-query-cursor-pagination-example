CREATE EXTENSION pg_trgm;

CREATE EXTENSION postgis;

CREATE TABLE people (
  id VARCHAR(21) PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position GEOGRAPHY (POINT, 4326) NOT NULL
);

CREATE INDEX name_trgm_idx ON people USING GIN (name gin_trgm_ops);

CREATE INDEX age_idx ON people (age);

CREATE INDEX position_geo_idx ON people USING GIST (position);
