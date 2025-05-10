// parse time string or object into minutes
export const parseTime = (timeValue) => {

  //for the stacked bar charts 
  //if the time value is an object and has a minutes property, return the minutes
  if (typeof timeValue === 'object' && timeValue !== null && 'minutes' in timeValue) {
    return timeValue.minutes;
  }

  //if the time value is an object and has a hours property, return the hours * 60
  if (typeof timeValue === 'object' && timeValue !== null && 'hours' in timeValue) {
    return timeValue.hours * 60;
  }

  //if the time value is a string, split it into a value and unit, and return the value * 60 if the unit is minutes, or the value if the unit is hours
  if (typeof timeValue === 'string') {
    const [value, unit] = timeValue.split(" ");
    const numValue = parseFloat(value);

    if (unit.startsWith("min")) {
      return numValue;
    } else if (unit.startsWith("hr")) {
      return numValue * 60;
    }
  }
  
  return 0;
};

// calculate height percentage for stacked bars
export const calculateHeight = (minutes, totalMinutes) => {
  return totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0;
};

// convert db focus level format to UI format
export const getFocusLevel = (level) => {
  if (level === 'lowFocus') return 'low';
  if (level === 'mediumFocus') return 'medium';
  if (level === 'highFocus') return 'high';
  return level;
};

//get the date for a specific day in the week
export const getDateForDay = (baseDate, dayIndex) => {
  const date = new Date(baseDate);
  const diff = dayIndex - date.getDay();
  date.setDate(date.getDate() + diff);
  return date;
};

//format date to match database date format (YYYY-MM-DD)
export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

//format week range for display
export const formatWeekRange = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

//group tasks by date and calculate focus level totals
export const groupTasksByDate = (tasks) => {
  return tasks.reduce((acc, task) => {
    const taskDate = task.date.split('T')[0];
    if (!acc[taskDate]) {
      acc[taskDate] = { high: 0, medium: 0, low: 0 };
    }
    const minutes = parseTime(task.time);
    const uiFocusLevel = getFocusLevel(task.focusLevel);
    acc[taskDate][uiFocusLevel] += minutes;
    return acc;
  }, {});
};

//calculate maximum total minutes for a set of tasks
export const calculateMaxTotalMinutes = (tasksByDate) => {
  return Math.max(
    ...Object.values(tasksByDate).map(dayTasks =>
      Object.values(dayTasks).reduce((sum, mins) => sum + mins, 0)
    ),
    60 //minimum value to prevent division by zero and too small bars
  );
}; 