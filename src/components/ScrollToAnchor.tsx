// ScrollToAnchor.tsx (New file - place this in your components folder, e.g., src/components/ui/ScrollToAnchor.tsx)
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToAnchor() {
  const location = useLocation();
  const lastHash = useRef('');

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // save hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document.getElementById(lastHash.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        lastHash.current = '';
      }, 100);
    }
  }, [location]);

  return null;
}
