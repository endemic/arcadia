# TODO

[ ] Draw bridges correctly; i.e. one line per bridge
[ ] Allow user to draw a second bridge between islands
[ ] Program a "win" condition
[ ] "you win" effect - bridges disappear, islands grow, then shrink to nothing,
	generating a particle effect when they disappear
[ ] Some kind of level editor

[ ] How to associate a bridge with an island?
	* A graph?
[x] How to clear bridges?
	* Could we have an invisible hitbox between islands?
[ ] Determine how to find out if a puzzle is cleared or not
	* Store how many bridges lead out from an island
[ ] Don't allow drawing lines from an island if it already has the max # of bridges

# Rules

Bridges can only connect at 90deg angles.
There can be a max of two bridges between each island
Bridges can't overlap

## Brainstorm

The "active bridge" is just a line used for display; after a successful bridge
placement, it disappears and a static bridge object is placed, with a decent-sized
hitbox. Can then easily prevent overlapping, due to AABB intersection checking.
Tapping the bridge hitbox will remove a strand of the bridge. A bridge will also
be prevented from being built if it collides with an island in the middle.

(So bridges can only connect if they're the same X or Y coordinates. If X coords
are the same, then it's a vertical bridge. If Y coords are the same, then it's
a horizontal bridge.)

How to store the game's state? A bridge object will store what two islands it
is connecting. When the bridge is placed, the two islands will increase their
internal counter. When the bridge is removed, the two islands will decrease the
counter.

How to check for completion? I guess technically it's a graph, so could iterate
through all the placed bridges and ensure that the ID of each island was
referenced at least once.
