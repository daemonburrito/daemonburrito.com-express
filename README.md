# A simple Express blog

Build for inspiration and exploring node.js.

Installation and usage is straightforward. One unique feature is the importer in `util`, which can automatically load all markdown files in the `md` directory into the db.

(from the repl)
```
daemonburrito.com > util = require('./util')
{ db: [Function],
  make_pg_constring: [Function],
  refresh_posts: [Function] }
daemonburrito.com > util.refresh_posts()
```

PRs welcome, but this repo is mainly for discussion and exchanging techniques (and putting something pretty on my website, of course).
