import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useChat } from "../hooks/useChat.js";
import { useAuth } from "../hooks/useAuth.js";

const IconPlus    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>;
const IconSend    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
const IconSearch  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>;
const IconChat    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const IconMenu    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
const IconLogout  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const IconSparkle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/></svg>;
const IconTrash   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

const ACCENT        = "#44C7D4";
const ACCENT_DIM    = "rgba(68,199,212,0.10)";
const ACCENT_BORDER = "rgba(68,199,212,0.30)";

const Skeleton = () => (
  <div style={{ padding: "0 12px" }}>
    {[80, 60, 72, 55, 65].map((w, i) => (
      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 8px" }}>
        <div style={{ width:14, height:14, borderRadius:3, background:"rgba(255,255,255,0.06)", flexShrink:0 }} />
        <div style={{ height:11, width:`${w}%`, borderRadius:4, background:"rgba(255,255,255,0.06)" }} />
      </div>
    ))}
  </div>
);

const TypingDots = () => (
  <div style={{ display:"flex", gap:4, padding:"14px 4px", alignItems:"center" }}>
    <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    {[0,150,300].map(d => (
      <span key={d} style={{
        width:6, height:6, borderRadius:"50%", background:ACCENT,
        display:"inline-block", animation:"bounce 1s infinite", animationDelay:`${d}ms`,
      }}/>
    ))}
  </div>
);

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom:10 }}>
      {!isUser && (
        <div style={{
          width:28, height:28, borderRadius:8, flexShrink:0, marginRight:10, marginTop:2,
          background:ACCENT_DIM, border:`1px solid ${ACCENT_BORDER}`,
          display:"flex", alignItems:"center", justifyContent:"center", color:ACCENT,
        }}>
          <IconSparkle />
        </div>
      )}
      <div style={{
        maxWidth:"68%", padding:"10px 14px", fontSize:14, lineHeight:1.65,
        borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
        color: isUser ? "#0D0D0D" : "rgba(255,255,255,0.88)",
        background: isUser ? ACCENT : "rgba(255,255,255,0.05)",
        border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
      }}>
        {isUser ? msg.content : (
          <>
            <style>{`
              .ai-response p { margin: 0 0 8px; }
              .ai-response p:last-child { margin: 0; }
              .ai-response ul, .ai-response ol { margin: 6px 0 8px 16px; padding: 0; }
              .ai-response li { margin-bottom: 4px; }
              .ai-response strong { color: #fff; font-weight: 600; }
              .ai-response code { background: rgba(255,255,255,0.1); border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 13px; }
              .ai-response pre { background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 12px; overflow-x: auto; margin: 8px 0; }
              .ai-response pre code { background: transparent; padding: 0; }
              .ai-response h1, .ai-response h2, .ai-response h3 { color: #fff; margin: 10px 0 6px; font-size: 15px; }
            `}</style>
            <div className="ai-response">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onSuggestion }) => {
  const suggestions = [
    "What's the latest in AI research?",
    "Explain React hooks simply",
    "Write a Python web scraper",
    "Compare REST vs GraphQL",
  ];
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px", height:"100%" }}>
      <div style={{ width:46, height:46, borderRadius:13, marginBottom:18, background:ACCENT_DIM, border:`1px solid ${ACCENT_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", color:ACCENT }}>
        <IconSparkle />
      </div>
      <p style={{ fontSize:21, fontWeight:500, color:"rgba(255,255,255,0.88)", margin:"0 0 6px" }}>What do you want to know?</p>
      <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", margin:"0 0 26px" }}>Your agent is ready.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", maxWidth:460 }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => onSuggestion(s)} style={{
            padding:"7px 14px", borderRadius:20, fontSize:12, cursor:"pointer",
            color:"rgba(255,255,255,0.5)", background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", transition:"all 0.15s",
          }}
            onMouseEnter={e=>{ e.target.style.color=ACCENT; e.target.style.borderColor=ACCENT_BORDER; }}
            onMouseLeave={e=>{ e.target.style.color="rgba(255,255,255,0.5)"; e.target.style.borderColor="rgba(255,255,255,0.08)"; }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user }                     = useSelector((state) => state.auth);
  const { isLoading, currentChatId } = useSelector((state) => state.chat);
  const chat                         = useChat();
  const { handleLogout }             = useAuth();       // ✅ logout hook
  const navigate                     = useNavigate();   // ✅ for redirect after logout

  const [input, setInput]                 = useState("");
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [search, setSearch]               = useState("");
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const messagesEndRef                    = useRef(null);
  const textareaRef                       = useRef(null);

  const currentMessages = currentChatId
    ? (chat.chats[currentChatId]?.messages || [])
    : (chat.chats["pending-new-chat"]?.messages || []);

  // ✅ filter out the "pending-new-chat" key from the sidebar list
  const chatList = Object.values(chat.chats)
    .filter(c => c._id && c._id !== "pending-new-chat")
    .filter(c => c.title?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, isLoading]);

  // ✅ logout handler — clears cookie, clears Redux, redirects to login
  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    chat.handleSendMessage({ message: input.trim(), chatId: currentChatId });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <main style={{
      height:"100vh", width:"100%", display:"flex", overflow:"hidden",
      background:"#0D0D0D", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      color:"rgba(255,255,255,0.87)",
    }}>

      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 240 : 0, minWidth: sidebarOpen ? 240 : 0,
        flexShrink:0, display:"flex", flexDirection:"column",
        background:"#111111", borderRight:"1px solid rgba(255,255,255,0.06)",
        overflow:"hidden", transition:"width 0.22s ease, min-width 0.22s ease",
      }}>

        {/* Brand */}
        <div style={{ padding:"18px 16px 12px", display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:26, height:26, borderRadius:7, flexShrink:0, background:ACCENT_DIM, border:`1px solid ${ACCENT_BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", color:ACCENT }}>
            <IconSparkle />
          </div>
          <span style={{ fontSize:14, fontWeight:500, letterSpacing:0.2, whiteSpace:"nowrap" }}>PolyMind</span>
          <span style={{ marginLeft:"auto", fontSize:9, fontFamily:"monospace", color:ACCENT, border:`1px solid ${ACCENT_BORDER}`, borderRadius:4, padding:"2px 5px", background:ACCENT_DIM, whiteSpace:"nowrap" }}>AGENT</span>
        </div>

        {/* New chat */}
        <div style={{ padding:"0 12px 10px" }}>
          <button
            onClick={() => chat.handleNewChat()}
            style={{
              width:"100%", display:"flex", alignItems:"center", gap:8,
              padding:"8px 10px", borderRadius:8, fontSize:13,
              color:"rgba(255,255,255,0.55)", cursor:"pointer",
              background:"transparent", border:"1px solid rgba(255,255,255,0.08)",
              transition:"border-color 0.15s",
            }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=ACCENT_BORDER}
            onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}
          >
            <span style={{ color:ACCENT }}><IconPlus /></span>
            New chat
          </button>
        </div>

        {/* Search */}
        <div style={{ padding:"0 12px 12px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"7px 10px", borderRadius:8, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ color:"rgba(255,255,255,0.3)", flexShrink:0 }}><IconSearch /></span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search chats…"
              style={{ background:"transparent", border:"none", outline:"none", fontSize:12, color:"rgba(255,255,255,0.7)", width:"100%" }}
            />
          </div>
        </div>

        {/* Label */}
        <p style={{ padding:"0 16px 6px", fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.22)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Recent</p>

        {/* Chat list */}
        <div style={{ flex:1, overflowY:"auto", paddingBottom:8 }}>
          {isLoading && chatList.length === 0 ? <Skeleton /> : (
            chatList.length === 0
              ? <p style={{ padding:"12px 20px", fontSize:12, color:"rgba(255,255,255,0.25)" }}>No chats yet.</p>
              : chatList.map(c => {
                  const active  = currentChatId === c._id;
                  const hovered = hoveredChatId === c._id;
                  return (
                    <div
                      key={c._id}
                      onMouseEnter={() => setHoveredChatId(c._id)}
                      onMouseLeave={() => setHoveredChatId(null)}
                      style={{
                        display:"flex", alignItems:"center", margin:"1px 0", borderRadius:8,
                        background: active ? ACCENT_DIM : hovered ? "rgba(255,255,255,0.04)" : "transparent",
                        transition:"background 0.12s",
                      }}
                    >
                      <button
                        onClick={() => chat.handleSelectChat(c._id)}
                        style={{ flex:1, display:"flex", alignItems:"center", gap:9, padding:"9px 12px", border:"none", cursor:"pointer", background:"transparent", textAlign:"left" }}
                      >
                        <span style={{ color: active ? ACCENT : "rgba(255,255,255,0.28)", flexShrink:0 }}><IconChat /></span>
                        <span style={{
                          fontSize:12, fontWeight: active ? 500 : 400,
                          color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.52)",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                        }}>
                          {c.title || "Untitled chat"}
                        </span>
                      </button>

                      {hovered && (
                        <button
                          onClick={(e) => { e.stopPropagation(); chat.handleDeleteChat(c._id); }}
                          style={{
                            flexShrink:0, marginRight:8, width:24, height:24, borderRadius:6,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            background:"rgba(255,255,255,0.06)", border:"none", cursor:"pointer",
                            color:"rgba(255,80,80,0.7)", transition:"all 0.12s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background="rgba(255,80,80,0.15)"; e.currentTarget.style.color="rgb(255,80,80)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,80,80,0.7)"; }}
                          title="Delete chat"
                        >
                          <IconTrash />
                        </button>
                      )}
                    </div>
                  );
                })
          )}
        </div>

        {/* ✅ User footer — clicking anywhere on it logs out */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:12 }}>
          <div
            onClick={onLogout}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px", borderRadius:8, cursor:"pointer", transition:"background 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            <div style={{
              width:26, height:26, borderRadius:"50%", flexShrink:0,
              background:ACCENT_DIM, border:`1px solid ${ACCENT_BORDER}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:600, color:ACCENT,
            }}>
              {/* ✅ fixed: using username not name */}
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ minWidth:0 }}>
              {/* ✅ fixed: using username not name */}
              <p style={{ fontSize:12, fontWeight:500, margin:0, color:"rgba(255,255,255,0.78)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user?.username || "User"}
              </p>
              <p style={{ fontSize:10, margin:0, color:"rgba(255,255,255,0.28)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user?.email || ""}
              </p>
            </div>
            <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.22)", flexShrink:0 }}><IconLogout /></span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, background:"#0D0D0D" }}>

        {/* Header */}
        <header style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 20px", borderBottom:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
          <button onClick={()=>setSidebarOpen(v=>!v)}
            style={{ background:"transparent", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.38)", padding:4, borderRadius:6, display:"flex", alignItems:"center", transition:"color 0.12s" }}
            onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.75)"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.38)"}
          >
            <IconMenu />
          </button>

          <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:400 }}>
            {currentChatId ? (chat.chats[currentChatId]?.title || "Untitled chat") : "New chat"}
          </span>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6 }}>
            <svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill={ACCENT}/></svg>
            <span style={{ fontSize:11, fontFamily:"monospace", color:"rgba(255,255,255,0.28)" }}>connected</span>
          </div>
        </header>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px 8px" }}>
          {currentMessages.length === 0 && !isLoading
            ? <EmptyState onSuggestion={s=>setInput(s)} />
            : (
              <>
                {currentMessages.map((msg, i) => <MessageBubble key={msg._id || i} msg={msg} />)}
                {isLoading && <TypingDots />}
                <div ref={messagesEndRef} />
              </>
            )
          }
        </div>

        {/* Input */}
        <div style={{ padding:"10px 20px 18px", flexShrink:0 }}>
          <div style={{
            display:"flex", alignItems:"flex-end", gap:10, padding:"10px 14px",
            borderRadius:14, background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", transition:"border-color 0.15s",
          }}
            onFocusCapture={e=>e.currentTarget.style.borderColor=ACCENT_BORDER}
            onBlurCapture={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={e=>{
                setInput(e.target.value);
                e.target.style.height="auto";
                e.target.style.height=Math.min(e.target.scrollHeight,140)+"px";
              }}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              style={{
                flex:1, background:"transparent", border:"none", outline:"none",
                resize:"none", fontSize:14, color:"rgba(255,255,255,0.85)",
                lineHeight:1.6, fontFamily:"inherit", minHeight:22, maxHeight:140, overflowY:"auto",
              }}
            />
            <button onClick={handleSend} disabled={!input.trim()||isLoading}
              style={{
                width:32, height:32, borderRadius:9, flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                background: input.trim()&&!isLoading ? ACCENT : "rgba(255,255,255,0.06)",
                border:"none", cursor: input.trim()&&!isLoading ? "pointer" : "default",
                color: input.trim()&&!isLoading ? "#0D0D0D" : "rgba(255,255,255,0.22)",
                transition:"all 0.15s",
              }}
            >
              <IconSend />
            </button>
          </div>
          <p style={{ textAlign:"center", fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.18)", marginTop:8 }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;