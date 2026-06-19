const rubric = (kind, subject) => {
  const sets = {
    knowledge: {
      pass: `Explains ${subject} accurately, completely, and without prompting; connects the answer to the planned operation.`,
      minor: `Answer is substantially correct but misses a non-essential detail or needs one clarification; safety meaning remains intact.`,
      major: `Answer is incomplete or partly incorrect and measurably weakens the task aim; important operational detail is missing.`,
      critical: `Answer would cause regulatory non-compliance, unsafe action, or shows no workable understanding of ${subject}.`
    },
    document: {
      pass: `Provides current, legible and applicable evidence of ${subject} without delay.`,
      minor: `Present and usable, but organization or a non-essential detail needs correction.`,
      major: `Incomplete, outdated, difficult to verify, or not clearly applicable; the task aim is not fully achieved.`,
      critical: `Required evidence is absent or invalid, or proceeding would be illegal or unsafe.`
    },
    practical: {
      pass: `Performs ${subject} safely, smoothly, in an organized sequence, and without reviewer assistance.`,
      minor: `Small deviation is recognized and corrected promptly; task completion and safety are unaffected.`,
      major: `Large deviation, hesitation, or poor organization measurably reduces the safety margin or successful achievement of the task.`,
      critical: `Mismanaged action creates an undesired aircraft state, compromises safety, violates a requirement, or requires reviewer intervention.`
    },
    binary: {
      pass: `Fully confirms ${subject} and meets the form requirement.`,
      minor: `Requirement is met, but presentation or a non-essential detail needs correction.`,
      major: `Only partly confirmed; important information is missing or cannot be verified promptly.`,
      critical: `Not confirmed, invalid, or proceeding would be prohibited or unsafe.`
    },
    emergency: {
      pass: `States ${subject} in the correct aircraft-specific order, without undue delay, including crew communication and notification when required.`,
      minor: `Correct safe sequence with a small non-essential omission that does not delay or change the outcome.`,
      major: `Important step is late, out of order, or omitted; safety margin is reduced but the response remains recoverable.`,
      critical: `Response is unsafe, contrary to the aircraft procedure, omits an essential action, or would worsen the emergency.`
    }
  };
  return sets[kind];
};

const q = (text, kind, subject, suggested=false, note='') => ({text, suggested, note, criteria:rubric(kind,subject)});

