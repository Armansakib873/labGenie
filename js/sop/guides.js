/* =====================================================================
   LabGenie SOP Guidebook · guides.js
   General laboratory SOPs: pre-analytical, quality control, calibration,
   safety, equipment, post-analytical. Sections:
     {h, li:[...]}  bullet list      {h, st:[...]}  numbered steps
     {h, tb:{hd:[...], r:[[...]]}}   table          {h, tip:'...'}  callout
   `tool` attaches an interactive widget rendered by sop.js.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  G.GCATS = ['Pre-analytical', 'Quality control', 'Analytical', 'Post-analytical', 'Safety', 'Management'];

  G.GUIDES = [
    /* ---------------- PRE-ANALYTICAL ---------------- */
    {
      id: 'draw', n: 'Order of Draw & Tube Guide', ic: '🧪', cat: 'Pre-analytical', aka: 'order of draw tubes colour additive edta citrate heparin fluoride sst', tool: 'draw',
      sec: [
        { h: 'Why order matters', li: ['Additive carry-over between tubes changes results: EDTA → falsely high K⁺ and low Ca²⁺; heparin → prolonged clotting times; clot activator → shortened PT/aPTT.', 'Follow CLSI GP41 order for every multi-tube venepuncture (also with syringe transfer).'] },
        { h: 'Inversions after collection', tb: { hd: ['Tube', 'Inversions'], r: [['Blood culture', '2–3 (gentle)'], ['Citrate (light blue)', '3–4'], ['Plain / SST (red, gold)', '5'], ['Heparin (green)', '8–10'], ['EDTA (lavender)', '8–10'], ['Fluoride (grey)', '8–10']] } },
        { h: 'Fill volume', li: ['Citrate tubes must be ≥ 90 % full (9:1 ratio).', 'Under-filled EDTA tubes: cell shrinkage (low MCV, Hct).', 'Butterfly + citrate as first tube → draw a discard tube to fill the tubing dead space.'] }
      ]
    },
    {
      id: 'veni', n: 'Venepuncture SOP', ic: '💉', cat: 'Pre-analytical', aka: 'venepuncture venipuncture phlebotomy blood collection procedure tourniquet',
      sec: [
        { h: 'Steps', st: ['Check the request form; prepare tubes, needle (21 G adult, 23 G small veins), tourniquet, antiseptic, gauze, sharps bin.', 'Identify the patient with at least two identifiers (full name + date of birth / ID) — ask, don’t tell.', 'Confirm fasting / timing / medicines as required by the test.', 'Hand hygiene and gloves.', 'Position the arm downward; apply tourniquet 7–10 cm above the site for no more than 1 minute.', 'Select a vein (median cubital first choice); clean with 70 % alcohol, let it dry 30 s — do not re-palpate.', 'Anchor the vein, insert bevel up at 15–30°.', 'Fill tubes in the correct order of draw; release the tourniquet as blood starts to flow into the last tube.', 'Withdraw the needle, apply pressure with gauze (patient keeps arm straight), activate safety device, discard into sharps bin immediately.', 'Invert tubes the correct number of times.', 'Label tubes at the bedside in the patient’s presence: name, ID, date/time, collector initials.', 'Check the site, apply a plaster, thank the patient; document any difficulty.'] },
        { h: 'Avoid', li: ['Drawing above an IV infusion (use the other arm or below the drip after stopping it 2 min).', 'Arm on the side of a mastectomy or with an AV fistula.', 'Haematoma, scarred or oedematous sites.', 'Fist pumping (raises K⁺ by up to 1–2 mmol/L).', 'Forcing blood through a small needle or vigorous shaking (haemolysis).', 'Pre-labelling tubes before collection.'] },
        { h: 'Patient reactions', li: ['Fainting: stop, remove tourniquet and needle, lower head / lay patient down, inform supervisor.', 'Persistent bleeding: apply pressure 5 min, check anticoagulant history.', 'Nerve pain (shooting / electric): remove the needle immediately.'] }
      ]
    },
    {
      id: 'cap', n: 'Capillary (Finger / Heel) Collection', ic: '👶', cat: 'Pre-analytical', aka: 'capillary finger prick heel prick neonate lancet microtainer',
      sec: [
        { h: 'Sites', li: ['Adults & children > 1 y: side of the 3rd or 4th fingertip of the non-dominant hand.', 'Infants < 1 y: medial or lateral plantar surface of the heel — never the posterior curvature.', 'Warm the site 3–5 min (≈ 42 °C) to increase blood flow.'] },
        { h: 'Steps', st: ['Clean with 70 % alcohol and let dry.', 'Puncture with a single-use lancet perpendicular to fingerprint lines (depth ≤ 2 mm in infants).', 'Wipe away the first drop (tissue fluid).', 'Collect freely-forming drops — do not squeeze or “milk” (haemolysis, tissue-fluid dilution).', 'Order for capillary: blood gas → EDTA → other additive tubes → serum.', 'Apply pressure, check bleeding has stopped.'] },
        { h: 'Notes', li: ['Capillary glucose is higher than venous after meals; K⁺ often falsely high.', 'Not suitable for coagulation tests (except validated POCT INR) or blood cultures.'] }
      ]
    },
    {
      id: 'label', n: 'Patient ID, Labelling & Requisition', ic: '🏷️', cat: 'Pre-analytical', aka: 'patient identification label labelling barcode requisition form',
      sec: [
        { h: 'Minimum label information', li: ['Two unique identifiers: full name and ID / date of birth.', 'Date and time of collection.', 'Collector’s initials.', 'Specimen type / site where relevant (e.g. left knee synovial fluid).'] },
        { h: 'Requisition must show', li: ['Patient details, age, sex, ward/OPD, requesting doctor and contact.', 'Tests requested and clinical details / provisional diagnosis.', 'Relevant drugs (anticoagulants, antibiotics, levothyroxine, steroids, biotin).', 'Fasting status, LMP / pregnancy, dialysis timing where relevant.'] },
        { h: 'Rules', li: ['Label at the bedside after collection — never pre-label.', 'Barcode label horizontal along the tube, leaving a window to see the sample.', 'Unlabelled / mislabelled samples are rejected (except irreplaceable samples — CSF, biopsies — which need documented identity confirmation).'] }
      ]
    },
    {
      id: 'reject', n: 'Specimen Acceptance & Rejection Criteria', ic: '⛔', cat: 'Pre-analytical', aka: 'rejection criteria reject sample unacceptable specimen',
      sec: [
        { h: 'Reject (and request recollection) when', li: ['Unlabelled, mislabelled or mismatched with the request form.', 'Wrong tube / anticoagulant for the test.', 'Clotted EDTA or citrate sample; under/over-filled citrate tube.', 'Grossly haemolysed sample for K⁺, LDH, AST, iron, folate, insulin, troponin (method-dependent).', 'Sample too old / wrong storage temperature for the analyte.', 'Insufficient volume (QNS).', 'Leaking or broken container; contaminated outside.', 'Urine culture in non-sterile container or > 2 h unrefrigerated.', '24-h urine without total volume / incomplete collection.'] },
        { h: 'Process', st: ['Record the reason in the rejection log.', 'Inform the ward/collector immediately; document who was informed and when.', 'For irreplaceable specimens, analyse with a disclaimer comment after supervisor approval.'] }
      ]
    },
    {
      id: 'hil', n: 'Haemolysis, Lipaemia & Icterus (HIL)', ic: '🩸', cat: 'Pre-analytical', aka: 'hemolysis haemolysis lipemia lipaemia icterus hil interference serum index',
      sec: [
        { h: 'Haemolysis (red/pink serum)', li: ['Falsely ↑: K⁺, LDH, AST, ALT (mild), phosphate, magnesium, iron, folate, CK (adenylate kinase).', 'Falsely ↓: insulin, troponin T (some assays), bilirubin (some methods).', 'Causes: small needle, vigorous mixing, forcing through a syringe, pneumatic tube, freezing whole blood, prolonged storage, difficult draw.', 'In-vivo haemolysis (haemolytic anaemia) — check haptoglobin, LDH, bilirubin; recollection will not fix it.'] },
        { h: 'Lipaemia (milky serum)', li: ['Light-scatter interference in photometric assays; volume displacement → falsely low Na/K on indirect ISE.', 'Remedy: ultracentrifugation or high-speed centrifugation (10 000 g × 15 min), or recollect after 12 h fast.'] },
        { h: 'Icterus (dark yellow serum)', li: ['Bilirubin interferes with Jaffe creatinine (↓), cholesterol, TG, uric acid (peroxidase methods).', 'Report with a comment when the serum index exceeds the method’s stated limit.'] },
        { h: 'Serum index (H-index) guide', tb: { hd: ['Free Hb (g/L)', 'Appearance', 'Action (typical)'], r: [['< 0.5', 'Normal', 'Report'], ['0.5–1', 'Slight pink', 'Comment for K⁺, LDH, AST'], ['1–2', 'Pink', 'Suppress K⁺, LDH; comment others'], ['> 2', 'Red', 'Reject sensitive tests, recollect']] } }
      ]
    },
    {
      id: 'centri', n: 'Centrifugation & Sample Processing', ic: '🌀', cat: 'Pre-analytical', aka: 'centrifuge centrifugation rpm rcf g force spin serum separation clotting', tool: 'rcf',
      sec: [
        { h: 'Before spinning', li: ['Serum tubes: allow complete clotting 30 min upright at room temperature (60 min if on anticoagulants, 5 min for thrombin tubes).', 'Plasma tubes: centrifuge immediately.', 'Balance the rotor with tubes of equal weight opposite each other; keep caps on (aerosols).'] },
        { h: 'Typical settings', tb: { hd: ['Sample', 'Force', 'Time'], r: [['Serum / SST / heparin', '1000–1300 g', '10 min'], ['Citrate — platelet-poor plasma', '1500–2000 g', '15 min'], ['Urine sediment', '400–450 g', '5 min'], ['Gel tubes (do not re-spin later)', 'per manufacturer', '10 min'], ['CSF / body fluid cytospin', '~ 100 g', '5 min']] } },
        { h: 'After spinning', li: ['Separate serum/plasma from cells within 2 h (glucose, K⁺, phosphate, LDH change).', 'Never re-centrifuge gel tubes after separation (K⁺ leaks through gel).', 'Aliquot with disposable pipettes; label aliquots with the same ID.', 'Check rotor and centrifuge speed with a tachometer every 6–12 months; clean spills with disinfectant.'] }
      ]
    },
    {
      id: 'stab', n: 'Specimen Stability & Storage', ic: '🧊', cat: 'Pre-analytical', aka: 'stability storage temperature transport frozen refrigerated',
      sec: [
        { h: 'Common analyte stability', tb: { hd: ['Analyte / sample', 'Room temp', '2–8 °C', '−20 °C'], r: [['Glucose (fluoride)', '24 h', '3 days', '—'], ['Glucose (unseparated serum)', '< 30 min', '—', '—'], ['K⁺ (separated)', '1 week', '1 week', '1 year'], ['Creatinine / urea', '2 days', '1 week', '6 months'], ['ALT / AST', '3 days', '1 week', '1 month'], ['Bilirubin (dark)', '1 day', '1 week', '6 months'], ['TSH / FT4', '1 day', '1 week', '1 year'], ['CBC (EDTA whole blood)', '6–8 h', '24 h', 'never'], ['PT (citrate)', '24 h', 'not whole blood', '2 weeks (plasma)'], ['aPTT (on heparin)', '4 h', '—', '2 weeks (plasma)'], ['Ammonia', 'no', 'on ice 30 min', '—'], ['Urine R/M/E', '2 h', '24 h', 'never'], ['Blood culture bottle', 'up to 12–24 h', 'never', 'never']] } },
        { h: 'Transport', li: ['Triple packaging for referral samples: leak-proof primary, sealed secondary with absorbent, rigid outer box.', 'Use temperature loggers / ice packs for cold-chain samples; keep requisition outside the secondary container.', 'Record dispatch and receipt times.'] }
      ]
    },
    {
      id: 'urinecol', n: 'Urine Collection Types & Preservatives', ic: '🥤', cat: 'Pre-analytical', aka: 'urine collection midstream first morning 24 hour preservative boric acid',
      sec: [
        { h: 'Collection types', tb: { hd: ['Type', 'Use'], r: [['Random', 'Routine screening'], ['First-morning', 'Protein, nitrite, pregnancy, casts, ACR'], ['Midstream clean-catch', 'Culture, routine'], ['Catheter (sampling port)', 'Culture in catheterised patients'], ['Suprapubic aspirate', 'Infants — any growth significant'], ['24-hour', 'Protein, creatinine clearance, Ca, oxalate, catecholamines'], ['Timed 2-h post-prandial', 'Glucose (rare)']] } },
        { h: '24-hour collection steps', st: ['Start in the morning: empty the bladder into the toilet and note the time.', 'Collect all urine for the next 24 h into the container (keep cool).', 'At exactly the same time next day, empty the bladder into the container — that ends the collection.', 'Record total volume; mix well before taking an aliquot.'] },
        { h: 'Preservatives', tb: { hd: ['Preservative', 'For'], r: [['Refrigeration (none)', 'Most tests, protein, creatinine'], ['6 M HCl', 'Calcium, oxalate, catecholamines, VMA'], ['Boric acid', 'Culture transport (prevents overgrowth)'], ['Sodium carbonate', 'Uric acid, porphyrins'], ['Toluene / thymol', 'Rarely used now']] } }
      ]
    },

    /* ---------------- QUALITY CONTROL ---------------- */
    {
      id: 'iqc', n: 'Internal Quality Control (IQC) SOP', ic: '📈', cat: 'Quality control', aka: 'qc iqc quality control levels mean sd cv levey jennings lj chart', tool: 'stats',
      sec: [
        { h: 'Daily QC routine', st: ['Bring controls to room temperature and mix gently (no foam) — follow the insert for reconstitution and open-vial stability.', 'Run at least 2 levels (normal & abnormal) every 24 h of patient testing, after calibration, reagent lot change, major maintenance, and when results look suspicious.', 'Plot each value on its Levey-Jennings chart.', 'Evaluate with Westgard rules before releasing patient results.', 'If rejected: stop reporting, troubleshoot, document corrective action, re-run QC, and re-run affected patient samples since the last acceptable QC.', 'Record lot numbers, expiry and operator.'] },
        { h: 'Establishing your own mean & SD', li: ['New control lot: run ≥ 20 values on 20 separate days (minimum 10 if urgent, then update).', 'Mean = Σx ÷ n; SD from the same data; CV % = SD ÷ mean × 100.', 'Run the new lot in parallel with the old lot before switching.', 'Do not use the manufacturer’s range as your SD — it is usually too wide.'] },
        { h: 'Acceptable CV (examples, desirable biological variation)', tb: { hd: ['Analyte', 'Desirable CV %'], r: [['Glucose', '≤ 2.9'], ['Creatinine', '≤ 2.2'], ['Sodium', '≤ 0.3–0.5'], ['Potassium', '≤ 2.3'], ['Cholesterol', '≤ 2.7'], ['ALT', '≤ 9.7'], ['TSH', '≤ 9.7'], ['Hb (CBC)', '≤ 1.4']] } },
        { h: 'Use the QC statistics calculator below', tip: 'Paste 20+ control values to get the mean, SD, CV and ±2SD / ±3SD limits for your Levey-Jennings chart.' }
      ]
    },
    {
      id: 'westgard', n: 'Westgard Rules & QC Troubleshooting', ic: '🚦', cat: 'Quality control', aka: 'westgard rules 1-2s 1-3s 2-2s r-4s 4-1s 10x multirule shift trend', tool: 'westgard',
      sec: [
        { h: 'The multirule', tb: { hd: ['Rule', 'Meaning', 'Error type', 'Action'], r: [['1₂ₛ', 'One value beyond ±2 SD', 'Warning', 'Inspect other rules'], ['1₃ₛ', 'One value beyond ±3 SD', 'Random', 'Reject run'], ['2₂ₛ', 'Two consecutive (same level) or both levels beyond the same ±2 SD', 'Systematic', 'Reject run'], ['R₄ₛ', 'One level > +2 SD and another < −2 SD in the same run', 'Random', 'Reject run'], ['4₁ₛ', 'Four consecutive values beyond the same ±1 SD', 'Systematic', 'Reject (or recalibrate/maintain)'], ['10ₓ', 'Ten consecutive values on the same side of the mean', 'Systematic', 'Reject (or recalibrate/maintain)']] } },
        { h: 'Random error — look at', li: ['Bubbles in reagent/sample, clots, pipette / probe problems, electrical fluctuation, temperature instability, improper mixing, reconstitution error.'] },
        { h: 'Systematic error (shift / trend) — look at', li: ['Reagent or calibrator lot change, deteriorating reagent, calibration drift, lamp ageing, change in incubation temperature, control deterioration, new operator technique.'] },
        { h: 'Troubleshooting order', st: ['Do not just repeat QC hoping it passes.', 'Check the obvious: correct control, level, lot, expiry, storage, reconstitution.', 'Check reagent (expiry, open stability, volume, lot change) and calibration status.', 'Check instrument: maintenance log, error flags, probe, lamp, temperature.', 'Correct the cause, re-run both QC levels.', 'Re-analyse patient samples run since the last good QC; issue amended reports if results changed significantly.', 'Document everything in the QC corrective-action log.'] }
      ]
    },
    {
      id: 'calib', n: 'Calibration & Calibration Verification', ic: '🎯', cat: 'Quality control', aka: 'calibration calibrator verification traceability blank slope factor',
      sec: [
        { h: 'When to calibrate', li: ['New reagent lot (if required by the manufacturer).', 'Per the manufacturer’s calibration interval (e.g. every 7–30 days or per cartridge).', 'After major maintenance or part replacement (lamp, probe, electrodes).', 'When QC shows a systematic shift / trend not fixed by other actions.', 'When calibration verification fails.'] },
        { h: 'Calibration steps', st: ['Use calibrators traceable to a reference method/material (from the same manufacturer system).', 'Reconstitute exactly with a class-A pipette; allow to stand per insert; mix gently.', 'Run reagent blank, then calibrators in replicate (usually duplicate).', 'Review calibration curve / factor / slope against acceptance limits and previous calibrations (large change = suspect).', 'Run QC (2 levels) immediately after calibration — release results only if QC passes.', 'Record calibrator lot, expiry, factor values and operator.'] },
        { h: 'Calibration verification (every 6 months, CLIA)', li: ['Test at least 3 levels (low, mid, high) across the reportable range.', 'Results must agree with assigned values within the allowable error.', 'Confirms the analytical measurement range (AMR) is still valid.'] },
        { h: 'Pipette calibration (gravimetric)', li: ['Weigh 10 replicates of distilled water at known temperature; volume = mass ÷ water density (≈ 0.998 g/mL at 20 °C).', 'Accuracy and CV must be within ISO 8655 limits (e.g. ≤ ±0.8 % at 1000 µL).', 'Check every 3–6 months and after any drop/repair.'] }
      ]
    },
    {
      id: 'eqa', n: 'External Quality Assessment (EQA / PT)', ic: '🌐', cat: 'Quality control', aka: 'eqa eqas proficiency testing pt external quality sdi',
      sec: [
        { h: 'Handling EQA samples', li: ['Treat EQA samples exactly like patient samples — same staff, same method, same number of runs.', 'Never communicate with other labs about EQA results before the closing date.', 'Submit before the deadline; keep printouts and raw data.'] },
        { h: 'Interpreting reports', tb: { hd: ['SDI / z-score', 'Performance'], r: [['|z| ≤ 2', 'Acceptable'], ['2 < |z| < 3', 'Warning — review trend'], ['|z| ≥ 3', 'Unacceptable — investigate and document corrective action']] } },
        { h: 'Investigating unacceptable results', st: ['Check for clerical/transcription errors and units.', 'Check sample handling, reconstitution and storage.', 'Review IQC, calibration and maintenance around the testing date.', 'Compare with peer group / method group; identify bias.', 'Implement and document corrective and preventive action; review the next round.'] }
      ]
    },
    {
      id: 'validate', n: 'Method Verification (New Test / Analyser)', ic: '🧮', cat: 'Analytical', aka: 'method validation verification precision accuracy linearity reference interval carryover',
      sec: [
        { h: 'Verify before reporting patient results', tb: { hd: ['Study', 'Typical protocol'], r: [['Precision (repeatability)', '20 replicates in one run, 2 levels → CV within claim'], ['Precision (intermediate)', '2 levels × 20 days (or 5×5 CLSI EP15)'], ['Trueness / accuracy', 'EQA material, certified reference, or recovery'], ['Method comparison', '≥ 40 patient samples across range vs old method (Bland-Altman, regression)'], ['Linearity / AMR', '5 levels, triplicate, low to high'], ['LoQ / sensitivity', 'Low-level replicates; CV ≤ 20 % (or claim)'], ['Carry-over', 'High H1-H3 then low L1-L3; (L1 − L3)/(H3 − L3) < 1 %'], ['Reference interval', 'Transfer: 20 healthy local subjects — ≤ 2 outside the interval to accept']] } },
        { h: 'Document', li: ['Plan, acceptance criteria, raw data, statistics, conclusion, director approval and date of introduction.'] }
      ]
    },
    {
      id: 'reagent', n: 'Reagent & Consumable Management', ic: '📦', cat: 'Analytical', aka: 'reagent lot inventory storage open vial stability expiry cold chain fefo',
      sec: [
        { h: 'Receiving', li: ['Check temperature on arrival (cold-chain indicator), packaging, lot and expiry.', 'Record in inventory: date received, lot, expiry, quantity, received by.', 'Quarantine until accepted; label “date received”.'] },
        { h: 'Storage & use', li: ['FEFO — first expiry, first out.', 'Label every opened bottle with date opened and new expiry (open-vial stability).', 'Never top up or mix lots in the same container.', 'Monitor fridge (2–8 °C) and freezer temperatures daily; record min/max.'] },
        { h: 'New lot', st: ['Run new lot in parallel with the current lot on QC and 5–20 patient samples.', 'Accept if difference is within the allowable bias.', 'Recalibrate if required; record lot-to-lot verification.'] }
      ]
    },
    {
      id: 'maint', n: 'Equipment Maintenance Schedule', ic: '🛠️', cat: 'Analytical', aka: 'maintenance analyzer daily weekly monthly cleaning probe lamp centrifuge fridge water',
      sec: [
        { h: 'Daily', li: ['Check reagent volumes, waste, water supply, temperature readings.', 'Clean sample/reagent probes; check for clots and bubbles.', 'Run start-up checks, photometer/blank checks, QC.', 'Record fridge, freezer, incubator and room temperature/humidity.'] },
        { h: 'Weekly', li: ['Clean cuvettes/wash station, ISE maintenance (cleaning solution, check slope), centrifuge bowl wipe-down.', 'Check biosafety cabinet airflow indicator; clean microscope lenses.'] },
        { h: 'Monthly / periodic', li: ['Replace tubing, filters, lamps per hours; deionised-water quality (resistivity ≥ 10 MΩ·cm for CLRW).', 'Centrifuge speed/timer check (tachometer) and thermometer calibration — 6–12 monthly.', 'Annual preventive maintenance by the service engineer; keep certificates.'] },
        { h: 'Always', li: ['Log every maintenance, breakdown and repair with date, action and initials.', 'After repair: verify with QC (and calibration if required) before patient testing.'] }
      ]
    },
    {
      id: 'conv', n: 'Unit Conversion Factors', ic: '🔁', cat: 'Analytical', aka: 'unit conversion si conventional mg/dl mmol/l factor', tool: 'conv',
      sec: [
        { h: 'Conventional × factor = SI', tb: { hd: ['Analyte', 'Conventional', 'Factor', 'SI'], r: [['Glucose', 'mg/dL', '0.0555', 'mmol/L'], ['Urea', 'mg/dL', '0.1665', 'mmol/L'], ['BUN', 'mg/dL', '0.357', 'mmol/L urea'], ['Creatinine', 'mg/dL', '88.4', 'µmol/L'], ['Uric acid', 'mg/dL', '59.48', 'µmol/L'], ['Cholesterol (TC, HDL, LDL)', 'mg/dL', '0.02586', 'mmol/L'], ['Triglycerides', 'mg/dL', '0.01129', 'mmol/L'], ['Bilirubin', 'mg/dL', '17.1', 'µmol/L'], ['Calcium', 'mg/dL', '0.2495', 'mmol/L'], ['Phosphorus', 'mg/dL', '0.3229', 'mmol/L'], ['Magnesium', 'mg/dL', '0.4114', 'mmol/L'], ['Iron', 'µg/dL', '0.1791', 'µmol/L'], ['Albumin / protein', 'g/dL', '10', 'g/L'], ['Hemoglobin', 'g/dL', '10', 'g/L'], ['Free T4', 'ng/dL', '12.87', 'pmol/L'], ['Free T3', 'pg/mL', '1.536', 'pmol/L'], ['Cortisol', 'µg/dL', '27.59', 'nmol/L'], ['Vitamin D (25-OH)', 'ng/mL', '2.496', 'nmol/L'], ['Vitamin B12', 'pg/mL', '0.7378', 'pmol/L'], ['Testosterone', 'ng/dL', '0.0347', 'nmol/L'], ['Prolactin', 'ng/mL', '21.2', 'mIU/L'], ['HbA1c', '%', '(% − 2.15) × 10.929', 'mmol/mol']] } }
      ]
    },

    /* ---------------- POST-ANALYTICAL ---------------- */
    {
      id: 'critical', n: 'Critical Value Reporting', ic: '🚨', cat: 'Post-analytical', aka: 'critical value panic value alert call notification read back',
      sec: [
        { h: 'Procedure', st: ['Verify the result: check sample identity, quality (haemolysis, clots, contamination), QC status; repeat if indicated (do not delay > 15 min).', 'Phone the responsible clinician / nurse within the agreed time (typically ≤ 30 min).', 'Ask the receiver to READ BACK the patient name, ID, test and value.', 'Document: date/time, result, name of person informed, read-back confirmed, your name.', 'Escalate to the senior/consultant if the clinician cannot be reached within the agreed time.'] },
        { h: 'Common adult critical limits (example — adopt your lab policy)', tb: { hd: ['Test', 'Low', 'High'], r: [['Glucose (mg/dL)', '< 40', '> 450'], ['Sodium (mmol/L)', '< 120', '> 160'], ['Potassium (mmol/L)', '< 2.8', '> 6.2'], ['Calcium (mg/dL)', '< 6.5', '> 13'], ['Hb (g/dL)', '< 7', '> 20'], ['Platelets (×10³/µL)', '< 20', '> 1000'], ['WBC (×10³/µL)', '< 1.5', '> 30'], ['INR', '—', '> 5'], ['aPTT (s)', '—', '> 100'], ['Creatinine (mg/dL, new)', '—', '> 7'], ['Positive blood culture / CSF Gram stain', '—', 'Always']] } }
      ]
    },
    {
      id: 'delta', n: 'Result Verification & Delta Check', ic: '✅', cat: 'Post-analytical', aka: 'delta check result verification autoverification plausibility review release',
      sec: [
        { h: 'Before releasing results', li: ['QC acceptable for the run.', 'Instrument flags reviewed (clot, short sample, linearity exceeded → dilute and repeat).', 'Plausibility: physiologically possible? consistent with other results (e.g. K⁺ with haemolysis index, MCHC < 37, Ca with albumin)?', 'Delta check vs previous result of the same patient.', 'Units, reference ranges and comments correct; sex/age-specific ranges applied.'] },
        { h: 'Typical delta-check limits (within 7 days)', tb: { hd: ['Test', 'Flag if change exceeds'], r: [['Hb', '± 2 g/dL'], ['MCV', '± 3 fL (24 h) — suspect wrong patient'], ['Platelets', '± 50 %'], ['Potassium', '± 1.0 mmol/L'], ['Sodium', '± 8 mmol/L'], ['Creatinine', '± 50 %'], ['Calcium', '± 1.5 mg/dL']] } },
        { h: 'Delta failure → investigate', li: ['Wrong patient / mislabelled sample, contamination (IV fluid: glucose ↑, others ↓), transfusion, dialysis, true clinical change.'] }
      ]
    },
    {
      id: 'amend', n: 'Report Amendment & Turnaround Time', ic: '⏱️', cat: 'Post-analytical', aka: 'amended report correction tat turnaround time stat',
      sec: [
        { h: 'Amending a released report', st: ['Never delete the original — issue an amended report marked “AMENDED”.', 'State what changed, why, the date/time and who authorised it.', 'Inform the clinician if the change affects management; document the call.', 'Record in the non-conformance log and identify root cause.'] },
        { h: 'Turnaround-time targets (example)', tb: { hd: ['Category', 'Target (receipt → report)'], r: [['STAT (emergency): K⁺, glucose, troponin, CBC', '≤ 60 min'], ['Routine chemistry / CBC', 'Same day (≤ 4–6 h)'], ['Hormones / tumour markers', '24 h'], ['Culture (negative)', '48 h urine · 5 days blood'], ['Histopathology', '3–5 working days']] } }
      ]
    },

    /* ---------------- SAFETY ---------------- */
    {
      id: 'biosafety', n: 'Biosafety & PPE', ic: '🦺', cat: 'Safety', aka: 'biosafety ppe gloves gown mask standard precautions bsc biosafety cabinet',
      sec: [
        { h: 'Standard precautions', li: ['Treat every specimen as potentially infectious.', 'Wear lab coat (closed front), gloves; eye protection / face shield when splashes possible; N95 for TB and aerosol-generating procedures.', 'Hand hygiene before and after glove use and between patients.', 'No eating, drinking, applying cosmetics or handling contact lenses in the lab.', 'Mouth pipetting is prohibited.'] },
        { h: 'Biosafety cabinet (Class II)', li: ['Switch on 5–15 min before use; do not block front/back grilles.', 'Work at least 10 cm inside; slow movements; minimal items inside.', 'Disinfect surfaces before and after (70 % ethanol / 1 % hypochlorite then wipe).', 'Annual certification (airflow, HEPA integrity).'] },
        { h: 'Vaccination & health', li: ['Hepatitis B vaccination with anti-HBs titre check for all staff.', 'Report illness, injuries and exposures immediately.'] }
      ]
    },
    {
      id: 'spill', n: 'Spill Management & Needle-stick Injury', ic: '🧯', cat: 'Safety', aka: 'spill blood spill needle stick injury exposure pep hypochlorite',
      sec: [
        { h: 'Blood / body-fluid spill', st: ['Alert others; put on gloves, gown, eye protection.', 'Cover the spill with absorbent paper.', 'Pour 1 % sodium hypochlorite (10 000 ppm available chlorine) from the outside inwards; leave 10–30 min.', 'Pick up broken glass with forceps/brush — never hands.', 'Wipe up, discard into biohazard (yellow/red) waste, re-wipe with 0.1 % hypochlorite / 70 % ethanol.', 'Remove PPE, wash hands, record the incident.'] },
        { h: 'Needle-stick / sharps injury', st: ['Let the wound bleed gently; wash with soap and running water — do not scrub or squeeze hard.', 'Mucous membranes / eyes: irrigate with water or saline for 10–15 min.', 'Report immediately to the supervisor / infection-control officer.', 'Identify the source patient; test source (HBsAg, anti-HCV, HIV) with consent.', 'Baseline testing of the exposed worker; start HIV PEP ideally within 2 h (no later than 72 h) if indicated; HBV vaccine/HBIG per anti-HBs status.', 'Follow up at 6 weeks, 3 and 6 months; document.'] }
      ]
    },
    {
      id: 'waste', n: 'Biomedical Waste Segregation', ic: '🗑️', cat: 'Safety', aka: 'waste segregation biomedical colour coded bin sharps autoclave',
      sec: [
        { h: 'Colour coding (common scheme — follow national rules)', tb: { hd: ['Bin / bag', 'Waste'], r: [['Yellow', 'Anatomical, soiled dressings, cultures (after pre-treatment), discarded blood bags, chemical waste'], ['Red', 'Contaminated recyclable plastics: tubing, gloves, tubes (without needles), urine containers'], ['White / translucent puncture-proof', 'Sharps: needles, lancets, blades, syringes with needles'], ['Blue / cardboard box', 'Broken or contaminated glassware, slides'], ['Black', 'General non-infectious waste']] } },
        { h: 'Rules', li: ['Segregate at the point of generation; never re-sort.', 'Fill sharps containers to ¾ only, then seal.', 'Autoclave / chemically disinfect microbiology cultures before disposal (121 °C, 15 psi, ≥ 30 min).', 'Do not recap needles.'] }
      ]
    },
    {
      id: 'chem', n: 'Chemical Safety', ic: '⚗️', cat: 'Safety', aka: 'chemical safety msds sds acid formalin flammable eyewash',
      sec: [
        { h: 'Essentials', li: ['Keep a Safety Data Sheet (SDS) for every chemical; label all containers with name, hazard, date.', 'Add acid to water — never water to acid.', 'Store flammables in a flammable cabinet; acids and bases separately.', 'Use a fume hood for formalin, xylene, methanol, concentrated acids.', 'Know the eyewash and safety-shower locations; test eyewash weekly.', 'Chemical splash on skin/eyes: flush with water for 15 min, then seek medical advice.'] }
      ]
    },

    /* ---------------- MANAGEMENT ---------------- */
    {
      id: 'iso', n: 'ISO 15189 & Documentation Checklist', ic: '📋', cat: 'Management', aka: 'iso 15189 accreditation documentation sop records audit nabl',
      sec: [
        { h: 'Documents every lab needs', li: ['Quality manual and quality policy.', 'SOPs for every test (principle, specimen, reagents, procedure, QC, calculations, reference intervals, critical limits, interferences, safety, references) — reviewed every 1–2 years.', 'Document control: version, approval, distribution, obsolete copies withdrawn.', 'Staff training, competency (annual) and authorisation records.', 'Equipment inventory, maintenance, calibration and service records.', 'IQC, EQA, corrective action and non-conformance logs.', 'Complaints, internal audits and management review records.'] },
        { h: 'Quality indicators to monitor', li: ['Sample rejection rate (target < 1–2 %).', 'Haemolysis rate.', 'TAT compliance %.', 'Critical value notification within target %.', 'EQA performance %.', 'Amended report rate.', 'Customer / clinician satisfaction.'] }
      ]
    },
    {
      id: 'sopwrite', n: 'How to Write a Test SOP (Template)', ic: '✍️', cat: 'Management', aka: 'sop template write standard operating procedure format',
      sec: [
        { h: 'Sections', st: ['Title, document number, version, effective date, author, approver.', 'Purpose & scope.', 'Principle of the method.', 'Specimen: type, container, volume, patient preparation, stability, rejection criteria.', 'Reagents, calibrators, controls: storage and preparation.', 'Equipment.', 'Procedure (step-by-step) including calibration and QC.', 'Calculations and units.', 'Reference intervals and critical values.', 'Reportable range, dilution protocol, interferences, limitations.', 'Safety precautions.', 'References (kit insert, textbooks, guidelines).', 'Revision history.'] }
      ]
    }
  ];
})();
