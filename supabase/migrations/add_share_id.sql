ALTER TABLE quotations ADD COLUMN IF NOT EXISTS share_id text;

CREATE INDEX IF NOT EXISTS idx_quotations_share_id ON quotations(share_id);

UPDATE quotations
SET share_id = data->>'share_id'
WHERE share_id IS NULL AND data->>'share_id' IS NOT NULL;
