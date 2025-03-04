So far, I've planned out the start of the website, getting a simple front end going, and creating a basic backend structure.

I think my next task is to fully flesh out the requirements of the website, and then make sure I have the routes in the backend for each requirement.

04/03/25

I've decided that going for the team bingo requirements straight away is a bit ambitious. I'm going to start with a smaller project, that may actually end up having more users, a solo board bingo so that people can easily create their account goals and update progress. It's a more doable project to start with, that I can add onto later, and has a potential user base of every player rather than just clan/team leaders.

Then, once that project is released and properly hosted, I will continue updating the website to include the team bingo functionality going forward. I'll update the PROJECT_OVERVIEW.md file to reflect this.

I've written out what I believe are the initial requirements for this project:

Solo board

• In the backend, the board will be in a new solo board database table
• Can add a title to the solo board page – e.g. “Usernames 2025 goals”
• Each solo board will have a name and password
• Editing the board will require being logged in
• Homepage
• Users can create a single bingo board with a name and password
• Users can configure the number of tiles
• Tiles are draggable and can be rearranged
• Tiles can be reset
• Users can use an existing board as a template
• Project tile images can be selected from the OSRS wiki
• Project tile names can be selected from the OSRS wiki
• Custom text can be added to project tiles
• Completed team tiles visually change (e.g. green tint and checkmark)
• A percentage completion indicator appears on tiles
• If the user changes the requirements of the tile down, and they have already saved progress to that tile (e.g. it was 5 million xp goal, and they hit 3m already), if the new target is equal or less than the existing xp, their xp will be adjusted down.
• There will be an undo button for tiles if the user did something unintentional.
• If the number of tiles are reduced, any tiles in that row or column that was removed will be removed
• There will be a board undo button if the user made unintentional changes
• Any tiles that have progress on them that are removed because of columns or rows being removed will be added to a “Previous tiles” section, where they can access the tiles they lost. This is so that if a user accidentally removes a row or column, then makes a lot of changes to their board, they don’t have to choose between undoing a lot of changes, or losing tiles they didn’t intend to lose, they can just select that tile again from the lost section.
