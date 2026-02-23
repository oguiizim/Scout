import { NavLink } from "react-router-dom";

export function IconButton({ to, staticSrc, animatedSrc, alt, children }) {
  const baseLink =
    "group flex items-center rounded-md transition-all duration-200 select-none";
  const inactive = "hover:bg-[#F1F5F9]";
  const active = "bg-[#F1F5F9] font-semibold";

  const linkClass = ({ isActive }) =>
    [
      baseLink,
      "gap-2 px-3 py-2 md:gap-2 md:px-2.5 md:py-2 lg:px-4",
      "hover:scale-[1.0]",
      isActive ? active : inactive,
    ].join(" ");

  return (
    <NavLink to={to} className={linkClass}>
      {/* Ícone com troca no hover */}
      <span className="relative w-5 h-5 group shrink-0">
        <img
          src={staticSrc}
          alt={alt}
          className="absolute inset-0 w-5 h-5 transition-opacity duration-150 group-hover:opacity-0"
        />
        <img
          src={animatedSrc}
          alt={alt}
          className="absolute inset-0 w-5 h-5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        />
      </span>

      {/* Texto vem do Navbar */}
      <span className="text-sm lg:text-base">{children}</span>
    </NavLink>
  );
}
