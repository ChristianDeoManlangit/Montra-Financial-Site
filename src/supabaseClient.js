import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcrgdaizaofjpwkdbcwo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcmdkYWl6YW9manB3a2RiY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjkyMjgsImV4cCI6MjA4MDMwNTIyOH0.iwQsd78L6ZVQScWVqSU3yfQKpT9gQgjXEUiO401eJkU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
