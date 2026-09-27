import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

// Simple line icons (24px grid), drawn to match the brand's thin, elegant type
const Icon = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.9" className="fill" /></svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M10.6 20.2l1.9-7.6m-.9 3.6c.4.9 1.3 1.4 2.4 1.4 2.2 0 3.7-2 3.7-4.6 0-2.8-2.3-4.7-5.3-4.7-3.2 0-5.3 2.2-5.3 4.8 0 1.2.5 2.3 1.4 2.8" /></svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5v6M8 7.6v.1M11.5 16.5v-3.4c0-1.5 1-2.6 2.3-2.6s2.2 1 2.2 2.6v3.4M11.5 10.5v6" /></svg>
  ),
};

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/bbloomandyou", icon: Icon.instagram },
  { label: "Pinterest", href: "https://pin.it/6PPIfHbEC", icon: Icon.pinterest },
  { label: "Email", href: "mailto:bloomandyou.social@gmail.com", icon: Icon.mail },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/bloom-and-you/", icon: Icon.linkedin },
];

export default function Footer() {
  return (
    <footer className="bf">
      <div className="bf__inner">
        <div className="bf__brand">
          <Link to="/" className="bf__logo">Bloom &amp; You</Link>
          <p className="bf__tag">Thoughtful self-care gifts, made to be personal.</p>
          <div className="bf__social">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} title={s.label}
                 {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="bf__col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/products">All products</Link>
          <Link to="/bouquets">Bouquets</Link>
          <Link to="/scented-candles">Scented candles</Link>
          <Link to="/skincare">Skincare</Link>
          <Link to="/customize">Build a gift</Link>
        </nav>

        <nav className="bf__col" aria-label="Help">
          <h4>Help</h4>
          <Link to="/contact">Contact us</Link>
          <Link to="/account">My account</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </nav>
      </div>

      <div className="bf__base">
        <span>© 2025 Bloom &amp; You</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
