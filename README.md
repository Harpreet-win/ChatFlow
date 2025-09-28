Thanks for letting me know you're using Supabase! I'll tailor the README to reflect that ChatFlow uses Supabase for its backend database and authentication, replacing MongoDB and custom JWT logic from the previous version. Below is an updated README for your GitHub repository `Harpreet-win/ChatFlow`, assuming Supabase handles the database, authentication, and possibly real-time features.

# ChatFlow


ChatFlow is a modern, open-source chat application designed for seamless real-time communication. Built with Supabase for backend services, it offers a scalable and secure solution for messaging, group chats, and media sharing. Whether you're creating a personal chat app or integrating chat functionality into your platform, ChatFlow provides a flexible and developer-friendly foundation.

## Features

- **Real-time Messaging**: Instant message delivery using Supabase Realtime subscriptions.
- **User Authentication**: Secure login and registration powered by Supabase Auth.
- **Group Chats**: Create and manage group conversations with multiple participants.
- **Media Sharing**: Upload images and files to Supabase Storage.
- **Responsive Design**: Fully responsive UI for desktop, tablet, and mobile devices.
- **Search and History**: Search through chat history stored in Supabase's PostgreSQL database.
- **Push Notifications**: Real-time updates for new messages via Supabase Realtime.

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Realtime, Storage)
- **Real-time**: Supabase Realtime
- **Styling**: Tailwind CSS
- **Deployment**: Vercel for frontend, Supabase for backend services

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account and project (set up at [app.supabase.com](https://app.supabase.com))
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Harpreet-win/ChatFlow.git
   cd ChatFlow
   ```

2. Install dependencies:
   ```
   npm install
   ```
   Or if using Yarn:
   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these in your Supabase project dashboard under **Settings > API**.

4. Set up the Supabase database:
   - Create tables for users, messages, and groups (example schema below).
   - Enable Row Level Security (RLS) for secure data access.
   - Enable Supabase Realtime for the `messages` and `groups` tables.

   **Example Schema** (run in Supabase SQL Editor):
   ```sql
   -- Users table (managed by Supabase Auth, but can reference)
   CREATE TABLE profiles (
       id UUID REFERENCES auth.users(id),
       username TEXT UNIQUE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Messages table
   CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       sender_id UUID REFERENCES auth.users(id),
       group_id UUID REFERENCES groups(id),
       content TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Groups table
   CREATE TABLE groups (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Group members
   CREATE TABLE group_members (
       group_id UUID REFERENCES groups(id),
       user_id UUID REFERENCES auth.users(id),
       joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       PRIMARY KEY (group_id, user_id)
   );

   -- Enable Realtime
   ALTER TABLE messages ENABLE REPLICA;
   ALTER TABLE groups ENABLE REPLICA;
   ```

5. Start the development server:
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Build for Production

1. Build the frontend:
   ```
   npm run build
   ```

2. Deploy to Vercel or your preferred platform, ensuring the Supabase environment variables are configured.

## Usage

1. **Register/Login**: Use Supabase Auth for sign-up (`/register`) or login (`/login`) via email, OAuth, or magic links.
2. **Start Chatting**: Access the dashboard to create or join group chats.
3. **Send Messages**: Type in the input field and hit Enter. Messages sync in real-time via Supabase Realtime.
4. **Manage Groups**: Use the sidebar to create groups and invite users by their username or ID.
5. **Upload Files**: Drag and drop files into the chat to upload to Supabase Storage.

For API details, refer to the [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript) or explore the `/api/docs` endpoint for custom routes.

**Example Supabase Query** (JavaScript):
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// Send a message
async function sendMessage(groupId, content, userId) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ group_id: groupId, content, sender_id: userId }]);
  if (error) console.error(error);
  return data;
}
```

## Project Structure

```
ChatFlow/
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-based pages
│   ├── lib/             # Supabase client setup and utilities
│   └── styles/          # Tailwind CSS and custom styles
├── .env.example         # Environment template
├── supabase/            # Supabase migrations and schema files
├── README.md            # This file
└── package.json
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'Add amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

### Guidelines
- Use ESLint and Prettier for code formatting.
- Test Supabase queries and RLS policies thoroughly.
- Update Supabase schema migrations if needed.

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Supabase](https://supabase.com) for database, auth, and real-time features.
- Built with ❤️ by Harpreet-win.

---

### Notes
- Since the original GitHub page lacked a description, I assumed ChatFlow is a chat application and tailored the README to use Supabase for database, authentication, storage, and real-time features.
- If you have specific features, a different tech stack, or additional details (e.g., specific frontend frameworks or deployment platforms), please share, and I can refine the README further.
- The Supabase schema provided is a starting point. You may need to adjust it based on your app's requirements.
- If you want me to generate a chart (e.g., for project stats) or analyze specific GitHub data, let me know!
