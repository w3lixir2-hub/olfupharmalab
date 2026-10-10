(function(){
 const container=document.getElementById('report-qr-cards');
 Object.entries(LabReports.types).forEach(([type,title])=>{
  const url='https://olfupharmalab.vercel.app/laboratory-report.html?type='+type;
  const card=document.createElement('article');card.className='report-qr-card';
  const heading=document.createElement('h3');heading.textContent=title;
  const qr=document.createElement('img');qr.alt=title+' QR Code';qr.src='https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data='+encodeURIComponent(url);
  const open=document.createElement('a');open.className='btn btn-secondary';open.href=url;open.target='_blank';open.rel='noopener';open.textContent='Open Form';
  const copy=document.createElement('button');copy.className='btn btn-secondary';copy.textContent='Copy Link';copy.onclick=async()=>{try{await navigator.clipboard.writeText(url);copy.textContent='Copied';}catch{copy.textContent=url;}};
  const print=document.createElement('a');print.className='btn btn-primary';print.href='print-report-qr.html?type='+type;print.target='_blank';print.rel='noopener';print.textContent='Print Poster';
  card.append(heading,qr,open,copy,print);container.appendChild(card);
 });
})();
