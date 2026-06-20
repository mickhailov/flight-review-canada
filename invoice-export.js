(function(){
  const rates={advanced:125,complex:250};
  const taxes={AB:.05,BC:.05,MB:.05,NB:.15,NL:.15,NS:.14,NT:.05,NU:.05,ON:.13,PE:.15,QC:.05,SK:.05,YT:.05};
  const provinces={AB:'Alberta',BC:'British Columbia',MB:'Manitoba',NB:'New Brunswick',NL:'Newfoundland and Labrador',NS:'Nova Scotia',NT:'Northwest Territories',NU:'Nunavut',ON:'Ontario',PE:'Prince Edward Island',QC:'Quebec',SK:'Saskatchewan',YT:'Yukon'};
  const clean=value=>String(value||'').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x20-\x7E]/g,'?');
  const money=value=>`$${Number(value).toFixed(2)}`;
  const localIsoDate=()=>{const d=new Date(),pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  let activeUrl='',activeName='',activeFile=null;
  const setStatus=(message,error=false)=>{const el=document.querySelector('#invoiceStatus');if(el){el.textContent=message;el.classList.toggle('error',error)}};
  const restore=()=>{const link=document.querySelector('#downloadInvoice');if(!link||!activeUrl)return;link.href=activeUrl;link.download=activeName;link.hidden=false};
  window.restoreInvoiceDownload=restore;

  function values(){
    const {state}=window.flightReviewApp,invoice=state.invoice||{};
    const rate=rates[invoice.reviewType]||125,travel=Math.max(0,Number(invoice.travel)||0),subtotal=rate+travel;
    const taxRate=invoice.taxRegistered?(taxes[invoice.province]||0):0,tax=subtotal*taxRate;
    return {state,invoice,rate,travel,subtotal,taxRate,tax,total:subtotal+tax};
  }
  function invoiceNumber(state,invoice){return invoice.number||`VA-${state.fields.reviewDate?.replaceAll('-','')||localIsoDate().replaceAll('-','')}`}

  window.invoiceEmailHref=function(){
    const {state,invoice,total}=values(),number=invoiceNumber(state,invoice);
    const subject=`Flight review invoice ${number}`;
    const body=`Hello Volatus Academy,\n\nPlease find attached invoice ${number} for ${state.fields.candidateName||'the completed flight review'} in the amount of ${money(total)}. The signed assessment has been uploaded to the Volatus Academy Flight Reviewer Portal.\n\nRegards,\n${invoice.businessName||state.fields.reviewerName||''}`;
    return `mailto:academy@volatusaerospace.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  async function buildInvoicePdf(download=true){
    const button=document.querySelector('#exportInvoice');
    try{
      if(!window.PDFLib)throw new Error('PDF writer did not load.');
      const {PDFDocument,StandardFonts,rgb}=window.PDFLib;
      const {state,invoice,rate,travel,subtotal,taxRate,tax,total}=values(),businessName=invoice.businessName||state.fields.reviewerName;
      if(!businessName)throw new Error('Enter your legal or business name.');
      if(!invoice.businessAddress)throw new Error('Enter your mailing address.');
      if(invoice.taxRegistered&&!invoice.taxNumber)throw new Error('Enter your GST/HST registration number.');
      if(button){button.disabled=true;button.textContent='Generating invoice...'}setStatus('Building invoice...');
      const pdf=await PDFDocument.create(),page=pdf.addPage([612,792]);
      const regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
      const ink=rgb(.04,.10,.11),muted=rgb(.36,.43,.43),green=rgb(.52,.72,.22),gold=rgb(.95,.62,.08),paper=rgb(.96,.97,.95),line=rgb(.78,.82,.80);
      page.drawRectangle({x:0,y:0,width:612,height:792,color:paper});page.drawRectangle({x:0,y:686,width:612,height:106,color:ink});
      page.drawText('VOLATUS AEROSPACE',{x:40,y:751,size:10,font:bold,color:gold});page.drawText('FLIGHT REVIEWER INVOICE',{x:40,y:715,size:24,font:bold,color:paper});
      const number=invoiceNumber(state,invoice);
      page.drawText(`INVOICE  ${clean(number)}`,{x:430,y:752,size:9,font:bold,color:paper});page.drawText(`DATE  ${localIsoDate()}`,{x:430,y:731,size:8,font:regular,color:rgb(.72,.78,.76)});
      page.drawText('FROM',{x:40,y:648,size:8,font:bold,color:muted});page.drawText(clean(businessName),{x:40,y:628,size:12,font:bold,color:ink});
      page.drawText(clean(invoice.businessAddress),{x:40,y:610,size:8,font:regular,color:muted,maxWidth:235});if(invoice.businessEmail)page.drawText(clean(invoice.businessEmail),{x:40,y:592,size:8,font:regular,color:muted});
      if(invoice.taxRegistered)page.drawText(`GST/HST  ${clean(invoice.taxNumber)}`,{x:40,y:574,size:8,font:regular,color:muted});
      page.drawText('BILL TO',{x:330,y:648,size:8,font:bold,color:muted});page.drawText('Volatus Academy',{x:330,y:628,size:12,font:bold,color:ink});page.drawText('6221 Highway 7, Unit #5',{x:330,y:610,size:8,font:regular,color:muted});page.drawText('Vaughan, Ontario  L4H 0K8  Canada',{x:330,y:594,size:8,font:regular,color:muted});page.drawText('academy@volatusaerospace.com',{x:330,y:578,size:8,font:regular,color:muted});
      const top=514;page.drawRectangle({x:40,y:top,width:532,height:30,color:ink});page.drawText('DESCRIPTION',{x:52,y:top+11,size:8,font:bold,color:paper});page.drawText('AMOUNT',{x:510,y:top+11,size:8,font:bold,color:paper});
      const service=invoice.reviewType==='complex'?'Level 1 Complex Flight Review':'Advanced RPAS Flight Review';
      page.drawText(service,{x:52,y:top-26,size:10,font:bold,color:ink});page.drawText(`Candidate: ${clean(state.fields.candidateName||'Not specified')}  |  Review: ${clean(state.fields.reviewDate||'Not specified')}  |  ${provinces[invoice.province]||invoice.province}`,{x:52,y:top-43,size:7.5,font:regular,color:muted});page.drawText(money(rate),{x:510,y:top-26,size:10,font:bold,color:ink});
      let rowY=top-76;if(travel>0){page.drawLine({start:{x:40,y:rowY+16},end:{x:572,y:rowY+16},thickness:.7,color:line});page.drawText('Approved travel expenses',{x:52,y:rowY,size:9,font:regular,color:ink});page.drawText(money(travel),{x:510,y:rowY,size:9,font:bold,color:ink});rowY-=36}
      page.drawLine({start:{x:350,y:rowY},end:{x:572,y:rowY},thickness:.8,color:line});
      const taxName=['NB','NL','NS','ON','PE'].includes(invoice.province)?'HST':'GST';
      const summary=[['Subtotal',subtotal],[invoice.taxRegistered?`${taxName} (${(taxRate*100).toFixed(0)}%)`:`${taxName} (not charged)`,tax],['TOTAL',total]];
      summary.forEach(([label,value],index)=>{const y=rowY-26-index*31;page.drawText(label,{x:372,y,size:index===2?11:8,font:index===2?bold:regular,color:index===2?ink:muted});page.drawText(money(value),{x:510,y,size:index===2?13:9,font:bold,color:index===2?green:ink})});
      page.drawRectangle({x:40,y:88,width:532,height:82,color:rgb(.90,.93,.90)});page.drawText('SUBMISSION CONFIRMATION',{x:54,y:145,size:8,font:bold,color:green});page.drawText('Transport Canada result updated  /  Signed assessment uploaded to Volatus Academy portal',{x:54,y:122,size:8,font:regular,color:ink});page.drawText('Payment correspondence: academy@volatusaerospace.com',{x:54,y:103,size:8,font:regular,color:muted});
      page.drawText('Thank you',{x:40,y:46,size:9,font:bold,color:ink});page.drawText('Flight reviewer services for Volatus Academy',{x:105,y:46,size:8,font:regular,color:muted});
      pdf.setTitle(`Invoice ${clean(number)}`);pdf.setAuthor(clean(businessName));pdf.setSubject('Volatus Academy flight reviewer services');
      const output=await pdf.save(),blob=new Blob([output],{type:'application/pdf'});if(activeUrl)URL.revokeObjectURL(activeUrl);activeUrl=URL.createObjectURL(blob);activeName=`invoice-${clean(number).replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.pdf`;activeFile=new File([blob],activeName,{type:'application/pdf'});restore();if(download)document.querySelector('#downloadInvoice')?.click();setStatus(`Invoice ready — ${money(total)}.`);return activeFile;
    }catch(error){console.error(error);setStatus(error.message||'Unable to generate invoice.',true);throw error}finally{if(button){button.disabled=false;button.textContent='Generate invoice PDF'}}
  }

  window.generateInvoicePdf=()=>buildInvoicePdf(true).catch(()=>{});

  window.emailInvoice=async function(){
    try{
      const file=await buildInvoicePdf(false);
      const {state,invoice,total}=values(),number=invoiceNumber(state,invoice);
      const shareData={
        files:[file],
        title:`Flight review invoice ${number}`,
        text:`Invoice ${number} for ${state.fields.candidateName||'the completed flight review'} — ${money(total)}. Send to academy@volatusaerospace.com.`
      };
      if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
        setStatus('Choose Mail to send the attached invoice.');
        await navigator.share(shareData);
        setStatus('Invoice shared with your email app.');
        return;
      }
      restore();document.querySelector('#downloadInvoice')?.click();
      setStatus('Invoice downloaded. Attach it to the email that just opened.');
      window.location.href=window.invoiceEmailHref();
    }catch(error){
      if(error?.name==='AbortError'){setStatus('Email cancelled. Your invoice is still ready.');return}
      console.error(error);
      if(activeFile){restore();document.querySelector('#downloadInvoice')?.click();setStatus('Invoice downloaded. Attach it to the email that just opened.');window.location.href=window.invoiceEmailHref()}
    }
  };
  window.addEventListener('beforeunload',()=>{if(activeUrl)URL.revokeObjectURL(activeUrl)});
})();
