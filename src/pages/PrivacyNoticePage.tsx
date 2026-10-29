import { useEffect } from 'react';

export default function PrivacyNoticePage(){
 useEffect(()=>{
  const priorTitle=document.title;
  const description=document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const priorDescription=description?.content;
  document.title='NYSRP Privacy Notice';
  if(description)description.content='Privacy information for the New York State Roleplay community website.';
  return()=>{document.title=priorTitle;if(description&&priorDescription!==undefined)description.content=priorDescription};
 },[]);
 return <article className="page-shell legal-page">
  <header className="page-intro"><span className="eyebrow">WEBSITE POLICY</span><h1>NYSRP Privacy Notice</h1></header>
  <p>The NYSRP website is a hobby community website providing server information, updates, photos, and a report submission feature.</p>
  <h2>Reports</h2>
  <p>When submitting a report, you may be asked to provide your Discord username, player username, subject, description, evidence link, staff member username, and report type.</p>
  <p>This information is used to review, investigate, and manage reports relating to the community. Please only submit information relevant to your report and avoid including unnecessary sensitive or private information.</p>
  <p>Reports may be reviewed by authorised NYSRP staff and retained for as long as reasonably necessary to handle the report and related community moderation matters.</p>
  <h2>Website Services</h2>
  <p>The website may use Firebase or other configured services to operate its features and securely manage submitted information.</p>
  <h2>Contact</h2>
  <p>If you have a question about information submitted through the website, please contact the NYSRP staff team through the community's official communication channels.</p>
 </article>;
}