const sections = [
  {code:'901.63',title:'Eligibility & documents',eligibility:true},
  {code:'901.27',title:'1. The site survey',items:[
    q('Were current flight publications used to extract pertinent information (paper or digital)?','document','current flight publications and extracted information'),
    q('Was the weather forecast and current conditions determined from relevant and reliable publications?','knowledge','weather sources, current conditions, forecast and operational effect'),
    q('Has the correct airspace been identified and documented?','knowledge','the airspace classification, boundaries, limits and applicable requirements'),
    q('Were all pertinent details about local aerodromes identified (type, range, bearing, contact, etc.)?','knowledge','nearby aerodromes and the operationally relevant information for each'),
    q('Were all potential obstructions, terrain features and alternative landing sites identified?','knowledge','ground and flight hazards plus suitable alternate landing sites'),
    q('Did the candidate demonstrate that current NOTAMs for the area were reviewed?','document','current applicable NOTAMs and their effect on the flight'),
    q('Describe the method used to inform Transport Canada of an incident or accident.','knowledge','the appropriate occurrence reporting method and information required',true),
    q('What additional procedures are required when operating in controlled airspace?','knowledge','controlled-airspace authorization, communication, compliance and contingencies',true),
    q('How will you ensure the public remains safe and clear of the operation?','knowledge','site control, bystander monitoring and an encroachment response',true),
    q('How close can you fly the RPAS to a bystander?','knowledge','the applicable distance based on operating category and aircraft safety assurance',true)
  ]},
  {code:'901.27',title:'2. RPAS & equipment',items:[
    q('Is the RPAS fully serviceable and registered, with the registration number clearly marked?','binary','aircraft serviceability, registration and marking'),
    q('Are RPAS additions, modifications and third-party software recorded in the registration information?','document','aircraft configuration and recorded modifications'),
    q('Can the candidate access the RPAS operations manual?','document','the current RPAS operations manual'),
    q('Does the candidate have a current maintenance record for the RPAS?','document','the current aircraft maintenance record'),
    q('Is adequate emergency equipment available (fire extinguisher and first-aid kit)?','binary','suitable and accessible emergency equipment'),
    q('Is a suitable means of emergency communication available?','binary','a reliable emergency communication method independent of the flight display when necessary'),
    q('What is the Transport Canada compliance level of the RPAS?','knowledge','the aircraft safety assurance declarations applicable to the planned operation',true),
    q('What are the maximum wind speed and operating temperature of the RPAS?','knowledge','manufacturer wind and temperature operating limits',true),
    q('What entries belong in the maintenance log?','knowledge','defects, maintenance, modifications and other required aircraft records',true),
    q('How would you proceed after finding a small crack in the RPAS landing gear?','knowledge','grounding, documenting, assessing and resolving an airworthiness defect',true)
  ]},
  {code:'901.33',title:'3. Pre-flight checks',items:[
    q('Has the candidate made a reasonable and competent decision to fly in the current conditions?','practical','a defensible GO/NO-GO decision using conditions, aircraft limits and site risks'),
    q('Has the airport operator or appropriate facility been contacted when required?','binary','all required aerodrome or air traffic coordination'),
    q('Did the candidate follow a checklist and perform adequate RPAS pre-flight checks?','practical','the complete aircraft-specific pre-flight checklist'),
    q('Did the candidate brief the visual observer and/or flight reviewer on duties and safety procedures?','practical','a complete crew and safety briefing'),
    q('Did the candidate verify and correctly program return-to-home with an appropriate altitude?','practical','RTH action and altitude against terrain, obstacles and airspace limits')
  ]},
  {code:'901.33',title:'4. Perform a takeoff',items:[
    q('Did the candidate use a safe and organized procedure to take off?','practical','a protected, controlled and stable takeoff'),
    q('Did the candidate record the launch time?','binary','the launch-time record'),
    q('Did the candidate fly to a safe height and complete a full function test of the RPAS?','practical','a safe-height hover and full aircraft function test')
  ]},
  {code:'901.33',title:'5. Navigate and fly',items:[
    q('Navigate clockwise around a fixed square grid using the required relative RPAS headings, without hesitation or corrections on the turns.','practical','the square pattern, headings, orientation and controlled turns'),
    q('Navigate clockwise and counter-clockwise in a figure eight, following the direction of flight.','practical','both figure-eight patterns with correct aircraft orientation'),
    q('Maintain a steady track while compensating for crosswind.','practical','early recognition and systematic correction of wind drift'),
    q('Approximate the distance and altitude of the RPAS from the candidate.','practical','a reasonable visual estimate of aircraft distance and altitude'),
    q('Navigate the RPAS home without using the navigation/video display.','practical','visual orientation and safe return without the navigation or video display'),
    q('Use an effective scan to monitor battery, range, altitude, signal strength, alarms and the operating environment.','practical','continuous aircraft-system, airspace and ground scanning')
  ]},
  {code:'901.33',title:'6. Perform a landing',items:[
    q('Did the candidate use an organized and safe procedure to land the RPAS?','practical','a stable approach and landing in the intended safe area'),
    q('Was an adequate post-flight checklist followed?','practical','the complete aircraft-specific post-flight checklist'),
    q('Did the candidate record the landing time?','binary','the landing-time record'),
    q('Was the airport operator or appropriate facility contacted when required?','binary','required arrival or operation-completion coordination'),
    q('Was the RPAS made safe and secure?','practical','disarming, power isolation, inspection and physical security')
  ]},
  {code:'901.23',title:'7. Loss of C2 link',items:[
    q('Can the candidate describe the lost-link emergency procedure?','emergency','the complete lost C2-link procedure'),
    q('Is a lost-link procedure checklist ready and available for reference?','document','the aircraft-specific lost-link checklist'),
    q('Does the lost-link procedure define the visual observer duties?','knowledge','visual-observer lookout, communication and reporting duties during lost link'),
    q('What actions could help regain the C2 link?','emergency','safe troubleshooting and link-recovery actions',true),
    q('What would you do if the C2 link remained good but the video feed failed?','emergency','continued VLOS control and safe recovery after video-only failure',true),
    q('How would you document and report a C2-link loss occurrence?','knowledge','the flight record, occurrence details and applicable notification',true)
  ]},
  {code:'901.23',title:'8. Fly-away procedure',items:[
    q('Is an emergency fly-away checklist ready and available for reference?','document','the aircraft-specific fly-away checklist'),
    q('Does the candidate have the correct contact number and required information for a fly-away?','document','the appropriate facility contact and concise fly-away report information'),
    q('Does the candidate understand how to safely initiate flight termination?','emergency','the aircraft-specific flight-termination method, limits and consequences'),
    q('Does the fly-away procedure define the visual observer duties?','knowledge','visual-observer tracking, direction/altitude reporting and communications'),
    q('What is the course of action if control of the RPAS is regained?','emergency','positive control confirmation and the safest recovery or landing decision',true),
    q('As pilot-in-command, how would you manage a vertical fly-away?','emergency','airspace monitoring, notification, endurance tracking and safe termination/recovery',true),
    q('How would you document and report a fly-away occurrence?','knowledge','position, direction, altitude, endurance, outcome and applicable reporting',true),
    q('What approximate maximum distance could the RPAS cover on a full battery?','knowledge','an endurance-based distance estimate using aircraft performance and conditions',true),
    q('What is your procedure for a crash-landing scenario?','emergency','scene safety, injury/fire response, aircraft isolation, notification and documentation',true)
  ]}
];

const officialSource={
  guide:{label:'Transport Canada TP 15395 - Flight Reviewer’s Guide',url:'https://tc.canada.ca/en/aviation/publications/flight-reviewer-s-guide-pilots-remotely-piloted-aircraft-systems'},
  site:{label:'CAR 901.27 - Site Survey',url:'https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/section-901.27.html'},
  procedures:{label:'CAR 901.23 - Normal and Emergency Procedures',url:'https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/section-901.23.html'},
  records:{label:'CAR 901.48 - Records',url:'https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/page-115.html'},
  occurrence:{label:'CAR 901.49 - Incidents and Accidents',url:'https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/section-901.49.html'},
  advanced:{label:'Transport Canada - Advanced Operations',url:'https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/drone-operation-categories-pilot-certificates/advanced-operations'},
  airspace:{label:'Transport Canada - Where to Fly Your Drone',url:'https://tc.canada.ca/en/aviation/drone-safety/learn-rules-you-fly-your-drone/where-fly-your-drone'},
  report:{label:'Transport Canada - Report a Drone Incident',url:'https://tc.canada.ca/en/aviation/drone-safety/report-drone-incident'}
};

