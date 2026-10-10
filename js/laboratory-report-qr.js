(function(){
 const container=document.getElementById('report-qr-cards');
  const title='Laboratory Reports';
  const url='https://olfupharmalab.vercel.app/laboratory-reports.html';
  const card=document.createElement('article');card.className='report-qr-card';
  const heading=document.createElement('h3');heading.textContent=title;
  const qr=document.createElement('img');qr.alt=title+' QR Code';qr.src='https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data='+encodeURIComponent(url);
  const description=document.createElement('p');description.textContent='Scan once, then choose Breakage, Lab Incident, Lab Concerns, or Lab Session Report.';
  const open=document.createElement('a');open.className='btn btn-secondary';open.href=url;open.target='_blank';open.rel='noopener';open.textContent='Choose Report';
  const copy=document.createElement('button');copy.className='btn btn-secondary';copy.textContent='Copy Link';copy.onclick=async()=>{try{await navigator.clipboard.writeText(url);copy.textContent='Copied';}catch{copy.textContent=url;}};
  const print=document.createElement('a');print.className='btn btn-primary';print.href='print-report-qr.html';print.target='_blank';print.rel='noopener';print.textContent='Print Poster';
  card.append(heading,description,qr,open,copy,print);container.appendChild(card);
})();
