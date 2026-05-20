Corrections for the next batch (I will correct this one manually).

- If the only version of the game is itself, there's no need to include it in versions.
- The relationships relate to the game it's related to, not itself. For example, in `princess-peach-showtime`:

```json
  {
                "source": "super-princess-peach",
                "type": "spiritual_successor"
            }
```

Should be `spiritual_predecessor`, as in Super Princess Peach is a spiritual predecessor to Princess Peach Showtime!.

- Reasons are... Odd. It should be a reason as to why I should even consider the game. `luigis-mansion-3ds` `"reason": "Owned remake of the original Luigi's Mansion."` <- This is nothing.
- Adding the `base` in relationships is redundant since that relationship is already contained in `versions`.
- If there is 2 versions of the same game, include both as prequels or sequels in the games that are those.
- If the games are in the same series but not direct prequels/sequels, do not include a relationship. Dr. Mario is not a prequel do Miracle Cure, there are a bunch of other games in between.
