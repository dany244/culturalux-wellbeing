# Mood-Based Wellbeing Sanctuary Transformation - Approved Plan Breakdown

## Completed: [0/18]

### Phase 1: Core Data & Config [2/2] ✅
- [x] 1. Update src/lib/moods.ts: Added stillness, solitude, courage; updated overwhelmed w/ Stoicism. New MoodId union.
- [x] 2. Update tailwind.config.ts: Added body font (Playfair expert), exact mood colors (calm blue 200 70% 65%, peace 210 80% 70%), fade-dissolve keyframe/anim 1s cinematic.

**Next:** Phase 2 - Home/Index.tsx hero + MoodChipsCarousel.

### Phase 2: Home/Entry Point [3/4] ✅
- [x] 3. src/pages/Index.tsx: Updated hero "What does your spirit seek...", badge. MoodChipsCarousel nav.
- [x] 4. MoodChipsCarousel created.
- [x] 5. Index.tsx: Focus mode (5s inactivity → hide non-hero UI opacity-0/pointer-events-none, hero text changes "Sit with stillness", timer on mousemove/keydown/scroll).

### Phase 3: Results View [3/3] ✅
- [x] 7. Explore.tsx: MoodChips nav, "Literary Remedies" header, mood palette var, whisper, fade-dissolve.
- [x] 8. ContentRow.tsx: Cinematic palette (calm/warm/peace hsl), expert diamond icon/overlay, caption "Read this to...", slow hover scale/anim.
- [x] 9. advisorClient/fetchBooks already mood-aware.

### Phase 6: Polish & Test [1/2] ✅
- [x] 17. index.html: Added Playfair Display Google Fonts preconnect.

**Next:** Phase 5 Dashboard enhancements, final test bun dev.

### Phase 5: Dashboard & Extras [0/5]
- Create JournalModal for "Record a Thought" → MoodContext saveInteraction
- Wisdom Map: group history by mood hours/total
- Curator suggestions top mood → book-search "Resilience collection"
- Sanctuary auto-pairing sound/visuals
- Test all: bun dev, mood flow, APIs, responsive, focus modes, expert overlays

### Phase 3: Results View [3/3]
- [ ] 7. src/pages/Explore.tsx: Mood chips nav trigger, cards w/ palette (blue/amber via mood.accent), 1s fade anims, task examples (Letters..., Norwegian Wood)
- [ ] 8. src/components/ContentRow.tsx: Add mood-based cinematic bg/color
- [ ] 9. Ensure advisorClient.ts uses mood for dynamic recs

### Phase 4: Expert Insight [2/2]
- [ ] 10. Create src/components/ExpertInsight.tsx: Diamond/i icon → overlay dialog, serif templates ("Our cultural experts...")
- [ ] 11. Integrate into Explore/ContentRow cards

### Phase 5: Dashboard & Extras [5/5]
- [ ] 12. src/pages/Dashboard.tsx: Wisdom Map (group saved by mood), Journaling button/modal
- [ ] 13. Dashboard: Curator suggestions ("Since seeking Courage...") via book-search
- [ ] 14. src/pages/Sanctuary.tsx/App.tsx: Auto-pairing visuals/sound (extend CinematicBackground)
- [ ] 15. Create src/components/JournalModal.tsx: Note input → MoodContext

### Phase 6: Polish & Test [2/2]
- [ ] 16. Global: Serif (Playfair) for literary/UI sans-serif, slow transitions
- [ ] 17. index.html: Add Playfair Google Fonts
- [ ] 18. Test: bun dev, mood flow, APIs, responsive

**Next:** Phase 1.1 - Update moods.ts then tailwind.

**Legend:** Mark [x] when done. Updates tracked here.

