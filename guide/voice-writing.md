---
title: Voice and writing
order: 160
summary: How Saga product copy sounds, the casing and control rules, numbers, dates and times, empty states, errors, confirmations, and the vocabulary.
---

Saga's screens are read by site coordinators, tutors and district admins who
know their rosters and schedules and are in the middle of doing something.
Copy exists to let them act. The one rule, from which the rest follows:

> Say what the reader needs in order to act. Then stop.

The failure mode to watch for is an essay voice: clause-stacked sentences
that explain a mechanism the reader cannot change. Write that explanation as
a code comment. Do not ship the comment.

## Casing

- **Field labels: Title Case.** "Session Title", "Tutoring Period",
  "Student ID".
- **Everything else: sentence case.** Headings, buttons, tabs, body copy,
  chips. "Add period", "Show bulk actions", "Overall summary".
- Product nouns are lowercase in running text (program, period, pod) unless
  they begin a sentence or name a specific thing ("Period 2", "Demo Program
  08/17").
- Spell out an abbreviation the first time on a screen, then use it. "ID",
  "AM", "PM" and "SSO" need no expansion.

The current dashboard still carries some Title Case buttons ("Add Student",
"Upload Roster"). New work uses sentence case; existing screens change as
they are touched.

## Controls

Buttons and links say what will happen, as a plain verb, optionally with
the noun:

| Do | Don't |
|---|---|
| Save | OK, Submit, Done |
| Delete session | Yes, I'm sure |
| Continue to pods | Looks right, continue |
| Start first sync | Run the first sync |
| Add student | Add new student record |
| Upload roster | Import |

- Cancel is always "Cancel". The destructive confirm names the thing:
  "Cancel this session?" with "Never mind" and "Yes, cancel this session".
- Toggles name what they hide, and the pair matches: "History" / "Hide
  history", not "Digests" / "Close".
- Only show a control when it does something. A "Re-check" next to a result
  that already resolved is noise.
- Icon-only controls get a label that is the action, not the icon: "Edit
  student", not "Pencil".

## Headings

Never repeat a heading. The top bar already names the program; the tab names
the view; a card heading names its contents. A page that opens with its own
`<h2>` saying the same thing as the tab has said nothing twice before the
reader reaches anything useful. Within a card titled "Questions", the first
paragraph does not announce that these are the questions.

Section headings inside a page are fine. Headings that restate the one above
them are not.

## No internal identifiers

Issue numbers, table names, service names, flag names and environment
variables never appear in the UI. "sis-api returned 403" becomes "Saga could
not reach the roster service. Try again in a minute, or contact your Saga
contact." The identifier belongs in the log line, the commit and the PR.

## Numbers, dates and times

- Digits for everything countable: "2 students", "18 sessions", "1 of 55".
  Spell out nothing except "one" in prose where a digit would look like a
  typo ("one more step").
- Counts pair with the noun and the noun agrees: "1 session", "2 sessions".
  "No sessions" rather than "0 sessions" in prose; a stat card may show "0".
- Percentages: "0%", "84%", no space, no decimals unless the comparison needs
  them.
- Dates: weekday and short month when there is room, "Tue, Dec 9"; "Oct 9 –
  Oct 13, 2026" for a range; numeric "10/12/2026" only inside an input.
- Times are 12-hour with AM and PM in capitals and a space: "8:34 PM",
  "4:30 AM". No leading zero, no seconds.
- A time range uses a spaced en dash and says the period once when both ends
  share it: "8:00 – 8:50 AM", "12:30 – 1:30 PM". When they differ, both:
  "11:45 AM – 12:15 PM".
- Durations are compact: "50m", "1h 15m" in tight spaces such as a table
  cell or a readout; "50 min", "1 hr 15 min" in a picker list where there is
  room to read.
- Never format a wall-clock time by hand in code; use the shared time
  formatter so the program's time zone and the viewer's agree.
- "this day", not "today", when the day in question is the one being edited
  and may not be today.

## Empty states

An empty state says what is empty and offers the one thing that fills it.
One sentence, then one action.

| Do | Don't |
|---|---|
| No students yet. Add a student or upload a roster. | There is currently no data to display. |
| No sessions this day. | Nothing here! |
| No responses received. | 0 submissions found for the selected survey criteria. |

No illustrations, no exclamation marks, no apology. If the emptiness is
expected (a new program), say so plainly; if it is a problem (students left
in no pod after a sync), that is a notice, not an empty state.

## Errors

An error names what went wrong and what to do, in that order, in one or two
sentences. It does not explain why the system works the way it does.

Shape: **what happened** + **what to do** (+ **who to ask** if there is no
remedy).

| Do | Don't |
|---|---|
| Enter a time after 4:00 AM. | Invalid time. |
| This student is already in Pod 3 this period. Remove from Pod 3? | Conflict detected (WS-44). |
| Saga could not save the session. Try again. | An unexpected error occurred while persisting the session entity. |
| This district is already configured. Contact Adam before continuing. | This district is already configured. |

Field errors sit under the field. Form errors sit at the top of the form.
Neither is a toast.

## Warnings and confirmations

A warning names the consequence and the remedy together. A warning that only
raises alarm leaves the reader stuck.

> Saving adds Chicago Public Schools to the nightly sync. You can pause the
> sync on the Clever tab.

A confirmation is a question, the one fact the reader needs, and two
buttons:

> **Cancel this session?**
> Students will be marked as not meeting on Tue, Jan 14. Cancellations are
> reversible.
> [Never mind] [Yes, cancel this session]

Name the off-screen thing concretely: "also in another pod this period",
never "rotation conflict". The remediation idiom is "remove from
<scope>?" where the scope is the link: "remove from Rotation 2?".
Confirmations of the last step go where the reader just acted, not inside the
next step's card.

## Vocabulary

Use these words and no synonyms. Each is user-facing; the backend may call it
something else.

| Word | Means | Not |
|---|---|---|
| district | the customer organisation; the nav footer | organisation, org, tenant |
| site | a school within a district | school (except in a proper name), campus |
| program | a tutoring program at a site, the unit the nav selects | course, class |
| period | a block of the school day a program meets in ("Period 2") | block, slot |
| day type | a schedule variant ("Regular", "Advisory") | schedule type, bell schedule |
| session | one meeting of a pod on one day | class, lesson, meeting |
| pod | a tutor with their students for a period | group (reserved), cohort, section |
| group | a set of pods within a period that share a rotation | cohort (backend), cluster |
| tutor | the adult leading a pod | host, teacher, instructor |
| student | a learner on the roster | kid, participant, learner |
| roster | the list of students, tutors and admins in a program | people, enrollment list |
| drop-in student | a student added to one session only | ad-hoc student, guest |
| unscheduled session | a session outside the schedule | ad-hoc session, one-off |
| observe | watch a live session without joining | monitor, spectate |
| glows and grows | coaching feedback: strengths and areas to improve | pros and cons, feedback |

## Review checklist

- Does any heading repeat the one above it?
- Is any idea stated more than once on the screen?
- Does every warning name a remedy, or a person to ask?
- Any issue numbers, table names, env vars or service names visible?
- Does every button say what will happen, in plain words?
- Could any sentence lose its second clause and still be actionable?
- Are times 12-hour with AM/PM, ranges en-dashed, durations compact?
- Does the copy use the vocabulary table's word, not a synonym?
