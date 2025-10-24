-- Create quiz_answers table to store user answers and explanations
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id INTEGER NOT NULL REFERENCES pathways(id),
  question_id INTEGER NOT NULL,
  user_answer INTEGER NOT NULL,
  correct_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own quiz answers" ON quiz_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz answers" ON quiz_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