const answers={
1:[
['Use appropriate, current aeronautical charts and flight publications; extract and record information relevant to the planned flight.','guide'],
['Retrieve and interpret current and forecast weather for the flight duration, then decide whether it is acceptable considering aircraft and operational limits.','guide'],
['Identify the type of airspace and every applicable requirement, including controlled or restricted airspace and any NOTAM affecting the flight geography.','site'],
['Identify nearby aircraft operations, airports, heliports and other aerodromes, and obtain the pertinent routes, procedures and contact information.','site'],
['Identify obstacle location and height, terrain, approach and departure routes, a safe takeoff site and safe alternate landing sites away from the main pattern.','guide'],
['Retrieve current NOTAMs from an official source and explain how each applicable notice changes or restricts the proposed operation.','airspace'],
['If there is imminent danger, call 9-1-1 first. For a reportable accident or serious incident, contact the Transportation Safety Board as soon as possible. Use Transport Canada’s drone incident channel for drone safety incidents or concerns. After a CAR 901.49 occurrence, cease operations, analyze the cause, take corrective action and retain the analysis record for 12 months.','occurrence'],
['Hold the required Advanced certificate; use an RPAS with the applicable safety assurance; obtain authorization from the air navigation service provider; maintain a means to contact and be contacted by the airspace authority; and comply with ATC instructions and authorization conditions.','airspace'],
['Use the site survey to identify uninvolved people and required horizontal distances; operate only in the category and at distances supported by the RPAS safety assurance; control access and stop or reposition if the operation can no longer remain compliant and safe.','advanced'],
['There is no single distance for every advanced operation. For a small RPAS in VLOS, the applicable declaration determines whether operation may be between 5 m and 30 m from a person, or within 5 m or over a person. Other operation types and medium RPAS have different limits.','advanced']
],
2:[
['Confirm the RPAS is airworthy, registered and operated within its approved limitations. The registration certificate must be available and the aircraft must carry its registration marking as required.','guide'],
['Confirm the actual aircraft configuration remains eligible for the intended operation. A modification must not invalidate the applicable safety assurance; assess configuration changes and unserviceability before flight.','guide'],
['Have immediate access to the current manufacturer operating instructions or approved operating manual used to establish normal, emergency and limitation procedures.','procedures'],
['The owner’s records must include crew and flight-time information plus particulars of maintenance actions, modifications and repairs, with the required dates and responsible persons.','records'],
['Transport Canada requires equipment and material to be organized and readily available. Carry emergency equipment suitable for the operation and identified risks; the assessment form specifically expects fire and first-aid capability.','guide'],
['Have a reliable means to contact emergency services and required aviation facilities. In controlled airspace, the pilot must be able to contact and be contacted by the airspace authority.','airspace'],
['Identify the exact safety assurance declarations for the RPAS model and planned operation. A declaration for one advanced operation does not authorize every advanced operation.','advanced'],
['Use the manufacturer’s published operating limitations for the exact RPAS configuration. Transport Canada does not prescribe one universal maximum wind or operating-temperature number.','procedures'],
['Record crew and flight time, and particulars of mandatory actions, maintenance, modifications and repairs, including the date and person who performed the work, as required by CAR 901.48.','records'],
['Do not launch until the effect on airworthiness and the proposed operation is determined. Follow manufacturer instructions, record the defect and any repair, and return the aircraft to service only when it is serviceable and eligible for the operation.','guide']
],
3:[
['Make a competent GO or NO-GO decision from the site survey, weather and NOTAMs, aircraft condition and limitations, people, airspace, route, power reserve and available alternates. The candidate owns the final decision.','guide'],
['Complete every coordination step required by the airspace and aerodrome procedure. In controlled airspace, obtain authorization and remain able to communicate with the controlling authority.','airspace'],
['Complete all aircraft-specific pre-flight inspections and checks using the established procedure and checklist. The procedures must reflect manufacturer instructions and be immediately available to crew.','procedures'],
['Clearly brief the reviewer and every crew member on duties, relevant flight information, communication, hazards, normal procedures and emergency actions.','guide'],
['If equipped, program RTH correctly and select an altitude and power setting appropriate to obstacles, airspace, weather and the lost-link situation; verify the setting before launch.','guide']
],
4:[
['Complete the pre-flight checks, comply with applicable departure clearances and instructions, use an organized and efficient safe departure, and complete the appropriate checklist.','guide'],
['Record the takeoff time as part of the flight record.','guide'],
['At a safe point after departure, verify stable control and required aircraft functions while maintaining VLOS, lookout and compliance with the planned flight.','guide']
],
5:[
['Maintain stable speed, altitude and heading; orient the RPA as required; navigate systematically around the fixed points; and make controlled heading corrections.','guide'],
['Apply systematic navigation in both directions, maintain stable flight and orient the RPA to the direction of flight around the fixed points.','guide'],
['Verify aircraft position, recognize track error and revise heading to correct wind drift while maintaining stable altitude, heading and adequate power.','guide'],
['Determine the aircraft position with respect to distance and altitude from the candidate with enough accuracy to maintain safe control and operational limits.','guide'],
['Use visual reference and systematic navigation to verify position and return safely while continuing to monitor airspace, power and the landing point.','guide'],
['Continuously monitor weather, aircraft systems, indications, communications, position, power and surrounding airspace; avoid tunnel vision and remain ahead of the aircraft.','guide']
],
6:[
['Use an organized and efficient safe arrival, comply with applicable arrival clearances and instructions, and land at the intended suitable point.','guide'],
['Complete the established aircraft-specific post-flight procedure and checklist.','procedures'],
['Record the landing time as part of the flight record.','guide'],
['Comply with every applicable arrival instruction and established aerodrome or airspace procedure; complete any required communication.','guide'],
['Secure the RPA after landing by completing the established shutdown or recovery procedure and preventing unintended operation or movement.','guide']
],
7:[
['Describe the manufacturer-aligned lost-link procedure: correctly programmed RTH if equipped, appropriate altitude and power, prompt recognition, recovery of control after reconnection, an appropriate post-reconnection decision, and contact with the appropriate facility if needed.','guide'],
['The lost-link procedure must be established before flight, reflect manufacturer instructions, be reviewed by crew and be immediately available to every crew member.','procedures'],
['Assign the visual observer continued lookout, aircraft tracking, prompt communication of direction, altitude, traffic and hazards, and support for planned notification and recovery actions.','procedures'],
['Apply only manufacturer-supported actions: maintain lookout, verify expected contingency behaviour, improve antenna orientation or connection where applicable, and be prepared to confirm control if the link reconnects. Do not create a second hazard while troubleshooting.','procedures'],
['A video loss is not automatically a C2-link loss. Maintain VLOS and control, follow the manufacturer procedure for display or equipment failure, and recover or land safely if the operation cannot continue within requirements.','procedures'],
['Record the occurrence and flight details. If CAR 901.49 applies, cease operations, analyze the cause, take corrective action and keep the analysis record for 12 months; notify the appropriate facility or agency when required.','occurrence']
],
8:[
['The fly-away procedure must be established before flight, reflect manufacturer instructions, be reviewed by crew and be immediately available to every crew member.','procedures'],
['Have the appropriate facility contact available. Be ready to report present position, last observed direction and altitude, estimated flight time remaining, aircraft description and known risk to other airspace users or people.','guide'],
['Use only the aircraft-specific flight-termination method established from manufacturer instructions. Understand how it activates, whether it can be cancelled, and the likely ground and airspace consequence before using it.','procedures'],
['The visual observer should continuously track the RPA, immediately report direction, altitude, traffic and hazards, and support communication and notification duties without taking over PIC responsibility.','procedures'],
['Positively confirm that control has returned, then choose an appropriate course of action. Prioritize a safe recovery or landing rather than automatically continuing the mission.','guide'],
['Record position, direction, altitude and endurance; maintain airspace lookout; contact the appropriate facility without delay if needed; and follow the manufacturer-aligned recovery or termination procedure.','guide'],
['A fly-away requires operations to cease under CAR 901.49. Analyze the cause, take corrective action to mitigate recurrence and retain the analysis for 12 months; make required aviation or emergency notifications.','occurrence'],
['Calculate from the exact RPAS endurance, usable power, expected groundspeed and current wind. Transport Canada does not publish a universal distance; provide a defensible aircraft-specific estimate.','guide'],
['Protect people first, call 9-1-1 for imminent danger or injury, secure the site and aircraft only when safe, address fire and battery hazards, notify the appropriate aviation authority when required, preserve records, and apply CAR 901.49 cease, analyze and correct requirements.','occurrence']
]};

