/* global gtag */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function GoogleAnalyticsReporter() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      // Ensure gtag is available
      gtag("config", "G-3PPHZYFY40", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}

export default GoogleAnalyticsReporter;
