import { NavLink } from "react-router-dom";

export function IconButton({ to, children }) {
  const baseLink =
    "group flex items-center rounded-md transition-all duration-200 select-none";
  const inactive = "hover:bg-lightblue";
  const active = "bg-lightblue font-semibold";

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
      {/* Texto vem do Navbar */}
      
      <span className="text-sm lg:text-base">{children}</span>
    </NavLink>
  );
}
