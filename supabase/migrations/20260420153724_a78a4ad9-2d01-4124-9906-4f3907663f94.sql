-- mood_history: one row per advisor interaction
CREATE TABLE public.mood_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  input_text TEXT,
  advisor TEXT,
  recommendation_summary JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_mood_history_user_created
  ON public.mood_history (user_id, created_at DESC);

ALTER TABLE public.mood_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood history"
  ON public.mood_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood history"
  ON public.mood_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood history"
  ON public.mood_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood history"
  ON public.mood_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);