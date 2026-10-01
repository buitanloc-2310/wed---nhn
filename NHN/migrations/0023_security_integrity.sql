-- P3 security/integrity hardening. Additive only: safe for existing databases.
ALTER TABLE exam_attempts ADD COLUMN deadline_at TEXT;
ALTER TABLE exam_attempts ADD COLUMN last_activity_at TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_exam_answers_attempt_question ON exam_answers(attempt_id,question_id);
CREATE INDEX IF NOT EXISTS idx_attempt_deadline ON exam_attempts(status,deadline_at);
UPDATE exam_attempts SET deadline_at=datetime(started_at,'+'||(SELECT duration_minutes FROM exams WHERE exams.id=exam_attempts.exam_id)||' minutes') WHERE deadline_at IS NULL;
UPDATE exam_attempts SET last_activity_at=COALESCE(submitted_at,started_at) WHERE last_activity_at IS NULL;
