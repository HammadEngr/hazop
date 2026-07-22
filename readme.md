# SCOPE

This is a solid three-part structure, Master Hammad — it maps cleanly onto your architecture (perception evaluation, reasoning evaluation, deliverable). A few things worth sharpening before you start building, though, because each task has a different kind of "ground truth" and different effort profile.

### Task 1: Compare LLM-generated nodes vs. real data

This is what we've already been doing — you nodalize P&IDs by hand (applying your rules), and score the VLM's output against it (node/equipment/instrumentation-level F1, as planned). This one's scope is clear and you've already validated the process on one example.

### Task 2: Compare generated HAZOP vs. real HAZOP — this needs a different kind of ground truth

Worth being precise here: your Task 1 ground truth (hand-built nodes) is not the same as what Task 2 needs. Task 2 needs a full expert-reference HAZOP worksheet — causes, consequences, safeguards, recommendations — per P&ID, which is significantly more work to build than nodalization alone.

Two ways to get this:

If your source textbook (Crowl & Louvar) includes worked HAZOP examples for the P&IDs you're using, you may already have expert-authored reference worksheets — check this first, since it saves enormous manual effort.
If not, you (or your supervisor) manually author reference worksheets for a subset of nodes, similar to how Lee et al. (2025) built their expert-prepared reference. Given time constraints, you likely don't need full worksheets for all 10-15 P&IDs — a smaller, carefully done reference set (maybe 3-5 P&IDs) is defensible and matches what published work in this space actually does.

Also worth deciding: are you comparing (a) your rule engine's output vs. reference, (b) raw LLM HAZOP generation vs. reference, or (c) both? Given our last exchange, I'd suggest (c) — this is what actually produces your key thesis result (rule engine outperforms raw LLM generation on validity), not just an isolated accuracy number.

### Task 3: The app — biggest scope question

This is a real, separate engineering deliverable on top of the research work. Given your fullstack background this is very doable, but for a 45-day prototype it's worth scoping the MVP tightly:

Core: upload P&ID → VLM nodalizes → rule engine generates HAZOP → display worksheet
Mode toggle: "LLM-only" vs. "Rule engine" generation — straightforward if you already have both pipelines working from Tasks 1-2
Custom rules/equipment input: this is the part I'd flag as scope-risk — letting users define their own equipment types and rule sets is a meaningfully bigger engineering lift (rule editor UI, validation, schema flexibility) than the rest of the app combined. Worth deciding whether this is MVP or a "future work" mention in your thesis rather than something you build now.

## Stream Roles

### inlet_external

"This is the very first pipe into the whole system, and nothing upstream owns it."
Used only at the true starting point(s) of your process — e.g. N1's crude methanol supply line, coming from outside the modeled boundary. No prior node exists to have already claimed it, so the first node claims it by exception.

### outlet_internal

"This pipe leaves my equipment and feeds directly into another node inside this P&ID."
This is the normal, most common case for equipment in the middle of a process chain — N1's discharge into N2, N3's bottoms into N6, N6's vapor back into N3. Whichever node is upstream on this pipe is the one that lists it, and the downstream node doesn't repeat it.

### outlet_external

"This pipe leaves my equipment and leaves the whole system — it's not going to another node in this diagram."
Used for final destinations — N5's product line to storage, N7's tars line to wherever tars go. Same ownership logic as outlet_internal (the node still owns its own outlet), just marking that there's no downstream node inside the P&ID to hand off to.

utility
"This pipe is a supporting utility, not part of the main process material flow."
Steam in/out, cooling water in/out, nitrogen purge. These sit outside the inlet/outlet ownership chain entirely — a utility line doesn't "belong" to anyone upstream/downstream in the process sense, it's just attached to whichever node uses it. That's why utility connections don't need the internal/external distinction at all — they're always local to the node they serve.
