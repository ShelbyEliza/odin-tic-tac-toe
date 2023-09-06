# odin-tic-tac-toe

The Odin Project: Tic Tac Toe Game

## Project Structure:

States stored in objects:
Modules for single object instances: Gameboard, Game Flow,
Factory objects: Player (Player1, Player2).

## Considerations:

- Board is 3 x 3.
  - Each square allows for only one marker
  - Tie condition
- Players take turns. Who goes first?
  - Flip a coin
  - Previous Loser
- Controls:
  - Start/Restart button
  - Field to insert player names
  - Coin flip button
- Win condition:
  - Player places 3 markers in a row either **vertically**, **horizontally**, or **across**.
  - Modal pops up:
    - Congratulates winner
    - Restart button
- Players can be:
  - Two users,

### Future Plans:

Create an unbeatable AI using the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax).

Players could be:
One user and one AI or two AIs
