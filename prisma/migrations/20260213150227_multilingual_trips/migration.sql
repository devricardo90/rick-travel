-- Step 1: Add new temporary JSON columns
ALTER TABLE "Trip" ADD COLUMN "title_new" JSONB;
ALTER TABLE "Trip" ADD COLUMN "description_new" JSONB;
ALTER TABLE "Trip" ADD COLUMN "highlights_new" JSONB;

-- Step 2: Migrate existing data to JSON format (PT only, other languages empty for now)
UPDATE "Trip" SET 
  "title_new" = jsonb_build_object('pt', "title", 'en', '', 'es', '', 'sv', ''),
  "description_new" = CASE 
    WHEN "description" IS NOT NULL THEN jsonb_build_object('pt', "description", 'en', '', 'es', '', 'sv', '')
    ELSE NULL
  END,
  "highlights_new" = jsonb_build_object(
    'pt', to_jsonb("highlights"),
    'en', '[]'::jsonb,
    'es', '[]'::jsonb,
    'sv', '[]'::jsonb
  );

-- Step 3: Drop old columns
ALTER TABLE "Trip" DROP COLUMN "title";
ALTER TABLE "Trip" DROP COLUMN "description";
ALTER TABLE "Trip" DROP COLUMN "highlights";

-- Step 4: Rename new columns to original names
ALTER TABLE "Trip" RENAME COLUMN "title_new" TO "title";
ALTER TABLE "Trip" RENAME COLUMN "description_new" TO "description";
ALTER TABLE "Trip" RENAME COLUMN "highlights_new" TO "highlights";

-- Step 5: Make title and highlights NOT NULL (they should have data now)
ALTER TABLE "Trip" ALTER COLUMN "title" SET NOT NULL;
ALTER TABLE "Trip" ALTER COLUMN "highlights" SET NOT NULL;
