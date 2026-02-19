# Bookmark App

A simple real-time Bookmark Application built using Next.js, Supabase, and Google Authentication, and deployed on Vercel.

This project helped me understand full-stack development, authentication, real-time data handling, and deployment.

# Live Demo

# Live URL:
https://bookmark-app-flax.vercel.app

# Tech Stack

Next.js – Frontend framework

Supabase – Authentication, Database & Realtime

Google OAuth – Login with Google

Vercel – Deployment

GitHub – Version control

# Features

Google Login Authentication

Add bookmarks

Delete bookmarks

Realtime updates across multiple tabs

User-specific data

Deployed with a live URL

# Problems Faced & Solutions

This project was challenging as a beginner. Below are the real problems I faced and how I solved them.

🔴 Problem 1: Bookmarks did not update in real time across tabs

Issue:
When I added or deleted a bookmark in one browser tab, the change did not appear in another tab until the page was refreshed.

Cause:
The Supabase Realtime subscription was created before the user authentication session was fully ready.

Solution:

Waited for the authentication session using onAuthStateChange

Subscribed to Supabase Realtime only after the user session was available

Updated React state directly using realtime events (INSERT & DELETE)

✅ Result:
Bookmarks now update instantly across all open tabs without refresh.

🔴 Problem 2: Realtime worked locally but not after deployment (Vercel)

Issue:
Realtime features worked on localhost but failed silently on the live site.

Cause:
Required environment variables were missing in the Vercel project settings.

Solution:

Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel

Redeployed the project after adding variables

✅ Result:
Realtime and authentication now work correctly in production.

🔴 Problem 3: Supabase Realtime did not detect table changes

Issue:
Database changes were not triggering realtime updates.

Cause:
The bookmarks table was not enabled in Supabase Realtime.

Solution:

Enabled the bookmarks table in supabase_realtime publication

Allowed INSERT, DELETE, and UPDATE events

✅ Result:
Supabase now broadcasts all bookmark changes correctly.

🔴 Problem 4: UI did not update properly after add or delete

Issue:
The bookmark list sometimes appeared unordered or out of sync.

Cause:

Missing ordering while fetching data

State relied only on refetching instead of realtime payloads

Solution:

Added order('created_at') while fetching bookmarks

Updated state directly using realtime event data

Used unique keys in React rendering

✅ Result:
UI updates smoothly and stays consistent.

🔴 Problem 5: User session lost after page refresh

Issue:
After refreshing the page, the user was logged out.

Cause:
Authentication state was fetched only once and not synced properly.

Solution:

Used supabase.auth.getSession()

Listened to authentication changes using onAuthStateChange

✅ Result:
User session now persists across page reloads.

🔴 Problem 6: Google Login worked locally but failed on live site

Issue:
Google login worked on localhost but not after deployment.

Cause:
Incorrect OAuth configuration.

Solution:

Added Vercel live URL in Google Cloud Console → Authorized Origins

Added Supabase callback URL in Redirect URIs

Updated Site URL in Supabase Auth settings

✅ Result:
Google login works correctly on the live site.

# Installation (Local Setup)
git clone https://github.com/Premnath-2001/bookmark-app.git
cd bookmark-app
npm install
npm run dev


# What I Learned

How Google OAuth authentication works

How Supabase Realtime works internally

How environment variables work in local and production

How to deploy a Next.js app on Vercel

How to debug real-time and auth issues

How to manage GitHub and deployment workflows

🟢 Final Outcome

Fully real-time bookmark synchronization

Secure user authentication using Google

Clean UI with predictable state updates

Successfully deployed with a live URL

Production-ready beginner full-stack project

# Author

Premnath A
