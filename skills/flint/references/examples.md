# Synthetic cases

These examples illustrate reasoning. They are not customer data or evaluation results.

## A small local tool

**Request:** "Scope a local script that lists Markdown files with broken relative links. I can spend two hours reviewing it. No network, no file changes."

**Good next decision:** Proceed with the bounded read-only tool if the engineering limit is also understood, or define the missing limit without blocking already-authorized inspection. Keep the definition short. Test missing files, fragments, spaces and unsupported syntax. Do not design a web service.

**Failure:** writing a deployment architecture and calling it thorough.

## An uncertain agent integration

**Request:** "I want a visual editor view over an agent I use in the terminal, with the same session."

**Good next decision:** Investigate the desired experience and the supported interface separately. "Same session" may mean visible history, actual backend context, working files or active execution ownership. Distinguish them. A renderer with fake responses proves none of the backend claims.

**Failure:** either rejecting the idea because the terminal has chat, or inventing a JSON stream and implementing against it.

## A hard constraint

**Request:** "Build a hosted dashboard, but customer data must never leave their disconnected machine."

**Good next decision:** Rescope to a local/offline surface or Stop the hosted approach unless the owner changes the requirement. The data boundary is not a weak score outweighed by convenience.

**Failure:** quietly adding cloud sync to make the demo work.

## Review before consent

**Request:** "I cannot comfortably inspect a multi-file proposal before approving it. Focus is unclear and resizing seems to free the display."

**Good next decision:** Record the user report; investigate reproduction without assuming the cause. Define a review task with visible controls and accurate proposed/applied states. A supported approval mechanism is separate from the visual design.

**Failure:** treating a cancellation as proof nothing was written, or making a control appear to approve actions without backend support.

## A fresh participant

Give a new reader only the original card and definition. Ask what is decided, what is unknown, and what they may do next. Compare their answer with the approved contract.

Do not claim this independent test happened merely because the author reread the documents.
