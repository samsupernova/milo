// Run this script to migrate default data to Supabase
// Usage: node migrate.js

import { runFullMigration } from './src/services/migration.js';

console.log('Starting Supabase data migration...\n');

runFullMigration()
  .then((result) => {
    if (result.success) {
      console.log('\n✅ Migration completed successfully!');
      process.exit(0);
    } else {
      console.error('\n❌ Migration completed with errors');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
