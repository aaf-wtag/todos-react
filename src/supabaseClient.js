import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcbsfmuzaqhoruplptev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnNmbXV6YXFob3J1cGxwdGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDc0MDI1MzcsImV4cCI6MTk2Mjk3ODUzN30.pH2u_6i7rXkpeNKGr4xH7C1hP7ME3sQlYnAZqsUA3pE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;