Object.entries(answers).forEach(([sectionIndex,list])=>list.forEach((entry,itemIndex)=>{const item=sections[Number(sectionIndex)].items[itemIndex];item.answer=entry[0];item.source=officialSource[entry[1]];}));

const tcGuideUrl='https://tc.canada.ca/en/aviation/publications/flight-reviewer-s-guide-pilots-remotely-piloted-aircraft-systems';
const guideRef=(reference,anchor)=>({label:'Transport Canada TP 15395 — Flight Reviewer’s Guide',reference,url:`${tcGuideUrl}#${anchor}`});
const carRef=(reference,section)=>({label:'Canadian Aviation Regulations — Part IX',reference,url:`https://laws-lois.justice.gc.ca/eng/regulations/SOR-96-433/section-${section}.html`});
const pinpointRefs={
1:[
  guideRef('TP 15395, Appendix A, A — Performance Criterion 3','toc13_1'),
  guideRef('TP 15395, Appendix A, A — Performance Criteria 8–9','toc13_1'),
  guideRef('TP 15395, Appendix A, A — Performance Criterion 4','toc13_1'),
  guideRef('TP 15395, Appendix A, A — Performance Criterion 7','toc13_1'),
  guideRef('TP 15395, Appendix A, A — Performance Criteria 4–6','toc13_1'),
  guideRef('TP 15395, Appendix A, A — Performance Criterion 8','toc13_1'),
  guideRef('TP 15395, Appendix A, B — Performance Criterion 3','toc13_2'),
  carRef('CAR 901.71(1)–(2) — Operations in Controlled Airspace','901.71'),
  carRef('CAR 901.27(g) — Distance from Uninvolved Persons','901.27'),
  carRef('CAR 901.26(a) — Small RPAS Horizontal Distance','901.26')
],
2:[
  carRef('CAR 900.13(1), 900.14 and 901.29 — Registration, Marking and Serviceability','901.29'),
  carRef('CAR 901.70 — Operation of a Modified RPAS','901.70'),
  carRef('CAR 901.30(1) — Availability of Manuals','901.30'),
  carRef('CAR 901.48(1) — RPAS Records','901.48'),
  guideRef('TP 15395, Appendix A, A — Performance Criterion 15','toc13_1'),
  carRef('CAR 901.71(2)(d) — Two-way Communication','901.71'),
  carRef('CAR 901.69(1) — Declaration: Permitted Advanced Operations','901.69'),
  carRef('CAR 901.31(2) — Manufacturer Operating Limitations','901.31'),
  carRef('CAR 901.48(1)(b)(i)–(iv) — Maintenance Record Contents','901.48'),
  carRef('CAR 901.29 — Serviceability of the RPAS','901.29')
],
3:[
  guideRef('TP 15395, Appendix A, A — Performance Criterion 12','toc13_1'),
  carRef('CAR 901.47 and 901.73 — Aerodrome Procedures','901.73'),
  guideRef('TP 15395, Appendix A, C — Performance Criteria 1 and 5','toc13_3'),
  guideRef('TP 15395, Appendix A, A — Performance Criterion 2','toc13_1'),
  guideRef('TP 15395, Appendix A, E — Performance Criteria 1–2','toc13_6')
],
4:[
  guideRef('TP 15395, Appendix A, C — Performance Criteria 3 and 5','toc13_3'),
  guideRef('TP 15395, Appendix A, C — Performance Criterion 2','toc13_3'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criterion 1','toc13_4')
],
5:[
  guideRef('TP 15395, Appendix A, D-1 — Performance Criteria 1–4','toc13_4'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criteria 2–4','toc13_4'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criterion 6(a)–(b)','toc13_4'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criterion 5','toc13_4'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criteria 2 and 5','toc13_4'),
  guideRef('TP 15395, Appendix A, D-1 — Performance Criterion 6(c)–(d)','toc13_4')
],
6:[
  guideRef('TP 15395, Appendix A, G-1 — Performance Criterion 1','toc13_8'),
  guideRef('TP 15395, Appendix A, G-1 — Performance Criterion 3','toc13_8'),
  guideRef('TP 15395, Appendix A, G-1 — Performance Criterion 4','toc13_8'),
  guideRef('TP 15395, Appendix A, G-1 — Performance Criterion 2','toc13_8'),
  guideRef('TP 15395, Appendix A, G-1 — Performance Criterion 5','toc13_8')
],
7:[
  guideRef('TP 15395, Appendix A, E — Performance Criteria 1–6','toc13_6'),
  carRef('CAR 901.23(1)–(2) — Established and Available Procedures','901.23'),
  carRef('CAR 901.20 — Visual Observer Duties','901.20'),
  guideRef('TP 15395, Appendix A, E — Performance Criteria 3–5','toc13_6'),
  carRef('CAR 901.23(1)(b) — Equipment-failure Procedures','901.23'),
  carRef('CAR 901.49(1)–(2) — Incident Measures and Records','901.49')
],
8:[
  carRef('CAR 901.23(1)–(2) — Established and Available Procedures','901.23'),
  guideRef('TP 15395, Appendix A, F — Performance Criterion 2','toc13_7'),
  carRef('CAR 901.44 — Flight Termination System','901.44'),
  carRef('CAR 901.20 — Visual Observer Duties','901.20'),
  guideRef('TP 15395, Appendix A, E — Performance Criteria 4–5','toc13_6'),
  guideRef('TP 15395, Appendix A, F — Performance Criteria 1–2','toc13_7'),
  carRef('CAR 901.49(1)–(2) — Incident Measures and Records','901.49'),
  guideRef('TP 15395, Appendix A, F — Performance Criterion 1(c)','toc13_7'),
  carRef('CAR 901.49(1)–(2) — Incident Measures and Records','901.49')
]};
Object.entries(pinpointRefs).forEach(([sectionIndex,list])=>list.forEach((source,itemIndex)=>{sections[Number(sectionIndex)].items[itemIndex].source=source}));

sections[5].items[0].demo='square';
sections[5].items[1].demo='eight';
sections[5].items[2].demo='crosswind';
sections.push({code:'PDF',title:'9. Finalize & export',finalize:true});

const droneArt=`<g id="demoArt" class="demo-drone-art">
  <line x1="-13" y1="-13" x2="13" y2="13"/><line x1="13" y1="-13" x2="-13" y2="13"/>
  <circle cx="-14" cy="-14" r="5"/><circle cx="14" cy="-14" r="5"/><circle cx="-14" cy="14" r="5"/><circle cx="14" cy="14" r="5"/>
  <path class="drone-body" d="M-7-10H7L10 8 0 14-10 8Z"/><path class="drone-nose" d="M0-24 6-14H-6Z"/>
</g>`;

function demoSvg(type){
  if(type==='square')return `<svg class="demo-svg" viewBox="0 0 500 300" role="img" aria-label="Animated clockwise square manoeuvre"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path class="demo-path" d="M75 55H425V245H75Z"/><g class="corner-markers"><circle cx="75" cy="55" r="6"/><circle cx="425" cy="55" r="6"/><circle cx="425" cy="245" r="6"/><circle cx="75" cy="245" r="6"/></g><text x="250" y="151" class="stage-label">CLOCKWISE</text><path class="direction-arrow" d="M218 40h65l-12-10m12 10-12 10"/><g id="demoDrone" filter="url(#glow)"><animateMotion id="demoMotion" dur="10s" repeatCount="indefinite" calcMode="linear" path="M75 55H425V245H75Z" rotate="0"/>${droneArt}</g></svg>`;
  if(type==='eight')return `<svg class="demo-svg" viewBox="0 0 500 300" role="img" aria-label="Animated figure-eight manoeuvre"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path class="demo-path" d="M250 150C340 50 450 70 450 150S340 250 250 150C160 50 50 70 50 150S160 250 250 150"/><g class="corner-markers"><circle cx="120" cy="150" r="6"/><circle cx="380" cy="150" r="6"/></g><text x="250" y="282" class="stage-label">NOSE FOLLOWS DIRECTION OF FLIGHT</text><g id="demoDrone" filter="url(#glow)"><animateMotion id="demoMotion" dur="10s" repeatCount="indefinite" calcMode="linear" path="M250 150C340 50 450 70 450 150S340 250 250 150C160 50 50 70 50 150S160 250 250 150" rotate="auto"/>${droneArt}</g></svg>`;
  return `<svg class="demo-svg" viewBox="0 0 500 300" role="img" aria-label="Animated crosswind correction manoeuvre"><defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arrowHead" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0 0L6 3 0 6Z"/></marker></defs><path class="drift-path" d="M50 150C180 150 320 205 450 240"/><path class="demo-path" d="M50 150H450"/><g class="corner-markers"><circle cx="50" cy="150" r="6"/><circle cx="450" cy="150" r="6"/></g><g class="wind-field"><path d="M150 45v60"/><path d="M250 25v80"/><path d="M350 45v60"/></g><text x="250" y="25" class="stage-label">WIND</text><text x="250" y="182" class="track-label">CORRECTED GROUND TRACK</text><text x="330" y="238" class="drift-label">UNCORRECTED DRIFT</text><g id="demoDrone" filter="url(#glow)"><animateMotion id="demoMotion" dur="7s" repeatCount="indefinite" calcMode="linear" path="M50 150H450" rotate="0"/>${droneArt}</g></svg>`;
}

function maneuverDemo(type){
  const copy={square:['Square grid','Maintain the selected relative heading for the entire clockwise circuit. Use smooth, deliberate turns at each corner.'],eight:['Figure eight','Complete both directions. The nose remains aligned with the direction of flight through each loop and crossover.'],crosswind:['Crosswind correction','Crab the aircraft into wind enough to hold a steady ground track between the two reference points.']}[type];
  const options=type==='square'?`<div class="demo-options" aria-label="Square heading modes"><button class="active" data-demo-option="north">Nose north</button><button data-demo-option="south">Nose south</button><button data-demo-option="west">Nose west</button><button data-demo-option="east">Nose east</button><button data-demo-option="inward">Nose inward</button></div>`:type==='eight'?`<div class="demo-options" aria-label="Figure eight directions"><button class="active" data-demo-option="cw">Clockwise first</button><button data-demo-option="ccw">Counter-clockwise first</button></div>`:'';
  return `<section class="maneuver-demo" data-demo="${type}"><div class="demo-heading"><div><span>Student demonstration</span><h2>${copy[0]}</h2><p>${copy[1]}</p></div><div class="demo-controls"><button id="demoPlay" aria-label="Pause animation">Pause</button><button id="demoRestart">Restart</button><button id="demoSpeed" data-slow="false">Slow motion</button></div></div>${options}<div class="demo-stage">${demoSvg(type)}<div class="demo-legend"><span><i class="nose-key"></i>Gold triangle = nose</span><span><i class="path-key"></i>Required track</span></div></div></section>`;
}

function wireManeuverDemo(){
  const root=$('.maneuver-demo');if(!root)return;
  const svg=root.querySelector('.demo-svg'),motion=root.querySelector('#demoMotion'),art=root.querySelector('#demoArt');
  const baseDuration=root.dataset.demo==='crosswind'?7:10;
  const restart=()=>{svg.setCurrentTime(0);svg.unpauseAnimations();$('#demoPlay').textContent='Pause';$('#demoPlay').setAttribute('aria-label','Pause animation')};
  root.querySelectorAll('[data-demo-option]').forEach(button=>button.onclick=()=>{
    root.querySelectorAll('[data-demo-option]').forEach(x=>x.classList.toggle('active',x===button));
    const mode=button.dataset.demoOption;
    if(root.dataset.demo==='square'){
      const config={north:[0,'0'],south:[180,'0'],west:[-90,'0'],east:[90,'0'],inward:[180,'auto']}[mode];
      art.setAttribute('transform',`rotate(${config[0]})`);motion.setAttribute('rotate',config[1]);
    }else{
      const paths={cw:'M250 150C340 50 450 70 450 150S340 250 250 150C160 50 50 70 50 150S160 250 250 150',ccw:'M250 150C160 250 50 230 50 150S160 50 250 150C340 250 450 230 450 150S340 50 250 150'};
      motion.setAttribute('path',paths[mode]);art.setAttribute('transform','rotate(90)');motion.setAttribute('rotate','auto');
    }
    motion.beginElement();restart();
  });
  $('#demoPlay').onclick=()=>{if(svg.animationsPaused()){svg.unpauseAnimations();$('#demoPlay').textContent='Pause';$('#demoPlay').setAttribute('aria-label','Pause animation')}else{svg.pauseAnimations();$('#demoPlay').textContent='Play';$('#demoPlay').setAttribute('aria-label','Play animation')}};
  $('#demoRestart').onclick=restart;
  $('#demoSpeed').onclick=()=>{const slow=$('#demoSpeed').dataset.slow!=='true';$('#demoSpeed').dataset.slow=String(slow);$('#demoSpeed').textContent=slow?'Normal speed':'Slow motion';motion.setAttribute('dur',`${baseDuration*(slow?1.8:1)}s`);motion.beginElement();restart()};
  if(root.dataset.demo==='eight')art.setAttribute('transform','rotate(90)');
  if(root.dataset.demo==='crosswind')art.setAttribute('transform','rotate(55)');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){svg.pauseAnimations();$('#demoPlay').textContent='Play';$('#demoPlay').setAttribute('aria-label','Play animation')}
}

