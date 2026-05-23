import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const lastDispatchedValue = useRef(storedValue);

  const setValue = useCallback((value) => {
    try {
      setStoredValue((currentVal) => {
        return value instanceof Function ? value(currentVal) : value;
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Write to localStorage and dispatch event when state changes (outside render phase)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      
      if (lastDispatchedValue.current !== storedValue) {
        lastDispatchedValue.current = storedValue;
        window.dispatchEvent(new CustomEvent('local-storage', {
          detail: { key, value: storedValue }
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  // Listen to changes from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue((currentVal) => {
            if (currentVal === newValue) return currentVal;
            lastDispatchedValue.current = newValue;
            return newValue;
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail && e.detail.key === key) {
        const newValue = e.detail.value;
        setStoredValue((currentVal) => {
          if (currentVal === newValue) return currentVal;
          lastDispatchedValue.current = newValue;
          return newValue;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleCustomStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
