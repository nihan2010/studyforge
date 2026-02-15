const QUOTES = [
  'Small steps every day lead to big results.',
  'The expert in anything was once a beginner.',
  'Discipline is choosing between what you want now and what you want most.',
  'Study hard, dream big.',
  'Your future is created by what you do today.',
  'Consistency beats intensity.',
  'Learn from yesterday, live for today, hope for tomorrow.',
  'The only way to do great work is to love what you study.',
  'Success is the sum of small efforts repeated day in and day out.',
  'Today’s preparation determines tomorrow’s achievement.',
  'Don’t watch the clock; do what it does. Keep going.',
  'The secret of getting ahead is getting started.',
  'Quality is not an act, it is a habit.',
  'You don’t have to be great to start, but you have to start to be great.',
  'The best time to plant a tree was 20 years ago. The second best time is now.',
];

export function getQuoteOfTheDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const now = new Date();
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}
