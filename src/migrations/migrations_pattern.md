To avoid using any more dependencies/outside libraries then needed, and for the sake of simplicity, migrations will be done by hand.

Steps:

1. Write the migration in migrations/ (.sql) Timestamp with descriptive name
2. Run the migration using psql
3. Insert log of migration in MIGRATIONS (following pattern)

Just record .ups, in the event that a .down is needed (revert a migration), one can be written off of the log.
