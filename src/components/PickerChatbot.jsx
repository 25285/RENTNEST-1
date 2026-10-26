import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Minus, Send, Sparkles, Home, MessageSquare, PlusCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PickerChatbot = () => {
  const { userRole, properties, inquiries, setIsAddModalOpen, setSelectedProperty } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: userRole === 'landlord'
        ? "Hi! I'm Picker 👋 I can help you list a property, manage inquiries, or track your rental portfolio."
        : "Hi! I'm Picker 👋 Looking for a rental home? I can help find verified properties matching your budget and amenities."
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const quickChipsTenant = [
    { label: "Find 2 BHK under ₹25,000", icon: Home },
    { label: "How to contact landlord?", icon: HelpCircle },
    { label: "Book a visit", icon: CheckCircle },
    { label: "Zero brokerage guarantee?", icon: Sparkles }
  ];

  const quickChipsLandlord = [
    { label: "List a Property", icon: PlusCircle, action: () => setIsAddModalOpen(true) },
    { label: "View My Properties", icon: Home, action: () => navigate('/dashboard') },
    { label: "Check Inquiries", icon: MessageSquare, action: () => navigate('/dashboard#inquiries') },
    { label: "Rental Performance Tips", icon: Sparkles }
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Rule-based responder with natural typing delay
    setTimeout(() => {
      let botResponse = "";
      const lower = text.toLowerCase();

      if (lower.includes('2 bhk') || lower.includes('25000') || lower.includes('under') || lower.includes('budget')) {
        const affordable2BHKs = properties.filter(p => p.price <= 25000 && p.type.includes('2 BHK'));
        if (affordable2BHKs.length > 0) {
          botResponse = `I found ${affordable2BHKs.length} verified 2 BHK properties under ₹25,000:
${affordable2BHKs.map(p => `• ${p.title} in ${p.location} (₹${p.price.toLocaleString('en-IN')}/mo)`).join('\n')}

Would you like to view photos or contact the landlord directly?`;
        } else {
          botResponse = "We have several verified 1 BHK and 2 BHK units starting from ₹16,000/month. Check our 'Find Homes' page for updated listings!";
        }
      } else if (lower.includes('list a property') || lower.includes('add property')) {
        botResponse = "Opening the property creation form now! You can set your monthly rent, upload photos, and select amenities in seconds.";
        setIsAddModalOpen(true);
      } else if (lower.includes('contact landlord') || lower.includes('how to contact')) {
        botResponse = "On RentNest, all listings are 100% direct from verified owners! Click on any property card and click 'View Details & Connect' to send a direct message or schedule an in-person visit.";
      } else if (lower.includes('book a visit') || lower.includes('visit')) {
        botResponse = "To book a visit, click on any property card, select your preferred date in the 'Schedule Visit' box, and submit. The landlord will confirm within 2 hours!";
      } else if (lower.includes('inquiries') || lower.includes('leads')) {
        botResponse = `You currently have ${inquiries.length} prospective tenant inquiries across your portfolio. Recent lead: ${inquiries[0]?.tenantName || 'Priya Sharma'} regarding ${inquiries[0]?.propertyTitle || 'Gachibowli apartment'}.`;
      } else if (lower.includes('brokerage') || lower.includes('commission')) {
        botResponse = "Zero Brokerage! RentNest connects genuine owners and tenants directly. Neither party pays any brokerage fees or commission.";
      } else if (lower.includes('view my properties') || lower.includes('portfolio') || lower.includes('dashboard')) {
        botResponse = `You have ${properties.length} active listings (${properties.filter(p => p.status === 'Available').length} available, ${properties.filter(p => p.status === 'Occupied').length} occupied). Taking you to your dashboard!`;
        navigate('/dashboard');
      } else {
        botResponse = "Thanks for asking! I can assist you with property search, checking landlord verified profiles, scheduling walkthroughs, or managing your rental income.";
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 700);
  };

  const handleChipClick = (chip) => {
    if (chip.action) {
      chip.action();
    }
    handleSend(chip.label);
  };

  return (
    <div className="picker-container">
      {isOpen ? (
        <div className="picker-chatbox">
          {/* Header */}
          <div className="picker-header">
            <div className="picker-header-profile">
              <div className="picker-header-avatar">
                <Bot size={22} color="#FFFFFF" />
              </div>
              <div className="picker-header-info">
                <h4>Picker</h4>
                <p>Your Rental Assistant • Online</p>
              </div>
            </div>
            <div className="picker-controls">
              <button onClick={() => setIsOpen(false)} className="picker-ctrl-btn" title="Minimize">
                <Minus size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} className="picker-ctrl-btn" title="Close">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="picker-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
              </div>
            ))}

            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            {/* Quick Action Suggestion Chips */}
            <div className="picker-chips-container">
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                Quick Suggestions
              </span>
              {(userRole === 'landlord' ? quickChipsLandlord : quickChipsTenant).map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(chip)}
                    className="picker-chip-btn"
                  >
                    <Icon size={14} color="#0C7A59" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="picker-input-bar"
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="picker-input"
            />
            <button type="submit" className="picker-send-btn" title="Send message">
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* Minimized Launcher with Tooltip */
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            onClick={() => setIsOpen(true)}
            style={{
              background: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              border: '1px solid #E2E8F0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.8rem',
              maxWidth: '190px',
              animation: 'floatCard 4s ease-in-out infinite'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <strong style={{ color: '#0C7A59' }}>Picker</strong>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>AI Assistant</span>
            </div>
            <span style={{ color: '#475569', fontSize: '0.78rem' }}>
              Hi! I'm Picker 👋 Need help finding or listing homes?
            </span>
          </div>

          <button onClick={() => setIsOpen(true)} className="picker-launcher">
            <div className="picker-avatar-badge">
              <Bot size={20} color="#0C7A59" />
            </div>
            <span className="picker-online-dot" />
            <span>Chat</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PickerChatbot;
