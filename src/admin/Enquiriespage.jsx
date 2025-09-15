import React, { useEffect, useState } from 'react';
import './EnquiriesPage.css';

const statusColor = {
  'In Progress': 'status-progress',
  Resolved: 'status-resolved',
};

const Enquiriespage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await fetch('/api/inquiries');
        const data = await res.json();

        if (res.ok) {
          const formatted = data
            .map((e) => {
              const created = new Date(e.createdAt || Date.now());
              return {
                id: e._id,
                name: e.name,
                email: e.email,
                phone: e.contact,
                message: e.inquiryMessage || e.message, // ✅ Fallback here
                receivedDate: created.toLocaleDateString(),
                receivedTime: created.toLocaleTimeString(),
                createdAt: created,
                status: e.status || 'In Progress',
              };
            })
            .sort((a, b) => b.createdAt - a.createdAt);

          setEnquiries(formatted);
        } else {
          console.error('Failed to fetch enquiries:', data.message);
        }
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const handleRespond = (enquiry) => {
    const subject = encodeURIComponent('Response to your inquiry');
    const body = encodeURIComponent(
      `Hi ${enquiry.name},\n\nThank you for your message:\n"${enquiry.message}"\n\n[Type your reply here]\n\nBest regards,\nAllure Homez`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${enquiry.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const data = await res.json();

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: data.inquiry.status } : e))
      );
    } catch (err) {
      console.error(err);
      alert('Could not update status');
    }
  };

  const filteredEnquiries = enquiries
  .filter((e) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Resolved') return e.status === 'Resolved';
    if (activeTab === 'In Progress') return e.status !== 'Resolved';
    return true;
  })
  .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page-wrapper">
      <div className="enquiries-container">
        <h1>Customer Inquiries</h1>
        <p className="subtitle">View and respond to customer messages</p>

        <div className="filter-tabs">
          {['All', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}{' '}
              <span
                className={`count ${
                  tab === 'Resolved' ? 'green' : tab === 'In Progress' ? 'yellow' : ''
                }`}
              >
                {tab === 'All'
                  ? enquiries.length
                  : enquiries.filter((e) =>
                      tab === 'Resolved' ? e.status === 'Resolved' : e.status !== 'Resolved'
                    ).length}
              </span>
            </button>
          ))}
        </div>

        <div className="enquiry-list">
          {loading ? (
            <p>Loading...</p>
          ) : filteredEnquiries.length === 0 ? (
            <p>No inquiries found.</p>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="enquiry-card">
                <div className="enquiry-header">
                  <div>
                    <strong>{enquiry.name}</strong>
                    <p>
                      {enquiry.email} • {enquiry.phone}
                    </p>
                  </div>
                  <div className={`status-tag ${statusColor[enquiry.status]}`}>
                    {enquiry.status === 'In Progress' && '🕒 '}
                    {enquiry.status === 'Resolved' && '✅ '}
                    {enquiry.status}
                  </div>
                </div>

                <div className="enquiry-body">
                  <p>{enquiry.message}</p>
                  <span className="received">
                    Received on <strong>{enquiry.receivedDate}</strong> at{' '}
                    {enquiry.receivedTime}
                  </span>
                </div>

                {enquiry.status !== 'Resolved' && (
                  <div className="respond-button-container">
                    <button
                      className="respond-button"
                      onClick={() => handleRespond(enquiry)}
                    >
                      Respond
                    </button>
                    <button
                      className="status-button green"
                      onClick={() => updateStatus(enquiry.id, 'Resolved')}
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Enquiriespage;
