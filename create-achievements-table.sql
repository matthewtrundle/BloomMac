CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL
);

INSERT INTO achievements (id, name, description, icon, points) VALUES
('first-login', 'Welcome Explorer', 'Started your wellness journey', '🌟', 10),
('first-course', 'Learning Begins', 'Enrolled in your first course', '📚', 20),
('first-workbook', 'Reflection Master', 'Completed your first workbook', '📝', 15),
('course-complete', 'Course Champion', 'Completed an entire course', '🎓', 50),
('appointment-booked', 'Connection Seeker', 'Booked your first appointment', '🤝', 25),
('week-streak', 'Consistency Star', 'Active for 7 days in a row', '🔥', 30);
