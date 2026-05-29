import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles, X, Loader2, FileText, Wand2 } from 'lucide-react';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

const suggestions = [
  "Generate a professional summary for a software engineer",
  "Suggest skills for a product manager role",
  "Improve my work experience descriptions",
  "What certifications should I add?",
  "How can I optimize my resume for ATS?",
  "Write a compelling career objective",
];

const quickActions = [
  {
    icon: FileText,
    label: 'Generate Summary',
    prompt: 'Generate a professional summary for a {role} with {years} years of experience',
  },
  {
    icon: Wand2,
    label: 'Improve Description',
    prompt: 'Help me improve this job description: {description}',
  },
  {
    icon: Sparkles,
    label: 'Suggest Skills',
    prompt: 'Suggest relevant skills for a {role} position',
  },
];

async function generateAIResponse(input: string): Promise<string> {
  await new Promise(r => setTimeout(r, 1200));

  const responses: Record<string, string> = {
    summary: `**Professional Summary**

Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven track record of delivering high-impact solutions that improve user experience and drive business growth.

Key highlights:
• Led development of microservices architecture serving 2M+ daily users
• Reduced page load time by 40% through performance optimization
• Mentored team of 5 junior developers, improving team velocity by 25%
• Expert in React, Node.js, TypeScript, and cloud technologies

Passionate about leveraging cutting-edge technology to solve complex problems and create meaningful user experiences.`,
    skills: `**Recommended Skills for Software Engineer**

**Technical Skills:**
• Programming: JavaScript/TypeScript, Python, Java
• Frontend: React, Vue.js, Next.js, Tailwind CSS
• Backend: Node.js, Express, GraphQL, REST APIs
• Databases: PostgreSQL, MongoDB, Redis
• Cloud: AWS, GCP, Docker, Kubernetes
• Tools: Git, CI/CD, Agile/Scrum

**Soft Skills:**
• Team Leadership
• Problem-Solving
• Communication
• Time Management
• Cross-functional Collaboration`,
    objective: `**Career Objective**

Seeking a Senior Software Engineer position where I can leverage my expertise in full-stack development and cloud architecture to build innovative solutions. I aim to contribute to a forward-thinking organization that values technical excellence and fosters continuous learning and growth.`,
    improve: `**Improved Description**

**Senior Software Engineer | Tech Company** | 2020 - Present

• Architected and deployed scalable microservices handling 2M+ daily transactions, improving system reliability by 99.9%
• Led a cross-functional team of 8 engineers in delivering critical product features, resulting in 35% revenue growth
• Implemented CI/CD pipelines reducing deployment time by 60% and eliminating production incidents
• Collaborated with product and design teams to define technical roadmaps and execute strategic initiatives
• Mentored 5 junior developers, establishing best practices and improving team velocity by 25%`,
    default: `I'm here to help you create an impressive resume. Here are some things I can assist with:

• **Generate professional summaries** tailored to your experience
• **Suggest relevant skills** for your target role
• **Improve job descriptions** with impactful language
• **Optimize for ATS** systems
• **Write career objectives** that stand out

Just tell me what you need, or select one of the quick actions above!`,
  };

  if (input.toLowerCase().includes('summary')) return responses.summary;
  if (input.toLowerCase().includes('skill')) return responses.skills;
  if (input.toLowerCase().includes('objective') || input.toLowerCase().includes('career')) return responses.objective;
  if (input.toLowerCase().includes('improve') || input.toLowerCase().includes('description')) return responses.improve;
  return responses.default;
}

type AIAssistantProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    const response = await generateAIResponse(text);
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setIsTyping(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Assistant</h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick actions */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-b border-gray-100 dark:border-gray-800"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick actions:</p>
                <div className="space-y-2">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSend(action.label)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <action.icon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Welcome to AI Assistant</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    I can help you create compelling resume content, suggest improvements, and answer your questions.
                  </p>
                  <p className="text-xs text-gray-400">Try asking me to generate a summary or improve your descriptions!</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md'
                          : 'bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-md border border-gray-100 dark:border-gray-700'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none">
                          {msg.role === 'ai' ? (
                            <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-md">
                        <div className="flex gap-1.5">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.8, delay }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Suggestions */}
            {messages.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {suggestions.slice(0, 3).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                    >
                      {s.length > 30 ? s.slice(0, 30) + '...' : s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask AI for help..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <motion.button
                  onClick={() => handleSend(input)}
                  disabled={isTyping || !input.trim()}
                  className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
