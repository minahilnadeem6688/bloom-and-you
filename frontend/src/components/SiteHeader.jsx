import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/header.css";

const LINKS = [
  { to: "/products", label: "Products" },
  { to: "/customize", label: "Customize" },
  { to: "/account", label: "Account" },
  { to: "/cart", label: "Cart" },
  { to: "/contact", label: "Contact" },
];

// One header for every page: a row of links on wider screens, a menu button on phones.
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { cartItems = [] } = useCart() || {};
  const count = cartItems.length;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header className={`site-header bh${open ? " is-open" : ""}`}>
      <div className="logo"><Link to="/" onClick={() => setOpen(false)}>Bloom &amp; You</Link></div>

      <nav className="site-nav bh-nav" id="bh-menu" aria-label="Main">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "nav-pill" : undefined)}>
            {l.label}{l.to === "/cart" ? ` (${count})` : ""}
          </NavLink>
        ))}
      </nav>

      <div className="bh-actions">
        <Link to="/cart" onClick={() => setOpen(false)} className="bh-bag" aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}>
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
            <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
          </svg>
          {count > 0 && <span className="bh-badge">{count}</span>}
        </Link>
        <button type="button" className="bh-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="bh-menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