const eligibilityFields = [
  ['candidateName','Candidate name','text'],['reviewDate','Review date','date'],['reviewTime','Time','time'],['location','Location','text'],['residence','Residence address as per pilot certificate','text'],['pilotCertificate','RPAS pilot certificate number (PC-)','text'],['tcAccount','Transport Canada account number (TC-)','text']
];
const eligibilityChecks = ['Citizenship or residency confirmed','Government-issued photo ID verified','Advanced Operations exam pass verified','Visual observer use declared'];
const reviewerFields=[
  ['candidateSignature','Candidate signature (typed)','text'],['reviewerName','Flight reviewer name','text'],['reviewerTc','Flight reviewer TC number','text'],['reviewerSignature','Flight reviewer signature (typed)','text'],['trainingProvider','Training provider','text']
];
const failureReasonLabels=[
  'Failure of one item during the complete flight review',
  'Failure to conduct an appropriate site survey',
  'Failure to use an effective visual scanning technique',
  'Unsafe flying',
  'Dangerous behaviour not directly linked to flying skill',
  'Lack of training or competency'
];

const flat=[]; sections.forEach((section,si)=>{if(section.eligibility)flat.push({section:si,eligibility:true});else if(section.finalize)flat.push({section:si,finalize:true});else section.items.forEach((item,ii)=>flat.push({section:si,item:ii,...item}))});
const saved=JSON.parse(localStorage.getItem('fr-assessment')||'{}');
const state={step:Math.min(saved.step||0,flat.length-1),grades:saved.grades||{},notes:saved.notes||{},fields:saved.fields||{},checks:saved.checks||{},failureReasons:saved.failureReasons||{}};
if(!state.fields.trainingProvider)state.fields.trainingProvider='Volatus Aerospace';
let openSection=flat[state.step].section;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem('fr-assessment',JSON.stringify(state));

