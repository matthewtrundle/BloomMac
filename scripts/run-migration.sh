#!/bin/bash

# Load environment variables from .env.local
export $(cat .env.local | grep -v '^#' | xargs)

# Run the migration script
node scripts/migrate-course-content-to-db.js