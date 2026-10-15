"use client";

type PageBarProps = {
  onContact: () => void;
  showId: boolean;
  scrolled: boolean;
};

export default function PageBar({ onContact, showId, scrolled }: PageBarProps) {
  const handleShare = () => {
    try {
      const url = window.location.href;
      void navigator.clipboard?.writeText(url);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const barClass = `page-bar${scrolled ? " scrolled" : ""}${showId ? " show-id" : ""}`;

  return (
    <div className={barClass} id="pageBar">
      <div className="bar-id">
        <div className="bar-avatar">P</div>
        <div>
          <div className="bar-name">Parvaj</div>
          <div className="bar-sub">CSE student · Full-stack developer</div>
        </div>
      </div>
      <div className="bar-actions">
        <button
          type="button"
          className="icon-btn"
          id="shareBtn"
          onClick={handleShare}
          aria-label="Copy link to share"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
          </svg>
        </button>
        <button type="button" className="btn-cta" onClick={onContact}>
          Get in touch
        </button>
      </div>
    </div>
  );
}