function sectionProgress(si){
  if(si===0) return eligibilityFields.every(([id])=>state.fields[id])&&eligibilityChecks.every((_,i)=>state.checks[i]!==undefined);
  if(sections[si].finalize)return reviewerFields.slice(0,4).every(([id])=>state.fields[id]);
  const indexes=flat.map((x,i)=>x.section===si?i:null).filter(x=>x!==null);
  return indexes.every(i=>state.grades[i]);
}
function renderNav(){
  $('#sectionNav').innerHTML=sections.map((s,i)=>{
    const expanded=openSection===i, current=flat[state.step].section===i, count=i===0?'Gate':s.finalize?'Export':`${s.items.length} fields`;
    const questions=i===0?[{label:'Candidate details and eligibility',step:0}]:s.finalize?[{label:'Reviewer information, signatures and PDF',step:flat.findIndex(x=>x.section===i)}]:s.items.map((item,itemIndex)=>({label:item.text,step:flat.findIndex(x=>x.section===i&&x.item===itemIndex)}));
    return `<div class="section-group ${expanded?'open':''}"><button class="section-button ${current?'active':''} ${sectionProgress(i)?'complete':''}" data-section-toggle="${i}" aria-expanded="${expanded}"><span>${i===0?'ID':String(i).padStart(2,'0')}</span><b>${s.title}</b><div class="section-meta"><small>${count}</small><i aria-hidden="true">⌄</i></div></button><div class="section-questions" ${expanded?'':'inert'}>${questions.map((item,index)=>{const grade=state.grades[item.step];return `<button class="question-nav-item ${state.step===item.step?'current':''}" data-question-step="${item.step}" title="${item.label}"><span>${i===0?'ID':`${i}.${index+1}`}</span><b>${item.label}</b><i class="question-status ${grade||''}" aria-label="${grade?`Graded ${grade}`:'Not graded'}"></i></button>`}).join('')}</div></div>`;
  }).join('');
  $$('[data-section-toggle]').forEach(b=>b.onclick=()=>{const section=+b.dataset.sectionToggle;openSection=openSection===section?-1:section;renderNav()});
  $$('[data-question-step]').forEach(b=>b.onclick=()=>{state.step=+b.dataset.questionStep;openSection=flat[state.step].section;save();render()});
}
function eligibilityView(){
  return `<p class="question-kicker">Admission gate</p><h1 class="question-title">Eligibility & documents</h1><p class="question-note">Complete every field from the top of page 1 before beginning assessment item 1.</p><div class="form-grid">${eligibilityFields.map(([id,label,type])=>`<div class="field ${id==='residence'?'full':''}"><label for="${id}">${label}</label><input id="${id}" data-field="${id}" type="${type}" value="${state.fields[id]||''}"></div>`).join('')}</div><div class="eligibility-list">${eligibilityChecks.map((x,i)=>`<div class="eligibility-row"><span>${x}</span><div class="toggle"><button data-check="${i}" data-value="yes" class="${state.checks[i]==='yes'?'selected':''}">Yes</button><button data-check="${i}" data-value="no" class="${state.checks[i]==='no'?'selected':''}">No</button></div></div>`).join('')}</div>`;
}
function finalizeView(){
  const graded=Object.keys(state.grades).length,critical=Object.values(state.grades).filter(x=>x==='critical').length,major=Object.values(state.grades).filter(x=>x==='major').length;
  const status=critical?'FAIL':major?'REVIEW REQUIRED':graded===54?'PASS':'DRAFT';
  return `<p class="question-kicker">Final step · PDF completion</p><h1 class="question-title">Finalize & export</h1><p class="question-note">Review the final status, enter the signature and flight reviewer information, then generate the completed original assessment PDF. Typed signatures are printed as acknowledgements and are not cryptographic digital signatures.</p><div class="final-status"><span>Final assessment</span><b class="${status==='FAIL'?'fail':status==='PASS'?'pass':''}">${status}</b><small>${graded} of 54 fields graded</small></div><h2 class="criteria-title">Required completion fields</h2><div class="form-grid">${reviewerFields.map(([id,label,type])=>`<div class="field ${id==='trainingProvider'?'full':''}"><label for="${id}">${label}</label><input id="${id}" data-field="${id}" type="${type}" value="${state.fields[id]||''}"></div>`).join('')}</div><label class="notes-label" for="additionalComments">Additional comments for the assessment form</label><textarea id="additionalComments" data-field="additionalComments" placeholder="Overall comments, limitations, debriefing notes...">${state.fields.additionalComments||''}</textarea><h2 class="criteria-title failure-title">Failure reasons (if applicable)</h2><div class="failure-reasons">${failureReasonLabels.map((label,index)=>`<label><input type="checkbox" data-failure-reason="${index}" ${state.failureReasons[index]?'checked':''}><span>${label}</span></label>`).join('')}</div><div class="export-actions"><button class="export-pdf-button" id="exportPdf">Generate filled PDF</button><div class="export-feedback"><span id="exportStatus" role="status" aria-live="polite"></span><a id="downloadPdf" class="download-pdf-link" hidden>Download PDF ↓</a></div></div>`;
}
function questionView(step){
  const s=sections[step.section]; return `<p class="question-kicker">${step.suggested?'Suggested reviewer question':'Assessment observation'} · ${s.title}</p><h1 class="question-title">${step.text}</h1>${step.note?`<p class="question-note">${step.note}</p>`:''}${step.demo?maneuverDemo(step.demo):''}<details class="official-answer" open><summary>Transport Canada expected answer / evidence</summary><p>${step.answer}</p><div class="source-citation"><span><small>Pinpoint authority</small><b>${step.source.reference||step.source.label}</b><em>${step.source.label}</em></span><a href="${step.source.url}" target="_blank" rel="noreferrer" aria-label="Open ${step.source.reference||step.source.label} in a new tab">Open exact section ↗</a></div></details><h2 class="criteria-title">Select the performance level</h2><div class="criteria-grid">${['pass','minor','major','critical'].map(g=>`<button class="criterion ${state.grades[state.step]===g?'selected':''}" data-grade="${g}"><strong>${g}</strong><p>${step.criteria[g]}</p></button>`).join('')}</div><label class="notes-label" for="notes">Reviewer notes</label><textarea id="notes" placeholder="Record the observed evidence...">${state.notes[state.step]||''}</textarea>`;
}
function updateSummary(){
  const vals=Object.values(state.grades), total=54;
  const count=g=>vals.filter(x=>x===g).length;
  $('#passCount').textContent=count('pass');$('#minorCount').textContent=count('minor');$('#majorCount').textContent=count('major');$('#criticalCount').textContent=count('critical');
  $('#answeredTop').textContent=`${vals.length} / ${total}`;
  const r=$('#result');r.className='result';
  if(count('critical')){r.textContent='FAIL';r.classList.add('fail')}
  else if(count('major')){r.textContent='REVIEW REQUIRED'}
  else if(vals.length===total){r.textContent='PASS';r.classList.add('pass')}
  else r.textContent='IN PROGRESS';
}
function render(scroll=true){
  const step=flat[state.step], section=sections[step.section];
  if(scroll)openSection=step.section;
  renderNav();$('#progressBar').style.width=`${(state.step+1)/flat.length*100}%`;$('#sectionCode').textContent=section.code;$('#stepCount').textContent=`Step ${state.step+1} of ${flat.length}`;
  if(scroll&&window.matchMedia('(max-width: 720px)').matches)requestAnimationFrame(()=>$('.section-button.active')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'}));
  $('#stepCard').innerHTML=step.eligibility?eligibilityView():step.finalize?finalizeView():questionView(step);
  wireManeuverDemo();
  $('#previous').disabled=state.step===0;$('#next').textContent=step.finalize?'Generate filled PDF':step.section===8&&step.item===8?'Review & sign →':'Next field →';
  $$('[data-grade]').forEach(b=>b.onclick=()=>{state.grades[state.step]=b.dataset.grade;save();render(false)});
  $$('[data-field]').forEach(input=>input.oninput=()=>{state.fields[input.dataset.field]=input.value;save();renderNav()});
  $$('[data-check]').forEach(b=>b.onclick=()=>{state.checks[b.dataset.check]=b.dataset.value;save();render(false)});
  $$('[data-failure-reason]').forEach(input=>input.onchange=()=>{state.failureReasons[input.dataset.failureReason]=input.checked;save()});
  const notes=$('#notes');if(notes)notes.oninput=()=>{state.notes[state.step]=notes.value;save()};
  const exportButton=$('#exportPdf');if(exportButton)exportButton.onclick=()=>window.generateFilledPdf?.();
  window.restorePdfDownload?.();
  updateSummary();if(scroll)window.scrollTo({top:0,behavior:'smooth'});
}
$('#previous').onclick=()=>{if(state.step>0){state.step--;save();render()}};
$('#next').onclick=()=>{if(state.step<flat.length-1){state.step++;save();render()}else window.generateFilledPdf?.()};
$('#reset').onclick=()=>{if(confirm('Reset all candidate fields, grades and notes?')){localStorage.removeItem('fr-assessment');location.reload()}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(e.key==='ArrowRight')$('#next').click();if(e.key==='ArrowLeft')$('#previous').click()});
render();
window.flightReviewApp={state,sections,flat};
