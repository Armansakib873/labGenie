/* =====================================================================
   LabGenie SOP Guidebook · learn.js
   • Case studies (worked interpretation, answer hidden until opened)
   • Pattern finder (pick abnormal findings → likely patterns + next tests)
   • Timed MCQ quiz (30 s per question, progress saved, JPG result card)
   Guidance for training only — not a diagnostic tool.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  ['Case studies', 'Learning'].forEach(c => G.GCATS.includes(c) || G.GCATS.push(c));
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ST2 = { get: (k, d) => { try { const v = localStorage.getItem('lg.' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem('lg.' + k, JSON.stringify(v)); } catch (_) {} } };
  const $i = id => document.getElementById(id);
  const toast = m => { try { window.toast && window.toast(m); } catch (_) {} };
  G.TOOLX = G.TOOLX || {};
  G.ACT = G.ACT || {};
  const refresh = () => G.refreshTool && G.refreshTool();

  /* =============================== CASE STUDIES =============================== */
  const CASE = (id, n, ic, story, rows, q, ans, tp, aka) => ({ id, n, ic, cat: 'Case studies', aka: 'case study interpretation ' + (aka || ''), sec: [{ h: 'Scenario', p: story }, { h: 'Results', tb: { hd: ['Test', 'Result', 'Reference'], r: rows } }, { h: 'Question', p: q }, { h: 'Answer & reasoning (tap to reveal)', li: ans }, { h: 'Teaching points', li: tp }] });
  G.GUIDES.push(
    CASE('cs-thal', 'Microcytosis: iron deficiency or thalassaemia trait?', '🩸', 'A 24-year-old woman is screened before marriage. She feels well and has no heavy periods.', [['Hb', '10.8 g/dL', '12–15'], ['RBC', '5.9 ×10¹²/L', '3.8–4.8'], ['MCV', '64 fL', '83–101'], ['MCH', '19 pg', '27–32'], ['RDW', '13.2 %', '11.6–14'], ['Ferritin', '85 ng/mL', '15–150']], 'What is the most likely diagnosis and the next test?', ['Mentzer index = 64 ÷ 5.9 = 10.8 (< 13) → favours thalassaemia trait.', 'High RBC count with mild anaemia, normal RDW and normal ferritin argue against iron deficiency.', 'Next: HPLC / electrophoresis — HbA2 5.2 % confirms β-thalassaemia trait. Offer partner screening.'], ['Correct iron deficiency first — it can lower HbA2 and hide a β-trait.', 'Normal HbA2 with microcytosis and normal ferritin → consider α-thalassaemia (DNA test).'], 'mentzer hba2 microcytic'),
    CASE('cs-pseudok', 'Very high potassium in a patient with CLL', '⚡', 'A 72-year-old man with CLL comes for routine follow-up. He is well; ECG is normal. The sample was a clotted serum tube sent by courier.', [['WBC', '185 ×10⁹/L', '4–10'], ['Serum K⁺', '7.2 mmol/L', '3.5–5.1'], ['Creatinine', '1.0 mg/dL', '0.7–1.3'], ['Haemolysis index', 'Normal', '']], 'Is this true hyperkalaemia? What would you do?', ['Probably pseudohyperkalaemia: fragile leukaemic cells release K⁺ during clotting and transport.', 'Clinically well, normal ECG and normal renal function do not fit K⁺ 7.2.', 'Repeat as heparinised whole blood on a blood-gas analyser (or plasma, gently handled, no pneumatic tube): K⁺ 4.3 mmol/L.'], ['Very high WBC or platelet counts cause falsely high serum K⁺.', 'Do not refrigerate unspun samples — K⁺ also leaks from cells at 4 °C.'], 'pseudohyperkalaemia potassium leukaemia'),
    CASE('cs-edta', 'High potassium, very low calcium, well patient', '🧪', 'Routine outpatient chemistry for a 45-year-old woman. She is asymptomatic. Several tubes were filled from one syringe.', [['K⁺', '9.8 mmol/L', '3.5–5.1'], ['Calcium', '1.2 mg/dL', '8.6–10.2'], ['ALP', '12 U/L', '40–130'], ['Magnesium', '0.6 mg/dL', '1.7–2.4']], 'What explains this pattern?', ['K₂EDTA contamination of the serum sample (wrong order of draw or decanting from the lavender tube).', 'EDTA adds potassium and chelates Ca²⁺ and Mg²⁺; ALP is inhibited because it needs Mg²⁺ / Zn²⁺.', 'Do not report — request a fresh sample drawn in the correct order.'], ['Order of draw: culture → citrate → serum → heparin → EDTA → fluoride.', 'Never pour blood from one tube into another.'], 'edta contamination order of draw'),
    CASE('cs-pltclump', 'Platelets 35 in a patient without bleeding', '🟣', 'Pre-operative CBC for a healthy 30-year-old man. The analyser flags “PLT clumps”.', [['Platelets (EDTA)', '35 ×10³/µL', '150–410'], ['Hb', '14.6 g/dL', '13–17'], ['WBC', '7.2 ×10³/µL', '4–10']], 'What should you do before reporting?', ['Examine the film: large platelet clumps at the feathered edge → EDTA-dependent pseudo-thrombocytopenia.', 'Recollect in sodium citrate (multiply by 1.1 for dilution) or count immediately after collection: 212 ×10³/µL.', 'Report with a comment so surgery is not delayed unnecessarily.'], ['Always check the film for clumps and satellitism before reporting an unexpected low platelet count.'], 'pseudothrombocytopenia platelet clumps citrate'),
    CASE('cs-cold', 'Impossible MCHC', '❄️', 'An elderly woman with recent pneumonia. The CBC is run straight from the fridge.', [['RBC', '1.9 ×10¹²/L', '3.8–4.8'], ['Hb', '11.8 g/dL', '12–15'], ['Hct', '21 %', '36–46'], ['MCV', '112 fL', '83–101'], ['MCHC', '39.5 g/dL', '31.5–34.5']], 'What is the problem and how do you fix it?', ['MCHC > 37 and Hb × 3 ≠ Hct → red-cell agglutination: cold agglutinins (e.g. after Mycoplasma).', 'RBC doublets are counted as single large cells → low RBC, high MCV, low Hct, high MCHC; Hb is correct.', 'Warm the sample at 37 °C for 15–30 min and re-run (or replace plasma with saline).'], ['Use the rule of three (Hb × 3 ≈ Hct) as a quick plausibility check.', 'Lipaemia also raises MCHC — but via falsely high Hb.'], 'cold agglutinin mchc'),
    CASE('cs-lipna', 'Low sodium in a milky sample', '🥛', 'A man with acute pancreatitis. The serum looks milky.', [['Na⁺ (indirect ISE)', '128 mmol/L', '135–145'], ['Triglycerides', '2500 mg/dL', '< 150'], ['Measured osmolality', '290 mOsm/kg', '275–295'], ['Na⁺ (direct ISE, blood gas)', '139 mmol/L', '135–145']], 'Why do the two sodium results differ?', ['Pseudohyponatraemia: the indirect ISE dilutes the sample and assumes normal water content; lipids take up volume.', 'Direct ISE and a normal measured osmolality show the true sodium is normal.', 'Report the direct ISE value / ultracentrifuge the sample; comment on lipaemia.'], ['Severe hyperproteinaemia (myeloma) causes the same effect.'], 'pseudohyponatraemia lipaemia indirect ise'),
    CASE('cs-prerenal', 'Rising urea after vomiting', '💧', 'A 60-year-old man has had vomiting and diarrhoea for 3 days and looks dry.', [['Urea', '120 mg/dL (BUN 56)', '15–45'], ['Creatinine', '2.0 mg/dL', '0.7–1.3'], ['BUN : creatinine', '28', '10–20'], ['Urine Na⁺', '10 mmol/L', ''], ['FeNa', '0.4 %', '']], 'Prerenal or intrinsic AKI?', ['BUN:Cr > 20, low urine sodium and FeNa < 1 % → prerenal AKI (hypovolaemia).', 'Kidneys are avidly retaining sodium — tubules still working.', 'Fluids should restore function; recheck in 24–48 h.'], ['FeNa is unreliable on diuretics — use FeUrea < 35 %.', 'GI bleeding also raises urea out of proportion to creatinine.'], 'prerenal aki fena bun creatinine ratio'),
    CASE('cs-eudka', 'Normal-ish glucose but very sick', '🍬', 'A 50-year-old woman with type 2 diabetes on empagliflozin, vomiting after surgery.', [['Glucose', '190 mg/dL', '70–140'], ['pH', '7.12', '7.35–7.45'], ['HCO₃⁻', '9 mmol/L', '22–26'], ['Anion gap', '26', '8–12'], ['β-hydroxybutyrate', '5.4 mmol/L', '< 0.6'], ['Urine ketones (dipstick)', '1+', 'Negative']], 'What is the diagnosis?', ['Euglycaemic DKA associated with an SGLT2 inhibitor.', 'High anion gap metabolic acidosis with very high BHB despite only moderately raised glucose.', 'Dipstick (nitroprusside) underestimates ketosis because it detects acetoacetate, not BHB.'], ['Measure blood BHB in sick patients on SGLT2 inhibitors even if glucose is near normal.'], 'euglycaemic dka sglt2 bhb'),
    CASE('cs-biotin', 'Thyrotoxic results in a well patient', '💊', 'A 35-year-old woman with no symptoms, taking a hair-and-nail supplement (biotin 10 mg / day).', [['TSH', '0.02 mIU/L', '0.4–4.0'], ['Free T4', '3.9 ng/dL', '0.9–1.7'], ['Free T3', '7.8 pg/mL', '2.3–4.2']], 'What is going on?', ['Biotin interference with streptavidin–biotin immunoassays.', 'Sandwich assays (TSH) read falsely LOW; competitive assays (FT4, FT3) read falsely HIGH — mimicking Graves’ disease.', 'Stop biotin for ≥ 2–3 days (longer for very high doses) and repeat, or use a non-biotin platform.'], ['Ask about supplements whenever results do not fit the clinical picture.', 'Biotin also affects troponin, hCG, PTH and many hormone assays.'], 'biotin interference thyroid immunoassay'),
    CASE('cs-haemolysis', 'High K⁺, AST and LDH — real?', '🩹', 'A difficult paediatric draw through a small needle; the sample is noticeably pink.', [['K⁺', '6.1 mmol/L', '3.5–5.1'], ['AST', '88 U/L', '< 40'], ['ALT', '22 U/L', '< 41'], ['LDH', '650 U/L', '125–220'], ['Haemolysis index', 'High (H 3+)', ''], ['Haptoglobin / bilirubin', 'Normal', '']], 'How should you report?', ['In-vitro haemolysis: K⁺, AST and LDH are released from red cells; ALT barely changes.', 'Normal haptoglobin and bilirubin argue against in-vivo haemolysis.', 'Do not report K⁺ / AST / LDH; request a recollection with a larger needle and gentle handling.'], ['Use the analyser’s HIL indices and your lab’s cut-offs for each test.'], 'haemolysis hil interference'),
    CASE('cs-dengue', 'Day 5 of fever with falling platelets', '🦟', 'A 19-year-old with dengue NS1 positive on day 2 now feels better but has abdominal pain.', [['Day 3 Hct', '38 %', ''], ['Day 5 Hct', '46 %', '36–46'], ['Platelets', '28 ×10³/µL', '150–410'], ['WBC', '2.8 ×10³/µL', '4–10'], ['AST / ALT', '180 / 90 U/L', '< 40']], 'What phase is this and why does it matter?', ['Critical phase (around defervescence): rising Hct ≥ 20 % with falling platelets = plasma leakage.', 'Abdominal pain is a warning sign — needs close monitoring / fluids.', 'AST > ALT is typical of dengue.'], ['Report rising Hct together with platelet trend; flag platelets < 20 ×10³/µL.'], 'dengue critical phase hct platelets'),
    CASE('cs-conn', 'Resistant hypertension with low potassium', '🫀', 'A 42-year-old man on three antihypertensives (not including β-blockers or diuretics).', [['K⁺', '3.1 mmol/L', '3.5–5.1'], ['HCO₃⁻', '30 mmol/L', '22–26'], ['Aldosterone', '28 ng/dL', '4–31'], ['Plasma renin activity', '0.3 ng/mL/h', '0.5–4.0'], ['ARR', '93', '< 20–30']], 'What is the likely diagnosis and next step?', ['Primary aldosteronism: high ARR with aldosterone > 15 ng/dL and suppressed renin.', 'Hypokalaemia and metabolic alkalosis support it (and hypokalaemia can falsely lower aldosterone — correct K⁺ first).', 'Next: confirmatory test (saline infusion / captopril) then adrenal CT ± adrenal vein sampling.'], ['Renin samples must stay at room temperature — ice falsely raises renin.'], 'primary aldosteronism arr renin aldosterone'),
    CASE('cs-addison', 'Low sodium, high potassium, low glucose', '🧂', 'A 28-year-old woman with fatigue, weight loss and darker skin is brought in hypotensive.', [['Na⁺', '124 mmol/L', '135–145'], ['K⁺', '6.2 mmol/L', '3.5–5.1'], ['Glucose', '58 mg/dL', '70–140'], ['Cortisol (08:00)', '2.1 µg/dL', '5–23'], ['ACTH', '480 pg/mL', '7–63']], 'Interpret.', ['Primary adrenal insufficiency (Addison’s disease): low cortisol with very high ACTH; mineralocorticoid deficiency causes low Na⁺ / high K⁺.', 'This is an adrenal crisis — treatment (hydrocortisone, fluids) must not wait for confirmatory tests.'], ['Take cortisol + ACTH before giving steroids if it does not delay treatment.', 'ACTH needs a chilled EDTA plastic tube on ice.'], 'addison adrenal insufficiency acth cortisol'),
    CASE('cs-myeloma', 'Back pain, anaemia and a very high ESR', '🦴', 'A 66-year-old man with back pain and tiredness.', [['Hb', '8.9 g/dL', '13–17'], ['ESR', '110 mm/h', '< 20'], ['Calcium', '11.8 mg/dL', '8.6–10.2'], ['Creatinine', '2.1 mg/dL', '0.7–1.3'], ['Total protein / albumin', '9.8 / 3.0 g/dL', ''], ['Film', 'Rouleaux', '']], 'What is suspected and which tests confirm it?', ['Multiple myeloma: CRAB features (hypercalcaemia, renal impairment, anaemia, bone pain) with a high globulin gap (6.8 g/dL) and rouleaux.', 'Next: serum protein electrophoresis + immunofixation, serum free light chains, urine Bence-Jones, marrow examination.'], ['Calculated globulin (total protein − albumin) > 3.5 g/dL is a useful screening clue.'], 'myeloma crab spep'),
    CASE('cs-ttp', 'Confusion, low platelets and fragments', '🚨', 'A 32-year-old woman with confusion and bruising.', [['Hb', '7.8 g/dL', '12–15'], ['Platelets', '12 ×10³/µL', '150–410'], ['Schistocytes', '6 %', '< 1 %'], ['LDH', '1450 U/L', '125–220'], ['PT / aPTT / fibrinogen', 'Normal', ''], ['Creatinine', '1.4 mg/dL', '0.5–1.1']], 'What is the likely diagnosis and what is urgent?', ['Thrombotic thrombocytopenic purpura (TTP): MAHA + severe thrombocytopenia with normal clotting tests (unlike DIC).', 'Medical emergency: send ADAMTS13 before treatment; urgent plasma exchange.', 'Avoid platelet transfusion unless life-threatening bleeding.'], ['Schistocytes > 1 % with low platelets must be phoned as a critical result.'], 'ttp maha schistocytes adamts13'),
    CASE('cs-lithium', 'Toxic lithium level in a well patient', '🧫', 'A stable patient on lithium for bipolar disorder. Level drawn 12 h after the dose in a green-top tube.', [['Lithium', '9.6 mmol/L', '0.6–1.0'], ['Creatinine', '0.9 mg/dL', '0.7–1.3'], ['Clinical state', 'Well, no tremor', '']], 'What happened?', ['The sample was collected in a lithium-heparin tube — the additive itself gives a falsely toxic result.', 'Recollect in a plain (red) tube: 0.8 mmol/L.'], ['TDM samples: correct tube, correct timing (trough), documented dose time.'], 'lithium heparin tube tdm')
  );

  /* =============================== PATTERN FINDER =============================== */
  const FG = [
    ['Blood count', [['hb_l', 'Hb ↓'], ['hb_h', 'Hb / Hct ↑'], ['mcv_l', 'MCV ↓'], ['mcv_h', 'MCV ↑'], ['rdw_h', 'RDW ↑'], ['rbc_h', 'RBC count ↑'], ['ret_h', 'Retic ↑'], ['ret_l', 'Retic ↓'], ['wbc_h', 'WBC ↑'], ['wbc_l', 'WBC ↓'], ['neu_h', 'Neutrophils ↑'], ['lym_h', 'Lymphocytes ↑'], ['eos_h', 'Eosinophils ↑'], ['plt_l', 'Platelets ↓'], ['plt_h', 'Platelets ↑'], ['blast', 'Blasts on film'], ['schis', 'Schistocytes'], ['hct_h', 'Hct rising']]],
    ['Iron & haemolysis', [['fer_l', 'Ferritin ↓'], ['fer_h', 'Ferritin ↑'], ['a2_h', 'HbA2 ↑'], ['bil_h', 'Indirect bilirubin ↑'], ['ldh_h', 'LDH ↑'], ['hap_l', 'Haptoglobin ↓']]],
    ['Coagulation', [['pt_h', 'PT ↑'], ['aptt_h', 'aPTT ↑'], ['fib_l', 'Fibrinogen ↓'], ['dd_h', 'D-dimer ↑']]],
    ['Kidney & electrolytes', [['urea_h', 'Urea ↑'], ['cr_h', 'Creatinine ↑'], ['bcr_h', 'BUN : Cr > 20'], ['na_l', 'Na ↓'], ['na_h', 'Na ↑'], ['k_h', 'K ↑'], ['k_l', 'K ↓'], ['ca_h', 'Ca ↑'], ['ca_l', 'Ca ↓'], ['po4_h', 'PO₄ ↑'], ['po4_l', 'PO₄ ↓'], ['ua_h', 'Uric acid ↑'], ['hco3_l', 'HCO₃ ↓'], ['hco3_h', 'HCO₃ ↑'], ['ag_h', 'Anion gap ↑'], ['uprot', 'Proteinuria'], ['hemat', 'Haematuria']]],
    ['Liver, pancreas, heart', [['alt_h', 'ALT ↑'], ['ast_gt', 'AST > ALT'], ['alp_h', 'ALP ↑'], ['ggt_h', 'GGT ↑'], ['dbil_h', 'Direct bilirubin ↑'], ['alb_l', 'Albumin ↓'], ['glob_h', 'Globulin ↑'], ['lip_h', 'Lipase / amylase ↑'], ['trop_h', 'Troponin ↑'], ['ck_h', 'CK ↑']]],
    ['Endocrine & metabolic', [['glu_h', 'Glucose ↑'], ['glu_l', 'Glucose ↓'], ['ket_h', 'Ketones ↑'], ['tsh_h', 'TSH ↑'], ['tsh_l', 'TSH ↓'], ['ft4_h', 'FT4 ↑'], ['ft4_l', 'FT4 ↓'], ['chol_h', 'Cholesterol ↑']]],
    ['Inflammation & clinical', [['crp_h', 'CRP ↑'], ['esr_h', 'ESR very high'], ['fever', 'Fever'], ['htn', 'Hypertension'], ['preg', 'Pregnant'], ['itch', 'Itching (pregnancy)']]]
  ];
  const FL = Object.fromEntries(FG.flatMap(g => g[1]));
  const PAT = [
    { n: 'Iron-deficiency anaemia', f: ['hb_l', 'mcv_l', 'rdw_h', 'fer_l', 'plt_h'], x: ['fer_h', 'a2_h'], d: 'Microcytic hypochromic anaemia from low iron stores.', nx: ['Ferritin, iron / TIBC', 'Look for blood loss (menstrual, GI — stool occult blood)', 'Dietary history, coeliac serology if refractory'], t: ['iron', 'cbc', 'srme'] },
    { n: 'β-thalassaemia trait', f: ['mcv_l', 'rbc_h', 'a2_h'], x: ['fer_l', 'rdw_h'], d: 'Microcytosis out of proportion to the mild anaemia, high RBC count.', nx: ['HbA2 by HPLC (> 3.5 %)', 'Mentzer index < 13', 'Partner / family screening'], t: ['hbelectro'] },
    { n: 'Anaemia of inflammation (chronic disease)', f: ['hb_l', 'fer_h', 'crp_h', 'esr_h'], x: ['ret_h', 'fer_l'], d: 'Normocytic or mildly microcytic anaemia with iron trapped in stores.', nx: ['Iron studies (low iron, low TIBC, normal / high ferritin)', 'Look for chronic infection, autoimmune disease, malignancy, CKD'], t: ['iron', 'crp'] },
    { n: 'Megaloblastic anaemia (B12 / folate)', f: ['hb_l', 'mcv_h', 'wbc_l', 'plt_l', 'ldh_h', 'bil_h'], x: ['ret_h'], d: 'Macrocytic anaemia, often with pancytopenia and very high LDH.', nx: ['B12, folate (± MMA / homocysteine)', 'Film: oval macrocytes, hypersegmented neutrophils', 'Anti-intrinsic-factor antibodies'], t: ['vitd', 'pbf', 'hcy'] },
    { n: 'Haemolytic anaemia', f: ['hb_l', 'ret_h', 'bil_h', 'ldh_h', 'hap_l'], x: [], d: 'Red cells destroyed faster than produced.', nx: ['DAT (immune vs non-immune)', 'Blood film (spherocytes, schistocytes, bite cells)', 'G6PD, HPLC, EMA as indicated'], t: ['dat', 'pbf', 'hapto', 'g6pd'] },
    { n: 'Thrombotic microangiopathy (TTP / HUS)', f: ['schis', 'plt_l', 'ldh_h', 'hb_l', 'cr_h'], x: ['pt_h', 'fib_l'], d: 'MAHA with thrombocytopenia but normal coagulation tests — emergency.', nx: ['Urgent ADAMTS13 (before plasma exchange)', 'Phone as critical result', 'Stool for STEC in diarrhoea-associated HUS'], t: ['pbf', 'ldh'] },
    { n: 'Disseminated intravascular coagulation', f: ['plt_l', 'pt_h', 'aptt_h', 'fib_l', 'dd_h', 'schis'], x: [], d: 'Consumption of clotting factors and platelets.', nx: ['ISTH DIC score (platelets, PT, fibrinogen, D-dimer)', 'Treat the trigger (sepsis, obstetric, trauma, APL)'], t: ['fib', 'ddimer', 'pt'] },
    { n: 'Acute leukaemia', f: ['blast', 'plt_l', 'hb_l', 'wbc_h'], x: [], d: 'Blasts with marrow failure.', nx: ['Urgent film review and haematology referral', 'Flow cytometry, marrow', 'Coagulation screen (APL → DIC)'], t: ['pbf', 'cbc'] },
    { n: 'Myeloproliferative neoplasm (CML / PV / ET)', f: ['wbc_h', 'plt_h', 'eos_h', 'hb_h', 'neu_h'], x: ['blast'], d: 'High counts in one or more lineages.', nx: ['Film (basophilia, myelocyte bulge)', 'BCR-ABL1 (CML), JAK2 / CALR / MPL'], t: ['pbf'] },
    { n: 'Bacterial infection / sepsis', f: ['wbc_h', 'neu_h', 'crp_h', 'fever'], x: ['lym_h'], d: 'Neutrophilia with raised inflammatory markers.', nx: ['Procalcitonin', 'Blood cultures before antibiotics', 'Lactate if unwell'], t: ['pct', 'bcs', 'lactate'] },
    { n: 'Dengue (plasma-leakage phase)', f: ['fever', 'wbc_l', 'plt_l', 'hct_h', 'ast_gt'], x: ['neu_h'], d: 'Leucopenia, thrombocytopenia and rising Hct.', nx: ['NS1 (days 1–5) / IgM (≥ day 5)', 'Serial Hct and platelets', 'Watch for warning signs'], t: ['dengue', 'cbc'] },
    { n: 'Viral infection / infectious mononucleosis', f: ['lym_h', 'alt_h', 'fever'], x: ['neu_h'], d: 'Lymphocytosis with reactive lymphocytes.', nx: ['Film for reactive lymphocytes', 'Monospot / EBV serology'], t: ['pbf'] },
    { n: 'Parasitic infection / allergy', f: ['eos_h'], x: [], d: 'Eosinophilia.', nx: ['Stool for ova and parasites', 'Total IgE', 'Drug history'], t: ['srme', 'ige'] },
    { n: 'Prerenal acute kidney injury', f: ['urea_h', 'cr_h', 'bcr_h', 'na_h'], x: ['po4_h', 'hb_l'], d: 'Reduced renal perfusion (dehydration, bleeding, heart failure).', nx: ['Urine sodium, FeNa (< 1 %)', 'Volume status; GI bleed?'], t: ['uelec', 'renal'] },
    { n: 'Chronic kidney disease', f: ['cr_h', 'urea_h', 'hb_l', 'po4_h', 'ca_l', 'k_h'], x: ['bcr_h'], d: 'Long-standing loss of renal function with anaemia and mineral changes.', nx: ['eGFR trend, urine ACR', 'PTH, vitamin D, iron studies'], t: ['renal', 'uacr', 'pth'] },
    { n: 'Spurious hyperkalaemia (sample problem)', f: ['k_h', 'plt_h', 'wbc_h'], x: ['cr_h', 'hco3_l'], d: 'Potassium released in vitro (haemolysis, high cells, delay, EDTA, fist clenching).', nx: ['Check haemolysis index and sample age', 'Repeat as plasma / blood-gas K⁺ with good technique'], t: ['lyte'] },
    { n: 'Diabetic ketoacidosis', f: ['glu_h', 'ket_h', 'hco3_l', 'ag_h', 'k_h'], x: [], d: 'Ketosis with high anion gap metabolic acidosis.', nx: ['Blood BHB, venous / arterial gas', 'Repeat K⁺ hourly during insulin therapy'], t: ['bhb', 'abg', 'glucose'] },
    { n: 'Hepatocellular injury (hepatitis)', f: ['alt_h', 'dbil_h', 'fever'], x: ['alp_h'], d: 'ALT-predominant liver injury.', nx: ['Viral hepatitis markers (A, B, C, E)', 'Drug / toxin history (paracetamol)', 'INR / albumin for synthetic function'], t: ['lft', 'hbv', 'viral'] },
    { n: 'Alcohol-related liver disease', f: ['ast_gt', 'ggt_h', 'mcv_h', 'plt_l'], x: [], d: 'AST : ALT > 2 with raised GGT and macrocytosis.', nx: ['Alcohol history', 'Ultrasound, fibrosis assessment'], t: ['lft', 'cbc'] },
    { n: 'Cholestasis', f: ['alp_h', 'ggt_h', 'dbil_h'], x: [], d: 'Obstructive / cholestatic pattern.', nx: ['Ultrasound for duct dilatation', 'AMA (PBC), drug history'], t: ['lft'] },
    { n: 'Obstetric cholestasis', f: ['preg', 'itch', 'alt_h'], x: [], d: 'Itching in pregnancy with raised bile acids.', nx: ['Serum bile acids (≥ 19 µmol/L)', 'Weekly LFT / bile acids'], t: ['bileacid', 'lft'] },
    { n: 'Pre-eclampsia / HELLP', f: ['preg', 'htn', 'uprot', 'plt_l', 'alt_h', 'ldh_h', 'ua_h'], x: [], d: 'Hypertension in pregnancy with proteinuria and organ involvement.', nx: ['Urine protein : creatinine', 'Platelets, LFT, LDH, creatinine, film for haemolysis'], t: ['uacr', 'cbc', 'lft'] },
    { n: 'Primary hyperparathyroidism', f: ['ca_h', 'po4_l'], x: ['cr_h', 'glob_h'], d: 'High calcium with inappropriately normal / high PTH.', nx: ['PTH, vitamin D, urine calcium'], t: ['pth', 'ca'] },
    { n: 'Multiple myeloma', f: ['ca_h', 'glob_h', 'esr_h', 'cr_h', 'hb_l', 'alb_l'], x: [], d: 'CRAB features with high globulin.', nx: ['Serum electrophoresis + immunofixation', 'Serum free light chains, urine Bence-Jones'], t: ['spep', 'flc'] },
    { n: 'Vitamin D deficiency / osteomalacia', f: ['ca_l', 'po4_l', 'alp_h'], x: ['cr_h'], d: 'Low calcium and phosphate with high ALP.', nx: ['25-OH vitamin D, PTH'], t: ['vitd', 'pth'] },
    { n: 'Primary hypothyroidism', f: ['tsh_h', 'ft4_l', 'chol_h'], x: [], d: 'Failing thyroid gland.', nx: ['Anti-TPO antibodies', 'Repeat in 6–8 weeks if subclinical'], t: ['thyroid', 'tg'] },
    { n: 'Hyperthyroidism', f: ['tsh_l', 'ft4_h'], x: [], d: 'Excess thyroid hormone.', nx: ['Free T3, TRAb (Graves’)', 'Exclude biotin interference if clinically euthyroid'], t: ['thyroid', 'tg'] },
    { n: 'Central hypothyroidism / non-thyroidal illness', f: ['tsh_l', 'ft4_l'], x: [], d: 'Low FT4 without the expected TSH rise.', nx: ['Pituitary assessment (cortisol, prolactin, LH / FSH)', 'Repeat after acute illness'], t: ['thyroid', 'cortisol'] },
    { n: 'Adrenal insufficiency', f: ['na_l', 'k_h', 'glu_l'], x: ['htn'], d: 'Cortisol (± aldosterone) deficiency.', nx: ['08:00 cortisol + ACTH', 'Synacthen test'], t: ['cortisol', 'acth'] },
    { n: 'Primary aldosteronism', f: ['k_l', 'htn', 'hco3_h', 'na_h'], x: ['k_h'], d: 'Autonomous aldosterone secretion.', nx: ['Aldosterone : renin ratio (correct K⁺ first)', 'Confirmatory test'], t: ['raa'] },
    { n: 'Nephrotic syndrome', f: ['uprot', 'alb_l', 'chol_h'], x: ['hemat'], d: 'Heavy proteinuria with low albumin and high lipids.', nx: ['Urine protein : creatinine', 'Renal biopsy pathway'], t: ['uacr', 'lipid'] },
    { n: 'Glomerulonephritis', f: ['hemat', 'uprot', 'cr_h', 'htn'], x: [], d: 'Nephritic picture.', nx: ['Urine microscopy for red-cell casts', 'C3 / C4, ANA, anti-dsDNA, ANCA, ASO'], t: ['c3c4', 'anca', 'ana', 'urme'] },
    { n: 'Acute pancreatitis', f: ['lip_h', 'ca_l', 'glu_h', 'wbc_h'], x: [], d: 'Lipase > 3× upper limit with abdominal pain.', nx: ['Triglycerides, calcium, LFT (gallstones)'], t: ['amylase', 'lipid'] },
    { n: 'Myocardial injury', f: ['trop_h', 'ck_h'], x: [], d: 'Raised troponin.', nx: ['Serial hs-troponin (rise / fall)', 'ECG'], t: ['cardiac'] },
    { n: 'Rhabdomyolysis', f: ['ck_h', 'k_h', 'cr_h', 'po4_h', 'ua_h', 'ca_l'], x: ['trop_h'], d: 'Muscle breakdown releasing CK, K⁺, phosphate and urate.', nx: ['CK trend, urine myoglobin', 'Monitor K⁺ and renal function'], t: ['cardiac', 'renal'] },
    { n: 'Tumour lysis syndrome', f: ['ua_h', 'k_h', 'po4_h', 'ca_l', 'cr_h', 'ldh_h'], x: [], d: 'Cell breakdown after chemotherapy or in bulky tumours.', nx: ['Repeat electrolytes 6-hourly', 'Rasburicase samples on ice'], t: ['uric', 'lyte'] },
    { n: 'Systemic lupus erythematosus', f: ['wbc_l', 'plt_l', 'hb_l', 'uprot', 'esr_h'], x: ['crp_h'], d: 'Cytopenias, proteinuria and high ESR with modest CRP.', nx: ['ANA, anti-dsDNA, C3 / C4'], t: ['ana', 'dsdna', 'c3c4'] }
  ];
  let PF = ST2.get('soppf', []);
  const score = p => { const m = p.f.filter(k => PF.includes(k)).length, x = p.x.filter(k => PF.includes(k)).length; return { m, x, s: m ? Math.max(0, Math.round(100 * (0.6 * m / PF.length + 0.4 * m / p.f.length)) - x * 30) : 0 }; };
  G.TOOLX.pattern = () => {
    const res = PF.length ? PAT.map(p => ({ p, r: score(p) })).filter(o => o.r.m && o.r.s > 0).sort((a, b) => b.r.s - a.r.s || b.r.m - a.r.m).slice(0, 6) : [];
    const T = id => (G.TESTS || []).find(t => t.id === id);
    return `<h3>🧩 Pattern finder</h3><p class="sp-sub">Tap the abnormal findings you have. Likely patterns and next tests appear below. Training guidance only — not a diagnosis.</p>
${FG.map(([g, l]) => `<h5 class="pf-h">${E(g)}</h5><div class="pf-ch">${l.map(([k, n]) => `<button class="${PF.includes(k) ? 'on' : ''}" data-sa="pft" data-v="${k}">${E(n)}</button>`).join('')}</div>`).join('')}
<div class="pf-bar"><span>${PF.length} selected</span>${PF.length ? '<button data-sa="pfc">Clear</button>' : ''}</div>
<div id="pf-res">${!PF.length ? '<div class="sp-empty">Select at least one finding.</div>' : res.length ? res.map(({ p, r }) => `<div class="pf-r"><div class="pf-rt"><b>${E(p.n)}</b><span class="pf-sc" style="--p:${Math.min(100, r.s)}">${Math.min(100, r.s)}%</span></div><p>${E(p.d)}</p><div class="pf-m">${p.f.map(k => `<i class="${PF.includes(k) ? 'y' : ''}">${E(FL[k] || k)}</i>`).join('')}</div>${r.x ? `<p class="pf-x">⚠ ${p.x.filter(k => PF.includes(k)).map(k => E(FL[k])).join(', ')} does not fit this pattern.</p>` : ''}<p class="pf-nx"><b>Next:</b> ${p.nx.map(E).join(' · ')}</p>${p.t.filter(T).length ? `<div class="sp-rel">${p.t.filter(T).map(id => `<a href="#sop?t=${id}">${E(T(id).n.split(' (')[0])}</a>`).join('')}</div>` : ''}</div>`).join('') : '<div class="sp-empty">No pattern matches this combination — review sample quality and repeat abnormal results.</div>'}</div>`;
  };
  G.ACT.pft = (b, v) => { PF = PF.includes(v) ? PF.filter(x => x !== v) : [...PF, v]; ST2.set('soppf', PF); refresh(); };
  G.ACT.pfc = () => { PF = []; ST2.set('soppf', PF); refresh(); };

  /* =============================== MCQ QUIZ =============================== */
  const Q = (c, q, o, a, e) => ({ c, q, o, a, e });
  const QZ = (G.QUIZ = [
    Q('Pre-analytical', 'A serum sample shows K⁺ 9.8 mmol/L and calcium 1.2 mg/dL in a well patient. Most likely cause?', ['Lithium-heparin contamination', 'K₂EDTA contamination', 'Fluoride-oxalate contamination', 'Prolonged fasting'], 1, 'EDTA adds potassium and chelates calcium (and magnesium) — classic wrong order of draw or decanting.'),
    Q('Pre-analytical', 'Correct CLSI order of draw?', ['EDTA → citrate → serum → heparin', 'Blood culture → citrate → serum → heparin → EDTA → fluoride', 'Serum → citrate → EDTA → heparin → fluoride', 'Citrate → blood culture → EDTA → serum'], 1, 'Sterile culture first, then citrate, serum, heparin, EDTA, fluoride.'),
    Q('Pre-analytical', 'A citrate tube for PT is only 70 % filled. The PT will be…', ['Falsely short', 'Falsely prolonged', 'Unchanged', 'Unmeasurable'], 1, 'Excess citrate relative to plasma binds more of the added calcium → prolonged clotting times.'),
    Q('Pre-analytical', 'Glucose in an unspun plain tube left 3 h at room temperature will be…', ['Falsely high', 'Falsely low', 'Unchanged', 'Higher only in diabetics'], 1, 'Glycolysis by cells lowers glucose ~5–7 % per hour; use fluoride or separate quickly.'),
    Q('Pre-analytical', 'In-vitro haemolysis does NOT significantly raise which analyte?', ['Potassium', 'LDH', 'AST', 'Sodium'], 3, 'Red cells contain much more K⁺, LDH and AST than plasma; sodium is slightly diluted instead.'),
    Q('Pre-analytical', 'Severe hyperlipidaemia does NOT cause pseudohyponatraemia with…', ['Indirect ISE', 'Flame photometry', 'Direct ISE (blood gas)', 'Both indirect ISE and flame photometry'], 2, 'Direct ISE measures sodium activity in plasma water without dilution.'),
    Q('Pre-analytical', 'Which sample must NOT be placed on ice?', ['Ammonia', 'ACTH', 'Renin', 'Lactate'], 2, 'Cold activates prorenin → falsely high renin. Keep renin at room temperature.'),
    Q('Pre-analytical', 'Fist clenching during venepuncture mainly causes…', ['Low glucose', 'High potassium', 'Low calcium', 'High sodium'], 1, 'Muscle activity releases potassium — can raise K⁺ by 1–2 mmol/L.'),
    Q('Pre-analytical', 'Cryoglobulin samples should be transported at…', ['2–8 °C', 'Room temperature', '37 °C', '−20 °C'], 2, 'Cryoglobulins precipitate in the cold; keep at 37 °C until serum is separated.'),
    Q('Pre-analytical', 'A CSF sample for bacterial culture arrives refrigerated. Main concern?', ['Glucose rises', 'Fastidious organisms (e.g. meningococci) may die', 'Cells multiply', 'Protein falls'], 1, 'Never refrigerate CSF for culture; hand-deliver immediately.'),
    Q('Haematology', 'MCV 62 fL, RBC 5.8 ×10¹²/L. The Mentzer index suggests…', ['Iron deficiency', 'Thalassaemia trait', 'Megaloblastic anaemia', 'Anaemia of chronic disease'], 1, '62 ÷ 5.8 = 10.7 (< 13) favours thalassaemia trait.'),
    Q('Haematology', 'HbA2 can be falsely normal in β-thalassaemia trait when the patient also has…', ['B12 deficiency', 'Iron deficiency', 'Hyperthyroidism', 'Pregnancy'], 1, 'Iron deficiency lowers HbA2 — treat iron deficiency, then re-test.'),
    Q('Haematology', 'Retic 6 %, Hct 25 %. The reticulocyte production index is about…', ['6.0', '3.3', '1.7', '0.8'], 2, 'Corrected retic = 6 × 25/45 = 3.3; maturation time at Hct 25 = 2 → RPI ≈ 1.7.'),
    Q('Haematology', 'MCHC 39 g/dL with Hb × 3 much greater than Hct. Best next step?', ['Report as is', 'Warm sample to 37 °C and re-run', 'Request iron studies', 'Repeat in EDTA'], 1, 'Cold agglutinins cause red-cell clumping; warming disperses agglutinates.'),
    Q('Haematology', 'Bite cells and Heinz bodies point to…', ['Hereditary spherocytosis', 'G6PD deficiency', 'Lead poisoning', 'Myelofibrosis'], 1, 'Oxidative damage in G6PD deficiency denatures Hb (Heinz bodies), removed by the spleen (bite cells).'),
    Q('Haematology', 'Auer rods indicate a blast is…', ['Lymphoid', 'Myeloid', 'Erythroid', 'Megakaryocytic'], 1, 'Auer rods are fused primary granules — myeloid lineage (AML).'),
    Q('Haematology', 'Many smudge cells on the film are typical of…', ['AML', 'CLL', 'Infectious mononucleosis', 'Iron deficiency'], 1, 'Fragile CLL lymphocytes rupture during spreading.'),
    Q('Haematology', 'Average 12 platelets per oil-immersion field. Estimated count?', ['12 ×10³/µL', '~180–240 ×10³/µL', '~1200 ×10³/µL', '~60 ×10³/µL'], 1, 'Multiply by 15,000–20,000 per µL.'),
    Q('Haematology', 'Low platelet count with clumps at the feathered edge. Best action?', ['Report and phone as critical', 'Recollect in citrate / check film', 'Transfuse platelets', 'Repeat in EDTA'], 1, 'EDTA-dependent pseudo-thrombocytopenia — recollect in citrate.'),
    Q('Haematology', 'Hypersegmented neutrophils are defined as…', ['≥ 3 lobes', '≥ 4 lobes', '≥ 6 lobes (or > 5 % with 5 lobes)', 'Any band form'], 2, 'Typical of B12 / folate deficiency.'),
    Q('Haematology', 'nRBC 20 per 100 WBC, measured WBC 12 ×10³/µL. Corrected WBC?', ['12.0', '10.0', '14.4', '9.6'], 1, '12 × 100 ÷ 120 = 10.0 ×10³/µL.'),
    Q('Haematology', 'Schistocytes 6 % with platelets 12 ×10³/µL and normal PT. Most likely?', ['DIC', 'TTP', 'ITP', 'Aplastic anaemia'], 1, 'MAHA + thrombocytopenia with normal clotting tests → TTP (emergency).'),
    Q('Quality control', 'One control > +2 SD and the next < −2 SD. Which rule and what error?', ['2-2s, systematic', 'R-4s, random', '4-1s, systematic', '10x, systematic'], 1, 'A range exceeding 4 SD within a run points to random error.'),
    Q('Quality control', 'Ten consecutive control values above the mean (all within 2 SD) indicate…', ['Random error', 'Systematic shift', 'No problem', 'Imprecision'], 1, '10x rule — calibration / reagent lot shift.'),
    Q('Quality control', 'Mean 100, SD 4. The CV is…', ['0.4 %', '4 %', '25 %', '40 %'], 1, 'CV = SD ÷ mean × 100.'),
    Q('Quality control', 'A single 1-2s violation alone means…', ['Reject the run', 'Warning — check other rules', 'Recalibrate at once', 'Change the reagent lot'], 1, '1-2s is a warning rule; reject only if another rule is broken.'),
    Q('Quality control', 'TEa 10 %, bias 2 %, CV 2 %. Sigma metric?', ['3', '4', '5', '6'], 1, 'Sigma = (TEa − bias) ÷ CV = (10 − 2) ÷ 2 = 4.'),
    Q('Quality control', 'A 1-3s rejection occurs. Correct response?', ['Rerun control until it passes', 'Report patients, note the error', 'Stop, find the cause, fix, rerun QC and affected patients', 'Widen the limits'], 2, 'Never just repeat until it passes — investigate and correct.'),
    Q('Blood bank', 'Universal donor for plasma is group…', ['O', 'A', 'B', 'AB'], 3, 'AB plasma has neither anti-A nor anti-B.'),
    Q('Blood bank', 'Platelet concentrates are stored at…', ['2–6 °C, no agitation', '20–24 °C with agitation', '≤ −25 °C', '37 °C'], 1, 'Room temperature with continuous agitation, 5 days.'),
    Q('Blood bank', 'A red-cell unit should be transfused within how long of leaving controlled storage?', ['1 h', '4 h', '8 h', '24 h'], 1, 'Complete within 4 h to limit bacterial growth.'),
    Q('Blood bank', 'Breathlessness and hypertension 2 h after a rapid transfusion with raised BNP suggests…', ['TRALI', 'TACO', 'Anaphylaxis', 'FNHTR'], 1, 'TACO: volume overload with hypertension; TRALI usually has hypotension and normal BNP.'),
    Q('Blood bank', 'WHO minimum haemoglobin for a male whole-blood donor?', ['11.0 g/dL', '12.0 g/dL', '13.0 g/dL', '14.0 g/dL'], 2, 'WHO: ≥ 13.0 g/dL men, ≥ 12.0 g/dL women (many services use 12.5 for all).'),
    Q('Blood bank', 'Deferral after a live attenuated vaccine (e.g. MMR)?', ['48 h', '4 weeks', '6 months', '12 months'], 1, 'Live vaccines: 4 weeks.'),
    Q('Blood bank', 'Daratumumab therapy mainly interferes with…', ['ABO forward grouping', 'Antibody screen / IAT crossmatch', 'Platelet count', 'Kleihauer test'], 1, 'Anti-CD38 binds reagent red cells → pan-reactive IAT; use DTT-treated cells.'),
    Q('Blood bank', 'Best anticoagulant for a DAT sample?', ['Plain clotted', 'EDTA', 'Citrate', 'Heparin'], 1, 'EDTA stops in-vitro complement binding that causes false-positive C3d.'),
    Q('Coagulation', 'Prolonged thrombin time with a normal reptilase time suggests…', ['Low fibrinogen', 'Heparin', 'Dysfibrinogenaemia', 'Factor VIII deficiency'], 1, 'Reptilase is not inhibited by heparin.'),
    Q('Coagulation', 'Isolated prolonged aPTT that corrects in a 1:1 mix suggests…', ['Lupus anticoagulant', 'Factor deficiency', 'Heparin', 'Acquired FVIII inhibitor'], 1, 'Correction → missing factor (VIII, IX, XI, XII); no correction → inhibitor.'),
    Q('Coagulation', 'Anti-Xa for twice-daily LMWH should be drawn…', ['Just before the dose', '30 min after', '3–4 h after the dose', '12 h after'], 2, 'Peak level 3–4 h after subcutaneous dosing.'),
    Q('Coagulation', 'A patient on rivaroxaban has a positive dRVVT. This is most likely…', ['True lupus anticoagulant', 'DOAC interference', 'Factor V Leiden', 'Vitamin K deficiency'], 1, 'Anti-Xa DOACs prolong dRVVT → false-positive LA.'),
    Q('Coagulation', 'INR = (patient PT ÷ MNPT) raised to the power of…', ['ISI', 'MNPT', '2', 'Hct'], 0, 'ISI corrects for reagent sensitivity.'),
    Q('Endocrinology', 'On high-dose biotin, a streptavidin-based TSH (sandwich) and FT4 (competitive) will read…', ['TSH high, FT4 low', 'TSH low, FT4 high', 'Both high', 'Both low'], 1, 'Biotin lowers the signal: sandwich assays read falsely low, competitive assays falsely high.'),
    Q('Endocrinology', 'Which drug causes a FALSE-POSITIVE aldosterone : renin ratio?', ['Spironolactone', 'ACE inhibitor', 'β-blocker', 'Verapamil'], 2, 'β-blockers suppress renin more than aldosterone → ARR rises.'),
    Q('Endocrinology', 'Normal suppression on the 1 mg overnight dexamethasone test is a cortisol of…', ['< 1.8 µg/dL (50 nmol/L)', '< 5 µg/dL', '< 10 µg/dL', '< 18 µg/dL'], 0, '> 1.8 µg/dL needs further work-up for Cushing’s.'),
    Q('Endocrinology', 'Low cortisol with very high ACTH indicates…', ['Pituitary failure', 'Primary adrenal insufficiency', 'Steroid therapy', 'Cushing’s disease'], 1, 'The adrenal fails; the pituitary drives ACTH up.'),
    Q('Endocrinology', 'High prolactin but no symptoms: which test checks for macroprolactin?', ['TRH test', 'PEG precipitation', 'Dilution test', 'Pituitary MRI'], 1, 'PEG precipitates the big, inactive prolactin–IgG complex.'),
    Q('Endocrinology', 'A negative urine pregnancy test in a suspected molar pregnancy may be due to…', ['Biotin', 'High-dose hook effect', 'Dilute urine only', 'Haemolysis'], 1, 'Extremely high hCG saturates both antibodies; dilute and repeat.'),
    Q('Endocrinology', 'ACTH samples are collected…', ['Plain glass tube, room temp', 'Pre-chilled plastic EDTA tube on ice', 'Fluoride tube', 'Citrate tube at 37 °C'], 1, 'ACTH is unstable and sticks to glass.'),
    Q('Biochemistry', 'HCO₃⁻ 12 mmol/L in metabolic acidosis. Expected pCO₂ (Winter’s)?', ['12 ± 2', '20 ± 2', '26 ± 2', '40 ± 2'], 2, 'pCO₂ = 1.5 × 12 + 8 = 26 ± 2 mmHg.'),
    Q('Biochemistry', 'Calcium 7.6 mg/dL, albumin 2.0 g/dL. Corrected calcium?', ['7.6', '8.4', '9.2', '10.0'], 2, '7.6 + 0.8 × (4 − 2) = 9.2 mg/dL.'),
    Q('Biochemistry', 'A high osmolal gap with metabolic acidosis suggests…', ['Diarrhoea', 'Methanol / ethylene glycol', 'Renal tubular acidosis', 'Vomiting'], 1, 'Toxic alcohols add unmeasured osmoles and acids.'),
    Q('Biochemistry', 'Which troponin is falsely LOWERED by in-vitro haemolysis?', ['hs-troponin T', 'hs-troponin I (all assays)', 'CK-MB mass', 'Myoglobin'], 0, 'Haemolysis negatively interferes with hs-TnT.'),
    Q('Biochemistry', 'AST : ALT > 2 with high GGT and MCV suggests…', ['Viral hepatitis', 'Alcohol-related liver disease', 'Biliary obstruction', 'Paracetamol overdose'], 1, 'Classic alcohol pattern.'),
    Q('Biochemistry', 'High ALP with normal GGT in a 14-year-old is most likely…', ['Cholestasis', 'Bone growth (physiological)', 'Hepatitis', 'Lab error'], 1, 'Growing bones raise ALP; GGT confirms a non-hepatic source.'),
    Q('Biochemistry', 'Urine dipstick (ketones) detects mainly…', ['β-hydroxybutyrate', 'Acetoacetate', 'Acetone only', 'Lactate'], 1, 'Nitroprusside reacts with acetoacetate — can underestimate DKA.'),
    Q('Urine & fluids', 'Urine dipstick protein is negative but SSA test is positive. Likely protein?', ['Albumin', 'Bence-Jones (light chains)', 'Haemoglobin', 'Glucose'], 1, 'Dipstick mainly detects albumin; SSA precipitates all proteins.'),
    Q('Urine & fluids', 'Which UTI organism commonly gives a negative nitrite test?', ['E. coli', 'Klebsiella', 'Enterococcus', 'Proteus'], 2, 'Enterococci do not reduce nitrate to nitrite.'),
    Q('Urine & fluids', 'High vitamin C intake gives FALSE-NEGATIVE dipstick results for…', ['Protein and pH', 'Blood and glucose', 'Specific gravity', 'Nitrite only'], 1, 'Ascorbic acid inhibits the peroxidase reactions.'),
    Q('Urine & fluids', 'Ascitic fluid neutrophils 400 /µL. This indicates…', ['Normal', 'Spontaneous bacterial peritonitis', 'Portal hypertension', 'Malignancy'], 1, 'Neutrophils ≥ 250 /µL → SBP.'),
    Q('Urine & fluids', 'Serum albumin 3.2, ascitic albumin 1.6 g/dL. SAAG and meaning?', ['1.6 — portal hypertension', '0.5 — exudate', '1.6 — not portal', '4.8 — nephrotic'], 0, 'SAAG ≥ 1.1 g/dL → portal hypertension.'),
    Q('Urine & fluids', 'Needle-shaped crystals with strong negative birefringence in joint fluid are…', ['CPPD', 'Monosodium urate', 'Cholesterol', 'Calcium oxalate'], 1, 'MSU crystals → gout.'),
    Q('Immunology & serology', 'tTG-IgA is negative in a patient with strong suspicion of coeliac disease. Check…', ['ESR', 'Total IgA', 'ANA', 'IgE'], 1, 'Selective IgA deficiency causes false-negative IgA-based tests.'),
    Q('Immunology & serology', 'PR3-ANCA positivity is most associated with…', ['Microscopic polyangiitis', 'Granulomatosis with polyangiitis', 'SLE', 'Rheumatoid arthritis'], 1, 'PR3 (c-ANCA) → GPA; MPO → MPA / EGPA.'),
    Q('Immunology & serology', 'Recurrent swelling without urticaria, low C4, normal C3 suggests…', ['Post-streptococcal GN', 'Hereditary angioedema', 'Active SLE', 'Sepsis'], 1, 'C1-inhibitor deficiency consumes C4.'),
    Q('Immunology & serology', 'HBsAg −, anti-HBc +, anti-HBs + means…', ['Acute infection', 'Vaccinated only', 'Past infection with immunity', 'Chronic carrier'], 2, 'Anti-HBc shows natural exposure; anti-HBs shows immunity.'),
    Q('Immunology & serology', 'Does BCG vaccination cause a positive IGRA?', ['Yes, always', 'Yes, for 5 years', 'No', 'Only in children'], 2, 'IGRA antigens are absent from BCG strains (unlike the tuberculin skin test).'),
    Q('Immunology & serology', 'Main limitation of the rK39 kala-azar test?', ['Low sensitivity', 'Stays positive after cure', 'Needs culture', 'Only works in HIV'], 1, 'It cannot diagnose relapse.'),
    Q('Immunology & serology', 'Dengue NS1 antigen is most useful on…', ['Days 1–5 of fever', 'After day 10', 'Only after recovery', 'Any time equally'], 0, 'Antigen falls as antibodies rise.'),
    Q('TDM', 'A lithium level is 9.6 mmol/L in a well patient. Most likely?', ['Overdose', 'Lithium-heparin tube used', 'Renal failure', 'Dehydration'], 1, 'The tube additive contains lithium.'),
    Q('TDM', 'Digoxin toxicity is potentiated by…', ['Hyperkalaemia', 'Hypokalaemia', 'Hyponatraemia', 'Hypophosphataemia'], 1, 'Low K⁺ (and low Mg²⁺, high Ca²⁺) increases toxicity.'),
    Q('TDM', 'Phenytoin total level 9 µg/mL with albumin 2.0 g/dL. The true (corrected) level is about…', ['4.5', '9', '18', '30'], 2, '9 ÷ (0.2 × 2 + 0.1) = 18 µg/mL — possibly toxic despite a “normal” total.'),
    Q('TDM', 'Tacrolimus is measured in…', ['Serum', 'Heparin plasma', 'EDTA whole blood', 'Urine'], 2, 'The drug is concentrated in red cells.'),
    Q('TDM', 'When is a vancomycin trough drawn?', ['30 min after the first dose', 'Just before the 4th dose', 'Any random time', '24 h after stopping'], 1, 'Steady state is reached by about the 4th dose.')
  ]);
  const CATS = [...new Set(QZ.map(q => q.c))];
  const TL = 30;
  let P = ST2.get('sopq', { hist: [], seen: {}, tot: [0, 0] });
  const Z = { st: 'home', cat: 'All', n: 10, list: [], ord: [], i: 0, ans: [], dl: 0, qt: 0, pick: null, tm: null };
  const shuf = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const stop = () => { clearInterval(Z.tm); Z.tm = null; };
  const tick = () => {
    const ring = $i('qz-ring'), tn = $i('qz-tn');
    if (!ring || Z.st !== 'run') { stop(); return; }
    const left = Math.max(0, (Z.dl - Date.now()) / 1000);
    ring.style.strokeDashoffset = String(125.7 * (1 - left / TL));
    ring.classList.toggle('lo', left <= 8);
    tn.textContent = Math.ceil(left);
    if (left <= 0 && Z.pick == null) answer(-1);
  };
  const begin = () => { Z.dl = Date.now() + TL * 1000; Z.qt = Date.now(); Z.pick = null; stop(); Z.tm = setInterval(tick, 200); };
  const answer = k => {
    if (Z.pick != null) return;
    stop();
    Z.pick = k;
    const qi = Z.list[Z.i], real = k >= 0 ? Z.ord[Z.i][k] : -1, ok = real === QZ[qi].a;
    Z.ans.push({ qi, ok, k: real, ms: Date.now() - Z.qt });
    P.seen[qi] = 1;
    try { navigator.vibrate && navigator.vibrate(ok ? 12 : [20, 40, 20]); } catch (_) {}
    refresh();
  };
  const finish = () => {
    Z.st = 'done'; stop();
    const s = Z.ans.filter(a => a.ok).length;
    P.hist = [{ d: Date.now(), c: Z.cat, n: Z.ans.length, s, ms: Z.ans.reduce((x, a) => x + a.ms, 0) }, ...P.hist].slice(0, 30);
    P.tot = [P.tot[0] + Z.ans.length, P.tot[1] + s];
    ST2.set('sopq', P);
  };
  const grade = p => (p >= 90 ? 'Lab Legend 🏆' : p >= 75 ? 'Sharp Analyst 🔬' : p >= 50 ? 'On the Bench 🧪' : 'Keep Practising 📘');
  const ring = (pct, big) => `<svg class="qz-rg${big ? ' big' : ''}" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" class="bg"/><circle cx="24" cy="24" r="20" class="fg" style="stroke-dashoffset:${125.7 * (1 - pct)}"/></svg>`;

  G.TOOLX.quiz = () => {
    if (Z.st === 'run') {
      if (Z.pick == null && !Z.tm) Z.tm = setInterval(tick, 200);
      const qi = Z.list[Z.i], q = QZ[qi], o = Z.ord[Z.i], done = Z.pick != null, last = Z.ans[Z.ans.length - 1];
      const left = done ? 0 : Math.max(0, (Z.dl - Date.now()) / 1000);
      return `<div class="qz"><div class="qz-top"><button class="qz-x" data-sa="qzq" aria-label="Quit quiz">✕</button><div class="qz-pg"><i style="width:${(Z.i / Z.list.length) * 100}%"></i></div><span>${Z.i + 1}/${Z.list.length}</span></div>
<div class="qz-hd"><span class="qz-cat">${E(q.c)}</span><div class="qz-tm">${done ? ring(0) : `<svg class="qz-rg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" class="bg"/><circle id="qz-ring" cx="24" cy="24" r="20" class="fg" style="stroke-dashoffset:${125.7 * (1 - left / TL)}"/></svg>`}<b id="qz-tn">${done ? '–' : Math.ceil(left)}</b></div></div>
<p class="qz-q">${E(q.q)}</p><div class="qz-o">${o.map((oi, k) => { const cls = !done ? '' : oi === q.a ? 'ok' : k === Z.pick ? 'no' : 'dim'; return `<button class="${cls}" data-sa="qza" data-v="${k}"${done ? ' disabled' : ''}><i>${'ABCD'[k]}</i><span>${E(q.o[oi])}</span></button>`; }).join('')}</div>
${done ? `<div class="qz-fb ${last.ok ? 'ok' : 'no'}"><b>${last.ok ? '✅ Correct' : Z.pick < 0 ? '⏰ Time’s up' : '❌ Not quite'}</b><p>${E(q.e)}</p></div><button class="qz-go" data-sa="qzn">${Z.i + 1 < Z.list.length ? 'Next question →' : 'See my result'}</button>` : ''}</div>`;
    }
    if (Z.st === 'done') {
      const s = Z.ans.filter(a => a.ok).length, n = Z.ans.length, pct = n ? Math.round((s / n) * 100) : 0, avg = n ? (Z.ans.reduce((x, a) => x + a.ms, 0) / n / 1000).toFixed(1) : 0, miss = Z.ans.filter(a => !a.ok);
      return `<div class="qz"><div class="qz-res"><div class="qz-big">${ring(pct / 100, 1)}<div><b>${s}/${n}</b><span>${pct}%</span></div></div><h4>${grade(pct)}</h4><p>${E(Z.cat === 'All' ? 'Mixed topics' : Z.cat)} · avg ${avg}s per question</p></div>
<div class="qz-btns"><button class="qz-go" data-sa="qzs">📤 Share result card</button><button class="sp-btn" data-sa="qzr">↻ Play again</button><button class="sp-btn" data-sa="qzh">Topics</button></div>
${miss.length ? `<h5 class="pf-h">Review (${miss.length})</h5>${miss.map(a => `<div class="qz-rv"><p>${E(QZ[a.qi].q)}</p><b>✔ ${E(QZ[a.qi].o[QZ[a.qi].a])}</b><small>${E(QZ[a.qi].e)}</small></div>`).join('')}` : '<div class="qz-fb ok"><b>Perfect score — every answer correct! 🎉</b></div>'}</div>`;
    }
    const acc = P.tot[0] ? Math.round((P.tot[1] / P.tot[0]) * 100) : 0, seen = Object.keys(P.seen).length;
    const pool = Z.cat === 'All' ? QZ.length : QZ.filter(q => q.c === Z.cat).length;
    return `<div class="qz"><div class="qz-hero"><b>⏱️ Lab MCQ challenge</b><p>${QZ.length} tricky questions · 30 seconds each · explanations after every answer</p></div>
<h5 class="pf-h">Topic</h5><div class="pf-ch">${['All', ...CATS].map(c => `<button class="${Z.cat === c ? 'on' : ''}" data-sa="qzc" data-v="${E(c)}">${E(c)} <i>${c === 'All' ? QZ.length : QZ.filter(q => q.c === c).length}</i></button>`).join('')}</div>
<h5 class="pf-h">Questions</h5><div class="sp-seg">${[5, 10, 20].map(n => `<button class="${Z.n === n ? 'on' : ''}" data-sa="qzk" data-v="${n}">${n}</button>`).join('')}</div>
<button class="qz-go" data-sa="qzgo">Start ${Math.min(Z.n, pool)} questions</button>
<div class="sp-kpi"><div><em>Quizzes</em><b>${P.hist.length}</b></div><div><em>Answered</em><b>${P.tot[0]}</b></div><div><em>Accuracy</em><b>${acc}%</b></div><div><em>Seen</em><b>${seen}/${QZ.length}</b></div></div>
${P.hist.length ? `<h5 class="pf-h">Recent</h5>${P.hist.slice(0, 5).map(h => `<div class="qz-hi"><span>${new Date(h.d).toLocaleDateString()} · ${E(h.c)}</span><b>${h.s}/${h.n}</b></div>`).join('')}<button class="sp-btn" data-sa="qzclr">Reset progress</button>` : ''}</div>`;
  };
  G.ACT.qzc = (b, v) => { Z.cat = v; refresh(); };
  G.ACT.qzk = (b, v) => { Z.n = +v; refresh(); };
  G.ACT.qzgo = () => {
    const pool = QZ.map((q, i) => i).filter(i => Z.cat === 'All' || QZ[i].c === Z.cat);
    const fresh = shuf(pool.filter(i => !P.seen[i])), old = shuf(pool.filter(i => P.seen[i]));
    Z.list = [...fresh, ...old].slice(0, Math.min(Z.n, pool.length));
    Z.ord = Z.list.map(() => shuf([0, 1, 2, 3]));
    Z.i = 0; Z.ans = []; Z.st = 'run';
    begin(); refresh();
    const el = document.getElementById('sp-tool'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  G.ACT.qza = (b, v) => answer(+v);
  G.ACT.qzn = () => { Z.i++; if (Z.i >= Z.list.length) finish(); else begin(); refresh(); };
  G.ACT.qzq = () => { stop(); Z.st = 'home'; refresh(); };
  G.ACT.qzr = () => G.ACT.qzgo();
  G.ACT.qzh = () => { Z.st = 'home'; refresh(); };
  G.ACT.qzclr = () => { P = { hist: [], seen: {}, tot: [0, 0] }; ST2.set('sopq', P); refresh(); toast('Quiz progress reset'); };

  /* ---------- shareable JPG result card ---------- */
  const card = () => new Promise(res => {
    const s = Z.ans.filter(a => a.ok).length, n = Z.ans.length, pct = n ? Math.round((s / n) * 100) : 0, avg = n ? (Z.ans.reduce((x, a) => x + a.ms, 0) / n / 1000).toFixed(1) : 0;
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1350;
    const x = c.getContext('2d'), F = (w, z) => `${w} ${z}px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;
    const g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, '#3b1fa8'); g.addColorStop(0.55, '#5b3fd4'); g.addColorStop(1, '#0e7490');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    x.fillStyle = 'rgba(255,255,255,.07)'; [[930, 170, 280], [110, 1230, 240], [1000, 900, 120]].forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); });
    x.fillStyle = '#fff'; x.textAlign = 'left'; x.font = F(800, 60); x.fillText('LabGenie', 80, 140);
    x.globalAlpha = 0.85; x.font = F(500, 34); x.fillText('Lab Knowledge Quiz · ' + (Z.cat === 'All' ? 'Mixed topics' : Z.cat), 80, 196); x.globalAlpha = 1;
    const cx = 540, cy = 560, R = 220; x.lineCap = 'round'; x.lineWidth = 38;
    x.strokeStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke();
    x.strokeStyle = '#fde047'; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0.001, pct / 100)); x.stroke();
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.font = F(800, 150); x.fillText(`${s}/${n}`, cx, cy + 45); x.font = F(600, 42); x.globalAlpha = 0.9; x.fillText(`${pct}% correct`, cx, cy + 115); x.globalAlpha = 1;
    x.font = F(800, 62); x.fillText(grade(pct), 540, 905);
    const box = (bx, label, val) => { x.fillStyle = 'rgba(255,255,255,.13)'; x.beginPath(); x.roundRect ? x.roundRect(bx, 960, 290, 150, 28) : x.rect(bx, 960, 290, 150); x.fill(); x.fillStyle = '#fff'; x.font = F(800, 50); x.fillText(val, bx + 145, 1035); x.globalAlpha = 0.8; x.font = F(500, 28); x.fillText(label, bx + 145, 1080); x.globalAlpha = 1; };
    box(80, 'Questions', String(n)); box(395, 'Avg time', avg + 's'); box(710, 'Date', new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' }));
    const A = G.AUTH || {};
    x.fillStyle = '#fff'; x.font = F(700, 32); x.fillText('Created by ' + (A.n || ''), 540, 1205);
    x.globalAlpha = 0.85; x.font = F(400, 26); x.fillText((A.r || '') + (A.e ? ' · ' + A.e : ''), 540, 1248); x.globalAlpha = 0.75; x.font = F(600, 26); x.fillText('Powered by LabGenie', 540, 1298); x.globalAlpha = 1;
    c.toBlob(res, 'image/jpeg', 0.92);
  });
  G.ACT.qzs = async () => {
    const b = await card();
    if (!b) return;
    const f = new File([b], 'labgenie-quiz-result.jpg', { type: 'image/jpeg' });
    try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: 'My LabGenie quiz result' }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    if (window.LGI && LGI.dl) LGI.dl(b, 'labgenie-quiz-result.jpg'); else { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'labgenie-quiz-result.jpg'; a.click(); }
    toast('Result card saved');
  };

  /* guide entries that host the tools */
  G.GUIDES.push(
    { id: 'quiz', n: 'Lab MCQ Quiz (30-second timer)', ic: '⏱️', cat: 'Learning', tool: 'quiz', aka: 'quiz mcq exam test practice question timer challenge', sec: [{ h: 'How it works', li: ['Pick a topic and the number of questions; each question has a 30-second timer.', 'You see the right answer and a short explanation after every question.', 'Unseen questions are asked first; progress and history stay on this device.', 'Share your result as a JPG card.'] }] },
    { id: 'pattern', n: 'Pattern Finder (Result Interpretation)', ic: '🧩', cat: 'Learning', tool: 'pattern', aka: 'pattern finder differential diagnosis interpretation abnormal results next tests', sec: [{ h: 'Use it wisely', li: ['Patterns are teaching aids that combine common result patterns — they do not replace clinical judgement or a pathologist’s review.', 'Always rule out pre-analytical errors (haemolysis, contamination, wrong tube, delay) before interpreting.', 'Follow your laboratory’s critical-value and escalation policy.'] }] }
  );
})();
