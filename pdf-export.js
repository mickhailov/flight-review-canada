(function(){
  const gradeRows={
    1:{page:0,tops:[283.5,298.2,312.8,327.4,342.1,356.7,400.9,415.5,430.2,444.8]},
    2:{page:0,tops:[549.9,564.6,579.2,593.8,608.5,623.1,667.0,681.9,696.6,711.2]},
    3:{page:1,tops:[113.8,133.8,151.0,165.9,183.2]},
    4:{page:1,tops:[244.4,259.0,273.7]},
    5:{page:1,tops:[329.6,415.3,478.9,556.9,571.5,588.8]},
    6:{page:1,tops:[641.6,656.2,670.9,688.2,705.2]},
    7:{page:2,tops:[116.7,131.4,148.6,195.4,210.1,224.7]},
    8:{page:2,tops:[280.6,295.3,309.9,327.2,373.8,388.4,403.0,417.7,432.3]}
  };
  const gradeX={critical:472.2,major:500.6,minor:528.9,pass:557.2};
  const clean=value=>String(value||'').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x20-\x7E]/g,'?');
  const withoutPrefix=(value,prefix)=>clean(value).replace(new RegExp(`^${prefix}\\s*`,'i'),'');
  const bytesFromBase64=base64=>Uint8Array.from(atob(base64),char=>char.charCodeAt(0));
  const setStatus=(message,error=false)=>{const el=document.querySelector('#exportStatus');if(el){el.textContent=message;el.classList.toggle('error',error)}};
  let activePdfUrl='',activePdfName='';
  const restorePdfDownload=()=>{const link=document.querySelector('#downloadPdf');if(!link||!activePdfUrl)return;link.href=activePdfUrl;link.download=activePdfName;link.hidden=false};
  window.restorePdfDownload=restorePdfDownload;

  function fitText(page,text,x,top,maxWidth,font,size=8,color){
    text=clean(text);if(!text)return;
    while(size>5&&font.widthOfTextAtSize(text,size)>maxWidth)size-=.5;
    page.drawText(text,{x,y:792-top-size,size,font,color,maxWidth});
  }
  function mark(page,x,top,font,color){page.drawText('X',{x,y:792-top-8.2,size:8.5,font,color});}
  function wrap(text,font,size,width){
    const words=clean(text).split(/\s+/),lines=[];let line='';
    for(const word of words){const next=line?`${line} ${word}`:word;if(font.widthOfTextAtSize(next,size)<=width)line=next;else{if(line)lines.push(line);line=word}}
    if(line)lines.push(line);return lines;
  }
  function drawParagraph(page,text,x,top,width,font,size=8,lineHeight=10,maxLines=7,color){
    const lines=wrap(text,font,size,width).slice(0,maxLines);lines.forEach((line,index)=>page.drawText(line,{x,y:792-top-size-index*lineHeight,size,font,color}));return lines.length*lineHeight;
  }
  function addNotesPages(pdfDoc,notes,regular,bold,black,gold,muted){
    if(!notes.length)return;
    let page,y;
    const newPage=()=>{page=pdfDoc.addPage([612,792]);page.drawRectangle({x:0,y:742,width:612,height:50,color:black});page.drawText('VOLATUS AEROSPACE',{x:36,y:760,size:11,font:bold,color:gold});page.drawText('FLIGHT REVIEW - SUPPLEMENTAL REVIEWER NOTES',{x:36,y:746,size:8,font:regular,color:muted});y=716};
    newPage();
    notes.forEach(note=>{
      const titleLines=wrap(`${note.number}  ${note.question}`,bold,8,528);const noteLines=wrap(note.note,regular,8,528);const height=titleLines.length*10+noteLines.length*10+28;
      if(y-height<46)newPage();
      page.drawText(`${note.section}  /  ${note.grade.toUpperCase()}`,{x:36,y,size:7,font:bold,color:gold});y-=13;
      titleLines.forEach(line=>{page.drawText(line,{x:36,y,size:8,font:bold,color:black});y-=10});y-=3;
      noteLines.forEach(line=>{page.drawText(line,{x:36,y,size:8,font:regular,color:black});y-=10});
      page.drawLine({start:{x:36,y:y-7},end:{x:576,y:y-7},thickness:.5,color:muted});y-=21;
    });
  }

  window.generateFilledPdf=async function(){
    const button=document.querySelector('#exportPdf');
    try{
      if(!window.PDFLib)throw new Error('PDF writer did not load.');
      if(!window.FR_ASSESSMENT_PDF_BASE64)throw new Error('Assessment PDF template did not load.');
      if(button){button.disabled=true;button.textContent='Generating PDF...'}setStatus('Building the completed assessment...');
      const {PDFDocument,StandardFonts,rgb}=window.PDFLib;
      const {state,sections,flat}=window.flightReviewApp;
      const pdfDoc=await PDFDocument.load(bytesFromBase64(window.FR_ASSESSMENT_PDF_BASE64));
      const pages=pdfDoc.getPages(),regular=await pdfDoc.embedFont(StandardFonts.Helvetica),bold=await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const black=rgb(0,0,0),red=rgb(.78,.08,.04),gold=rgb(.92,.58,0),muted=rgb(.45,.45,.45);

      fitText(pages[0],state.fields.candidateName,114,108,270,regular,8,black);
      fitText(pages[0],state.fields.reviewDate,98,124,80,regular,7.5,black);
      fitText(pages[0],state.fields.reviewTime,208,124,47,regular,7.5,black);
      fitText(pages[0],state.fields.location,299,124,91,regular,7.5,black);
      fitText(pages[0],withoutPrefix(state.fields.pilotCertificate,'PC-'),198,141,185,regular,8,black);
      fitText(pages[0],withoutPrefix(state.fields.tcAccount,'TC-'),198,158,175,regular,8,black);
      const eligibility=[state.checks[0],state.fields.residence?'yes':'no',state.checks[1],state.checks[2]],eligibilityTops=[108.1,124.6,141.4,158.0];
      eligibility.forEach((value,index)=>{if(value)mark(pages[0],value==='yes'?557.2:529.0,eligibilityTops[index],bold,value==='no'?red:black)});
      fitText(pages[0],state.checks[3]?state.checks[3].toUpperCase():'',304,174,44,bold,8,state.checks[3]==='no'?red:black);

      const notes=[];
      flat.forEach((step,stepIndex)=>{
        if(step.item===undefined)return;
        const grade=state.grades[stepIndex],row=gradeRows[step.section];
        if(grade&&row)mark(pages[row.page],gradeX[grade],row.tops[step.item],bold,grade==='critical'?red:black);
        const note=state.notes[stepIndex];if(note)notes.push({section:sections[step.section].title,number:`${step.section}.${step.item+1}`,question:step.text,grade:grade||'ungraded',note});
      });

      const grades=Object.values(state.grades),critical=grades.filter(x=>x==='critical').length,major=grades.filter(x=>x==='major').length,complete=grades.length===54;
      if(critical)mark(pages[2],557.2,590.7,bold,red);else if(complete&&!major)mark(pages[2],557.2,567.1,bold,black);
      const selectedReasons={...(state.failureReasons||{})};
      if(critical&&!Object.values(selectedReasons).some(Boolean))selectedReasons[0]=true;
      [591.4,605.3,619.3,633.4,647.3,661.3].forEach((top,index)=>{if(selectedReasons[index])mark(pages[2],499.0,top,bold,red)});
      fitText(pages[2],state.fields.candidateSignature,42,548,240,regular,8,black);
      const commentsTop=major&&!critical?482:470;
      if(major&&!critical)fitText(pages[2],'ASSESSMENT STATUS: REVIEW REQUIRED',42,470,520,bold,7.5,red);
      drawParagraph(pages[2],state.fields.additionalComments,42,commentsTop,520,regular,7.5,9,major&&!critical?7:8,black);
      fitText(pages[2],state.fields.trainingProvider?`Training provider: ${state.fields.trainingProvider}`:'',42,661,320,regular,7,black);
      fitText(pages[2],state.fields.reviewerSignature,112,700,98,regular,8,black);
      fitText(pages[2],state.fields.reviewerName,286,700,120,regular,8,black);
      fitText(pages[2],state.fields.reviewerTc,475,700,100,regular,8,black);
      addNotesPages(pdfDoc,notes,regular,bold,black,gold,muted);

      pdfDoc.setTitle(`Flight Review Assessment - ${clean(state.fields.candidateName)||'Candidate'}`);pdfDoc.setAuthor('Volatus Aerospace');pdfDoc.setSubject('Advanced RPAS Flight Review Assessment');pdfDoc.setCreator('Volatus Aerospace Flight Review App');
      const output=await pdfDoc.save(),blob=new Blob([output],{type:'application/pdf'});
      const name=(clean(state.fields.candidateName)||'candidate').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
      if(activePdfUrl)URL.revokeObjectURL(activePdfUrl);
      activePdfUrl=URL.createObjectURL(blob);activePdfName=`flight-review-${name||'candidate'}-${state.fields.reviewDate||new Date().toISOString().slice(0,10)}.pdf`;
      restorePdfDownload();document.querySelector('#downloadPdf')?.click();
      setStatus(`PDF ready${notes.length?` with ${notes.length} supplemental note${notes.length===1?'':'s'}`:''}.`);
    }catch(error){console.error(error);setStatus(error.message||'Unable to generate the PDF.',true)}finally{if(button){button.disabled=false;button.textContent='Generate filled PDF'}}
  };
  window.addEventListener('beforeunload',()=>{if(activePdfUrl)URL.revokeObjectURL(activePdfUrl)});
})();
