import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const FILTER_OPTIONS = [
  { key: 'numbers', label: 'Numbers', icon: '🔢' },
  { key: 'alphabets', label: 'Alphabets', icon: '🔤' },
  { key: 'highest_lowercase_alphabet', label: 'Highest Lowercase', icon: '⬆️' },
];

export default function Home() {
  const [jsonInput, setJsonInput] = useState('{"data": ["A","1","b","2","Z","d"]}');
  const [selectedFilters, setSelectedFilters] = useState(['numbers', 'alphabets', 'highest_lowercase_alphabet']);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleFilter = (key) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    setError('');
    setResponse(null);
    setLoading(true);

    let parsed;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setError('❌ Invalid JSON. Please check your input.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setResponse(data);
    } catch (err) {
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResponse = response
    ? Object.fromEntries(
        Object.entries(response).filter(
          ([key]) =>
            !['numbers', 'alphabets', 'highest_lowercase_alphabet'].includes(key) ||
            selectedFilters.includes(key)
        )
      )
    : null;

  return (
    <>
      <Head>
        <title>BFHL API Round | Bajaj Finserv HackRound</title>
        <meta
          name="description"
          content="BFHL API Qualifier - Bajaj Finserv HackRound submission by Diya Wadhwa"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Qualifier Round 1
          </div>
          <h1 className={styles.title}>
            BFHL <span className={styles.titleAccent}>API</span> Round
          </h1>
          <p className={styles.subtitle}>
            Bajaj Finserv HackRound · Data Processing API
          </p>
        </header>

        {/* Card */}
        <div className={styles.card}>
          {/* Input Section */}
          <section className={styles.section}>
            <label className={styles.label} htmlFor="json-input">
              <span className={styles.labelIcon}>📥</span>
              JSON Input
            </label>
            <textarea
              id="json-input"
              className={styles.textarea}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='{"data": ["A","1","b","2"]}'
              rows={4}
              spellCheck={false}
            />
            <p className={styles.hint}>
              Provide an array of strings under the{' '}
              <code className={styles.code}>"data"</code> key
            </p>
          </section>

          {/* Filter Section */}
          <section className={styles.section}>
            <label className={styles.label}>
              <span className={styles.labelIcon}>🎛️</span>
              Filter Response Fields
            </label>
            <div className={styles.dropdownWrapper}>
              <button
                id="filter-dropdown-btn"
                className={styles.dropdownBtn}
                onClick={() => setDropdownOpen((o) => !o)}
                type="button"
              >
                <span>
                  {selectedFilters.length === 0
                    ? 'Select fields to display…'
                    : selectedFilters.map((k) => FILTER_OPTIONS.find((o) => o.key === k)?.label).join(', ')}
                </span>
                <span
                  className={styles.dropdownArrow}
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  ▾
                </span>
              </button>
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {FILTER_OPTIONS.map((opt) => {
                    const checked = selectedFilters.includes(opt.key);
                    return (
                      <label key={opt.key} className={styles.dropdownItem}>
                        <input
                          type="checkbox"
                          id={`filter-${opt.key}`}
                          checked={checked}
                          onChange={() => toggleFilter(opt.key)}
                          className={styles.checkbox}
                        />
                        <span className={styles.dropdownIcon}>{opt.icon}</span>
                        <span>{opt.label}</span>
                        {checked && <span className={styles.checkmark}>✓</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <button
            id="submit-btn"
            className={`${styles.submitBtn} ${loading ? styles.loading : ''}`}
            onClick={handleSubmit}
            disabled={loading}
            type="button"
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Processing…
              </>
            ) : (
              <>
                <span>🚀</span>
                Submit Request
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className={styles.errorBox} role="alert">
              {error}
            </div>
          )}

          {/* Response */}
          {filteredResponse && (
            <section className={styles.responseSection}>
              <div className={styles.responseHeader}>
                <span className={styles.successBadge}>✅ Success</span>
                <span className={styles.responseLabel}>API Response</span>
              </div>
              <div className={styles.responseGrid}>
                {Object.entries(filteredResponse).map(([key, value]) => (
                  <div key={key} className={styles.responseCard}>
                    <div className={styles.responseCardKey}>{key}</div>
                    <div className={styles.responseCardValue}>
                      {Array.isArray(value) ? (
                        value.length === 0 ? (
                          <span className={styles.empty}>[ empty ]</span>
                        ) : (
                          <div className={styles.tagRow}>
                            {value.map((v, i) => (
                              <span key={i} className={styles.tag}>
                                {v}
                              </span>
                            ))}
                          </div>
                        )
                      ) : typeof value === 'boolean' ? (
                        <span className={value ? styles.boolTrue : styles.boolFalse}>
                          {String(value)}
                        </span>
                      ) : (
                        <span className={styles.scalar}>{value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <details className={styles.rawDetails}>
                <summary className={styles.rawSummary}>View raw JSON</summary>
                <pre className={styles.rawJson}>
                  {JSON.stringify(filteredResponse, null, 2)}
                </pre>
              </details>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <span>Built for</span>
          <span className={styles.footerAccent}> Bajaj Finserv HackRound</span>
          <span> · Qualifier 1</span>
        </footer>
      </main>
    </>
  );
}
