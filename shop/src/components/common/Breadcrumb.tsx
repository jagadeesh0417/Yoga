import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: Props) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-wine-500 transition-colors">Home</Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          <HiChevronRight className="text-xs" />
          {crumb.to ? (
            <Link to={crumb.to} className="hover:text-wine-500 transition-colors">{crumb.label}</Link>
          ) : (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
