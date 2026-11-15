export const inspirationalQuotes = [
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "Dreams" },
  { quote: "All our dreams can come true, if we have the courage to pursue them.", author: "Walt Disney", category: "Courage" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "Motivation" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "Belief" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "Perseverance" },
  { quote: "Dream big and dare to fail.", author: "Norman Vaughan", category: "Dreams" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "Career" },
  { quote: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "Growth" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "Action" },
  { quote: "Your life does not get better by chance, it gets better by change.", author: "Jim Rohn", category: "Change" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "Perseverance" },
  { quote: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "Courage" },
  { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", category: "Achievement" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", category: "Dreams" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "Success" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "Action" },
  { quote: "Act as if what you do makes a difference. It does.", author: "William James", category: "Purpose" },
  { quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar", category: "Growth" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha", category: "Mindset" },
  { quote: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Kindness" },
  { quote: "Don't go through life, grow through life.", author: "Eric Butterworth", category: "Growth" },
  { quote: "If opportunity doesn't knock, build a door.", author: "Milton Berle", category: "Opportunity" },
  { quote: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "Action" },
  { quote: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Perspective" },
]

export function getDailyQuote() {
  const now = new Date()
  const dayIndex = (now.getFullYear() * 365 + now.getMonth() * 31 + now.getDate()) % inspirationalQuotes.length
  return inspirationalQuotes[dayIndex]
}

