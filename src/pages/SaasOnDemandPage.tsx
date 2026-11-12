import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SaasOnDemandRequest } from '../types';

export const SaasOnDemandPage: React.FC = () => {
  const [category, setCategory] = useState('Operations & Workflow Automation');
  const [toolNameIdea, setToolNameIdea] = useState('');
  const [description, setDescription] = useState('');
  const [currentWorkaround, setCurrentWorkaround] = useState('');
  const [targetUsers, setTargetUsers] = useState('');

  // Contact fields (all optional)
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe what type of SaaS tool you need.');
      return;
    }

    setSubmitting(true);
    const newId = 'req_' + Date.now();
    const reqData: SaasOnDemandRequest = {
      id: newId,
      category,
      toolNameIdea: toolNameIdea.trim() || 'Custom SaaS Tool',
      description: description.trim(),
      currentWorkaround: currentWorkaround.trim(),
      targetUsers: targetUsers.trim(),
      email: email.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      phone: phone.trim() || undefined,
      instagram: instagram.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    // Save locally
    const existing: SaasOnDemandRequest[] = JSON.parse(
      localStorage.getItem('across_saas_on_demand_requests') || '[]'
    );
    existing.unshift(reqData);
    localStorage.setItem('across_saas_on_demand_requests', JSON.stringify(existing));

    // Also forward to backend API
    try {
      fetch('/api/saas-on-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData)
      }).catch(() => {});
    } catch (err) {}

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    setRequestId(newId);
    setSubmitted(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setDescription('');
    setToolNameIdea('');
    setCurrentWorkaround('');
    setTargetUsers('');
    setEmail('');
    setWhatsapp('');
    setPhone('');
    setInstagram('');
    setSubmitted(false);
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '40px 0 80px 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--blue-primary)',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 700
            }}
          >
            ← Back to Across Suite
          </a>
        </div>

        {/* Page Hero Header */}
        <div className="saas-demand-box" style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid var(--border-light)',
          borderRadius: 'var(--radius-bento)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: 'var(--blue-primary)',
            marginBottom: '14px'
          }}>
            <span>⚡</span> ACROSS PRODUCT STUDIO
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 4.5vw, 46px)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            color: 'var(--ink)',
            lineHeight: 1.15,
            marginBottom: '14px'
          }}>
            SaaS on Demand
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--slate)',
            maxWidth: '620px',
            margin: '0 auto 18px auto',
            lineHeight: 1.6
          }}>
            Have a repetitive workflow, a missing integration, or bloated software your team hates using? Tell our founding engineering team what tool you want us to build.
          </p>

          <div className="saas-demand-pill-row" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#059669',
            background: '#ECFDF5',
            padding: '8px 18px',
            borderRadius: '9999px',
            border: '1px solid #A7F3D0',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span>✓ Built by Senior Product Engineers</span>
            <span>✓ Rapid 48–72h Prototypes</span>
            <span>✓ Focused & Lightweight</span>
          </div>
        </div>

        {/* Main Form or Success Card */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="saas-demand-box"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-light)',
              borderRadius: 'var(--radius-bento)',
              padding: '36px 32px',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Section 1: Tool Details */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--ink)',
                marginBottom: '18px',
                borderBottom: '1px solid #F1F5F9',
                paddingBottom: '10px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--lime)',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}>1</span>
                What type of SaaS do you want?
              </div>

              {/* Category Dropdown */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  SaaS Category / Domain <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                    outline: 'none'
                  }}
                >
                  <option value="Operations & Workflow Automation">Operations & Workflow Automation</option>
                  <option value="Customer Support & QA">Customer Support & QA Automation</option>
                  <option value="Client Reporting & Analytics">Client Reporting & Analytics</option>
                  <option value="Finance & Invoicing Automation">Finance & Invoicing Automation</option>
                  <option value="Task, Meeting & Decision Tracking">Task, Meeting & Decision Tracking</option>
                  <option value="Inventory, Wholesale & B2B Orders">Inventory, Wholesale & B2B Orders</option>
                  <option value="CA, Accounting & Tax Workflows">CA, Accounting & Tax Workflows</option>
                  <option value="Reputation & Review Management">Reputation & Review Management</option>
                  <option value="Custom Internal SaaS Tool / Other">Custom Internal SaaS Tool / Other</option>
                </select>
              </div>

              {/* Tool Working Title */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  Working Title / Name Idea <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 500 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={toolNameIdea}
                  onChange={(e) => setToolNameIdea(e.target.value)}
                  placeholder="e.g. Across AutoReconcile, ClientPortal Mini, WhatsApp Ticket Desk"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Core Description */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  Describe what the SaaS tool should do <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what problem this solves, the inputs it receives (e.g. PDFs, WhatsApp chats, Google Sheets), and what output or report it should generate..."
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Current Workaround / Bloated Tool Replaced */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  What software or manual process does this replace? <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 500 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={currentWorkaround}
                  onChange={(e) => setCurrentWorkaround(e.target.value)}
                  placeholder="e.g. Tedious manual Excel sheets, bloated Salesforce/Zendesk, copying WhatsApp chats"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Target Team / Users */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                  Who will use this tool? <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 500 }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  placeholder="e.g. 5 support agents, solo consultant, finance manager, CA firm staff"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Section 2: Contact Details (ALL OPTIONAL) */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--ink)',
                marginBottom: '10px',
                borderBottom: '1px solid #F1F5F9',
                paddingBottom: '10px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#BAE6FD',
                  color: 'var(--blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}>2</span>
                How can we contact you?
              </div>
              <p style={{ fontSize: '13px', color: 'var(--slate)', marginBottom: '18px' }}>
                Where should our founding engineers send early prototypes, updates, or follow-up questions? All channels below are completely optional:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* Email (Optional) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                    <span>✉️ Email</span>
                    <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>optional</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* WhatsApp (Optional) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                    <span>💬 WhatsApp</span>
                    <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>optional</span>
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210 or with country code"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Phone Number (Optional) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                    <span>📞 Phone Number</span>
                    <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>optional</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000 or phone"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Instagram (Optional) */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
                    <span>📸 Instagram</span>
                    <span style={{ fontSize: '11px', color: 'var(--slate-light)', fontWeight: 600 }}>optional</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@yourhandle or profile link"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ paddingTop: '10px' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-lime"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  fontSize: '15px'
                }}
              >
                {submitting ? 'Submitting to Founders...' : 'Submit SaaS Request 🚀'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--slate-light)', marginTop: '12px' }}>
                We review every submission directly. Zero spam, zero sales pitches.
              </div>
            </div>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #A7F3D0',
            borderRadius: 'var(--radius-bento)',
            padding: '48px 36px',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#065F46', marginBottom: '8px' }}>
              SaaS on Demand Request Received!
            </h2>
            <p style={{ fontSize: '15px', color: '#047857', maxWidth: '540px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
              Thank you! Our engineering team has logged your request <strong>(ID: #{requestId})</strong>. We build and evaluate functional prototypes in 48–72 hours.
            </p>

            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '14px',
              padding: '18px',
              maxWidth: '520px',
              margin: '0 auto 28px auto',
              textAlign: 'left',
              fontSize: '13px',
              color: '#166534'
            }}>
              <div style={{ fontWeight: 800, marginBottom: '6px' }}>Summary of Your Request:</div>
              <div>• <strong>Category:</strong> {category}</div>
              <div>• <strong>Tool Idea:</strong> {toolNameIdea || 'Custom Tool'}</div>
              <div>• <strong>Details:</strong> {description.slice(0, 100)}...</div>
              {(email || whatsapp || phone || instagram) && (
                <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #A7F3D0' }}>
                  • <strong>Contact Channel:</strong> {[email, whatsapp, phone, instagram].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={handleReset}
                style={{ padding: '12px 24px', fontSize: '13.5px' }}
              >
                Submit Another Request
              </button>
              <a
                href="/"
                className="btn-outline"
                style={{ padding: '12px 24px', fontSize: '13.5px' }}
              >
                Back to Across Suite
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

