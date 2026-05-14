import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [results, setResults] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/notifications`)
      .then(res => res.json())
      .then(setNotifications);
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/jobs`)
      .then(res => res.json())
      .then(setJobs);
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/results`)
      .then(res => res.json())
      .then(setResults);
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/admit_cards`)
      .then(res => res.json())
      .then(setAdmitCards);
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/categories`)
      .then(res => res.json())
      .then(setCategories);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-2">Notifications</h2>
          <table className="min-w-full bg-white border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Message</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id}>
                  <td className="border px-2 py-1">{n.id}</td>
                  <td className="border px-2 py-1">{n.title}</td>
                  <td className="border px-2 py-1">{n.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Jobs</h2>
          <table className="min-w-full bg-white border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Department</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td className="border px-2 py-1">{j.id}</td>
                  <td className="border px-2 py-1">{j.title}</td>
                  <td className="border px-2 py-1">{j.department || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <table className="min-w-full bg-white border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id}>
                  <td className="border px-2 py-1">{r.id}</td>
                  <td className="border px-2 py-1">{r.title}</td>
                  <td className="border px-2 py-1">{r.status || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Admit Cards</h2>
          <table className="min-w-full bg-white border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Exam Date</th>
              </tr>
            </thead>
            <tbody>
              {admitCards.map(a => (
                <tr key={a.id}>
                  <td className="border px-2 py-1">{a.id}</td>
                  <td className="border px-2 py-1">{a.title}</td>
                  <td className="border px-2 py-1">{a.exam_date || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <table className="min-w-full bg-white border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td className="border px-2 py-1">{c.id}</td>
                  <td className="border px-2 py-1">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
