import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar: string | null;
          is_online: boolean;
          last_seen: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar?: string | null;
          is_online?: boolean;
          last_seen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          avatar?: string | null;
          is_online?: boolean;
          last_seen?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          content: string;
          sender_id: string;
          recipient_id: string;
          created_at: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          content: string;
          sender_id: string;
          recipient_id: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          content?: string;
          sender_id?: string;
          recipient_id?: string;
          created_at?: string;
          is_read?: boolean;
        };
      };
    };
  };
}

// Auth helpers
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Profile helpers
export const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', (await supabase.auth.getUser()).data.user?.id);
  return { data, error };
};

export const getProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');
  return { data, error };
};

// Message helpers
export const sendMessage = async (content: string, recipientId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      content,
      sender_id: user.id,
      recipient_id: recipientId,
    })
    .select()
    .single();
  
  return { data, error };
};

export const getMessages = async (userId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(name, avatar),
      recipient:profiles!messages_recipient_id_fkey(name, avatar)
    `)
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${user.id})`)
    .order('created_at', { ascending: true });

  return { data, error };
};

// Real-time subscriptions
export const subscribeToMessages = (userId: string, callback: (message: any) => void) => {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id.eq.${userId},recipient_id.eq.${userId}),and(sender_id.eq.${userId},recipient_id.eq.${userId}))`,
      },
      callback
    )
    .subscribe();
};