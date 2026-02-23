// js/params.js - forward `porposal-by` query parameter to internal links and expose getter
(function(){
  function getProposalName(){
    try{
      return new URLSearchParams(window.location.search).get('porposal-by') || null;
    }catch(e){return null}
  }

  function getProposalEmail(){
    try{
      return new URLSearchParams(window.location.search).get('porposal-email') || null;
    }catch(e){return null}
  }

  // Append params to relative/internal hrefs as a string so file:// and GitHub Pages keep correct paths
  function appendParamsToHref(href, name, email){
    if(!name) return href;
    if(!href) return href;
    const low = href.trim();
    // ignore anchors, mailto, external links, protocols
    if(low.startsWith('#') || low.startsWith('mailto:') || low.startsWith('http') || low.startsWith('//') || low.startsWith('javascript:')) return href;
    // avoid double-adding
    if(href.indexOf('porposal-by=') !== -1) return href;
    const sep = href.indexOf('?') !== -1 ? '&' : '?';
    let out = href + sep + 'porposal-by=' + encodeURIComponent(name);
    if(email) out += '&porposal-email=' + encodeURIComponent(email);
    return out;
  }

  function forward(){
    const name = getProposalName();
    if(!name) return;
    const email = getProposalEmail();
    document.querySelectorAll('a[href]').forEach(a=>{
      const href = a.getAttribute('href');
      if(!href) return;
      const newHref = appendParamsToHref(href, name, email);
      if(newHref !== href) a.setAttribute('href', newHref);
    });
  }

  document.addEventListener('DOMContentLoaded', forward);

  // expose getter
  window.__proposal = window.__proposal || {};
  window.__proposal.getName = getProposalName;
  window.__proposal.getEmail = getProposalEmail;
})();
