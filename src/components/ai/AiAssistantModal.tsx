import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string;
}

export const AiAssistantModal: React.FC = () => {
  const { projects, beneficiaries, alerts } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Namaste! I am the BhumiSetu AI Assistant. I have indexed real-time data across all 5 infrastructure projects, 6 cadastral plots, and ₹1,800+ Cr in compensation records. How can I assist your decision-making today?',
      timestamp: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sampleQuestions = [
    'Which projects are delayed?',
    'Show compensation pending projects',
    'Which state has the highest acquisition progress?',
    'How many families are affected?',
    'Which projects require immediate attention?'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsThinking(true);

    // Contextual answer generator grounded strictly in prototype data
    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();

      if (q.includes('delayed') || q.includes('delay')) {
        const delayed = projects.filter(p => p.isDelayed);
        reply = `There are currently ${delayed.length} delayed projects in the national registry:\n\n` +
          delayed.map(p => `• ${p.name} (${p.district}, ${p.state}): ${p.delayReason || 'Milestone SLA exceeded'}`).join('\n') +
          `\n\nRecommendation: Check the Decision Support module to review the Tripartite Adalat and PFMS re-validation suggestions.`;
      } else if (q.includes('compensation') || q.includes('pending') || q.includes('money')) {
        const totalAssessed = projects.reduce((acc, p) => acc + p.compensationAssessedCr, 0);
        const totalPaid = projects.reduce((acc, p) => acc + p.compensationPaidCr, 0);
        const pending = (totalAssessed - totalPaid).toFixed(1);
        reply = `Total compensation assessed across national projects is ₹${totalAssessed.toFixed(1)} Cr, of which ₹${totalPaid.toFixed(1)} Cr has been disbursed via PFMS DBT. A backlog of ₹${pending} Cr remains pending release across Kaleshwaram Canal and EDFC packages.`;
      } else if (q.includes('highest') || q.includes('state') || q.includes('progress')) {
        reply = `Madhya Pradesh holds the highest acquisition progress at 96.8% (1,210 Ha acquired for Rewa Ultra Mega Solar Park), followed by Maharashtra at 81.0% (275.8 Ha acquired for NH-48 Expressway).`;
      } else if (q.includes('family') || q.includes('families') || q.includes('affected')) {
        const affected = projects.reduce((acc, p) => acc + p.affectedFamilies, 0);
        const displaced = projects.reduce((acc, p) => acc + p.displacedFamilies, 0);
        const rehab = projects.reduce((acc, p) => acc + p.rehabilitatedFamilies, 0);
        reply = `A total of ${affected.toLocaleString()} families are affected across projects. ${displaced.toLocaleString()} families required physical resettlement, of which ${rehab.toLocaleString()} (${((rehab/displaced)*100).toFixed(0)}%) have already received rehabilitation colony housing or one-time resettlement grants.`;
      } else if (q.includes('immediate') || q.includes('attention') || q.includes('critical')) {
        const crit = alerts.filter(a => a.riskLevel === 'Critical');
        reply = `Immediate executive intervention is needed for: \n\n• ${crit[0]?.title || 'EDFC Land Mutation Deadlock'}: ${crit[0]?.reason || 'Sub-Registrar titles pending for over 65 days in Purba Bardhaman'}.\n\nRecommended Action: ${crit[0]?.recommendedAction}`;
      } else {
        reply = `Based on the latest National Registry sync, there are ${projects.length} active infrastructure projects covering ${(projects.reduce((a,b)=>a+b.totalLandProposedHa,0)).toFixed(1)} Hectares. You can inspect project files, GIS plots, or DBT payment batches from the navigation bar.`;
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-[650px] max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm">BhumiSetu AI Intelligence Desk</h3>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono">
                SIH Decision Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded on national land registry, cadastral parcels & PFMS DBT records
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 shrink-0 font-medium text-[11px] flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 rounded-full text-[11px] transition-colors font-medium shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
              m.sender === 'user' ? 'bg-blue-700 text-white' : 'bg-slate-900 text-white'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[75%] rounded-xl p-3.5 text-xs shadow-xs leading-relaxed whitespace-pre-line ${
              m.sender === 'user' 
                ? 'bg-blue-700 text-white font-medium rounded-tr-none' 
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
            }`}>
              {m.text}
              <div className={`text-[10px] mt-2 font-mono ${m.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            BhumiSetu AI is analyzing national land acquisition databases...
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question about national projects, delayed parcels, or compensation backlogs..."
          className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white p-2.5 rounded-lg text-xs font-semibold transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
