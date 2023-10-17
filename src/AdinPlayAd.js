import React, { useEffect } from "react";

const AdinPlayAd = ({ placementId }) => {
  useEffect(() => {
    // Check if the aiptag object is available
    if (window.aiptag && window.aiptag.cmd && window.aiptag.cmd.display) {
      window.aiptag.cmd.display.push(function () {
        window.aipDisplayTag.display(placementId);
      });
    }
  }, [placementId]);

  return <div id={placementId}></div>;
};

export default AdinPlayAd;
