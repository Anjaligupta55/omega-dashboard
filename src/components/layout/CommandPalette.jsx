import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Settings, Sparkles, LayoutDashboard, Package, BarChart2, Moon, Sun, ArrowRight } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { useTheme } from '../../hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';

const PAGES = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Toggle state with Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleOpenEvent);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleOpenEvent);
    };
  }, []);

  // Debounced search for products
  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await productApi.searchProducts({ query: search, limit: 5 });
        setProducts(res.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const actions = useMemo(() => [
    {
      name: `Switch to ${theme === 'dull' ? 'Bright' : 'Dull'} Mode`,
      icon: theme === 'dull' ? Sun : Moon,
      run: () => {
        toggleTheme();
        setIsOpen(false);
      }
    },
    {
      name: 'Download CSV Summary',
      icon: FileText,
      run: () => {
        window.dispatchEvent(new CustomEvent('trigger-csv-export'));
        setIsOpen(false);
      }
    }
  ], [theme, toggleTheme]);

  // Filter static options based on search query
  const filteredPages = useMemo(() => PAGES.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [search]);
  
  const filteredActions = useMemo(() => actions.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  ), [search, actions]);

  // Combine items to list for keyboard navigation
  const listItems = useMemo(() => [
    ...filteredPages.map(p => ({ type: 'page', ...p })),
    ...products.map(pr => ({ type: 'product', ...pr })),
    ...filteredActions.map(a => ({ type: 'action', ...a }))
  ], [filteredPages, products, filteredActions]);

  const handleSelect = useCallback((item) => {
    if (item.type === 'page') {
      navigate(item.path);
    } else if (item.type === 'product') {
      navigate(`/products/${item.id}`);
    } else if (item.type === 'action') {
      item.run();
    }
    setIsOpen(false);
    setSearch('');
  }, [navigate]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % listItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + listItems.length) % listItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (listItems[selectedIndex]) {
          handleSelect(listItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, listItems, handleSelect]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '10vh'
          }}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
          >
            {/* Input Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <Search size={20} className="text-secondary" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearch(val);
                  setSelectedIndex(0);
                  if (!val.trim()) {
                    setProducts([]);
                  }
                }}
                placeholder="Type a command or search products..."
                autoFocus
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
              <div 
                style={{
                  fontSize: '10px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: 'bold'
                }}
              >
                ESC
              </div>
            </div>

            {/* Results Body */}
            <div 
              style={{ 
                maxHeight: '380px', 
                overflowY: 'auto', 
                padding: '12px' 
              }}
              className="scrollbar-thin"
            >
              {loading ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-color)',
                    borderTopColor: 'var(--accent-primary)',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '8px'
                  }}></div>
                  <p style={{ fontSize: '13px' }}>Searching live catalog...</p>
                </div>
              ) : listItems.length === 0 ? (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Sparkles size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '14px' }}>No matches found</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {filteredPages.length > 0 && (
                    <>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pages</div>
                      {filteredPages.map((page, index) => {
                        const Icon = page.icon;
                        const globalIndex = index;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <div 
                            key={page.path}
                            onClick={() => handleSelect({ type: 'page', ...page })}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'between',
                              padding: '10px 12px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'var(--sidebar-active-bg)' : 'transparent',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div className="flex items-center gap-3" style={{ flex: 1 }}>
                              <Icon size={16} />
                              <span style={{ fontSize: '14px', fontWeight: '500', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{page.name}</span>
                            </div>
                            {isSelected && <ArrowRight size={14} />}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {products.length > 0 && (
                    <>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px' }}>Products</div>
                      {products.map((prod, index) => {
                        const globalIndex = filteredPages.length + index;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <div 
                            key={prod.id}
                            onClick={() => handleSelect({ type: 'product', ...prod })}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'between',
                              padding: '10px 12px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'var(--sidebar-active-bg)' : 'transparent',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div className="flex items-center gap-3" style={{ flex: 1 }}>
                              <img 
                                src={prod.thumbnail} 
                                alt={prod.title} 
                                style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '14px', fontWeight: '500', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{prod.title}</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>In {prod.category} • ${prod.price}</span>
                              </div>
                            </div>
                            {isSelected && <ArrowRight size={14} />}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {filteredActions.length > 0 && (
                    <>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', padding: '6px 12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px' }}>Commands</div>
                      {filteredActions.map((act, index) => {
                        const Icon = act.icon;
                        const globalIndex = filteredPages.length + products.length + index;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <div 
                            key={act.name}
                            onClick={() => handleSelect({ type: 'action', ...act })}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'between',
                              padding: '10px 12px',
                              borderRadius: '12px',
                              cursor: 'pointer',
                              backgroundColor: isSelected ? 'var(--sidebar-active-bg)' : 'transparent',
                              color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div className="flex items-center gap-3" style={{ flex: 1 }}>
                              <Icon size={16} />
                              <span style={{ fontSize: '14px', fontWeight: '500', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{act.name}</span>
                            </div>
                            {isSelected && <ArrowRight size={14} />}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer guide */}
            <div 
              style={{ 
                padding: '10px 20px', 
                borderTop: '1px solid var(--border-color)', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                gap: '16px',
                fontSize: '11px',
                color: 'var(--text-secondary)'
              }}
            >
              <div>↑↓ Navigate</div>
              <div>↵ Select</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
