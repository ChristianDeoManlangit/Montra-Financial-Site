const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bcrgdaizaofjpwkdbcwo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcmdkYWl6YW9manB3a2RiY3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjkyMjgsImV4cCI6MjA4MDMwNTIyOH0.iwQsd78L6ZVQScWVqSU3yfQKpT9gQgjXEUiO401eJkU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Backend Connection...\n');

  try {
    // Test 1: Connection test
    console.log('✅ Step 1: Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
      .limit(1);
    
    if (testError) {
      console.log('⚠️  Note: Initial query may fail if table needs setup');
    } else {
      console.log('✅ Supabase connection successful!\n');
    }

    // Test 2: Create sample account
    console.log('✅ Step 2: Creating sample test account...');
    const timestamp = Date.now();
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = 'TestPassword123!@#';

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (authError) {
      console.log(`❌ Auth Error: ${authError.message}`);
      return;
    }

    console.log(`✅ Sample account created successfully!`);
    console.log(`   📧 Email: ${testEmail}`);
    console.log(`   🔑 Password: ${testPassword}`);
    console.log(`   👤 User ID: ${authData.user?.id}\n`);

    // Test 3: Create user profile
    console.log('✅ Step 3: Creating user profile...');
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user?.id,
        email: testEmail,
        full_name: 'Test User',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);

    if (profileError) {
      if (profileError.code === '42P01') {
        console.log('⚠️  Users table not found - this is expected on first setup');
      } else {
        console.log(`⚠️  Profile creation note: ${profileError.message}`);
      }
    } else {
      console.log('✅ User profile created successfully!\n');
    }

    // Test 4: Sign in with the new account
    console.log('✅ Step 4: Testing sign-in with new account...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.log(`❌ Sign-in Error: ${signInError.message}`);
      return;
    }

    console.log('✅ Sign-in successful!');
    console.log(`   🔓 Session Token (first 50 chars): ${signInData.session?.access_token.substring(0, 50)}...\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('�� BACKEND CONNECTION TEST COMPLETED! 🎉');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('✅ Summary:');
    console.log(`   • Supabase connection: Working ✓`);
    console.log(`   • Test account created: ✓`);
    console.log(`   • User ID: ${authData.user?.id}`);
    console.log(`   • Authentication: Working ✓\n`);
    console.log('📝 Test Account Credentials:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}\n`);
    console.log('🎯 Next Steps:');
    console.log('   1. Use these credentials to log in to the app');
    console.log('   2. Create wallets and transactions');
    console.log('   3. Test all features\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testConnection();
