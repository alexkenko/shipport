import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current message count before cleanup
    const { data: beforeCount, error: countError } = await supabase
      .rpc('get_chat_message_count');

    if (countError) {
      console.error('Error getting message count:', countError);
    }

    // Run the cleanup function
    const { error: cleanupError } = await supabase
      .rpc('cleanup_old_chat_messages');

    if (cleanupError) {
      console.error('Error cleaning up messages:', cleanupError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: cleanupError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get message count after cleanup
    const { data: afterCount } = await supabase
      .rpc('get_chat_message_count');

    const deletedCount = (beforeCount || 0) - (afterCount || 0);

    console.log(`Chat cleanup completed. Deleted ${deletedCount} messages.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        deletedCount,
        beforeCount: beforeCount || 0,
        afterCount: afterCount || 0,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
