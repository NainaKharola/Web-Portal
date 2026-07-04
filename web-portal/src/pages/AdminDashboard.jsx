import { useEffect, useMemo, useState } from "react";
import DashboardCards from "../components/Admin/DashboardCards";
import FilterBar from "../components/Admin/FilterBar";
import SearchBar from "../components/Admin/SearchBar";
import SortControls from "../components/Admin/SortControls";
import StudentTable from "../components/Admin/StudentTable";
import { clearAdminToken, fetchAdminStudents } from "../services/adminService";
import "../styles/admin.css";

const initialFilters = {
  collegeName: "",
  branch: "",
  year: "",
  status: "",
  registrationDate: "",
};

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState({ sortBy: "submittedAt", sortOrder: "desc" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(
    () => ({
      search,
      ...filters,
      ...sort,
    }),
    [filters, search, sort]
  );

  useEffect(() => {
    let ignore = false;

    async function loadStudents() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchAdminStudents(query);
        if (ignore) return;
        setStudents(response.students);
        setSummary(response.summary);
      } catch (err) {
        if (err.message.toLowerCase().includes("token")) {
          clearAdminToken();
          window.history.pushState({}, "", "/admin/login");
          window.dispatchEvent(new PopStateEvent("popstate"));
          return;
        }

        setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadStudents();

    return () => {
      ignore = true;
    };
  }, [query]);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const response = await fetchAdminStudents({
          sortBy: "submittedAt",
          sortOrder: "desc",
        });
        setAllStudents(response.students);
      } catch {
        setAllStudents([]);
      }
    }

    loadFilterOptions();
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    window.history.pushState({}, "", "/admin/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const openStudent = (id) => {
    window.history.pushState({}, "", `/admin/students/${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="portal-eyebrow">Admin Panel</p>
          <h1>Student Applications</h1>
        </div>
        <button className="secondary-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <DashboardCards summary={summary} />

      <section className="admin-panel">
        <div className="admin-panel__header">
          <SearchBar value={search} onChange={setSearch} />
          <SortControls sort={sort} onChange={setSort} />
        </div>

        <FilterBar
          filters={filters}
          onChange={setFilters}
          students={allStudents}
        />

        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <div className="admin-loading">Loading applications...</div>
        ) : (
          <StudentTable students={students} onView={openStudent} />
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
