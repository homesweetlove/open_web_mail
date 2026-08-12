/*
 * Nocturne Mail / Home
 * Style reminder: Neo Kinpaku — asymmetric three-column workspace,
 * calibration lines, restrained gold actions, patina state signals.
 */
import {
  Archive,
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Folder,
  Inbox,
  LayoutList,
  Mail,
  Menu,
  MoreHorizontal,
  Paperclip,
  PencilLine,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FolderKey = "inbox" | "starred" | "snoozed" | "sent" | "drafts" | "archive";
type FilterKey = "all" | "unread" | "starred";

type MailItem = {
  id: number;
  sender: string;
  initials: string;
  subject: string;
  preview: string;
  time: string;
  date: string;
  label: string;
  tone: "gold" | "patina" | "paper" | "graphite";
  unread?: boolean;
  starred?: boolean;
  attachment?: boolean;
  body: string[];
};

const mailSeed: MailItem[] = [
  {
    id: 1,
    sender: "Studio Aster",
    initials: "SA",
    subject: "Q3 identity review — the final pass",
    preview: "The restraint in the new wordmark is working. I left three notes in the margin…",
    time: "09:42",
    date: "오늘",
    label: "PROJECTS",
    tone: "gold",
    unread: true,
    starred: true,
    attachment: true,
    body: [
      "Hi Min,",
      "The restraint in the new wordmark is working. I left three notes in the margin, mostly around how the mark behaves when it is reduced to a single-color stamp.",
      "Could you take one last look before our 16:00 review? I would keep the gold seam, but let the surrounding space do more of the work.",
      "Warmly,\nAster",
    ],
  },
  {
    id: 2,
    sender: "Mara Chen",
    initials: "MC",
    subject: "A quieter way to plan next week",
    preview: "I pulled the three commitments that deserve a little more room around them…",
    time: "08:17",
    date: "오늘",
    label: "PERSONAL",
    tone: "patina",
    unread: true,
    body: [
      "Morning,",
      "I pulled the three commitments that deserve a little more room around them. The rest can stay in the background until Wednesday.",
      "Sharing the note here so it is in one place when you are ready.",
      "Mara",
    ],
  },
  {
    id: 3,
    sender: "Ritual Objects",
    initials: "RO",
    subject: "Your order is moving through the studio",
    preview: "The small brass desk lamp has been wrapped and is ready for collection…",
    time: "Yesterday",
    date: "어제",
    label: "RECEIPTS",
    tone: "paper",
    attachment: false,
    body: [
      "Hello Min,",
      "The small brass desk lamp has been wrapped and is ready for collection. We will send the tracking note as soon as it leaves the studio.",
      "Thank you for choosing something made slowly.",
      "Ritual Objects",
    ],
  },
  {
    id: 4,
    sender: "Hiro Tan",
    initials: "HT",
    subject: "Re: The handoff should feel lighter",
    preview: "Agreed. I simplified the handoff to two moments instead of four…",
    time: "Yesterday",
    date: "어제",
    label: "PROJECTS",
    tone: "graphite",
    starred: true,
    body: [
      "Agreed. I simplified the handoff to two moments instead of four and removed the extra status email.",
      "The updated flow is attached. It should feel closer to a clear desk than another dashboard.",
      "Hiro",
    ],
  },
  {
    id: 5,
    sender: "Aster Notes",
    initials: "AN",
    subject: "The margin is part of the message",
    preview: "A short field note on why less interface can sometimes say more…",
    time: "Mon",
    date: "월요일",
    label: "READING",
    tone: "paper",
    body: [
      "A short field note on why less interface can sometimes say more.",
      "When the important things have enough space around them, attention stops feeling like something we need to wrestle back.",
      "Aster Notes",
    ],
  },
  {
    id: 6,
    sender: "Nami Logistics",
    initials: "NL",
    subject: "Friday delivery window confirmed",
    preview: "The delivery is now booked between 14:00 and 16:00 this Friday…",
    time: "Sun",
    date: "일요일",
    label: "RECEIPTS",
    tone: "patina",
    attachment: true,
    body: [
      "The delivery is now booked between 14:00 and 16:00 this Friday.",
      "Please keep the access note unchanged. We will call fifteen minutes before arrival.",
      "Nami Logistics",
    ],
  },
];

const folderItems: Array<{ key: FolderKey; label: string; count?: number; icon: typeof Inbox }> = [
  { key: "inbox", label: "받은편지함", count: 7, icon: Inbox },
  { key: "starred", label: "별표 표시", count: 2, icon: Star },
  { key: "snoozed", label: "다시 알림", icon: Clock3 },
  { key: "sent", label: "보낸편지함", icon: Send },
  { key: "drafts", label: "임시보관함", count: 1, icon: FileText },
  { key: "archive", label: "보관됨", icon: Archive },
];

const labelItems = [
  { label: "Projects", color: "gold" },
  { label: "Personal", color: "patina" },
  { label: "Reading", color: "paper" },
];

function IconButton({
  label,
  children,
  onClick,
  active = false,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? "is-active" : ""} ${className}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Avatar({ mail, size = "normal" }: { mail: MailItem; size?: "normal" | "large" }) {
  return (
    <span className={`mail-avatar avatar-${mail.tone} ${size === "large" ? "avatar-large" : ""}`}>
      {mail.initials}
    </span>
  );
}

function Home() {
  const [activeFolder, setActiveFolder] = useState<FolderKey>("inbox");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState("");
  const [starred, setStarred] = useState<Set<number>>(
    () => new Set(mailSeed.filter((mail) => mail.starred).map((mail) => mail.id)),
  );
  const [archived, setArchived] = useState<Set<number>>(() => new Set());
  const [trashed, setTrashed] = useState<Set<number>>(() => new Set());
  const [read, setRead] = useState<Set<number>>(
    () => new Set(mailSeed.filter((mail) => !mail.unread).map((mail) => mail.id)),
  );
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState("2 MIN AGO");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const visibleMails = useMemo(() => {
    let list = mailSeed.filter((mail) => !trashed.has(mail.id));

    if (activeFolder === "inbox") list = list.filter((mail) => !archived.has(mail.id));
    if (activeFolder === "archive") list = list.filter((mail) => archived.has(mail.id));
    if (activeFolder === "starred") list = list.filter((mail) => starred.has(mail.id));
    if (activeFolder === "drafts") list = [];
    if (activeFolder === "sent") list = list.filter((mail) => mail.id === 4);
    if (activeFolder === "snoozed") list = list.filter((mail) => mail.id === 5);

    if (activeFilter === "unread") list = list.filter((mail) => !read.has(mail.id));
    if (activeFilter === "starred") list = list.filter((mail) => starred.has(mail.id));

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter((mail) =>
        [mail.sender, mail.subject, mail.preview, mail.label].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      );
    }

    return list;
  }, [activeFilter, activeFolder, archived, query, read, starred, trashed]);

  const selectedMail =
    visibleMails.find((mail) => mail.id === selectedId) ?? visibleMails[0] ?? mailSeed[0];
  const isSelectedRead = read.has(selectedMail.id);
  const isSelectedStarred = starred.has(selectedMail.id);

  const selectFolder = (folder: FolderKey) => {
    setActiveFolder(folder);
    setActiveFilter("all");
    setIsNavOpen(false);
    const first = folder === "inbox" ? 1 : folder === "starred" ? 1 : folder === "archive" ? 1 : 4;
    setSelectedId(first);
  };

  const toggleStar = (id: number) => {
    setStarred((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markSelectedRead = () => {
    setRead((current) => {
      const next = new Set(current);
      if (next.has(selectedMail.id)) next.delete(selectedMail.id);
      else next.add(selectedMail.id);
      return next;
    });
    toast(isSelectedRead ? "안읽음으로 표시했습니다" : "읽음으로 표시했습니다", {
      description: selectedMail.subject,
    });
  };

  const archiveSelected = () => {
    setArchived((current) => new Set(current).add(selectedMail.id));
    toast("보관함으로 이동했습니다", { description: selectedMail.sender });
  };

  const trashSelected = () => {
    setTrashed((current) => new Set(current).add(selectedMail.id));
    toast("휴지통으로 이동했습니다", { description: selectedMail.subject });
  };

  const refreshInbox = () => {
    setLastSynced("JUST NOW");
    toast("받은편지함을 새로고침했습니다", { description: "새로운 메일은 없습니다." });
  };

  const openCompose = () => {
    setIsComposeOpen(true);
    setIsQuickMenuOpen(false);
  };

  const sendDraft = () => {
    if (!draftSubject.trim() && !draftBody.trim()) {
      toast("작성 중인 내용이 없습니다", { description: "제목이나 본문을 먼저 입력해 주세요." });
      return;
    }
    toast("메일을 보낼 준비가 되었습니다", { description: "정적 화면 데모에서는 실제 전송되지 않습니다." });
    setDraftSubject("");
    setDraftBody("");
    setIsComposeOpen(false);
  };

  return (
    <main className="mail-app">
      <div className="grain-layer" aria-hidden="true" />
      <aside className={`mail-sidebar ${isNavOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-symbol-wrap">
            <img src="/manus-storage/nocturne-mark_9bc29b24.png" alt="" className="brand-symbol" />
          </div>
          <div>
            <p className="brand-name">NOCTURNE</p>
            <p className="brand-subtitle">PERSONAL MAIL / 01</p>
          </div>
          <IconButton label="메뉴 닫기" className="mobile-close" onClick={() => setIsNavOpen(false)}>
            <X size={17} strokeWidth={1.5} />
          </IconButton>
        </div>

        <button type="button" className="compose-button" onClick={openCompose}>
          <PencilLine size={17} strokeWidth={1.7} />
          <span>새 메일</span>
          <span className="compose-key">C</span>
        </button>

        <div className="sidebar-section">
          <p className="sidebar-eyebrow">MAILBOX / 06</p>
          <nav className="folder-nav" aria-label="메일 폴더">
            {folderItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.key}
                  className={`folder-link ${activeFolder === item.key ? "is-selected" : ""}`}
                  onClick={() => selectFolder(item.key)}
                >
                  <Icon size={16} strokeWidth={activeFolder === item.key ? 1.8 : 1.5} />
                  <span>{item.label}</span>
                  {item.count ? <span className="folder-count">{item.count}</span> : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-section label-section">
          <p className="sidebar-eyebrow">LABELS</p>
          <div className="label-list">
            {labelItems.map((item) => (
              <button
                type="button"
                className="label-link"
                key={item.label}
                onClick={() => {
                  setQuery(item.label);
                  toast(`${item.label} 라벨로 필터링했습니다`);
                }}
              >
                <span className={`label-dot dot-${item.color}`} />
                <span>{item.label}</span>
              </button>
            ))}
            <button type="button" className="label-link label-add" onClick={() => toast("라벨 관리 기능은 준비 중입니다")}>
              <Plus size={14} strokeWidth={1.5} />
              <span>라벨 추가</span>
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sync-row">
            <span className="status-pulse" />
            <span>SYNCED {lastSynced}</span>
          </div>
          <div className="sidebar-footer-links">
            <button type="button" onClick={() => toast("설정 화면은 준비 중입니다")}>
              <Settings2 size={15} strokeWidth={1.5} />
              설정
            </button>
            <button type="button" onClick={() => toast("도움말 화면은 준비 중입니다")}>
              <ShieldCheck size={15} strokeWidth={1.5} />
              보안
            </button>
          </div>
        </div>
      </aside>

      <section className="mail-workspace">
        <header className="workspace-header">
          <div className="mobile-header-left">
            <IconButton label="메일 메뉴 열기" className="mobile-menu" onClick={() => setIsNavOpen(true)}>
              <Menu size={20} strokeWidth={1.5} />
            </IconButton>
            <span className="mobile-brand">NOCTURNE</span>
          </div>
          <div className="workspace-heading">
            <div className="heading-kicker">
              <span>INBOX / 07</span>
              <span className="kicker-line" />
              <span>FOCUS TODAY</span>
            </div>
            <h1>{activeFolder === "inbox" ? "받은편지함" : folderItems.find((item) => item.key === activeFolder)?.label}</h1>
            <p>당신의 주의를 한 곳에 모으는 조용한 메일 작업대.</p>
          </div>
          <div className="header-actions">
            <IconButton label="알림" onClick={() => toast("새로운 알림이 없습니다")}>
              <Bell size={17} strokeWidth={1.5} />
              <span className="notification-dot" />
            </IconButton>
            <button type="button" className="profile-chip" onClick={() => toast("프로필 메뉴는 준비 중입니다")}>
              <span className="profile-avatar">M</span>
              <span className="profile-name">Min</span>
              <ChevronDown size={13} strokeWidth={1.5} />
            </button>
          </div>
        </header>

        <div className="mail-toolbar">
          <label className="search-field">
            <Search size={16} strokeWidth={1.5} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="메일 검색"
              aria-label="메일 검색"
            />
            <span className="search-shortcut">⌘ K</span>
          </label>
          <div className="toolbar-actions">
            <IconButton label="새로고침" onClick={refreshInbox}>
              <RefreshCw size={16} strokeWidth={1.5} />
            </IconButton>
            <IconButton label="보기 설정" onClick={() => toast("보기 설정은 준비 중입니다")}>
              <SlidersHorizontal size={16} strokeWidth={1.5} />
            </IconButton>
            <span className="toolbar-rule" />
            <button type="button" className="page-button" onClick={() => toast("첫 페이지입니다")}>
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <span className="page-count">1–{visibleMails.length || 0} / 48</span>
            <button type="button" className="page-button" onClick={() => toast("다음 페이지로 이동할 준비 중입니다")}>
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="workspace-grid">
          <section className="inbox-panel" aria-label="메일 목록">
            <div className="list-header">
              <div>
                <p className="panel-eyebrow">RECENT CORRESPONDENCE</p>
                <p className="list-caption">가장 최근의 대화부터 정리했습니다.</p>
              </div>
              <div className="filter-tabs" role="tablist" aria-label="메일 필터">
                {([
                  ["all", "전체"],
                  ["unread", "안읽음"],
                  ["starred", "별표"],
                ] as Array<[FilterKey, string]>).map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    className={activeFilter === key ? "is-active" : ""}
                    onClick={() => setActiveFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mail-list">
              {visibleMails.length ? (
                visibleMails.map((mail, index) => {
                  const isRead = read.has(mail.id);
                  const isStarred = starred.has(mail.id);
                  return (
                    <article
                      className={`mail-row ${selectedMail.id === mail.id ? "is-selected" : ""} ${!isRead ? "is-unread" : ""}`}
                      key={mail.id}
                      style={{ "--row-delay": `${index * 45}ms` } as React.CSSProperties}
                      onClick={() => setSelectedId(mail.id)}
                    >
                      <Avatar mail={mail} />
                      <div className="mail-row-copy">
                        <div className="mail-row-meta">
                          <span className="mail-sender">{mail.sender}</span>
                          <span className="mail-time">{mail.time}</span>
                        </div>
                        <div className="mail-row-subject">
                          <span>{mail.subject}</span>
                          {!isRead ? <span className="unread-mark" /> : null}
                        </div>
                        <p>{mail.preview}</p>
                        <div className="mail-row-tags">
                          <span className={`mini-label label-${mail.tone}`}>{mail.label}</span>
                          {mail.attachment ? <Paperclip size={12} strokeWidth={1.4} /> : null}
                        </div>
                      </div>
                      <IconButton
                        label={isStarred ? "별표 해제" : "별표 표시"}
                        active={isStarred}
                        className="row-star"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleStar(mail.id);
                        }}
                      >
                        <Star size={15} strokeWidth={1.5} fill={isStarred ? "currentColor" : "none"} />
                      </IconButton>
                    </article>
                  );
                })
              ) : (
                <div className="empty-state">
                  <Sparkles size={22} strokeWidth={1.3} />
                  <strong>이 선반은 비어 있습니다.</strong>
                  <span>다른 폴더나 검색어를 확인해 보세요.</span>
                </div>
              )}
            </div>

            <div className="list-footer">
              <span><span className="footer-dot" /> ALL CAUGHT UP</span>
              <span>{visibleMails.length} conversations</span>
            </div>
          </section>

          <section className="reading-panel" aria-label="선택한 메일">
            <div className="reading-toolbar">
              <div className="reading-breadcrumb">
                <span>INBOX</span>
                <ChevronRight size={13} strokeWidth={1.4} />
                <span>MESSAGE / {String(selectedMail.id).padStart(2, "0")}</span>
              </div>
              <div className="reading-actions">
                <IconButton label="보관" onClick={archiveSelected}>
                  <Archive size={16} strokeWidth={1.5} />
                </IconButton>
                <IconButton label={isSelectedRead ? "안읽음으로 표시" : "읽음으로 표시"} onClick={markSelectedRead}>
                  {isSelectedRead ? <Mail size={16} strokeWidth={1.5} /> : <CheckCheck size={16} strokeWidth={1.5} />}
                </IconButton>
                <IconButton label="삭제" onClick={trashSelected}>
                  <Trash2 size={16} strokeWidth={1.5} />
                </IconButton>
                <span className="toolbar-rule" />
                <div className="quick-menu-wrap">
                  <IconButton label="더보기" onClick={() => setIsQuickMenuOpen((open) => !open)}>
                    <MoreHorizontal size={16} strokeWidth={1.5} />
                  </IconButton>
                  {isQuickMenuOpen ? (
                    <div className="quick-menu">
                      <button type="button" onClick={() => { toast("메일을 다시 알림 목록에 넣었습니다"); setIsQuickMenuOpen(false); }}>
                        <Clock3 size={14} strokeWidth={1.5} />
                        다시 알림
                      </button>
                      <button type="button" onClick={() => { toast("라벨 메뉴는 준비 중입니다"); setIsQuickMenuOpen(false); }}>
                        <Tag size={14} strokeWidth={1.5} />
                        라벨 지정
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="reading-content">
              <div className="message-heading">
                <div>
                  <div className="message-label-row">
                    <span className={`mini-label label-${selectedMail.tone}`}>{selectedMail.label}</span>
                    {isSelectedStarred ? <Star size={14} fill="currentColor" strokeWidth={1.4} /> : null}
                  </div>
                  <h2>{selectedMail.subject}</h2>
                  <p className="message-meta-line">to me <span>·</span> {selectedMail.date}, {selectedMail.time}</p>
                </div>
                <IconButton label={isSelectedStarred ? "별표 해제" : "별표 표시"} active={isSelectedStarred} onClick={() => toggleStar(selectedMail.id)}>
                  <Star size={17} strokeWidth={1.5} fill={isSelectedStarred ? "currentColor" : "none"} />
                </IconButton>
              </div>

              <div className="sender-line">
                <Avatar mail={selectedMail} size="large" />
                <div>
                  <strong>{selectedMail.sender}</strong>
                  <span>{selectedMail.sender.toLowerCase().replaceAll(" ", ".")}@studio.example</span>
                </div>
                <button type="button" className="sender-more" onClick={() => toast("보낸 사람 정보는 준비 중입니다")}>
                  <MoreHorizontal size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="message-body">
                {selectedMail.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {selectedMail.attachment ? (
                <div className="attachment-card">
                  <div className="attachment-icon"><FileText size={18} strokeWidth={1.3} /></div>
                  <div>
                    <strong>identity_review_v6.pdf</strong>
                    <span>2.4 MB · PDF document</span>
                  </div>
                  <button type="button" onClick={() => toast("첨부파일 미리보기는 준비 중입니다")}>열기</button>
                </div>
              ) : null}

              <div className="reply-actions">
                <button type="button" className="reply-button" onClick={() => { setIsComposeOpen(true); toast("답장을 준비하고 있습니다"); }}>
                  <ArrowLeft size={15} strokeWidth={1.5} />
                  답장
                </button>
                <button type="button" className="reply-button secondary" onClick={() => toast("전달 화면은 준비 중입니다")}>
                  전달
                  <ArrowLeft size={15} strokeWidth={1.5} className="flip-x" />
                </button>
              </div>
            </div>
          </section>

          <aside className="context-rail" aria-label="메일 컨텍스트">
            <div className="rail-header">
              <p className="panel-eyebrow">TODAY / 12 AUG</p>
              <IconButton label="컨텍스트 숨기기" onClick={() => toast("컨텍스트 레일은 데스크톱에서 고정됩니다")}>
                <LayoutList size={16} strokeWidth={1.5} />
              </IconButton>
            </div>
            <div className="focus-block">
              <div className="focus-block-top">
                <span className="patina-flag"><Zap size={12} strokeWidth={1.8} /> FOCUS</span>
                <span>02 / 03</span>
              </div>
              <h3>오늘의 중심을<br /><em>하나만</em> 남겨두세요.</h3>
              <p>읽고, 답하고, 내려놓는 순서를 가볍게 유지합니다.</p>
              <div className="focus-progress"><span /></div>
              <div className="focus-progress-meta"><span>1 of 3 complete</span><span>08:42</span></div>
            </div>

            <div className="digest-card">
              <div className="digest-image" role="img" aria-label="금빛 봉인이 있는 크림색 봉투" />
              <div className="digest-copy">
                <p className="panel-eyebrow">STUDIO DIGEST</p>
                <h3>작은 편지의<br />큰 여백</h3>
                <p>이번 주에 저장한 문장 4개를 짧게 엮었습니다.</p>
                <button type="button" onClick={() => toast("다이제스트는 준비 중입니다")}>
                  읽기 <ArrowLeft size={13} strokeWidth={1.5} className="flip-x" />
                </button>
              </div>
            </div>

            <div className="rail-note">
              <div className="rail-note-mark"><Sparkles size={15} strokeWidth={1.5} /></div>
              <div>
                <p className="panel-eyebrow">PRIVATE BY DEFAULT</p>
                <p>이 작업대의 메모와 초안은 당신의 흐름 안에만 머뭅니다.</p>
              </div>
            </div>

            <div className="rail-footer">
              <span><span className="status-pulse" /> ENCRYPTED SESSION</span>
              <button type="button" onClick={() => toast("보안 안내는 준비 중입니다")}>DETAILS</button>
            </div>
          </aside>
        </div>
      </section>

      {isComposeOpen ? (
        <div className="compose-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsComposeOpen(false); }}>
          <section className="compose-panel" role="dialog" aria-modal="true" aria-labelledby="compose-title">
            <div className="compose-header">
              <div>
                <p className="panel-eyebrow">NEW CORRESPONDENCE / 01</p>
                <h2 id="compose-title">새 메일</h2>
              </div>
              <IconButton label="작성 창 닫기" onClick={() => setIsComposeOpen(false)}>
                <X size={17} strokeWidth={1.5} />
              </IconButton>
            </div>
            <div className="compose-fields">
              <label>
                <span>받는 사람</span>
                <input placeholder="name@example.com" autoFocus />
              </label>
              <label>
                <span>제목</span>
                <input value={draftSubject} onChange={(event) => setDraftSubject(event.target.value)} placeholder="조용히 시작하는 문장" />
              </label>
              <label className="compose-body-field">
                <span>본문</span>
                <textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value)} placeholder="당신의 말을 남겨보세요…" />
              </label>
            </div>
            <div className="compose-footer">
              <button type="button" className="attach-button" onClick={() => toast("첨부파일 기능은 준비 중입니다")}>
                <Paperclip size={15} strokeWidth={1.5} /> 첨부
              </button>
              <div>
                <button type="button" className="discard-button" onClick={() => { setDraftSubject(""); setDraftBody(""); setIsComposeOpen(false); }}>버리기</button>
                <button type="button" className="send-button" onClick={sendDraft}>
                  보내기 <Send size={14} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export default Home;
