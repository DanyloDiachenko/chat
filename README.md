# Setup Instructions

Use 'yarn' (if you're using 'npm', replace 'yarn' with 'npm' in the global package.json scripts).
Run the following in your terminal to install dependencies:
- yarn install
- yarn postinstall
- yarn start

This will automatically start both the server and client.
The server will be available at localhost:3005, and the client at localhost:3000.

## Important Notes
- User data is stored in localStorage. Use different browsers to chat with different users.
- Spam bot starts sending messages with random intervals between 10 and 120 seconds while the user stays in the chat with the Spam Bot.
- A user can be disconnected if they close localhost:3000.
- After restarting the project, the user list will reset to an empty array (except for bots).
- Other features work as specified in the technical task and do not require further explanation.
