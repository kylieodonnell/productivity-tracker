-- truncate table to avoid conflicts
TRUNCATE TABLE tasks;

-- import csv data
\copy tasks(id, date, focuslevel, description, time) FROM 'tasks.csv' WITH CSV HEADER;

-- reset the sequence to the maximum id
SELECT setval('tasks_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM tasks)); 