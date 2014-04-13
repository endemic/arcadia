* JS strings are immutable, so any sort of string manipulation within the game loop
  (such as storing individual RGB color values then joining them together for each draw
  call) is a Bad Idea in terms of memory use/garbage collection