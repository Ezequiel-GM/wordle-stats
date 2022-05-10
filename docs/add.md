# Add Score
Adds a new Wordle score to your stats, or changes the score you have saved if you've already
provided a score for the given puzzle.

## Command

### `/add [guesses] [puzzle]`

## Options
| Option | Type | Required | Description |
| --- | --- | --- | --- |
| guesses | multiple choice | Yes | The number of guesses it took you to solve the Wordle, or "Unsolved" if you did not solve it. |
| puzzle | integer | No | The unique puzzle number to add a score to. Today's puzzle is used if none is provided. |

## Example Usage

![Add Command Example](images/add-command.jpg)

![Add Response Example](images/add-response.jpg)