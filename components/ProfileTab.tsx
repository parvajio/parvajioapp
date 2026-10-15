import type { CSSProperties } from "react";
import {
  Briefcase,
  Check,
  Globe,
  GraduationCap,
  Languages as LanguagesIcon,
  Layers,
  MapPin,
  User,
} from "lucide-react";
import { CHIPS, LANGUAGES, STACK_ROWS, TIMELINE } from "@/data/profile";
import DhakaClock from "./DhakaClock";

const AVAILABILITY = ["Freelance", "Internship", "Full-time", "Async-friendly"];

export default function ProfileTab() {
  return (
    <div id="tab-profile">
      <section className="hero">
        <div className="banner" aria-hidden="true"></div>
        <div className="hero-avatar">P</div>
        <h1 className="hero-name">Parvaj</h1>
        <p className="hero-tag">I build fast, clean, secure web apps.</p>
        <span className="status">
          <i className="dot"></i>Open to new conversations
        </span>
        <p className="hero-meta">
          <span>
            <Briefcase aria-hidden="true" />
            CSE student at <b>Uttara University</b>
          </span>
          <span className="sep">·</span>
          <span>Full-stack developer</span>
          <span className="sep">·</span>
          <span>
            <MapPin aria-hidden="true" />
            Dhaka <span className="sep">·</span>{" "}
            <DhakaClock variant="inline" />
          </span>
        </p>
        <div className="chips">
          {CHIPS.map((chip) => (
            <span
              key={chip.label}
              className="chip"
              style={{ "--c": chip.color } as CSSProperties}
            >
              <i></i>
              {chip.label}
            </span>
          ))}
        </div>
      </section>

      <div className="page">
        <section data-toc="About">
          <h2 className="sec-h">
            <User aria-hidden="true" />
            About
          </h2>
          <div className="prose">
            <p>
              I&apos;m a <b>3rd-year CSE student</b> at Uttara University who
              builds full-stack web apps end to end, from the database schema
              and API to a polished Next.js interface. I care about software
              that is fast, clean and secure, and about shipping things real
              people use.
            </p>
            <p>
              Alongside my studies I&apos;ve spent around{" "}
              <b>8 years teaching privately</b>, which taught me to break
              complex ideas into simple steps. I bring the same habit to code:
              clear structure, readable naming and honest documentation.
            </p>
          </div>
          <div className="grid2">
            <div className="panel tint">
              <div className="p-label">
                <MapPin aria-hidden="true" />
                Based in
              </div>
              <div className="p-title">Dhaka, Bangladesh</div>
              <DhakaClock variant="panel" />
            </div>
            <div className="panel">
              <div className="p-label">
                <Globe aria-hidden="true" />
                Availability
              </div>
              <div className="p-title">Remote-friendly</div>
              <p className="p-text">
                Open to freelance work, internships and full-time roles, and
                comfortable collaborating across time zones.
              </p>
              <div className="checks">
                {AVAILABILITY.map((item) => (
                  <span key={item} className="check">
                    <Check aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-toc="Stack">
          <h2 className="sec-h">
            <Layers aria-hidden="true" />
            Stack
          </h2>
          <div className="panel">
            {STACK_ROWS.map((row) => (
              <div key={row.key} className="kv-row">
                <span className="kv-k">{row.key}</span>
                <div className="pills">
                  {row.pills.map((pill) => (
                    <span key={pill} className="pill-s">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-toc="Journey">
          <h2 className="sec-h">
            <GraduationCap aria-hidden="true" />
            Journey
          </h2>
          <div className="panel">
            <div className="tl">
              {TIMELINE.map((item) => (
                <div key={item.title} className="tl-item">
                  <div className="tl-t">{item.title}</div>
                  <div className="tl-m">{item.meta}</div>
                  <p className="tl-p">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-toc="Languages">
          <h2 className="sec-h">
            <LanguagesIcon aria-hidden="true" />
            Languages
          </h2>
          <div className="panel">
            <div className="langs">
              {LANGUAGES.map((lang) => (
                <div key={lang.name} className="lang">
                  <b>{lang.name}</b>
                  <span>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
