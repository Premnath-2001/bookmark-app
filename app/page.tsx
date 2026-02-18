'use client';

import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);
  useEffect(() => {
  if (!user) return;

  fetchBookmarks(); // load once

    const channel = supabase
      .channel(`bookmarks-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
    console.log('REALTIME EVENT:', payload);

    if (payload.eventType === 'INSERT') {
      setBookmarks((prev) => [...prev, payload.new]);
    }

    if (payload.eventType === 'DELETE') {
      setBookmarks((prev) =>
        prev.filter((b) => b.id !== payload.old.id)
      );
    }

    if (payload.eventType === 'UPDATE') {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === payload.new.id ? payload.new : b
        )
      );
    }
  }

      )
      .subscribe((status) => {
          console.log('Realtime status:', status);
        });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);



  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };





  const addBookmark = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('bookmarks')
      .insert({
        title: 'Google',
        url: 'https://google.com',
        user_id: user.id,
      });

    if (error) {
      console.error(error);
      alert('Error adding bookmark');
    } else {
      alert('Bookmark added!');
    }
  };


  const fetchBookmarks = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else {
        setBookmarks(data || []);
      }
    };

  const deleteBookmark = async (bookmarkId: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);

    if (error) {
      console.error(error);
      alert('Error deleting bookmark');
    } else {
      // 🔥 Remove from state immediately
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    }
  };



  return (
    <main style={{ padding: 40 }}>
      {!user ? (
        <button onClick={login}>Login with Google</button>
      ) : (
        <>
          <h2>Welcome, {user.user_metadata?.full_name}</h2>

          <button onClick={addBookmark}>Add Test Bookmark</button>

          <br /><br />

          <button onClick={logout}>Logout</button>
          <h3>Your Bookmarks</h3>

          <ul>
            {bookmarks.map((b) => (
              <li key={b.id}>
                <a href={b.url} target="_blank">
                  {b.title}
                </a>

                {' '}  

                <button onClick={() => deleteBookmark(b.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          

        </>

      )}
    </main>
  );
  

}
