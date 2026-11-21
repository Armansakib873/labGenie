/* =====================================================================
   LabGenie Report Engine · catalog.js
   Hard-coded specimen types, option lists and pre-filled test profiles.
   Every profile is fully editable once added to a report page.
   ---------------------------------------------------------------------
   Test row format:  [key, name, unit, reference, defaultResult, extra]
     reference  : string, or {m:'male range', f:'female range'}
     extra      : {c:[critLow,critHigh], o:'optionList', nv:[normal values],
                   ab:[abnormal values], a:1 (auto-calculated), nf:1 (never flag)}
   Sub-heading :  ['#', 'Heading text']
   Reference intervals are typical adult values — each lab should verify
   against its own validated method.
   ===================================================================== */
(function () {
  'use strict';
  const R = (window.LGR = window.LGR || {});

  /* ---------- specimen types: [id, label, container / tube, family] ---------- */
  R.SPEC = [
    ['serum', 'Serum', 'Red / gold (SST) top', 'Blood'],
    ['pl-hep', 'Plasma (Lithium heparin)', 'Green top', 'Blood'],
    ['pl-edta', 'Plasma (EDTA)', 'Lavender top', 'Blood'],
    ['pl-flu', 'Plasma (Fluoride-oxalate)', 'Grey top', 'Blood'],
    ['pl-cit', 'Plasma (Sodium citrate 3.2%)', 'Light-blue top', 'Blood'],
    ['wb-edta', 'Whole blood (EDTA)', 'Lavender top', 'Blood'],
    ['wb-cit', 'Whole blood (Sodium citrate 3.2%)', 'Light-blue top', 'Blood'],
    ['wb-esr', 'Whole blood (Citrate 3.8%, ESR)', 'Black top', 'Blood'],
    ['wb-hep', 'Whole blood (Heparin)', 'Green top', 'Blood'],
    ['abg', 'Arterial blood (heparinised syringe)', 'Blood-gas syringe', 'Blood'],
    ['cap', 'Capillary blood (finger prick)', 'Microtainer / strip', 'Blood'],
    ['bc', 'Blood culture bottle', 'Aerobic / anaerobic bottle', 'Blood'],
    ['dbs', 'Dried blood spot', 'Filter card', 'Blood'],
    ['ur-rand', 'Urine (random / spot)', 'Sterile container', 'Urine'],
    ['ur-fm', 'Urine (first morning)', 'Sterile container', 'Urine'],
    ['ur-msu', 'Urine (midstream, clean-catch)', 'Sterile container', 'Urine'],
    ['ur-cath', 'Urine (catheter)', 'Sterile container', 'Urine'],
    ['ur-24', 'Urine (24-hour collection)', '24-h container', 'Urine'],
    ['stool', 'Stool', 'Stool container', 'Stool'],
    ['csf', 'Cerebrospinal fluid (CSF)', 'Sterile tube', 'Body fluid'],
    ['pleural', 'Pleural fluid', 'Sterile tube', 'Body fluid'],
    ['ascitic', 'Ascitic / peritoneal fluid', 'Sterile tube', 'Body fluid'],
    ['synovial', 'Synovial fluid', 'Sterile tube', 'Body fluid'],
    ['pericardial', 'Pericardial fluid', 'Sterile tube', 'Body fluid'],
    ['semen', 'Semen', 'Sterile wide-mouth container', 'Semen'],
    ['sputum', 'Sputum', 'Sterile container', 'Respiratory'],
    ['np', 'Nasopharyngeal swab', 'Viral transport medium', 'Respiratory'],
    ['throat', 'Throat swab', 'Swab / transport medium', 'Respiratory'],
    ['hvs', 'High vaginal swab', 'Swab / transport medium', 'Swab'],
    ['urethral', 'Urethral swab', 'Swab / transport medium', 'Swab'],
    ['wound', 'Wound swab', 'Swab / transport medium', 'Swab'],
    ['pus', 'Pus / aspirate', 'Sterile container', 'Swab'],
    ['tissue', 'Tissue / biopsy', 'Formalin container', 'Tissue'],
    ['bm', 'Bone marrow aspirate', 'EDTA tube / slides', 'Tissue'],
    ['skin', 'Skin / nail / hair scrapings', 'Sterile paper envelope', 'Tissue'],
    ['saliva', 'Saliva', 'Saliva collector', 'Other'],
    ['other', 'Other (type below)', '', 'Other']
  ];
  R.SPEC_BY = Object.fromEntries(R.SPEC.map(s => [s[0], s]));
  R.specLabel = (id, custom) => (id === 'other' ? custom || 'Other' : (R.SPEC_BY[id] || [, id || ''])[1]);

  /* ---------- result option lists (shown as quick-pick suggestions) ---------- */
  R.OPT = {
    posneg: ['Negative', 'Positive', 'Weakly positive'],
    react: ['Non-reactive', 'Reactive', 'Weakly reactive'],
    nil: ['Nil', 'Trace', '+', '++', '+++', '++++'],
    nilp: ['Nil', 'Few', 'Occasional', 'Present', 'Plenty'],
    found: ['Not found', 'Found'],
    seen: ['Not seen', 'Seen'],
    abs: ['Absent', 'Present'],
    ucol: ['Pale yellow', 'Straw', 'Yellow', 'Dark yellow', 'Amber', 'Orange', 'Red', 'Brown', 'Colourless', 'Milky'],
    uapp: ['Clear', 'Slightly turbid', 'Turbid', 'Cloudy', 'Hazy'],
    ubg: ['Normal', 'Increased', 'Decreased'],
    cast: ['Nil', 'Hyaline casts', 'Granular casts', 'RBC casts', 'WBC casts', 'Waxy casts'],
    cryst: ['Nil', 'Calcium oxalate', 'Uric acid', 'Triple phosphate', 'Amorphous urates', 'Amorphous phosphates'],
    abo: ['A', 'B', 'AB', 'O'],
    rh: ['Positive', 'Negative'],
    sir: ['S', 'I', 'R'],
    titre: ['Negative', '1:20', '1:40', '1:80', '1:160', '1:320', '1:640'],
    scol: ['Brown', 'Yellowish brown', 'Yellow', 'Green', 'Black', 'Clay coloured', 'Red'],
    scon: ['Formed', 'Semi-formed', 'Soft', 'Loose', 'Watery', 'Hard'],
    sreac: ['Acidic', 'Alkaline', 'Neutral'],
    rbcm: ['Normocytic normochromic', 'Microcytic hypochromic', 'Macrocytic', 'Dimorphic', 'Anisopoikilocytosis'],
    wbcm: ['Normal in number and morphology', 'Leucocytosis with neutrophilia', 'Leucopenia', 'Lymphocytosis', 'Eosinophilia', 'Atypical cells seen'],
    pltm: ['Adequate', 'Reduced', 'Increased', 'Giant platelets seen'],
    gram: ['No organisms seen', 'Gram-positive cocci', 'Gram-negative bacilli', 'Gram-positive bacilli', 'Gram-negative diplococci', 'Yeast cells seen'],
    afb: ['No AFB seen', 'Scanty', '1+', '2+', '3+'],
    growth: ['No growth', 'Growth of'],
    liq: ['Complete', 'Incomplete'],
    visc: ['Normal', 'Increased', 'Decreased']
  };

  /* ---------- profile definitions ---------- */
  const CHEM = ['serum', 'pl-hep'],
    HORM = ['serum', 'pl-hep'],
    EDTA = ['wb-edta'],
    CIT = ['pl-cit', 'wb-cit'],
    URINE = ['ur-fm', 'ur-rand', 'ur-msu', 'ur-cath'],
    CLIA = '(Chemiluminescence immunoassay — fully automated analyzer)',
    AUTO = '(Fully automated clinical chemistry analyzer)';
  const H = t => ['#', t];

  // P(id, name, category, department, accepted specimens, method note, tests, extra)
  const P = (id, n, cat, dept, acc, mn, t, x) => Object.assign({ id, n, cat, dept, acc, mn: mn || '', t }, x || {});

  const cs = (id, n, acc, dept) =>
    P(id, n, 'Microbiology', dept || 'Microbiology', acc, '(Culture on blood / MacConkey / CLED agar · Kirby-Bauer disc diffusion, CLSI)', [
      H('Culture'),
      ['org', 'Organism Isolated', '', 'No growth', 'Escherichia coli', { nf: 1 }],
      ['cfu', 'Colony Count', 'CFU/mL', '', '> 10⁵', { nf: 1 }],
      H('Antibiotic Susceptibility'),
      ['ab1', 'Amikacin', '', '', 'S', { o: 'sir', ab: ['R'] }],
      ['ab2', 'Gentamicin', '', '', 'S', { o: 'sir', ab: ['R'] }],
      ['ab3', 'Ciprofloxacin', '', '', 'R', { o: 'sir', ab: ['R'] }],
      ['ab4', 'Levofloxacin', '', '', 'R', { o: 'sir', ab: ['R'] }],
      ['ab5', 'Ceftriaxone', '', '', 'S', { o: 'sir', ab: ['R'] }],
      ['ab6', 'Cefixime', '', '', 'I', { o: 'sir', ab: ['R'] }],
      ['ab7', 'Co-trimoxazole', '', '', 'R', { o: 'sir', ab: ['R'] }],
      ['ab8', 'Nitrofurantoin', '', '', 'S', { o: 'sir', ab: ['R'] }],
      ['ab9', 'Piperacillin-tazobactam', '', '', 'S', { o: 'sir', ab: ['R'] }],
      ['ab10', 'Meropenem', '', '', 'S', { o: 'sir', ab: ['R'] }]
    ], { note: 'S = Sensitive, I = Intermediate, R = Resistant. Interpretation per current CLSI breakpoints.' });

  R.PROF = [
    /* ================= HEMATOLOGY ================= */
    P('cbc', 'Complete Blood Count (CBC)', 'Hematology', 'Hematology', EDTA, '(Automated 5-part differential hematology analyzer)', [
      ['hb', 'Hemoglobin', 'g/dL', { m: '13.0–17.0', f: '12.0–15.0' }, '13.8', { c: [7, 20] }],
      ['rbc', 'RBC Count', '×10⁶/µL', { m: '4.5–5.5', f: '3.8–4.8' }, '4.82'],
      ['hct', 'Hematocrit (PCV)', '%', { m: '40–50', f: '36–46' }, '41.5'],
      ['mcv', 'MCV', 'fL', '83–101', '', { a: 1 }],
      ['mch', 'MCH', 'pg', '27–32', '', { a: 1 }],
      ['mchc', 'MCHC', 'g/dL', '31.5–34.5', '', { a: 1 }],
      ['rdw', 'RDW-CV', '%', '11.6–14.0', '12.8'],
      ['wbc', 'Total WBC Count', '×10³/µL', '4.0–10.0', '7.6', { c: [1.5, 30] }],
      H('Differential Count'),
      ['neu', 'Neutrophils', '%', '40–80', '58'],
      ['lym', 'Lymphocytes', '%', '20–40', '32'],
      ['mon', 'Monocytes', '%', '2–10', '6'],
      ['eos', 'Eosinophils', '%', '1–6', '3'],
      ['bas', 'Basophils', '%', '0–2', '1'],
      H('Absolute Count'),
      ['anc', 'Absolute Neutrophil Count', '×10³/µL', '2.0–7.0', '', { a: 1, c: [0.5, null] }],
      ['alc', 'Absolute Lymphocyte Count', '×10³/µL', '1.0–3.0', '', { a: 1 }],
      ['amc', 'Absolute Monocyte Count', '×10³/µL', '0.2–1.0', '', { a: 1 }],
      ['aec', 'Absolute Eosinophil Count', '×10³/µL', '0.02–0.5', '', { a: 1 }],
      H('Platelets'),
      ['plt', 'Platelet Count', '×10³/µL', '150–410', '265', { c: [20, 1000] }],
      ['mpv', 'MPV', 'fL', '7.5–11.5', '9.4']
    ]),
    P('hb', 'Hemoglobin (Hb%)', 'Hematology', 'Hematology', ['wb-edta', 'cap'], '', [
      ['hb', 'Hemoglobin', 'g/dL', { m: '13.0–17.0', f: '12.0–15.0' }, '13.6', { c: [7, 20] }]
    ]),
    P('esr', 'ESR', 'Hematology', 'Hematology', ['wb-esr', 'wb-edta'], '(Westergren method)', [
      ['esr', 'ESR (1st hour)', 'mm/hr', { m: '0–15', f: '0–20' }, '12']
    ]),
    P('pbf', 'Peripheral Blood Film (PBF)', 'Hematology', 'Hematology', EDTA, '(Leishman-stained smear examination)', [
      ['pbr', 'RBC Morphology', '', 'Normocytic normochromic', 'Normocytic normochromic', { o: 'rbcm' }],
      ['pbw', 'WBC Morphology', '', 'Normal in number and morphology', 'Normal in number and morphology', { o: 'wbcm' }],
      ['pbp', 'Platelets', '', 'Adequate', 'Adequate', { o: 'pltm' }],
      ['pbh', 'Hemoparasites', '', 'Not seen', 'Not seen', { o: 'seen' }],
      ['pbi', 'Impression', '', '', 'Normal peripheral blood picture', { nf: 1 }]
    ]),
    P('retic', 'Reticulocyte Count', 'Hematology', 'Hematology', EDTA, '(Supravital stain — new methylene blue)', [
      ['ret', 'Reticulocytes', '%', '0.5–2.5', '1.2']
    ]),
    P('bgrp', 'Blood Group & Rh Typing', 'Hematology', 'Blood Bank', ['wb-edta', 'cap'], '(Slide / tube agglutination — forward grouping)', [
      ['abo', 'ABO Blood Group', '', '', 'B', { o: 'abo', nf: 1 }],
      ['rhd', 'Rh (D) Type', '', '', 'Positive', { o: 'rh', nf: 1 }]
    ]),
    P('btct', 'Bleeding & Clotting Time', 'Hematology', 'Hematology', ['cap'], '(BT — Duke method · CT — capillary tube method)', [
      ['bt', 'Bleeding Time', 'min', '2–7', '2.5'],
      ['ct', 'Clotting Time', 'min', '5–11', '6.5']
    ]),
    P('mp', 'Malaria Parasite (MP / ICT)', 'Hematology', 'Hematology', ['wb-edta', 'cap'], '', [
      ['mpf', 'MP (Thick & thin film)', '', 'Not found', 'Not found', { o: 'found' }],
      ['mpi', 'Malaria ICT (P. falciparum / P. vivax)', '', 'Negative', 'Negative', { o: 'posneg' }]
    ]),

    /* ================= COAGULATION ================= */
    P('pt', 'Prothrombin Time (PT / INR)', 'Coagulation', 'Coagulation', CIT, '(Automated coagulometer — clot detection)', [
      ['pt', 'PT (Patient)', 'sec', '11.0–13.5', '12.6'],
      ['ptc', 'PT (Control / MNPT)', 'sec', '', '12.0', { nf: 1 }],
      ['isi', 'ISI', '', '', '1.00', { nf: 1 }],
      ['inr', 'INR', 'ratio', '0.8–1.2', '', { a: 1, c: [null, 5] }]
    ]),
    P('aptt', 'Activated Partial Thromboplastin Time (aPTT)', 'Coagulation', 'Coagulation', CIT, '(Automated coagulometer)', [
      ['aptt', 'aPTT (Patient)', 'sec', '25–35', '29.5', { c: [null, 100] }],
      ['apttc', 'aPTT (Control)', 'sec', '', '30.0', { nf: 1 }]
    ]),
    P('coag', 'Coagulation Profile', 'Coagulation', 'Coagulation', CIT, '(Automated coagulometer)', [
      ['pt', 'PT (Patient)', 'sec', '11.0–13.5', '12.6'],
      ['ptc', 'PT (Control / MNPT)', 'sec', '', '12.0', { nf: 1 }],
      ['isi', 'ISI', '', '', '1.00', { nf: 1 }],
      ['inr', 'INR', 'ratio', '0.8–1.2', '', { a: 1, c: [null, 5] }],
      ['aptt', 'aPTT (Patient)', 'sec', '25–35', '29.5', { c: [null, 100] }],
      ['fib', 'Fibrinogen', 'mg/dL', '200–400', '285', { c: [100, null] }],
      ['ddim', 'D-Dimer', 'µg/mL FEU', '< 0.50', '0.28']
    ]),
    P('ddimer', 'D-Dimer', 'Coagulation', 'Coagulation', CIT, '(Immunoturbidimetric assay)', [
      ['ddim', 'D-Dimer', 'µg/mL FEU', '< 0.50', '0.28']
    ]),

    /* ================= BIOCHEMISTRY ================= */
    P('fbs', 'Fasting Blood Sugar (FBS)', 'Biochemistry', 'Biochemistry', ['pl-flu', 'serum', 'cap'], '(Glucose oxidase–peroxidase method)', [
      ['fbs', 'Fasting Plasma Glucose', 'mg/dL', '70–99', '92', { c: [40, 450] }]
    ]),
    P('glupp', 'Blood Sugar (Fasting & 2-hr PP)', 'Biochemistry', 'Biochemistry', ['pl-flu', 'serum', 'cap'], '(Glucose oxidase–peroxidase method)', [
      ['fbs', 'Fasting Plasma Glucose', 'mg/dL', '70–99', '92', { c: [40, 450] }],
      ['ppbs', 'Plasma Glucose (2 hr after breakfast)', 'mg/dL', '< 140', '118', { c: [40, 450] }]
    ]),
    P('rbs', 'Random Blood Sugar (RBS)', 'Biochemistry', 'Biochemistry', ['pl-flu', 'serum', 'cap'], '(Glucose oxidase–peroxidase method)', [
      ['rbs', 'Random Plasma Glucose', 'mg/dL', '< 140', '112', { c: [40, 450] }]
    ]),
    P('ogtt', 'Oral Glucose Tolerance Test (75 g OGTT)', 'Biochemistry', 'Biochemistry', ['pl-flu', 'serum'], '(Glucose oxidase–peroxidase · 75 g anhydrous glucose load)', [
      ['fbs', 'Fasting Plasma Glucose', 'mg/dL', '70–99', '88', { c: [40, 450] }],
      ['og1', 'Plasma Glucose (1 hr)', 'mg/dL', '< 180', '146'],
      ['og2', 'Plasma Glucose (2 hr)', 'mg/dL', '< 140', '121']
    ]),
    P('hba1c', 'Glycated Hemoglobin (HbA1c)', 'Biochemistry', 'Biochemistry', EDTA, '(HPLC — NGSP certified, DCCT aligned)', [
      ['a1c', 'HbA1c', '%', '4.0–5.6', '5.4'],
      ['eag', 'Estimated Average Glucose (eAG)', 'mg/dL', '', '', { a: 1, nf: 1 }]
    ], { note: 'ADA: < 5.7% normal · 5.7–6.4% prediabetes · ≥ 6.5% diabetes. Therapeutic goal for most adults with diabetes < 7.0%.' }),
    P('lipid', 'Lipid Profile', 'Biochemistry', 'Biochemistry', ['serum', 'pl-hep', 'pl-edta'], '(Enzymatic · LDL by Friedewald when TG < 400 mg/dL) · 10–12 h fasting', [
      ['tc', 'Total Cholesterol', 'mg/dL', '< 200', '182'],
      ['tg', 'Triglycerides', 'mg/dL', '< 150', '138'],
      ['hdl', 'HDL Cholesterol', 'mg/dL', { m: '> 40', f: '> 50' }, '46'],
      ['ldl', 'LDL Cholesterol', 'mg/dL', '< 100', '', { a: 1 }],
      ['vldl', 'VLDL Cholesterol', 'mg/dL', '< 30', '', { a: 1 }],
      ['nhdl', 'Non-HDL Cholesterol', 'mg/dL', '< 130', '', { a: 1 }],
      ['tchdl', 'TC / HDL Ratio', 'ratio', '< 5.0', '', { a: 1 }],
      ['ldlhdl', 'LDL / HDL Ratio', 'ratio', '< 3.5', '', { a: 1 }]
    ], { note: 'NCEP ATP III: LDL < 100 optimal · 130–159 borderline high · ≥ 160 high. TG ≥ 500 mg/dL very high.' }),
    P('lft', 'Liver Function Test (LFT)', 'Biochemistry', 'Biochemistry', CHEM, AUTO, [
      ['tbil', 'Bilirubin (Total)', 'mg/dL', '0.3–1.2', '0.8', { c: [null, 15] }],
      ['dbil', 'Bilirubin (Direct)', 'mg/dL', '0.0–0.3', '0.2'],
      ['ibil', 'Bilirubin (Indirect)', 'mg/dL', '0.1–1.0', '', { a: 1 }],
      ['alt', 'ALT (SGPT)', 'U/L', { m: '< 50', f: '< 35' }, '28'],
      ['ast', 'AST (SGOT)', 'U/L', { m: '< 50', f: '< 35' }, '24'],
      ['alp', 'Alkaline Phosphatase (ALP)', 'U/L', '30–120', '86'],
      ['ggt', 'Gamma GT (GGT)', 'U/L', { m: '< 55', f: '< 38' }, '22'],
      ['tp', 'Total Protein', 'g/dL', '6.4–8.3', '7.2'],
      ['alb', 'Albumin', 'g/dL', '3.5–5.2', '4.4'],
      ['glob', 'Globulin', 'g/dL', '2.0–3.5', '', { a: 1 }],
      ['agr', 'A : G Ratio', 'ratio', '1.0–2.2', '', { a: 1 }]
    ]),
    P('rft', 'Renal Function Test (RFT / KFT)', 'Biochemistry', 'Biochemistry', CHEM, AUTO, [
      ['urea', 'Blood Urea', 'mg/dL', '15–45', '28'],
      ['bun', 'Blood Urea Nitrogen (BUN)', 'mg/dL', '7–21', '', { a: 1 }],
      ['cr', 'Serum Creatinine', 'mg/dL', { m: '0.7–1.3', f: '0.6–1.1' }, '0.9', { c: [null, 7] }],
      ['bcr', 'BUN / Creatinine Ratio', 'ratio', '10–20', '', { a: 1 }],
      ['ua', 'Uric Acid', 'mg/dL', { m: '3.5–7.2', f: '2.6–6.0' }, '5.2'],
      ['egfr', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m²', '> 90', '', { a: 1 }]
    ], { note: 'eGFR uses the race-free CKD-EPI 2021 creatinine equation; requires patient age and sex.' }),
    P('cre', 'Serum Creatinine + eGFR', 'Biochemistry', 'Biochemistry', CHEM, AUTO, [
      ['cr', 'Serum Creatinine', 'mg/dL', { m: '0.7–1.3', f: '0.6–1.1' }, '0.9', { c: [null, 7] }],
      ['egfr', 'eGFR (CKD-EPI 2021)', 'mL/min/1.73m²', '> 90', '', { a: 1 }]
    ]),
    P('lyte', 'Serum Electrolytes', 'Biochemistry', 'Biochemistry', CHEM, '(Ion-selective electrode — indirect)', [
      ['na', 'Sodium (Na⁺)', 'mmol/L', '136–145', '139', { c: [120, 160] }],
      ['k', 'Potassium (K⁺)', 'mmol/L', '3.5–5.1', '4.2', { c: [2.8, 6.2] }],
      ['cl', 'Chloride (Cl⁻)', 'mmol/L', '98–107', '102'],
      ['hco3', 'Bicarbonate (HCO₃⁻)', 'mmol/L', '22–29', '25', { c: [10, 40] }],
      ['agap', 'Anion Gap', 'mmol/L', '8–16', '', { a: 1 }]
    ]),
    P('bone', 'Bone Profile (Ca / PO₄ / Mg)', 'Biochemistry', 'Biochemistry', CHEM, AUTO, [
      ['ca', 'Calcium (Total)', 'mg/dL', '8.6–10.2', '9.4', { c: [6.5, 13] }],
      ['calb', 'Albumin', 'g/dL', '3.5–5.2', '4.2'],
      ['cca', 'Corrected Calcium', 'mg/dL', '8.6–10.2', '', { a: 1 }],
      ['phos', 'Phosphorus (Inorganic)', 'mg/dL', '2.5–4.5', '3.6', { c: [1, null] }],
      ['mg', 'Magnesium', 'mg/dL', '1.7–2.4', '2.0', { c: [1, 4.9] }],
      ['alp2', 'Alkaline Phosphatase (ALP)', 'U/L', '30–120', '78']
    ]),
    P('cardiac', 'Cardiac Markers', 'Biochemistry', 'Immunology', CHEM, CLIA, [
      ['trop', 'Troponin I', 'ng/mL', '< 0.04', '0.01'],
      ['ckmb', 'CK-MB', 'U/L', '< 25', '14'],
      ['cpk', 'CPK (Total)', 'U/L', { m: '39–308', f: '26–192' }, '110'],
      ['ldh', 'LDH', 'U/L', '125–220', '180'],
      ['bnp', 'NT-proBNP', 'pg/mL', '< 125', '62']
    ]),
    P('pancreas', 'Pancreatic Enzymes', 'Biochemistry', 'Biochemistry', CHEM, AUTO, [
      ['amy', 'Amylase', 'U/L', '28–100', '64'],
      ['lip', 'Lipase', 'U/L', '13–60', '32']
    ]),
    P('iron', 'Iron Studies', 'Biochemistry', 'Biochemistry', ['serum'], AUTO, [
      ['fe', 'Serum Iron', 'µg/dL', { m: '65–175', f: '50–170' }, '92'],
      ['tibc', 'TIBC', 'µg/dL', '250–450', '320'],
      ['uibc', 'UIBC', 'µg/dL', '110–370', '', { a: 1 }],
      ['tsat', 'Transferrin Saturation', '%', '20–50', '', { a: 1 }],
      ['ferr', 'Ferritin', 'ng/mL', { m: '30–400', f: '13–150' }, '85']
    ]),
    P('crp', 'C-Reactive Protein (CRP)', 'Biochemistry', 'Immunology', CHEM, '(Immunoturbidimetry)', [
      ['crp', 'CRP (Quantitative)', 'mg/L', '< 5.0', '2.1']
    ]),
    P('pct', 'Procalcitonin', 'Biochemistry', 'Immunology', CHEM, CLIA, [
      ['pct', 'Procalcitonin', 'ng/mL', '< 0.05', '0.03']
    ]),
    P('uric', 'Serum Uric Acid', 'Biochemistry', 'Biochemistry', CHEM, '(Uricase–peroxidase)', [
      ['ua', 'Uric Acid', 'mg/dL', { m: '3.5–7.2', f: '2.6–6.0' }, '5.2']
    ]),
    P('uacr', 'Urine Albumin / Creatinine Ratio (ACR)', 'Biochemistry', 'Biochemistry', ['ur-fm', 'ur-rand'], '(Immunoturbidimetry · Jaffe kinetic)', [
      ['ualb', 'Urine Albumin', 'mg/L', '', '12', { nf: 1 }],
      ['ucr', 'Urine Creatinine', 'mg/dL', '20–320', '110'],
      ['acr', 'Albumin / Creatinine Ratio', 'mg/g', '< 30', '', { a: 1 }]
    ], { note: 'KDIGO: ACR < 30 mg/g A1 · 30–300 A2 (moderately increased) · > 300 A3 (severely increased).' }),
    P('u24p', '24-hour Urine Protein', 'Biochemistry', 'Biochemistry', ['ur-24'], '(Pyrogallol red method)', [
      ['uvol', '24-h Urine Volume', 'mL', '800–2000', '1450'],
      ['uprot', 'Urine Protein', 'mg/dL', '', '8', { nf: 1 }],
      ['u24', 'Total Protein Excretion', 'mg/24 h', '< 150', '', { a: 1 }]
    ]),
    P('ccr', 'Creatinine Clearance (24 h)', 'Biochemistry', 'Biochemistry', ['ur-24', 'serum'], '(Serum + 24-hour urine)', [
      ['cr', 'Serum Creatinine', 'mg/dL', { m: '0.7–1.3', f: '0.6–1.1' }, '0.9'],
      ['ucr', 'Urine Creatinine', 'mg/dL', '20–320', '96'],
      ['uvol', '24-h Urine Volume', 'mL', '800–2000', '1450'],
      ['ccl', 'Creatinine Clearance', 'mL/min', { m: '97–137', f: '88–128' }, '', { a: 1 }]
    ], { spl: 'Serum & 24-hour urine' }),

    /* ================= HORMONES ================= */
    P('thyroid', 'Thyroid Profile (FT3, FT4, TSH)', 'Hormones', 'Endocrinology', HORM, CLIA, [
      ['ft3', 'Free T3 (FT3)', 'pg/mL', '2.0–4.4', '3.1'],
      ['ft4', 'Free T4 (FT4)', 'ng/dL', '0.93–1.70', '1.24'],
      ['tsh', 'TSH (3rd generation)', 'µIU/mL', '0.27–4.20', '2.15', { c: [null, 100] }]
    ], { note: 'Pregnancy (TSH): 1st trimester 0.1–2.5 · 2nd 0.2–3.0 · 3rd 0.3–3.0 µIU/mL. TSH shows diurnal variation.' }),
    P('t3t4', 'Thyroid Profile (T3, T4, TSH — Total)', 'Hormones', 'Endocrinology', HORM, CLIA, [
      ['tt3', 'Total T3', 'ng/dL', '80–200', '118'],
      ['tt4', 'Total T4', 'µg/dL', '5.1–14.1', '8.6'],
      ['tsh', 'TSH (3rd generation)', 'µIU/mL', '0.27–4.20', '2.15', { c: [null, 100] }]
    ]),
    P('tsh', 'TSH', 'Hormones', 'Endocrinology', HORM, CLIA, [
      ['tsh', 'TSH (3rd generation)', 'µIU/mL', '0.27–4.20', '2.15', { c: [null, 100] }]
    ]),
    P('thab', 'Thyroid Antibodies', 'Hormones', 'Immunology', ['serum'], CLIA, [
      ['tpo', 'Anti-TPO Antibody', 'IU/mL', '< 34', '12'],
      ['atg', 'Anti-Thyroglobulin Antibody', 'IU/mL', '< 115', '20']
    ]),
    P('fhorm', 'Female Hormone Profile', 'Hormones', 'Endocrinology', HORM, CLIA, [
      ['fsh', 'FSH', 'mIU/mL', 'Follicular 3.5–12.5 | Ovulation 4.7–21.5 | Luteal 1.7–7.7 | Post-menopause 25.8–134.8', '6.2'],
      ['lh', 'LH', 'mIU/mL', 'Follicular 2.4–12.6 | Ovulation 14.0–95.6 | Luteal 1.0–11.4 | Post-menopause 7.7–58.5', '5.4'],
      ['prl', 'Prolactin', 'ng/mL', { m: '4.0–15.2', f: '4.8–23.3' }, '12.4'],
      ['e2', 'Estradiol (E2)', 'pg/mL', 'Follicular 12.5–166 | Ovulation 85.8–498 | Luteal 43.8–211 | Post-menopause < 54.7', '68'],
      ['prog', 'Progesterone', 'ng/mL', 'Follicular 0.06–0.89 | Luteal 1.83–23.9 | Post-menopause < 0.13', '0.52'],
      ['amh', 'Anti-Müllerian Hormone (AMH)', 'ng/mL', '1.0–4.0 (age dependent)', '2.4']
    ], { sex: 'f', note: 'Gonadotropin and steroid reference ranges depend on menstrual-cycle phase; interpret with LMP.' }),
    P('mhorm', 'Male Hormone Profile', 'Hormones', 'Endocrinology', HORM, CLIA, [
      ['testo', 'Testosterone (Total)', 'ng/dL', '249–836', '512'],
      ['ftesto', 'Free Testosterone', 'pg/mL', '46–224', '98'],
      ['fsh', 'FSH', 'mIU/mL', '1.5–12.4', '4.6'],
      ['lh', 'LH', 'mIU/mL', '1.7–8.6', '4.2'],
      ['prl', 'Prolactin', 'ng/mL', '4.0–15.2', '9.6']
    ], { sex: 'm' }),
    P('cort', 'Cortisol (Morning)', 'Hormones', 'Endocrinology', HORM, CLIA + ' · sample at 8–9 AM', [
      ['cort', 'Cortisol (8 AM)', 'µg/dL', '6.2–19.4', '12.8']
    ]),
    P('homa', 'Fasting Insulin & HOMA-IR', 'Hormones', 'Endocrinology', ['serum'], CLIA, [
      ['fbs', 'Fasting Glucose', 'mg/dL', '70–99', '90'],
      ['ins', 'Fasting Insulin', 'µIU/mL', '2.6–24.9', '8.4'],
      ['homa', 'HOMA-IR', 'index', '< 2.5', '', { a: 1 }]
    ], { note: 'HOMA-IR = fasting glucose (mg/dL) × fasting insulin (µIU/mL) ÷ 405. Separate serum promptly for glucose.' }),
    P('bhcg', 'β-hCG (Quantitative)', 'Hormones', 'Endocrinology', ['serum'], CLIA, [
      ['bhcg', 'Beta hCG', 'mIU/mL', '< 5.0 (non-pregnant)', '2.1']
    ], { note: 'Pregnancy (weeks from LMP): 3–4 wk 9–130 · 4–5 wk 75–2600 · 5–6 wk 850–20 800 · 6–7 wk 4000–100 200 mIU/mL.' }),
    P('pth', 'Parathyroid Hormone (Intact PTH)', 'Hormones', 'Endocrinology', ['serum', 'pl-edta'], CLIA, [
      ['pth', 'Intact PTH', 'pg/mL', '15–65', '42']
    ]),
    P('vit', 'Vitamin Profile (D, B12, Folate)', 'Hormones', 'Immunology', ['serum'], CLIA, [
      ['vitd', '25-OH Vitamin D (Total)', 'ng/mL', '30–100', '24'],
      ['b12', 'Vitamin B12', 'pg/mL', '197–771', '410'],
      ['fol', 'Folate (Serum)', 'ng/mL', '> 5.4', '9.8']
    ], { note: 'Vitamin D: < 20 deficiency · 20–29 insufficiency · 30–100 sufficiency · > 100 potential toxicity (ng/mL).' }),

    /* ================= TUMOR MARKERS ================= */
    P('psa', 'PSA (Total & Free)', 'Tumor markers', 'Immunology', ['serum'], CLIA, [
      ['psa', 'PSA (Total)', 'ng/mL', '< 4.0', '1.2'],
      ['fpsa', 'PSA (Free)', 'ng/mL', '', '0.36', { nf: 1 }],
      ['fpsar', 'Free / Total PSA Ratio', '%', '> 25', '', { a: 1 }]
    ], { sex: 'm', note: 'With total PSA 4–10 ng/mL, a free/total ratio < 10% increases probability of prostate cancer; > 25% suggests benign disease.' }),
    P('tmark', 'Tumor Marker Panel', 'Tumor markers', 'Immunology', ['serum'], CLIA, [
      ['cea', 'CEA', 'ng/mL', '< 5.0', '1.8'],
      ['afp', 'AFP', 'ng/mL', '< 7.0', '3.1'],
      ['ca125', 'CA 125', 'U/mL', '< 35', '14'],
      ['ca199', 'CA 19-9', 'U/mL', '< 37', '11'],
      ['ca153', 'CA 15-3', 'U/mL', '< 25', '9']
    ], { note: 'Tumor markers are for monitoring, not screening; values differ between assay methods.' }),

    /* ================= URINE & STOOL ================= */
    P('urme', 'Urine R/M/E', 'Urine & stool', 'Clinical Pathology', URINE, '(Physical · reagent strip · microscopy of centrifuged deposit)', [
      H('Physical Examination'),
      ['uqty', 'Quantity', 'mL', '', '30', { nf: 1 }],
      ['ucol', 'Colour', '', 'Pale yellow', 'Pale yellow', { o: 'ucol', nv: ['Pale yellow', 'Straw', 'Yellow', 'Light yellow', 'Colourless'] }],
      ['uapp', 'Appearance', '', 'Clear', 'Clear', { o: 'uapp' }],
      ['usg', 'Specific Gravity', '', '1.005–1.030', '1.020'],
      ['uph', 'Reaction (pH)', '', '4.6–8.0', '6.0'],
      ['udep', 'Sediment', '', 'Nil', 'Nil', { o: 'nilp' }],
      H('Chemical Examination'),
      ['upro', 'Albumin (Protein)', '', 'Nil', 'Nil', { o: 'nil' }],
      ['usug', 'Sugar (Glucose)', '', 'Nil', 'Nil', { o: 'nil' }],
      ['uket', 'Ketone Bodies', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['ubil', 'Bilirubin', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['uubg', 'Urobilinogen', '', 'Normal', 'Normal', { o: 'ubg' }],
      ['ubld', 'Blood', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['unit', 'Nitrite', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['ule', 'Leukocyte Esterase', '', 'Negative', 'Negative', { o: 'posneg' }],
      H('Microscopic Examination'),
      ['upus', 'Pus Cells', '/HPF', '0–5', '1–2'],
      ['urbc', 'Red Blood Cells', '/HPF', '0–2', 'Nil'],
      ['uepi', 'Epithelial Cells', '/HPF', '0–5', '2–3'],
      ['ucas', 'Casts', '/LPF', 'Nil', 'Nil', { o: 'cast' }],
      ['ucry', 'Crystals', '', 'Nil', 'Nil', { o: 'cryst' }],
      ['ubac', 'Bacteria', '', 'Nil', 'Nil', { o: 'nilp' }],
      ['uyst', 'Yeast Cells', '', 'Nil', 'Nil', { o: 'nilp' }],
      ['uoth', 'Others', '', '', 'Nil', { nf: 1 }]
    ]),
    P('upt', 'Urine Pregnancy Test', 'Urine & stool', 'Clinical Pathology', ['ur-fm', 'ur-rand'], '(Immunochromatographic hCG card test)', [
      ['upt', 'Pregnancy Test (Urine hCG)', '', '', 'Negative', { o: 'posneg', nf: 1 }]
    ], { sex: 'f' }),
    P('srme', 'Stool R/M/E', 'Urine & stool', 'Clinical Pathology', ['stool'], '(Macroscopy · saline & iodine wet mount)', [
      H('Physical Examination'),
      ['scol', 'Colour', '', 'Brown', 'Brown', { o: 'scol', nv: ['Brown', 'Yellowish brown'] }],
      ['scon', 'Consistency', '', 'Formed', 'Semi-formed', { o: 'scon', nv: ['Formed', 'Semi-formed', 'Soft'] }],
      ['smuc', 'Mucus', '', 'Absent', 'Absent', { o: 'abs' }],
      ['sbld', 'Visible Blood', '', 'Absent', 'Absent', { o: 'abs' }],
      H('Chemical Examination'),
      ['sreac', 'Reaction', '', 'Acidic', 'Acidic', { o: 'sreac', nf: 1 }],
      ['sob', 'Occult Blood', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['srs', 'Reducing Substances', '', 'Negative', 'Negative', { o: 'posneg' }],
      H('Microscopic Examination'),
      ['spus', 'Pus Cells', '/HPF', 'Nil', '0–1'],
      ['srbc', 'Red Blood Cells', '/HPF', 'Nil', 'Nil'],
      ['sova', 'Ova', '', 'Not found', 'Not found', { o: 'found' }],
      ['scys', 'Cysts', '', 'Not found', 'Not found', { o: 'found' }],
      ['stro', 'Trophozoites', '', 'Not found', 'Not found', { o: 'found' }],
      ['sfat', 'Fat Globules', '', 'Absent', 'Absent', { o: 'abs' }],
      ['sveg', 'Vegetable Cells', '', '', 'Present', { nf: 1 }],
      ['sstr', 'Starch Granules', '', 'Absent', 'Absent', { o: 'abs' }]
    ]),
    P('fobt', 'Stool Occult Blood (FOBT)', 'Urine & stool', 'Clinical Pathology', ['stool'], '(Immunochromatographic — human Hb specific)', [
      ['sob', 'Occult Blood', '', 'Negative', 'Negative', { o: 'posneg' }]
    ]),

    /* ================= SEROLOGY ================= */
    P('widal', 'Widal Test', 'Serology', 'Serology', ['serum'], '(Slide agglutination — titre)', [
      ['wto', 'S. Typhi "O"', 'titre', '< 1:80', '1:40', { o: 'titre' }],
      ['wth', 'S. Typhi "H"', 'titre', '< 1:160', '1:80', { o: 'titre' }],
      ['wah', 'S. Paratyphi "AH"', 'titre', '< 1:160', '1:20', { o: 'titre' }],
      ['wbh', 'S. Paratyphi "BH"', 'titre', '< 1:160', '1:20', { o: 'titre' }]
    ], { note: 'A single Widal result has limited value; a four-fold rise in paired sera or blood culture is confirmatory.' }),
    P('dengue', 'Dengue Profile (NS1, IgM, IgG)', 'Serology', 'Serology', ['serum'], '(Immunochromatographic rapid test)', [
      ['dns1', 'Dengue NS1 Antigen', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['digm', 'Dengue IgM Antibody', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['digg', 'Dengue IgG Antibody', '', 'Negative', 'Negative', { o: 'posneg' }]
    ]),
    P('viral', 'Viral Markers (HBsAg, HCV, HIV, VDRL)', 'Serology', 'Serology', ['serum'], '(Rapid / ELISA method)', [
      ['hbsag', 'HBsAg', '', 'Non-reactive', 'Non-reactive', { o: 'react' }],
      ['hcv', 'Anti-HCV Antibody', '', 'Non-reactive', 'Non-reactive', { o: 'react' }],
      ['hiv', 'HIV I & II Antibody', '', 'Non-reactive', 'Non-reactive', { o: 'react' }],
      ['vdrl', 'VDRL / RPR', '', 'Non-reactive', 'Non-reactive', { o: 'react' }]
    ], { note: 'Reactive screening results must be confirmed by a supplementary test before reporting a diagnosis.' }),
    P('rheum', 'RA Factor, ASO & CRP', 'Serology', 'Immunology', ['serum'], '(Latex agglutination / turbidimetry)', [
      ['raf', 'RA Factor', 'IU/mL', '< 20', '8'],
      ['aso', 'ASO Titre', 'IU/mL', '< 200', '120'],
      ['crp', 'CRP (Quantitative)', 'mg/L', '< 5.0', '2.1']
    ]),
    P('typhi', 'Typhoid IgM / IgG (Rapid)', 'Serology', 'Serology', ['serum'], '(Immunochromatographic rapid test)', [
      ['tyigm', 'S. Typhi IgM', '', 'Negative', 'Negative', { o: 'posneg' }],
      ['tyigg', 'S. Typhi IgG', '', 'Negative', 'Negative', { o: 'posneg' }]
    ]),
    P('hpy', 'H. pylori Antibody', 'Serology', 'Serology', ['serum'], '(Immunochromatographic rapid test)', [
      ['hpy', 'H. pylori Antibody', '', 'Negative', 'Negative', { o: 'posneg' }]
    ]),

    /* ================= BODY FLUIDS & SEMEN ================= */
    P('csf', 'CSF Analysis', 'Fluids', 'Clinical Pathology', ['csf'], '', [
      H('Physical'),
      ['fapp', 'Appearance', '', 'Clear, colourless', 'Clear, colourless', { nv: ['Clear, colourless', 'Clear'] }],
      H('Cytology'),
      ['ftc', 'Total Cell Count', 'cells/µL', '0–5', '2'],
      ['fneu', 'Neutrophils', '%', '', '0', { nf: 1 }],
      ['flym', 'Lymphocytes', '%', '', '100', { nf: 1 }],
      H('Biochemistry'),
      ['fpro', 'Protein', 'mg/dL', '15–45', '32'],
      ['fglu', 'Glucose', 'mg/dL', '40–70', '58'],
      H('Microbiology'),
      ['fgram', 'Gram Stain', '', 'No organisms seen', 'No organisms seen', { o: 'gram' }]
    ], { note: 'Interpret CSF glucose with a simultaneous plasma glucose (normal CSF/plasma ratio ≈ 0.6).' }),
    P('bfluid', 'Body Fluid Analysis', 'Fluids', 'Clinical Pathology', ['pleural', 'ascitic', 'synovial', 'pericardial'], '', [
      ['fapp', 'Appearance', '', 'Clear, straw coloured', 'Clear, straw coloured', { nf: 1 }],
      ['ftc', 'Total Cell Count', 'cells/µL', '< 1000', '420'],
      ['fneu', 'Neutrophils', '%', '', '20', { nf: 1 }],
      ['flym', 'Lymphocytes', '%', '', '80', { nf: 1 }],
      ['fpro', 'Protein', 'g/dL', '', '2.1', { nf: 1 }],
      ['fglu', 'Glucose', 'mg/dL', '', '88', { nf: 1 }],
      ['fldh', 'LDH', 'U/L', '', '140', { nf: 1 }],
      ['fada', 'Adenosine Deaminase (ADA)', 'U/L', '< 40', '18']
    ], { note: 'Light’s criteria (exudate if any): fluid/serum protein > 0.5, fluid/serum LDH > 0.6, or fluid LDH > ⅔ of serum ULN.' }),
    P('semen', 'Semen Analysis (WHO 2021)', 'Fluids', 'Andrology', ['semen'], '(WHO laboratory manual, 6th edition, 2021)', [
      ['sabs', 'Abstinence', 'days', '2–7', '3', { nf: 1 }],
      H('Macroscopic'),
      ['svol', 'Volume', 'mL', '≥ 1.4', '2.8'],
      ['sph', 'pH', '', '≥ 7.2', '7.8'],
      ['sliq', 'Liquefaction', '', 'Complete', 'Complete', { o: 'liq' }],
      ['svis', 'Viscosity', '', 'Normal', 'Normal', { o: 'visc' }],
      H('Microscopic'),
      ['sconc', 'Sperm Concentration', 'million/mL', '≥ 16', '42'],
      ['stsc', 'Total Sperm Count', 'million/ejaculate', '≥ 39', '', { a: 1 }],
      ['sprog', 'Progressive Motility (PR)', '%', '≥ 30', '38'],
      ['stmot', 'Total Motility (PR + NP)', '%', '≥ 42', '52'],
      ['svit', 'Vitality', '%', '≥ 54', '68'],
      ['smor', 'Normal Morphology', '%', '≥ 4', '5'],
      ['swbc', 'Round / Pus Cells', 'million/mL', '< 1.0', '0.4']
    ], { sex: 'm' }),

    /* ================= MICROBIOLOGY ================= */
    cs('ucs', 'Urine Culture & Sensitivity', ['ur-msu', 'ur-cath', 'ur-fm', 'ur-rand']),
    cs('bcs', 'Blood Culture & Sensitivity', ['bc']),
    cs('pcs', 'Pus / Wound Culture & Sensitivity', ['pus', 'wound', 'hvs', 'urethral', 'throat', 'sputum']),
    P('afb', 'AFB Smear (Ziehl-Neelsen)', 'Microbiology', 'Microbiology', ['sputum', 'pus', 'csf', 'pleural', 'ascitic'], '(Ziehl-Neelsen stain)', [
      ['afb1', 'AFB (Sample 1)', '', 'No AFB seen', 'No AFB seen', { o: 'afb' }],
      ['afb2', 'AFB (Sample 2)', '', 'No AFB seen', 'No AFB seen', { o: 'afb' }]
    ]),
    P('gram', 'Gram Stain', 'Microbiology', 'Microbiology', ['sputum', 'pus', 'wound', 'hvs', 'urethral', 'csf', 'throat'], '', [
      ['gpc', 'Pus Cells', '', '', 'Few', { o: 'nilp', nf: 1 }],
      ['gorg', 'Organisms', '', 'No organisms seen', 'No organisms seen', { o: 'gram' }]
    ])
  ];
  R.PROF_BY = Object.fromEntries(R.PROF.map(p => [p.id, p]));
  R.CATS = ['Hematology', 'Coagulation', 'Biochemistry', 'Hormones', 'Tumor markers', 'Urine & stool', 'Serology', 'Fluids', 'Microbiology'];

  /* ---------- flat test index (for single-test search + name → key lookup) ---------- */
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  R.norm = norm;
  R.TESTS = [];
  R.TEST_BY_NAME = {};
  R.PROF.forEach(p =>
    p.t.forEach(t => {
      if (t[0] === '#') return;
      const k = norm(t[1]);
      if (!R.TEST_BY_NAME[k]) {
        R.TEST_BY_NAME[k] = { t, p };
        R.TESTS.push({ t, p });
      }
    })
  );
  // common aliases typed by users
  [['sgpt', 'ALT (SGPT)'], ['sgot', 'AST (SGOT)'], ['creatinine', 'Serum Creatinine'], ['urea', 'Blood Urea'], ['hemoglobin', 'Hemoglobin'], ['haemoglobin', 'Hemoglobin'], ['wbc', 'Total WBC Count'], ['platelets', 'Platelet Count'], ['cholesterol', 'Total Cholesterol'], ['ldl', 'LDL Cholesterol'], ['hdl', 'HDL Cholesterol'], ['fbs', 'Fasting Plasma Glucose'], ['rbs', 'Random Plasma Glucose'], ['sodium', 'Sodium (Na⁺)'], ['potassium', 'Potassium (K⁺)'], ['calcium', 'Calcium (Total)'], ['vitamind', '25-OH Vitamin D (Total)'], ['hba1c', 'HbA1c'], ['tsh', 'TSH (3rd generation)']]
    .forEach(([a, n]) => { const x = R.TEST_BY_NAME[norm(n)]; if (x && !R.TEST_BY_NAME[a]) R.TEST_BY_NAME[a] = x; });

  /* ---------- demo case (default content, shows every feature) ---------- */
  R.DEMO = {
    pt: { lno: 'LG-260412-0042', pid: 'P-10293', p: 'Rahim Uddin', age: '46', sx: 'Male', ph: '01711-000000', rb: 'Dr. A. K. Hasan, MBBS, FCPS (Medicine)', bed: '', pst: 'OPD' },
    pages: [
      { nm: 'Hematology', prof: ['cbc', 'esr'], set: { hb: '11.2', rbc: '4.95', hct: '35.6', rdw: '15.2', wbc: '11.8', neu: '76', lym: '18', mon: '4', eos: '2', bas: '0', esr: '28' } },
      { nm: 'Biochemistry', prof: ['lipid', 'rft', 'glupp'], set: { fbs: '128', ppbs: '204', tc: '232', tg: '210', hdl: '38', cr: '1.1', urea: '34' } },
      { nm: 'Urine', prof: ['urme'], set: { uapp: 'Slightly turbid', upro: 'Trace', usug: '+', upus: '8–10', uepi: '4–6', ubac: 'Present' } },
      { nm: 'Hormones', prof: ['thyroid', 'vit'], set: { tsh: '6.8', ft4: '1.02', vitd: '18' } }
    ]
  };
})();
