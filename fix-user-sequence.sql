-- Fix the users table ID sequence after manual inserts
-- Run this in Supabase SQL Editor

-- Reset the sequence to start after the highest existing ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Verify the fix
SELECT nextval('users_id_seq') as next_id;

-- This should show 9 (or higher if you have more users)
