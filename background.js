try {
  chrome.webNavigation.onDOMContentLoaded.addListener(checkForCookies);
} catch (err) {
  console.error(err)
}

function checkForCookies(e) {
  const { tabId, url } = e;
  const currentURL = new URL(url);
  if (currentURL.hostname === 'www.theguardian.com') {
    chrome.scripting.executeScript({
      target: { tabId },
      function: removeGuardianIframe,
    });
  }
}

function removeGuardianIframe() {
  let c = 0;
  const i = setInterval(() => {
    if (++c > 20) clearInterval(i); // search for 4 seconds at 250ms intervals
    document.querySelectorAll('iframe').forEach(iFrame => {
      if (!iFrame.src.startsWith('https://ccpa-notice.sp-prod.net')) return;
      const { parentElement } = iFrame;
      parentElement.remove();
      clearInterval(i);
    });
  }, 250);
}
