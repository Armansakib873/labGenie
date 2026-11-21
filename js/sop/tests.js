/* =====================================================================
   LabGenie SOP Guidebook · tests.js
   Per-test / per-profile guidance for laboratory personnel.
   Reference values are typical adult (and where useful paediatric)
   intervals from common textbook sources (Tietz, Henry, WHO). Every lab
   must verify against its own validated method and the kit insert.
   Fields:
     id, n name, aka search aliases, dept, cat, sp specimen, tube (key),
     vol volume, time best collection time / patient preparation,
     pre precautions, proc processing & stability, ref {u:[conv,SI], r:[[group,conv,si]]},
     hi causes of increase, lo causes of decrease, corr correlations,
     hx patient-history clues, crit critical values, int interferences, note
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});

  G.TUBES = {
    lav: ['Lavender (K₂/K₃ EDTA)', '#8b5cf6'],
    red: ['Red (plain / clot activator)', '#dc2626'],
    gold: ['Gold / SST (gel separator)', '#d4a017'],
    grey: ['Grey (fluoride-oxalate)', '#9ca3af'],
    blue: ['Light blue (3.2% sodium citrate)', '#60a5fa'],
    green: ['Green (lithium heparin)', '#16a34a'],
    black: ['Black (3.8% citrate, ESR)', '#111827'],
    urine: ['Sterile urine container', '#eab308'],
    stool: ['Stool container', '#92400e'],
    sterile: ['Sterile tube / container', '#0ea5e9'],
    bc: ['Blood culture bottles', '#f97316'],
    abg: ['Heparinised blood-gas syringe', '#0d9488']
  };
  G.DEPTS = ['Hematology', 'Coagulation', 'Biochemistry', 'Endocrinology', 'Tumor markers', 'Clinical Pathology', 'Serology', 'Microbiology'];

  G.TESTS = [
    /* ===================== HEMATOLOGY ===================== */
    {
      id: 'cbc', n: 'Complete Blood Count (CBC)', aka: 'cbc hemogram hb wbc rbc platelet tc dc fbc full blood count', dept: 'Hematology', cat: 'Blood counts',
      sp: 'Whole blood', tube: 'lav', vol: '2 mL (fill to the mark; 0.5 mL paediatric microtainer)',
      time: 'Any time; no fasting. For serial monitoring collect at the same time of day.',
      pre: ['Mix the EDTA tube gently 8–10 inversions immediately after collection — never shake.', 'Avoid prolonged tourniquet (> 1 min) — causes haemoconcentration.', 'Do not collect from an arm with an IV drip (dilution).', 'Under-filled tubes (excess EDTA) shrink cells: falsely low Hct/MCV.', 'Check for clots before running — micro-clots give falsely low platelets.'],
      proc: ['Run within 4–6 h at room temperature for best accuracy; stable up to 24 h at 4 °C (differential and MCV drift after ~8 h).', 'Prepare a blood film within 2–3 h if morphology is needed (EDTA artefacts appear later).', 'Re-mix by inversion / roller for 2 min before aspirating.', 'Flags (blasts, NRBC, platelet clumps, abnormal scatter) require smear review.'],
      ref: { u: ['conventional', 'SI'], r: [['Hb — adult male', '13.0–17.0 g/dL', '130–170 g/L'], ['Hb — adult female', '12.0–15.0 g/dL', '120–150 g/L'], ['Hb — newborn', '14.0–22.0 g/dL', '140–220 g/L'], ['Hb — child 2–6 y', '11.0–14.0 g/dL', '110–140 g/L'], ['Hb — pregnancy', '≥ 11.0 g/dL', '≥ 110 g/L'], ['WBC — adult', '4.0–10.0 ×10³/µL', '4.0–10.0 ×10⁹/L'], ['WBC — newborn', '9.0–30.0 ×10³/µL', '9.0–30.0 ×10⁹/L'], ['WBC — child 1–6 y', '5.0–15.0 ×10³/µL', '5.0–15.0 ×10⁹/L'], ['Platelets', '150–410 ×10³/µL', '150–410 ×10⁹/L'], ['MCV', '83–101 fL', '83–101 fL'], ['MCH / MCHC', '27–32 pg / 31.5–34.5 g/dL', '27–32 pg / 315–345 g/L'], ['RDW-CV', '11.6–14.0 %', '0.116–0.140'], ['Neutrophils / Lymphocytes (adult)', '40–80 % / 20–40 %', '0.40–0.80 / 0.20–0.40']] },
      hi: ['Hb ↑: polycythaemia vera, dehydration, smokers, high altitude, COPD, EPO use.', 'WBC ↑: bacterial infection (neutrophilia), stress, steroids, leukaemia, tissue necrosis.', 'Lymphocytes ↑: viral infection, CLL, pertussis, TB.', 'Eosinophils ↑: allergy, asthma, parasites, drug reaction.', 'Platelets ↑: iron deficiency, inflammation, post-splenectomy, myeloproliferative disease.'],
      lo: ['Hb ↓: iron deficiency, thalassaemia, B12/folate deficiency, bleeding, haemolysis, CKD, marrow failure.', 'WBC ↓: viral infection (dengue, typhoid), chemotherapy, aplastic anaemia, SLE, severe sepsis.', 'Platelets ↓: dengue, ITP, DIC, sepsis, hypersplenism, drugs (heparin — HIT), EDTA pseudo-thrombocytopenia.'],
      corr: ['MCV < 80 + RDW ↑ → iron deficiency (confirm ferritin); MCV < 80 + RDW normal + RBC count high → thalassaemia trait (Mentzer index MCV/RBC < 13).', 'MCV > 100 → check B12, folate, TSH, liver function, alcohol history, reticulocytes.', 'Hb × 3 ≈ Hct (rule of three) — a mismatch suggests lipaemia, cold agglutinin or instrument error.', 'Pancytopenia → peripheral smear + reticulocyte count; consider marrow examination.', 'Dengue: falling platelets with rising Hct (haemoconcentration) is a warning sign.'],
      hx: ['Recent fever / travel (dengue, malaria, typhoid).', 'Menstrual history, pregnancy, GI bleeding, NSAID use (anaemia).', 'Chemotherapy / radiotherapy, immunosuppressants.', 'Known thalassaemia or family history; previous transfusions.', 'CKD on dialysis (normocytic anaemia of CKD, EPO therapy).'],
      crit: 'Hb < 7 or > 20 g/dL · WBC < 1.5 or > 30 ×10³/µL · ANC < 0.5 ×10³/µL · Platelets < 20 or > 1000 ×10³/µL · blasts on first smear',
      int: ['Platelet clumping / satellitism with EDTA → falsely low platelets (recollect in citrate).', 'Cold agglutinins → falsely high MCV/MCHC, low RBC (warm sample to 37 °C).', 'Lipaemia / high WBC → falsely high Hb.', 'Nucleated RBC may be counted as WBC on older analysers.']
    },
    {
      id: 'esr', n: 'ESR (Erythrocyte Sedimentation Rate)', aka: 'esr westergren sed rate', dept: 'Hematology', cat: 'Blood counts',
      sp: 'Whole blood', tube: 'black', vol: '1.6 mL blood + 0.4 mL 3.8 % citrate (4:1), or EDTA diluted 4:1',
      time: 'Any time. Test within 4 h at room temperature (12 h at 4 °C, re-warm before testing).',
      pre: ['Exact 4:1 blood:citrate ratio — under-filling falsely lowers ESR.', 'Keep the Westergren tube exactly vertical, away from vibration, sunlight and heat.', 'Read at exactly 60 min.'],
      proc: ['Room temperature 18–25 °C; higher temperature accelerates sedimentation.', 'Mix gently before filling the tube; avoid air bubbles.'],
      ref: { u: ['mm/1st hr', 'mm/hr'], r: [['Male < 50 y', '0–15', '0–15'], ['Male > 50 y', '0–20', '0–20'], ['Female < 50 y', '0–20', '0–20'], ['Female > 50 y', '0–30', '0–30'], ['Children', '0–10', '0–10'], ['Rule of thumb (upper limit)', 'Men: age ÷ 2 · Women: (age + 10) ÷ 2', '—']] },
      hi: ['Infection, inflammation, TB, autoimmune disease (RA, SLE, PMR, temporal arteritis).', 'Multiple myeloma, macroglobulinaemia (very high, > 100).', 'Anaemia, pregnancy, old age, CKD.'],
      lo: ['Polycythaemia, sickle cell, spherocytosis, hypofibrinogenaemia, extreme leucocytosis, CHF.'],
      corr: ['ESR > 100 mm/hr → consider myeloma (serum protein electrophoresis), TB, giant-cell arteritis, malignancy.', 'CRP rises and falls faster than ESR — use CRP for acute monitoring.'],
      hx: ['Joint pain, morning stiffness, weight loss, night sweats (TB / malignancy).', 'Headache with jaw claudication in elderly (temporal arteritis).'],
      int: ['Tilted tube, high room temperature, delayed testing (> 4 h) all change the result.']
    },
    {
      id: 'pbf', n: 'Peripheral Blood Film (PBF)', aka: 'pbf blood smear slide morphology leishman giemsa', dept: 'Hematology', cat: 'Morphology',
      sp: 'Whole blood (EDTA) or capillary blood', tube: 'lav', vol: '1–2 mL', time: 'Make the smear within 2–3 h of collection (EDTA artefacts: crenation, vacuolation).',
      pre: ['Use clean, grease-free slides; label with pencil on the frosted end.', 'Feathered edge must end 1–2 cm before the slide end; film should cover ~⅔ of the slide.', 'Air-dry quickly and fix in methanol within 1 h.'],
      proc: ['Stain: Leishman / Wright-Giemsa; pH 6.8 buffer.', 'Scan at 10× for distribution, platelet clumps, abnormal cells; examine 100 WBC at 100× oil in the monolayer.', 'Estimate platelets: average per oil field × 15–20 ×10³/µL.'],
      ref: { u: ['finding', ''], r: [['RBC', 'Normocytic normochromic', ''], ['WBC', 'Normal number and morphology', ''], ['Platelets', 'Adequate (8–20 per oil field)', ''], ['Haemoparasites', 'Not seen', '']] },
      hi: ['Target cells: thalassaemia, liver disease, HbC.', 'Schistocytes (> 1 %): DIC, TTP/HUS, mechanical valves — urgent report.', 'Spherocytes: hereditary spherocytosis, autoimmune haemolysis.', 'Blasts: acute leukaemia — urgent report.', 'Hypersegmented neutrophils (≥ 6 lobes): B12 / folate deficiency.'],
      corr: ['Always correlate with CBC indices and the analyser flags.', 'Toxic granulation + left shift → bacterial sepsis.', 'Atypical lymphocytes → viral infection (dengue, EBV).'],
      hx: ['Fever with travel (malaria — request thick film).', 'Known haemoglobinopathy, recent transfusion, chemotherapy.']
    },
    {
      id: 'retic', n: 'Reticulocyte Count', aka: 'retic reticulocyte rpi', dept: 'Hematology', cat: 'Blood counts', sp: 'Whole blood', tube: 'lav', vol: '1–2 mL',
      time: 'Any time.', pre: ['Mix well; test within 24 h (4 °C up to 72 h on analysers).'], proc: ['Manual: new methylene blue 1:1 with blood, incubate 15 min at 37 °C, count reticulocytes per 1000 RBC.', 'Corrected retic % = retic % × (patient Hct ÷ 45).'],
      ref: { u: ['%', 'absolute'], r: [['Adult', '0.5–2.5 %', '25–100 ×10⁹/L'], ['Newborn', '2–6 %', '—']] },
      hi: ['Haemolysis, acute blood loss (after 3–5 days), response to iron/B12/folate therapy.'], lo: ['Aplastic anaemia, marrow infiltration, untreated nutritional anaemia, CKD, pure red-cell aplasia.'],
      corr: ['Reticulocyte production index (RPI) > 2 → adequate marrow response (blood loss / haemolysis); < 2 → hypoproliferative.', 'With high LDH, high indirect bilirubin, low haptoglobin → haemolysis.']
    },
    {
      id: 'bgrp', n: 'Blood Grouping & Rh Typing', aka: 'blood group abo rh d typing', dept: 'Hematology', cat: 'Blood bank', sp: 'Whole blood', tube: 'lav', vol: '2 mL',
      time: 'Any time.', pre: ['Positive patient identification is critical — two identifiers, label at the bedside.', 'Perform forward (cell) and reverse (serum) grouping; they must agree.'], proc: ['Tube method preferred over slide for confirmation.', 'Weak D testing (IAT) for apparent Rh-negative donors / mothers per local policy.'],
      ref: { u: ['result', ''], r: [['ABO', 'A, B, AB or O', ''], ['Rh (D)', 'Positive / Negative', '']] },
      corr: ['Forward–reverse discrepancy → check for weak subgroups, cold antibodies, recent transfusion, newborn (no reverse group before 4–6 months).', 'Rh-negative mother → antibody screen and anti-D prophylaxis planning.'],
      hx: ['Previous transfusions, pregnancies, transfusion reactions, bone marrow transplant.']
    },
    {
      id: 'mp', n: 'Malaria Parasite (MP film / ICT)', aka: 'malaria mp plasmodium falciparum vivax ict rdt thick thin film', dept: 'Hematology', cat: 'Parasitology', sp: 'Whole blood (EDTA) or finger prick', tube: 'lav', vol: '2 mL',
      time: 'Ideally during or just after a fever spike, before antimalarials. Repeat every 6–12 h × 3 if negative but suspicion high.',
      pre: ['Make thick and thin films within 1 h of EDTA collection (parasite morphology changes).', 'Thick film: do not fix; thin film: methanol fix.'], proc: ['Giemsa 3 % for 30–45 min or 10 % for 10 min, pH 7.2.', 'Examine ≥ 100 (thick) / 200 oil fields before reporting negative; report species and parasitaemia %.'],
      ref: { u: ['result', ''], r: [['Film', 'Not found', ''], ['ICT (HRP-2 / pLDH)', 'Negative', '']] },
      corr: ['Thrombocytopenia, anaemia, raised bilirubin and LDH support malaria.', 'HRP-2 RDT can stay positive 2–4 weeks after cure — use film for follow-up.', 'Parasitaemia > 5 % (P. falciparum) indicates severe malaria — critical.'],
      hx: ['Travel to / residence in endemic area, previous malaria, prophylaxis taken, blood transfusion.'], crit: 'Any P. falciparum positive; parasitaemia > 2–5 %'
    },

    /* ===================== COAGULATION ===================== */
    {
      id: 'pt', n: 'Prothrombin Time (PT / INR)', aka: 'pt inr prothrombin warfarin coagulation', dept: 'Coagulation', cat: 'Coagulation', sp: 'Citrated plasma', tube: 'blue', vol: 'Fill to the line (2.7 mL blood : 0.3 mL citrate = 9:1)',
      time: 'Warfarin monitoring: 12–16 h after last dose (morning sample before the evening dose).',
      pre: ['Tube must be ≥ 90 % filled — under-filling prolongs PT.', 'If using a butterfly, draw a discard tube first (dead-space air).', 'Draw citrate tube before EDTA / heparin (order of draw).', 'Hct > 55 %: reduce citrate volume (formula: C = 0.00185 × V × (100 − Hct)).', 'Avoid heparin-contaminated lines.'],
      proc: ['Centrifuge 1500 g × 15 min to platelet-poor plasma (< 10 ×10³/µL platelets).', 'Test within 24 h (PT) at room temperature; do not refrigerate whole blood (cold activates FVII).', 'Freeze plasma at −20 °C (2 weeks) or −70 °C if delayed.'],
      ref: { u: ['seconds / ratio', ''], r: [['PT', '11.0–13.5 s (lab/reagent specific)', ''], ['INR (not on warfarin)', '0.8–1.2', ''], ['INR target — most indications', '2.0–3.0', ''], ['INR target — mechanical mitral valve', '2.5–3.5', '']] },
      hi: ['Warfarin, vitamin K deficiency, liver disease, DIC, factor VII/X/V/II deficiency, broad-spectrum antibiotics, newborn.'], lo: ['Rarely clinically significant; check sample (over-filled, clotted).'],
      corr: ['PT ↑ + APTT normal → factor VII deficiency, early warfarin, early liver disease.', 'PT ↑ + APTT ↑ → common pathway, DIC (low platelets, high D-dimer, low fibrinogen), severe liver disease, warfarin over-dose.', 'INR = (PT patient ÷ MNPT)^ISI — ISI and MNPT come from the reagent lot.'],
      hx: ['Anticoagulant (warfarin dose, DOACs — apixaban/rivaroxaban prolong PT variably).', 'Liver disease, malnutrition, malabsorption, recent antibiotics.', 'Bleeding history, family history of bleeding disorder.'], crit: 'INR > 5.0 (or > 4.5 per policy); PT > 30 s without anticoagulant',
      int: ['Clotted or haemolysed sample, wrong fill ratio, high Hct, lipaemia/icterus on optical analysers.']
    },
    {
      id: 'aptt', n: 'Activated Partial Thromboplastin Time (aPTT)', aka: 'aptt ptt heparin intrinsic coagulation', dept: 'Coagulation', cat: 'Coagulation', sp: 'Citrated plasma', tube: 'blue', vol: 'Fill to the line (9:1)',
      time: 'Unfractionated heparin: 6 h after starting / dose change.', pre: ['Same as PT — correct fill, no heparin contamination, draw after a discard tube with butterfly.'], proc: ['Centrifuge 1500 g × 15 min; test within 4 h if on unfractionated heparin (platelet factor 4 neutralises heparin), otherwise 4 h.'],
      ref: { u: ['seconds', ''], r: [['aPTT', '25–35 s (reagent specific)', ''], ['Therapeutic UFH', '1.5–2.5 × control', '']] },
      hi: ['Heparin, haemophilia A/B, von Willebrand disease, factor XI/XII deficiency, lupus anticoagulant, DIC, liver disease.'],
      corr: ['Prolonged aPTT → mixing study: corrects = factor deficiency; does not correct = inhibitor (lupus anticoagulant, factor VIII inhibitor).', 'Isolated aPTT ↑ with thrombosis history → lupus anticoagulant (antiphospholipid syndrome).'],
      hx: ['Heparin therapy, bleeding after surgery/dental extraction, recurrent miscarriage (APS).'], crit: 'aPTT > 100 s (not on heparin)'
    },
    {
      id: 'ddimer', n: 'D-Dimer', aka: 'd dimer ddimer dvt pe dic fibrin', dept: 'Coagulation', cat: 'Coagulation', sp: 'Citrated plasma', tube: 'blue', vol: 'Fill to the line',
      time: 'Any time; collect before anticoagulation where possible.', pre: ['Avoid traumatic draws and haemolysis.'], proc: ['Stable 8 h at room temperature; freeze if delayed.'],
      ref: { u: ['µg/mL FEU', 'ng/mL FEU'], r: [['Adult < 50 y', '< 0.50', '< 500'], ['Age-adjusted cut-off > 50 y', 'age × 0.01', 'age × 10']] },
      hi: ['DVT, pulmonary embolism, DIC, surgery/trauma, infection, malignancy, pregnancy, COVID-19, old age.'],
      corr: ['High negative predictive value: a normal D-dimer with low clinical probability (Wells) helps exclude VTE.', 'DIC panel: platelets ↓, PT ↑, fibrinogen ↓, D-dimer ↑↑.']
    },

    /* ===================== BIOCHEMISTRY ===================== */
    {
      id: 'glucose', n: 'Blood Glucose (FBS / RBS / PPBS / OGTT)', aka: 'glucose sugar fbs rbs ppbs 2hpp ogtt diabetes gtt', dept: 'Biochemistry', cat: 'Diabetes', sp: 'Fluoride plasma (preferred) or serum separated within 30 min', tube: 'grey', vol: '2 mL',
      time: 'Fasting: 8–12 h overnight fast (water allowed). PPBS: exactly 2 h after the start of a meal. OGTT: morning after 8–14 h fast, 3 days of normal carbohydrate diet.',
      pre: ['Glycolysis lowers glucose ~5–7 %/hour in un-separated blood — use fluoride or separate serum within 30 min.', 'No smoking, exercise or tea/coffee during OGTT.', 'OGTT: 75 g anhydrous glucose in 250–300 mL water drunk within 5 min (children 1.75 g/kg, max 75 g).', 'Do not perform OGTT if fasting glucose already ≥ 126 mg/dL or during acute illness.'],
      proc: ['Fluoride plasma stable 24 h at room temperature, 3 days at 4 °C.', 'Capillary (glucometer) values are ~10–15 % higher than venous after a meal.'],
      ref: { u: ['mg/dL', 'mmol/L'], r: [['Fasting — normal', '70–99', '3.9–5.5'], ['Fasting — impaired (IFG)', '100–125', '5.6–6.9'], ['Fasting — diabetes', '≥ 126', '≥ 7.0'], ['2-h OGTT — normal', '< 140', '< 7.8'], ['2-h OGTT — IGT', '140–199', '7.8–11.0'], ['2-h OGTT / random — diabetes', '≥ 200', '≥ 11.1'], ['GDM (75 g, IADPSG): F / 1 h / 2 h', '≥ 92 / ≥ 180 / ≥ 153', '≥ 5.1 / ≥ 10.0 / ≥ 8.5'], ['Newborn', '40–60', '2.2–3.3']] },
      hi: ['Diabetes mellitus, stress (MI, sepsis, trauma), steroids, thiazides, Cushing’s, pancreatitis, IV dextrose.'], lo: ['Insulin / sulfonylurea excess, prolonged fasting, alcohol, liver failure, adrenal insufficiency, insulinoma, delayed separation (artefact).'],
      corr: ['Confirm diabetes with HbA1c or repeat fasting glucose.', 'Glucose with ketones / bicarbonate ↓ → DKA; very high glucose + osmolality > 320 → HHS.', 'Correct Na for hyperglycaemia: + 1.6 mmol/L Na per 100 mg/dL glucose above 100.'],
      hx: ['Known diabetes and current medicines (insulin dose timing), steroid therapy, pregnancy week (GDM screening 24–28 wk).', 'Symptoms: polyuria, polydipsia, weight loss, hypoglycaemia episodes.'], crit: '< 40 mg/dL (2.2 mmol/L) or > 450 mg/dL (25 mmol/L)',
      int: ['IV dextrose contamination, delayed separation (falsely low), haematocrit extremes on glucometers.']
    },
    {
      id: 'hba1c', n: 'HbA1c (Glycated Haemoglobin)', aka: 'hba1c a1c glycated glycosylated hemoglobin diabetes eag', dept: 'Biochemistry', cat: 'Diabetes', sp: 'Whole blood', tube: 'lav', vol: '2 mL',
      time: 'Any time, no fasting. Reflects average glucose over the previous 2–3 months; repeat every 3 months if not at goal.',
      pre: ['Not valid after recent transfusion, acute blood loss or in haemolytic anaemia.', 'Haemoglobin variants (HbS, HbE, HbF) may interfere — use an unaffected method or fructosamine.'], proc: ['Stable 7 days at 4 °C in EDTA.', 'Use an NGSP-certified, IFCC-traceable method (HPLC / immunoassay / enzymatic).'],
      ref: { u: ['% (NGSP)', 'mmol/mol (IFCC)'], r: [['Normal', '< 5.7', '< 39'], ['Prediabetes', '5.7–6.4', '39–46'], ['Diabetes', '≥ 6.5', '≥ 48'], ['Treatment goal (most adults)', '< 7.0', '< 53']] },
      hi: ['Uncontrolled diabetes; falsely high: iron deficiency anaemia, splenectomy, alcoholism, uraemia (carbamylated Hb).'], lo: ['Falsely low: haemolysis, blood loss, transfusion, pregnancy, CKD on EPO, haemoglobinopathy.'],
      corr: ['eAG (mg/dL) = 28.7 × HbA1c − 46.7.', 'IFCC (mmol/mol) = (NGSP % − 2.15) × 10.929.', 'Discordant HbA1c and glucose → check Hb variants, anaemia, use fructosamine.'],
      hx: ['Diabetes duration and medicines, recent transfusion, anaemia, CKD, pregnancy.']
    },
    {
      id: 'renal', n: 'Urea, BUN & Creatinine (Renal Function)', aka: 'urea bun creatinine rft kft renal kidney function egfr', dept: 'Biochemistry', cat: 'Renal', sp: 'Serum or heparin plasma', tube: 'gold', vol: '3 mL',
      time: 'Any time; avoid heavy meat meal (raises creatinine up to 30 %) and strenuous exercise 24 h before.',
      pre: ['Note age, sex and weight — needed for eGFR / creatinine clearance.', 'Haemolysis interferes with Jaffe creatinine.'], proc: ['Separate within 2 h; stable 7 days at 4 °C.', 'Jaffe (alkaline picrate) vs enzymatic creatinine — enzymatic has fewer interferences (bilirubin, ketones, cephalosporins).'],
      ref: { u: ['mg/dL', 'µmol/L or mmol/L'], r: [['Urea', '15–45 mg/dL', '2.5–7.5 mmol/L'], ['BUN', '7–21 mg/dL', '2.5–7.5 mmol/L'], ['Creatinine — adult male', '0.7–1.3 mg/dL', '62–115 µmol/L'], ['Creatinine — adult female', '0.6–1.1 mg/dL', '53–97 µmol/L'], ['Creatinine — child 1–12 y', '0.3–0.7 mg/dL', '27–62 µmol/L'], ['Creatinine — newborn', '0.3–1.0 mg/dL (falls in week 1)', '27–88 µmol/L'], ['BUN : creatinine ratio', '10–20', '—'], ['eGFR (CKD-EPI 2021)', '> 90 mL/min/1.73 m²', '—']] },
      hi: ['Acute kidney injury, CKD, dehydration, heart failure, shock, urinary obstruction.', 'Urea ↑ alone: GI bleed, high-protein diet, steroids, catabolism.', 'Creatinine ↑ alone: muscle mass, creatine supplements, trimethoprim/cimetidine (block secretion).'], lo: ['Urea ↓: liver failure, low-protein diet, pregnancy, SIADH.', 'Creatinine ↓: low muscle mass, elderly, pregnancy.'],
      corr: ['BUN:Cr > 20 → pre-renal (dehydration, heart failure, GI bleed); 10–20 with both high → intrinsic renal; < 10 → liver disease, low protein.', 'CKD staging (KDIGO): G1 ≥ 90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 < 15 mL/min/1.73 m² — combine with urine ACR.', 'Rising creatinine ≥ 0.3 mg/dL in 48 h or ≥ 1.5× baseline = AKI.', 'High K⁺, low HCO₃⁻, high phosphate and anaemia accompany advanced CKD.'],
      hx: ['Diabetes, hypertension (commonest CKD causes); known CKD stage; dialysis (pre- vs post-dialysis sample — record timing!).', 'Recent contrast, NSAIDs, aminoglycosides, ACE-i/ARB start.', 'Vomiting/diarrhoea, reduced urine output, kidney stones, prostate enlargement.'], crit: 'Creatinine > 7 mg/dL (new) · Urea > 200 mg/dL'
    },
    {
      id: 'lyte', n: 'Serum Electrolytes (Na, K, Cl, HCO₃)', aka: 'electrolytes sodium potassium chloride bicarbonate na k cl ise anion gap', dept: 'Biochemistry', cat: 'Electrolytes', sp: 'Serum or lithium-heparin plasma', tube: 'gold', vol: '3 mL',
      time: 'Any time.',
      pre: ['Do not draw above an IV line — dilution / contamination.', 'Avoid fist clenching and prolonged tourniquet (K⁺ rises 1–2 mmol/L).', 'Never pour EDTA blood into another tube — EDTA-K₂ contamination: very high K⁺ with very low Ca²⁺.', 'Fill tube to minimise HCO₃⁻ loss (air exposure).'],
      proc: ['Separate within 1 h — K⁺ leaks from cells (and falls if refrigerated whole blood).', 'Reject or flag haemolysed samples for K⁺ (falsely high).', 'Indirect ISE gives falsely low Na with severe hyperlipidaemia / hyperproteinaemia (pseudohyponatraemia) — use direct ISE / blood gas.'],
      ref: { u: ['mEq/L', 'mmol/L'], r: [['Sodium', '136–145', '136–145'], ['Potassium (serum)', '3.5–5.1', '3.5–5.1'], ['Potassium — newborn', '3.7–5.9', '3.7–5.9'], ['Chloride', '98–107', '98–107'], ['Bicarbonate', '22–29', '22–29'], ['Anion gap (Na − Cl − HCO₃)', '8–16', '8–16']] },
      hi: ['Na ↑: dehydration, diabetes insipidus, hypertonic saline.', 'K ↑: CKD, ACE-i/ARB/spironolactone, acidosis, Addison’s, rhabdomyolysis — and haemolysis/delayed separation (artefact).', 'Anion gap ↑: DKA, lactic acidosis, renal failure, toxins (methanol, ethylene glycol, salicylate).'], lo: ['Na ↓: diuretics, SIADH, heart failure, cirrhosis, vomiting/diarrhoea, hypothyroidism, adrenal insufficiency.', 'K ↓: diuretics, vomiting, diarrhoea, insulin/β-agonists, alkalosis, hyperaldosteronism.'],
      corr: ['Hyponatraemia work-up: serum osmolality, urine Na and osmolality, glucose (true vs pseudo/hypertonic), TSH, cortisol.', 'K ↑ with normal ECG and haemolysed sample → recollect before treating.', 'Low HCO₃ with normal anion gap → diarrhoea, renal tubular acidosis.'],
      hx: ['Diuretics, ACE-i, potassium supplements, laxatives; vomiting/diarrhoea; CKD / dialysis; DKA; IV fluids being given.'], crit: 'Na < 120 or > 160 · K < 2.8 or > 6.2 · HCO₃ < 10 or > 40 mmol/L'
    },
    {
      id: 'ca', n: 'Calcium, Phosphorus & Magnesium', aka: 'calcium ca phosphate phosphorus po4 magnesium mg bone mineral corrected calcium', dept: 'Biochemistry', cat: 'Bone & minerals', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Fasting morning sample preferred for phosphate (diurnal and meal variation).', pre: ['Minimal tourniquet — stasis raises total calcium.', 'Never use EDTA/citrate/oxalate tubes (chelate calcium).', 'Haemolysis raises phosphate and magnesium.'], proc: ['Separate promptly; phosphate rises in un-separated blood.'],
      ref: { u: ['mg/dL', 'mmol/L'], r: [['Total calcium', '8.6–10.2', '2.15–2.55'], ['Ionised calcium', '4.6–5.3', '1.15–1.33'], ['Phosphorus — adult', '2.5–4.5', '0.81–1.45'], ['Phosphorus — child', '4.0–7.0', '1.29–2.26'], ['Magnesium', '1.7–2.4', '0.70–1.00']] },
      hi: ['Ca ↑: primary hyperparathyroidism, malignancy, vitamin D excess, sarcoidosis, thiazides, immobilisation.', 'PO₄ ↑: CKD, hypoparathyroidism, rhabdomyolysis, tumour lysis.', 'Mg ↑: renal failure, antacids/Mg infusion.'], lo: ['Ca ↓: hypoalbuminaemia (check corrected Ca), vitamin D deficiency, CKD, hypoparathyroidism, pancreatitis, low Mg.', 'PO₄ ↓: refeeding, alcoholism, hyperparathyroidism, DKA treatment.', 'Mg ↓: diuretics, PPIs, alcoholism, diarrhoea.'],
      corr: ['Corrected Ca (mg/dL) = total Ca + 0.8 × (4.0 − albumin g/dL).', 'High Ca + high/normal PTH → primary hyperparathyroidism; high Ca + suppressed PTH → malignancy / vitamin D.', 'Low Ca resistant to treatment → check magnesium.'],
      hx: ['Bone pain, renal stones, malignancy, CKD/dialysis, vitamin D or calcium supplements, thyroid/parathyroid surgery.'], crit: 'Ca < 6.5 or > 13 mg/dL · PO₄ < 1.0 mg/dL · Mg < 1.0 or > 4.9 mg/dL'
    },
    {
      id: 'lipid', n: 'Lipid Profile', aka: 'lipid cholesterol triglyceride tg hdl ldl vldl non-hdl', dept: 'Biochemistry', cat: 'Cardiac & lipids', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: '9–12 h fast for triglycerides (water allowed). Non-fasting is acceptable for screening total/HDL/non-HDL cholesterol.',
      pre: ['No alcohol 24 h before; maintain usual diet 2 weeks before.', 'Avoid testing within 6 weeks of MI, surgery, acute illness (lipids fall).', 'Seated 5 min before draw; prolonged tourniquet raises cholesterol.'], proc: ['Stable 5–7 days at 4 °C.', 'Friedewald LDL = TC − HDL − TG/5 (mg/dL) — invalid if TG ≥ 400; use direct LDL or Sampson/Martin equation.'],
      ref: { u: ['mg/dL', 'mmol/L'], r: [['Total cholesterol — desirable', '< 200', '< 5.2'], ['LDL — optimal', '< 100', '< 2.6'], ['LDL — high', '≥ 160', '≥ 4.1'], ['HDL — low (risk)', '< 40 M / < 50 F', '< 1.0 M / < 1.3 F'], ['Triglycerides — normal', '< 150', '< 1.7'], ['Triglycerides — very high', '≥ 500', '≥ 5.6'], ['Non-HDL cholesterol', '< 130', '< 3.4']] },
      hi: ['Familial hypercholesterolaemia, hypothyroidism, nephrotic syndrome, diabetes, obesity, cholestasis, pregnancy, drugs (steroids, thiazides, retinoids).', 'TG ↑: diabetes, alcohol, obesity, CKD, non-fasting sample.'], lo: ['Malnutrition, hyperthyroidism, liver failure, acute illness, statin therapy.'],
      corr: ['TG > 1000 mg/dL → pancreatitis risk; sample will be lipaemic (interferes with other tests — ultracentrifuge/clear).', 'High LDL → check TSH, fasting glucose, urine protein (secondary causes).', 'Cholesterol conversion: mg/dL × 0.02586 = mmol/L; TG mg/dL × 0.01129 = mmol/L.'],
      hx: ['Diabetes, hypertension, smoking, family history of premature CAD, statin / fibrate therapy and dose, thyroid disease.']
    },
    {
      id: 'lft', n: 'Liver Function Tests (LFT)', aka: 'lft liver bilirubin alt sgpt ast sgot alp ggt albumin protein jaundice hepatitis', dept: 'Biochemistry', cat: 'Liver', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Morning, ideally 8–12 h fasting (meals raise ALP in blood groups O/B; lipaemia interferes).',
      pre: ['Protect from light — bilirubin falls ~30–50 % per hour in direct sunlight (wrap tube in foil, especially neonatal).', 'Avoid haemolysis — raises AST, LDH, falsely affects bilirubin.', 'Avoid strenuous exercise 24 h before (AST/CK rise).'], proc: ['Separate within 2 h; stable 3 days at 4 °C (bilirubin protected from light).'],
      ref: { u: ['conventional', 'SI'], r: [['Total bilirubin', '0.3–1.2 mg/dL', '5–21 µmol/L'], ['Direct bilirubin', '0.0–0.3 mg/dL', '0–5 µmol/L'], ['ALT', '< 50 U/L M · < 35 U/L F', 'same'], ['AST', '< 50 U/L M · < 35 U/L F', 'same'], ['ALP — adult', '30–120 U/L', 'same'], ['ALP — child/adolescent', 'up to 400–500 U/L (bone growth)', 'same'], ['GGT', '< 55 U/L M · < 38 U/L F', 'same'], ['Total protein', '6.4–8.3 g/dL', '64–83 g/L'], ['Albumin', '3.5–5.2 g/dL', '35–52 g/L'], ['Neonatal bilirubin', 'Use age-in-hours nomogram (Bhutani)', '—']] },
      hi: ['ALT/AST ≫ ALP: viral/drug/ischaemic hepatitis (ALT > 1000 → acute viral, paracetamol, ischaemia).', 'ALP + GGT ≫ ALT: cholestasis — stones, tumour, PBC/PSC, drugs.', 'ALP ↑ with normal GGT: bone (growth, Paget’s, metastases), pregnancy (placental).', 'Indirect bilirubin ↑: haemolysis, Gilbert’s, neonatal jaundice.'], lo: ['Albumin ↓: chronic liver disease, nephrotic syndrome, malnutrition, inflammation, protein-losing enteropathy.'],
      corr: ['AST:ALT > 2 with GGT ↑ → alcoholic liver disease.', 'Low albumin + prolonged INR → poor synthetic function (cirrhosis).', 'Globulin ↑ (A:G < 1) → chronic infection, autoimmune hepatitis, myeloma.', 'Raised bilirubin with high LDH, low haptoglobin, retics ↑ → haemolysis.'],
      hx: ['Alcohol intake, hepatitis B/C status, recent drugs (paracetamol, anti-TB, statins, herbal), jaundice, pregnancy, obesity (NAFLD).'], crit: 'Neonatal total bilirubin above phototherapy/exchange threshold; adult bilirubin > 15 mg/dL'
    },
    {
      id: 'cardiac', n: 'Cardiac Markers (Troponin, CK-MB, CK, LDH, NT-proBNP)', aka: 'troponin ctni ctnt hs-troponin ckmb ck cpk ldh bnp nt-probnp mi heart attack', dept: 'Biochemistry', cat: 'Cardiac & lipids', sp: 'Serum or heparin plasma (per kit)', tube: 'green', vol: '3 mL',
      time: 'At presentation and repeat at 1–3 h (hs-troponin) or 3–6 h (conventional) per local ACS protocol. Record exact time of collection and of chest-pain onset.',
      pre: ['Avoid haemolysis (raises troponin on some assays, CK, LDH).', 'Use the same assay for serial samples.'], proc: ['Analyse immediately — STAT test (target TAT < 60 min).', 'Re-centrifuge heparin plasma if fibrin strands (false positives).'],
      ref: { u: ['typical', ''], r: [['hs-Troponin I', '< 99th percentile (e.g. < 26 ng/L — kit specific)', ''], ['Troponin I (conventional)', '< 0.04 ng/mL', ''], ['CK-MB', '< 25 U/L (activity) / < 5 ng/mL (mass)', ''], ['CK total', '39–308 U/L M · 26–192 U/L F', ''], ['LDH', '125–220 U/L', ''], ['NT-proBNP (rule-out HF, acute)', '< 300 pg/mL', '']] },
      hi: ['Troponin ↑: MI, myocarditis, PE, heart failure, sepsis, CKD (chronic stable elevation), cardiac contusion.', 'CK ↑: MI, muscle injury, IM injection, rhabdomyolysis, hypothyroidism, statins, exercise.', 'NT-proBNP ↑: heart failure, renal failure, age, AF.'],
      corr: ['MI: rise and/or fall of troponin with at least one value > 99th percentile + clinical/ECG evidence.', 'CK-MB/CK ratio > 6 % suggests cardiac source.', 'Troponin peaks 12–48 h, stays raised 7–14 days; CK-MB returns to normal in 48–72 h (useful for re-infarction).'],
      hx: ['Chest-pain onset time, ECG changes, CKD, recent exercise/trauma/IM injections, statins.'], crit: 'Troponin above the MI decision limit (first time positive)'
    },
    {
      id: 'amylase', n: 'Amylase & Lipase', aka: 'amylase lipase pancreas pancreatitis', dept: 'Biochemistry', cat: 'Pancreas', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'At presentation with abdominal pain.', pre: ['Avoid lipaemic samples (lipase method interference).'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['U/L', ''], r: [['Amylase', '28–100', ''], ['Lipase', '13–60', '']] },
      hi: ['Acute pancreatitis (> 3× ULN), pancreatic duct obstruction, perforated ulcer, bowel ischaemia, renal failure, macroamylasaemia (amylase only), mumps/salivary (amylase).'],
      corr: ['Lipase is more specific and stays elevated longer (8–14 days) than amylase (3–5 days).', 'Pancreatitis with high TG (> 1000) or high Ca — check both as causes.'],
      hx: ['Alcohol, gallstones, high triglycerides, recent ERCP, drugs (azathioprine, valproate).']
    },
    {
      id: 'iron', n: 'Iron Studies (Iron, TIBC, Transferrin Sat., Ferritin)', aka: 'iron tibc uibc ferritin transferrin saturation anaemia ida', dept: 'Biochemistry', cat: 'Anaemia', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Morning, fasting (serum iron has diurnal variation — highest in morning). Stop iron supplements 24 h before.', pre: ['Avoid haemolysis (RBC iron contamination).'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['µg/dL / ng/mL', 'µmol/L / µg/L'], r: [['Serum iron', '65–175 M · 50–170 F µg/dL', '11.6–31.3 M · 9–30.4 F µmol/L'], ['TIBC', '250–450 µg/dL', '45–81 µmol/L'], ['Transferrin saturation', '20–50 %', '0.20–0.50'], ['Ferritin', '30–400 M · 13–150 F ng/mL', 'same in µg/L']] },
      hi: ['Ferritin ↑: iron overload (haemochromatosis, transfusions), inflammation, infection, liver disease, malignancy (acute-phase reactant).'], lo: ['Iron deficiency: ferritin ↓, iron ↓, TIBC ↑, saturation < 20 %.'],
      corr: ['Anaemia of chronic disease: iron ↓, TIBC ↓/normal, ferritin normal/↑.', 'Ferritin < 30 ng/mL confirms iron deficiency; with high CRP use cut-off < 100.', 'Saturation > 45 % repeatedly → screen for haemochromatosis.'],
      hx: ['Iron tablets or injections, transfusions, menstrual loss, GI symptoms, pregnancy, CKD, chronic inflammation.']
    },
    {
      id: 'crp', n: 'C-Reactive Protein (CRP / hs-CRP)', aka: 'crp hscrp c reactive protein inflammation', dept: 'Biochemistry', cat: 'Inflammation', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time; hs-CRP for cardiac risk when the patient is well (not within 2 weeks of infection).', pre: ['None special.'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['mg/L', ''], r: [['CRP', '< 5', ''], ['hs-CRP low cardiovascular risk', '< 1.0', ''], ['hs-CRP high risk', '> 3.0', '']] },
      hi: ['Bacterial infection (often > 100), inflammation, trauma, surgery, autoimmune flares, MI.'],
      corr: ['CRP rises within 6–8 h and halves every ~19 h — good for monitoring treatment.', 'Viral infections usually raise CRP modestly (< 50).', 'With procalcitonin > 0.5 ng/mL → bacterial sepsis more likely.']
    },
    {
      id: 'uric', n: 'Uric Acid', aka: 'uric acid urate gout', dept: 'Biochemistry', cat: 'Renal', sp: 'Serum', tube: 'gold', vol: '2 mL', time: 'Fasting morning; avoid high-purine meal and alcohol the day before.',
      pre: ['Rasburicase therapy: collect on ice and analyse immediately (enzyme continues to degrade urate in the tube).'], proc: ['Stable 3–5 days at 4 °C.'],
      ref: { u: ['mg/dL', 'µmol/L'], r: [['Male', '3.5–7.2', '208–428'], ['Female', '2.6–6.0', '155–357'], ['Gout treatment target', '< 6.0', '< 357']] },
      hi: ['Gout, CKD, tumour lysis, chemotherapy, diuretics, alcohol, high-purine diet, pre-eclampsia, psoriasis.'], lo: ['Allopurinol/febuxostat, SIADH, Fanconi syndrome, Wilson’s disease.'],
      corr: ['Tumour-lysis syndrome: urate ↑, K ↑, PO₄ ↑, Ca ↓, creatinine ↑.', 'In pregnancy rising urate supports pre-eclampsia.'], hx: ['Joint pain (big toe), kidney stones, chemotherapy, diuretics, alcohol.']
    },
    {
      id: 'ammonia', n: 'Ammonia', aka: 'ammonia nh3 hepatic encephalopathy', dept: 'Biochemistry', cat: 'Liver', sp: 'EDTA or heparin plasma (not ammonium heparin)', tube: 'lav', vol: '2 mL, full tube',
      time: 'Patient resting, no smoking for several hours (smoking raises ammonia).', pre: ['Free-flowing draw without tourniquet stasis or fist clenching.', 'Place on ice immediately, cap tightly; transport within 15 min.', 'Avoid haemolysis (RBCs contain ammonia).'], proc: ['Centrifuge cold and analyse within 30 min; plasma stable 3 h at 4 °C, longer only if frozen.'],
      ref: { u: ['µg/dL', 'µmol/L'], r: [['Adult', '15–45', '11–32'], ['Newborn', '< 150', '< 110']] },
      hi: ['Hepatic encephalopathy, Reye’s syndrome, urea-cycle disorders, valproate, GI bleed in cirrhosis — and delayed / warm samples (artefact).'],
      corr: ['Correlate with clinical encephalopathy; level does not correlate well with grade.'], crit: '> 100 µmol/L (adult) · > 150 µmol/L (neonate)'
    },
    {
      id: 'lactate', n: 'Lactate', aka: 'lactate lactic acid sepsis', dept: 'Biochemistry', cat: 'Critical care', sp: 'Fluoride plasma (or blood-gas syringe)', tube: 'grey', vol: '2 mL',
      time: 'At presentation of sepsis/shock and repeat within 2–4 h.', pre: ['No tourniquet or release immediately; no fist clenching.', 'Transport on ice; analyse within 15 min (non-fluoride) or 2 h (fluoride on ice).'], proc: ['Glycolysis raises lactate in standing blood.'],
      ref: { u: ['mmol/L', 'mg/dL'], r: [['Venous', '0.5–2.2', '4.5–19.8']] },
      hi: ['Sepsis/septic shock (> 2, > 4 = high mortality), hypoperfusion, seizures, metformin, liver failure, thiamine deficiency.'], corr: ['Lactate clearance ≥ 10 % in 2 h indicates response to resuscitation.', 'High anion gap metabolic acidosis — check lactate first.'], crit: '> 4 mmol/L'
    },
    {
      id: 'uacr', n: 'Urine Albumin / Creatinine Ratio (ACR) & 24-h Protein', aka: 'acr microalbumin urine albumin pcr 24 hour protein proteinuria', dept: 'Biochemistry', cat: 'Renal', sp: 'First-morning urine (ACR) / 24-hour urine (protein)', tube: 'urine', vol: '10–20 mL spot; complete 24-h collection',
      time: 'First-morning void preferred for ACR. 24-h: discard first morning void, collect all urine for 24 h including next morning’s first void.',
      pre: ['Avoid testing during UTI, fever, menstruation, after vigorous exercise or with uncontrolled glucose — transiently raise albumin.', 'Confirm a raised ACR on 2 of 3 samples over 3–6 months.', '24-h: keep container refrigerated; record total volume and times.'], proc: ['Stable 7 days at 4 °C; do not freeze for some immunoassays (check kit).'],
      ref: { u: ['mg/g', 'mg/mmol'], r: [['ACR — normal (A1)', '< 30', '< 3'], ['ACR — moderately increased (A2)', '30–300', '3–30'], ['ACR — severely increased (A3)', '> 300', '> 30'], ['24-h urine protein', '< 150 mg/day', '< 0.15 g/day'], ['Nephrotic range', '> 3.5 g/day', '> 3.5 g/day']] },
      corr: ['Diabetic and hypertensive patients: annual ACR screening.', 'Adequacy of 24-h collection: creatinine excretion ~15–20 mg/kg/day (F) and 20–25 mg/kg/day (M).'], hx: ['Diabetes, hypertension, CKD, ACE-i/ARB therapy, recent UTI or exercise.']
    },

    /* ===================== ENDOCRINOLOGY ===================== */
    {
      id: 'thyroid', n: 'Thyroid Function (TSH, FT4, FT3)', aka: 'thyroid tsh ft4 ft3 t3 t4 hypothyroid hyperthyroid', dept: 'Endocrinology', cat: 'Thyroid', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Morning sample preferred (TSH highest at night, lowest afternoon). On levothyroxine: collect before the daily dose; recheck 6–8 weeks after a dose change.',
      pre: ['Biotin supplements (> 5 mg/day) interfere with streptavidin immunoassays — stop 48–72 h before.', 'Note pregnancy and trimester (trimester-specific ranges).', 'Amiodarone, steroids, dopamine, heparin and acute illness affect results.'], proc: ['Stable 7 days at 4 °C; freeze for longer.'],
      ref: { u: ['conventional', 'SI'], r: [['TSH — adult', '0.27–4.20 µIU/mL', '0.27–4.20 mIU/L'], ['TSH — 1st trimester', '0.1–2.5 µIU/mL', 'same'], ['TSH — newborn (day 3–5)', '< 10–15 µIU/mL', 'same'], ['Free T4', '0.93–1.70 ng/dL', '12–22 pmol/L'], ['Free T3', '2.0–4.4 pg/mL', '3.1–6.8 pmol/L'], ['Total T4', '5.1–14.1 µg/dL', '66–181 nmol/L'], ['Total T3', '80–200 ng/dL', '1.2–3.1 nmol/L']] },
      hi: ['TSH ↑: primary hypothyroidism (Hashimoto’s), iodine deficiency, recovery phase of illness, under-replacement, amiodarone/lithium.', 'FT4 ↑: Graves’, toxic nodule, thyroiditis (early), excess levothyroxine.'], lo: ['TSH ↓: hyperthyroidism, over-replacement, pituitary failure, first trimester (hCG), steroids/dopamine.', 'FT4 ↓: hypothyroidism, central hypothyroidism (low/normal TSH).'],
      corr: ['High TSH + low FT4 → overt primary hypothyroidism; high TSH + normal FT4 → subclinical (repeat + anti-TPO).', 'Low TSH + high FT4/FT3 → hyperthyroidism; low TSH + normal FT4 + high FT3 → T3 toxicosis.', 'Low TSH + low FT4 → pituitary disease or sick euthyroid — check cortisol.', 'Hypothyroidism raises cholesterol, CK, prolactin; may cause hyponatraemia and macrocytosis.'],
      hx: ['Levothyroxine / carbimazole dose and timing, pregnancy, thyroid surgery or radio-iodine, amiodarone/lithium, biotin, weight change, palpitations, goitre.'], crit: 'TSH > 100 µIU/mL or FT4 very high with symptoms (thyroid storm)',
      int: ['Biotin, heterophile antibodies, macro-TSH, anti-T4 antibodies.']
    },
    {
      id: 'repro', n: 'Reproductive Hormones (FSH, LH, Prolactin, E2, Progesterone, AMH, Testosterone)', aka: 'fsh lh prolactin estradiol e2 progesterone amh testosterone fertility pcos infertility', dept: 'Endocrinology', cat: 'Fertility', sp: 'Serum', tube: 'gold', vol: '3–5 mL',
      time: 'FSH/LH/E2: day 2–5 of the cycle (early follicular). Progesterone: day 21 of a 28-day cycle (7 days before expected period) to confirm ovulation. Prolactin: 2–3 h after waking, rested, no breast stimulation. Testosterone: 7–10 AM (diurnal), repeat to confirm low. AMH: any day.',
      pre: ['Record LMP, cycle day, pregnancy status, hormonal contraception / HRT.', 'Prolactin rises with stress, sleep, exercise, venepuncture stress — repeat if mildly raised.', 'Biotin interference — stop 48–72 h before.'], proc: ['Stable 3–7 days at 4 °C; freeze for longer.'],
      ref: { u: ['conventional', 'note'], r: [['FSH — follicular', '3.5–12.5 mIU/mL', 'post-menopause 25.8–134.8'], ['LH — follicular', '2.4–12.6 mIU/mL', 'mid-cycle peak 14–96'], ['Prolactin', 'F 4.8–23.3 · M 4.0–15.2 ng/mL', '× 21.2 = mIU/L'], ['Estradiol — follicular', '12.5–166 pg/mL', '× 3.67 = pmol/L'], ['Progesterone — mid-luteal', '> 3 ng/mL confirms ovulation', '× 3.18 = nmol/L'], ['AMH', '1.0–4.0 ng/mL (age dependent)', '× 7.14 = pmol/L'], ['Testosterone — male', '249–836 ng/dL', '8.6–29 nmol/L'], ['Testosterone — female', '8–60 ng/dL', '0.3–2.1 nmol/L']] },
      corr: ['High FSH (> 25) with low E2 → ovarian failure / menopause.', 'LH:FSH > 2, high testosterone, high AMH → PCOS (with clinical/ultrasound criteria).', 'Prolactin > 100 ng/mL → prolactinoma likely; moderate rise → drugs (antipsychotics, metoclopramide), hypothyroidism, macroprolactin (check PEG precipitation).', 'Low testosterone with low/normal LH → secondary hypogonadism (check prolactin).'],
      hx: ['Cycle regularity, LMP, infertility duration, hirsutism, galactorrhoea, drugs (antipsychotics, OCP, steroids, anabolic agents).']
    },
    {
      id: 'cortisol', n: 'Cortisol', aka: 'cortisol cushing addison adrenal', dept: 'Endocrinology', cat: 'Adrenal', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: '8–9 AM (peak) for suspected adrenal insufficiency; midnight sample or 1 mg overnight dexamethasone suppression test for Cushing’s (dexamethasone at 11 PM, cortisol at 8 AM).',
      pre: ['Record exact time of collection.', 'Oral contraceptives / pregnancy raise cortisol-binding globulin → higher total cortisol.', 'Steroid medicines (prednisolone cross-reacts in immunoassays; hydrocortisone measured).'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['µg/dL', 'nmol/L'], r: [['Morning (8 AM)', '6.2–19.4', '171–536'], ['Afternoon (4 PM)', '2.3–11.9', '64–327'], ['After 1 mg dexamethasone', '< 1.8', '< 50']] },
      hi: ['Cushing’s syndrome, stress, acute illness, depression, alcohol, pregnancy, OCP.'], lo: ['Addison’s disease, pituitary failure, abrupt steroid withdrawal.'],
      corr: ['Morning cortisol < 3 µg/dL strongly suggests adrenal insufficiency; > 15 µg/dL makes it unlikely — otherwise do a synacthen test.', 'Low Na + high K + low cortisol → primary adrenal insufficiency.'], hx: ['Steroid use (oral, inhaled, topical), fatigue, weight loss, hypotension, pigmentation, hypertension, central obesity, striae.']
    },
    {
      id: 'bhcg', n: 'β-hCG (Pregnancy test)', aka: 'bhcg beta hcg pregnancy upt urine pregnancy ectopic', dept: 'Endocrinology', cat: 'Pregnancy', sp: 'Serum (quantitative) / first-morning urine (qualitative)', tube: 'gold', vol: '3 mL serum / 10 mL urine',
      time: 'Urine: first-morning void (most concentrated). Serial serum: 48 h apart.', pre: ['Very dilute urine can give false negatives early in pregnancy.', 'Record LMP and gestational age.'], proc: ['Stable 3 days at 4 °C.'],
      ref: { u: ['mIU/mL', 'IU/L'], r: [['Non-pregnant', '< 5', '< 5'], ['3–4 weeks from LMP', '9–130', 'same'], ['5–6 weeks', '850–20 800', 'same'], ['7–12 weeks (peak)', '11 500–289 000', 'same']] },
      corr: ['Normal early pregnancy: hCG rises ≥ 35–50 % (usually doubles) every 48 h.', 'Plateauing / slow rise → ectopic or failing pregnancy (correlate with transvaginal ultrasound; discriminatory zone ~1500–3500).', 'Very high hCG → molar pregnancy, multiple pregnancy, germ-cell tumour.', 'Hook effect: very high hCG may read falsely low — dilute.'],
      hx: ['LMP, bleeding / pain (ectopic), IVF, recent miscarriage, hCG injections (fertility treatment) — false positive.']
    },
    {
      id: 'vitd', n: 'Vitamin D (25-OH), B12 & Folate', aka: 'vitamin d 25 oh d b12 cobalamin folate folic acid', dept: 'Endocrinology', cat: 'Vitamins', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Any time; B12/folate preferably fasting (food raises folate). Collect before starting supplements.', pre: ['Protect folate and B12 from light; avoid haemolysis (RBC folate raises serum folate).'], proc: ['Vitamin D stable 7 days at 4 °C.'],
      ref: { u: ['conventional', 'SI'], r: [['25-OH vitamin D — deficient', '< 20 ng/mL', '< 50 nmol/L'], ['25-OH vitamin D — insufficient', '20–29 ng/mL', '50–74 nmol/L'], ['25-OH vitamin D — sufficient', '30–100 ng/mL', '75–250 nmol/L'], ['Vitamin B12', '197–771 pg/mL', '145–569 pmol/L'], ['Folate (serum)', '> 5.4 ng/mL', '> 12.2 nmol/L']] },
      corr: ['Low vitamin D with high PTH and ALP → secondary hyperparathyroidism / osteomalacia.', 'B12 borderline (200–300) → check methylmalonic acid / homocysteine.', 'Macrocytosis + hypersegmented neutrophils → B12/folate deficiency.'], hx: ['Sun exposure, supplements and dose, malabsorption, vegan diet, metformin/PPI use (B12), pregnancy.']
    },
    {
      id: 'pth', n: 'Parathyroid Hormone (Intact PTH)', aka: 'pth parathormone parathyroid', dept: 'Endocrinology', cat: 'Bone & minerals', sp: 'EDTA plasma (more stable) or serum', tube: 'lav', vol: '3 mL',
      time: 'Morning, fasting; collect with calcium.', pre: ['Keep cold, separate within 2 h.'], proc: ['EDTA plasma stable 24–48 h at 4 °C; serum less stable — freeze if delayed.'],
      ref: { u: ['pg/mL', 'pmol/L'], r: [['Adult', '15–65', '1.6–6.9']] },
      corr: ['High Ca + high PTH → primary hyperparathyroidism.', 'Low/normal Ca + high PTH → vitamin D deficiency or CKD (secondary).', 'CKD G5 target PTH ≈ 2–9× upper limit (KDIGO).'], hx: ['CKD/dialysis, kidney stones, bone pain, vitamin D supplements, neck surgery.']
    },
    {
      id: 'insulin', n: 'Fasting Insulin, C-peptide & HOMA-IR', aka: 'insulin c-peptide homa insulin resistance', dept: 'Endocrinology', cat: 'Diabetes', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: '8–12 h fast; collect glucose at the same time (fluoride tube).', pre: ['Avoid haemolysis — insulin is degraded by RBC enzymes (reject haemolysed samples).'], proc: ['Separate within 1 h, freeze if not analysed within 24 h.'],
      ref: { u: ['µIU/mL', 'pmol/L'], r: [['Fasting insulin', '2.6–24.9', '18–173'], ['C-peptide (fasting)', '0.8–3.1 ng/mL', '0.26–1.03 nmol/L'], ['HOMA-IR', '< 2.5 (population dependent)', '—']] },
      corr: ['HOMA-IR = fasting glucose (mg/dL) × fasting insulin ÷ 405.', 'Hypoglycaemia with high insulin + low C-peptide → exogenous insulin; high both → insulinoma or sulfonylurea.'], hx: ['Diabetes treatment (insulin injections cross-react), PCOS, obesity, hypoglycaemic episodes.']
    },

    /* ===================== TUMOUR MARKERS ===================== */
    {
      id: 'psa', n: 'PSA (Total & Free)', aka: 'psa prostate specific antigen free psa', dept: 'Tumor markers', cat: 'Tumour markers', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Before DRE, prostate biopsy or cystoscopy. Wait 48 h after ejaculation / vigorous cycling, 6 weeks after biopsy or prostatitis.', pre: ['5-α-reductase inhibitors (finasteride) halve PSA — double the value for interpretation.'], proc: ['Separate within 3 h; free PSA is unstable — analyse or freeze promptly.'],
      ref: { u: ['ng/mL', ''], r: [['40–49 y', '< 2.5', ''], ['50–59 y', '< 3.5', ''], ['60–69 y', '< 4.5', ''], ['≥ 70 y', '< 6.5', ''], ['Free/total ratio (PSA 4–10)', '> 25 % benign more likely; < 10 % cancer more likely', '']] },
      hi: ['Prostate cancer, BPH, prostatitis, UTI, retention, catheterisation, recent DRE/ejaculation.'], corr: ['PSA velocity > 0.75 ng/mL/year is a warning sign.', 'After radical prostatectomy PSA should be undetectable (< 0.1).'], hx: ['Age, urinary symptoms, family history, finasteride/dutasteride, recent instrumentation.']
    },
    {
      id: 'tmark', n: 'CEA, AFP, CA-125, CA 19-9, CA 15-3', aka: 'tumor marker cea afp ca125 ca 19-9 ca15-3 cancer', dept: 'Tumor markers', cat: 'Tumour markers', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Baseline before treatment, then at regular intervals with the same method.', pre: ['Use the same laboratory/method for serial monitoring — results are not interchangeable between methods.'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['typical upper limit', ''], r: [['CEA', '< 5.0 ng/mL (smokers < 10)', ''], ['AFP', '< 7.0 ng/mL (higher in pregnancy & newborns)', ''], ['CA-125', '< 35 U/mL', ''], ['CA 19-9', '< 37 U/mL', ''], ['CA 15-3', '< 25 U/mL', '']] },
      hi: ['CEA: colorectal cancer, smoking, IBD, cirrhosis.', 'AFP: hepatocellular carcinoma, germ-cell tumours, hepatitis, pregnancy.', 'CA-125: ovarian cancer, endometriosis, menstruation, pregnancy, ascites, PID.', 'CA 19-9: pancreatic/biliary cancer, cholestasis, pancreatitis (absent in Lewis-negative individuals).'],
      corr: ['Tumour markers are for monitoring and prognosis — not stand-alone screening (except AFP in high-risk cirrhosis surveillance).'], hx: ['Known cancer and treatment stage, smoking, liver disease, menstrual/pregnancy status.']
    },

    /* ===================== CLINICAL PATHOLOGY ===================== */
    {
      id: 'urme', n: 'Urine Routine & Microscopy (R/M/E)', aka: 'urine re rme routine microscopic urinalysis pus cells dipstick', dept: 'Clinical Pathology', cat: 'Urine', sp: 'Urine — first-morning, midstream clean-catch', tube: 'urine', vol: '10–20 mL (min 10 mL for centrifugation)',
      time: 'First-morning void is most concentrated (best for protein, nitrite, casts). Examine within 2 h of collection, or refrigerate (max 24 h).',
      pre: ['Clean-catch midstream: wash hands, clean periurethral area front-to-back, discard first portion, collect midstream.', 'Avoid collection during menstruation (RBC contamination) — note on request if unavoidable.', 'Use a clean, dry, sterile container; label the container, not the lid.'],
      proc: ['Mix, perform physical exam and dipstick at room temperature.', 'Centrifuge 10 mL at 400–450 g (≈ 1500–2000 rpm) for 5 min; decant to 0.5–1 mL; examine 10 LPF and 10 HPF.', 'Unrefrigerated urine > 2 h: bacteria multiply, pH rises, casts and RBCs lyse, glucose falls.'],
      ref: { u: ['normal finding', ''], r: [['Colour / appearance', 'Pale yellow, clear', ''], ['Specific gravity', '1.005–1.030', ''], ['pH', '4.6–8.0', ''], ['Protein, glucose, ketones, bilirubin, nitrite, LE, blood', 'Negative / Nil', ''], ['Urobilinogen', 'Normal (0.2–1 mg/dL)', ''], ['Pus cells', '0–5 /HPF', ''], ['RBC', '0–2 /HPF', ''], ['Epithelial cells', 'Few (0–5 /HPF)', ''], ['Casts', 'Occasional hyaline', '']] },
      hi: ['Pus cells > 5/HPF + nitrite/LE positive → UTI (send culture).', 'RBC > 2/HPF → stones, infection, glomerulonephritis (dysmorphic RBC, RBC casts), tumour, trauma, menstruation.', 'Protein → glomerular disease, diabetes, hypertension, fever, exercise, orthostatic.', 'Glucose → diabetes (renal threshold ~180 mg/dL), pregnancy, SGLT2 inhibitors.', 'Ketones → DKA, starvation, vomiting.', 'Bilirubin → obstructive/hepatocellular jaundice; urobilinogen ↑ → haemolysis, liver disease.'],
      corr: ['Dipstick blood positive with no RBC on microscopy → haemoglobinuria or myoglobinuria (check CK).', 'Many squamous epithelial cells → contaminated sample; request repeat clean-catch.', 'Waxy/broad casts → chronic kidney disease; RBC casts → glomerulonephritis; WBC casts → pyelonephritis.', 'Persistent proteinuria → quantify with ACR/PCR.'],
      hx: ['Fever, dysuria, frequency, flank pain, diabetes, pregnancy, antibiotics already taken, menstruation, catheter, renal stones.']
    },
    {
      id: 'ucs', n: 'Urine Culture & Sensitivity', aka: 'urine culture c/s ucs uti bacteria antibiotic sensitivity', dept: 'Microbiology', cat: 'Culture', sp: 'Midstream clean-catch urine / catheter urine (from sampling port)', tube: 'urine', vol: '10–20 mL in a sterile container',
      time: 'Before starting antibiotics; first-morning sample preferred.', pre: ['Never collect from the catheter drainage bag.', 'Strict clean-catch technique; label with collection time.', 'Inoculate within 2 h, or refrigerate 4 °C (max 24 h) or use boric-acid container.'],
      proc: ['Calibrated loop (1 µL / 10 µL) onto CLED / blood + MacConkey agar; incubate 35–37 °C 18–24 h.', 'Report colony count (CFU/mL) and organism; perform AST (CLSI / EUCAST) on significant growth.'],
      ref: { u: ['interpretation', ''], r: [['No growth', 'No bacteriuria', ''], ['< 10⁴ CFU/mL', 'Not significant (MSU)', ''], ['≥ 10⁵ CFU/mL single organism', 'Significant bacteriuria', ''], ['≥ 10³ CFU/mL (catheter / symptomatic)', 'May be significant', ''], ['≥ 3 organisms', 'Contaminated — repeat sample', '']] },
      corr: ['Correlate with pyuria (pus cells > 5/HPF), nitrite and LE.', 'Sterile pyuria → TB, recent antibiotics, chlamydia, stones.'], hx: ['Antibiotics already taken, catheter, pregnancy (screen asymptomatic bacteriuria), recurrent UTI, diabetes.']
    },
    {
      id: 'srme', n: 'Stool Routine & Microscopy (R/M/E) / Occult Blood', aka: 'stool re rme ova cyst occult blood fobt fit', dept: 'Clinical Pathology', cat: 'Stool', sp: 'Fresh stool', tube: 'stool', vol: 'Pea-size (formed) or 5–10 mL (liquid)',
      time: 'Examine within 30 min for trophozoites (liquid stool), within 2 h otherwise. Parasites: 3 samples on alternate days.',
      pre: ['Avoid urine or water contamination; do not collect from the toilet bowl.', 'No barium, antacids, antidiarrhoeals or antibiotics 1 week before (parasites).', 'Guaiac FOBT: avoid red meat, vitamin C, NSAIDs 3 days before; immunochemical FIT needs no diet restriction.'],
      proc: ['Saline and iodine wet mounts; concentration (formol-ether) for low parasite loads.', 'Preserve in 10 % formalin if delay is unavoidable (not for culture).'],
      ref: { u: ['normal finding', ''], r: [['Colour / consistency', 'Brown, formed', ''], ['Mucus / blood', 'Absent', ''], ['Pus cells', 'Nil to occasional', ''], ['Ova / cysts / trophozoites', 'Not found', ''], ['Occult blood', 'Negative', ''], ['Reducing substances (infants)', 'Negative', '']] },
      corr: ['Pus cells + RBC + mucus → invasive diarrhoea (Shigella, Campylobacter, amoebiasis) — send culture.', 'Fat globules ↑ → malabsorption / pancreatic insufficiency.', 'Positive occult blood → colonoscopy evaluation (age > 45 or anaemia).'],
      hx: ['Diarrhoea duration, blood/mucus, travel, recent antibiotics (C. difficile), infant feeding (reducing substances).']
    },
    {
      id: 'csf', n: 'CSF Analysis', aka: 'csf cerebrospinal fluid lumbar puncture meningitis', dept: 'Clinical Pathology', cat: 'Body fluids', sp: 'Cerebrospinal fluid', tube: 'sterile', vol: '3–4 sterile tubes, 1–2 mL each (tube 1 chemistry, 2 microbiology, 3 cell count)',
      time: 'STAT — deliver by hand immediately; never refrigerate microbiology tube.', pre: ['Collect a simultaneous blood glucose.', 'Number tubes in order of collection (traumatic tap clears from tube 1 to 3).'], proc: ['Cell count within 1 h (cells lyse).', 'Centrifuge for Gram stain; culture at 37 °C (meningococcus is cold-sensitive).'],
      ref: { u: ['adult', ''], r: [['Appearance', 'Clear, colourless', ''], ['WBC', '0–5 /µL (lymphocytes)', ''], ['Protein', '15–45 mg/dL', ''], ['Glucose', '40–70 mg/dL (≈ 60 % of plasma)', ''], ['Opening pressure', '10–20 cm H₂O', '']] },
      corr: ['Bacterial meningitis: neutrophils ↑↑, protein ↑, glucose ↓ (CSF:plasma < 0.4).', 'Viral: lymphocytes, protein mildly ↑, glucose normal.', 'TB/fungal: lymphocytes, protein ↑↑, glucose ↓; ADA ↑.', 'Traumatic tap: subtract 1 WBC per 700 RBC.'], crit: 'Any positive Gram stain / culture; WBC with low glucose'
    },
    {
      id: 'semen', n: 'Semen Analysis (WHO 2021)', aka: 'semen analysis sperm count motility morphology infertility', dept: 'Clinical Pathology', cat: 'Body fluids', sp: 'Semen (by masturbation)', tube: 'sterile', vol: 'Complete ejaculate',
      time: '2–7 days of sexual abstinence. Collect at the lab or deliver within 1 h kept at body temperature (20–37 °C).', pre: ['Wide-mouth sterile container; no condoms (spermicide) or lubricants.', 'Report if any portion was lost (first fraction is sperm-rich).'], proc: ['Allow liquefaction 15–30 min at 37 °C; assess within 1 h.', 'Motility on a pre-warmed slide; count with improved Neubauer chamber; morphology on Papanicolaou-stained smear.', 'Two samples ≥ 1 week apart before a diagnosis.'],
      ref: { u: ['WHO 2021 lower reference limit', ''], r: [['Volume', '≥ 1.4 mL', ''], ['pH', '≥ 7.2', ''], ['Concentration', '≥ 16 million/mL', ''], ['Total sperm number', '≥ 39 million/ejaculate', ''], ['Progressive motility', '≥ 30 %', ''], ['Total motility', '≥ 42 %', ''], ['Vitality', '≥ 54 %', ''], ['Normal forms', '≥ 4 %', '']] },
      corr: ['Low volume + acidic pH + no fructose → ejaculatory duct obstruction / absent seminal vesicles.', 'Azoospermia → centrifuge and re-examine pellet; check FSH, testosterone.', 'Round cells > 1 million/mL → peroxidase stain to separate leucocytes (infection) from germ cells.'],
      hx: ['Abstinence days, fever in last 3 months, varicocele, drugs (anabolic steroids), smoking, heat exposure, previous surgery.']
    },

    /* ===================== SEROLOGY & MICROBIOLOGY ===================== */
    {
      id: 'dengue', n: 'Dengue NS1 / IgM / IgG', aka: 'dengue ns1 igm igg fever rapid', dept: 'Serology', cat: 'Fever panel', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'NS1: day 1–5 of fever. IgM: from day 4–5 (peaks ~2 weeks). IgG: secondary infection rises early (day 1–3); primary after day 10.', pre: ['Record day of fever.'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['result', ''], r: [['NS1 / IgM / IgG', 'Negative', '']] },
      corr: ['NS1 positive → acute dengue (early).', 'IgM positive / IgG negative → primary infection; IgG high early → secondary infection (higher risk of severe dengue).', 'Monitor CBC daily: platelets ↓ + Hct ↑ ≥ 20 % = plasma leakage warning.'], hx: ['Fever day, warning signs (abdominal pain, vomiting, bleeding), previous dengue.']
    },
    {
      id: 'widal', n: 'Widal / Typhoid Tests', aka: 'widal typhoid enteric salmonella typhidot', dept: 'Serology', cat: 'Fever panel', sp: 'Serum', tube: 'red', vol: '3 mL',
      time: 'After day 7 of fever; paired sera 7–10 days apart. Blood culture is preferred in week 1.', pre: ['Note vaccination history and previous typhoid.'], proc: ['Slide screening then tube titration.'],
      ref: { u: ['titre', ''], r: [['O antigen', '< 1:80 (local baseline varies)', ''], ['H antigen', '< 1:160', '']] },
      corr: ['A four-fold rise in paired sera is diagnostic; single titres have poor specificity in endemic areas.', 'Blood culture positivity is highest in week 1 (70–80 %).', 'Leucopenia, relative bradycardia, raised transaminases support typhoid.'], hx: ['Fever duration, vaccination, prior antibiotics, travel.']
    },
    {
      id: 'viral', n: 'HBsAg, Anti-HCV, HIV, VDRL', aka: 'hbsag hepatitis b anti hcv hepatitis c hiv vdrl rpr syphilis screening', dept: 'Serology', cat: 'Infectious screening', sp: 'Serum', tube: 'red', vol: '3–5 mL',
      time: 'Any time. Note window periods: HBsAg 1–10 weeks, HIV 4th-gen ~2–6 weeks, HCV antibody up to 8–12 weeks.', pre: ['Pre-test counselling and consent for HIV per national policy; confidentiality.', 'Treat every sample as potentially infectious (standard precautions).'], proc: ['Repeat reactive screening samples in duplicate; confirm with a different assay/algorithm before reporting positive.'],
      ref: { u: ['result', ''], r: [['All screens', 'Non-reactive', '']] },
      corr: ['HBsAg reactive → HBeAg, anti-HBc IgM, HBV DNA, LFT.', 'Anti-HCV reactive → HCV RNA to confirm active infection.', 'VDRL reactive → confirm with TPHA/TPPA; biological false positives in pregnancy, SLE, malaria.'], hx: ['Transfusions, dialysis, injecting drug use, pregnancy (antenatal screening), needle-stick exposure, vaccination (HBV).']
    },
    {
      id: 'rheum', n: 'RA Factor, ASO, Anti-CCP', aka: 'ra factor rheumatoid aso antistreptolysin anti ccp arthritis', dept: 'Serology', cat: 'Autoimmune', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Any time.', pre: ['Avoid lipaemic / haemolysed samples (latex agglutination).'], proc: ['Stable 7 days at 4 °C.'],
      ref: { u: ['IU/mL', ''], r: [['RA factor', '< 20', ''], ['ASO', '< 200 (adults) · < 250 (school-age children)', ''], ['Anti-CCP', '< 17 U/mL (kit specific)', '']] },
      corr: ['Anti-CCP is more specific than RF for rheumatoid arthritis.', 'Rising ASO in paired sera supports recent streptococcal infection (rheumatic fever, post-streptococcal GN).'], hx: ['Joint symptoms, morning stiffness, sore throat 2–4 weeks earlier.']
    },
    {
      id: 'bcs', n: 'Blood Culture', aka: 'blood culture sepsis bacteraemia bottle', dept: 'Microbiology', cat: 'Culture', sp: 'Venous blood into culture bottles', tube: 'bc', vol: 'Adult 8–10 mL per bottle, 2 sets (aerobic + anaerobic) from separate sites; children 1–3 mL (paediatric bottle)',
      time: 'Before antibiotics; during fever spike or rigor; 2 sets from 2 sites within 1 h.', pre: ['Skin antisepsis: 2 % chlorhexidine in 70 % alcohol, allow 30 s to dry.', 'Disinfect bottle tops; do not change needle; inoculate aerobic bottle first with a syringe (anaerobic first with a butterfly).', 'Correct blood volume is the single most important factor for sensitivity.'],
      proc: ['Do not refrigerate; load in incubator within 2 h (room temperature max 12–24 h).', 'Positive bottle → Gram stain and phone report immediately; subculture and AST.'],
      ref: { u: ['result', ''], r: [['Normal', 'No growth after 5 days', '']] },
      corr: ['Single bottle with skin flora (CoNS, diphtheroids, Bacillus) → probable contaminant; true pathogens grow in multiple sets.', 'Correlate with procalcitonin, CRP, WBC.'], hx: ['Antibiotics already given, central lines, prosthetic valves, immunosuppression.'], crit: 'Every positive Gram stain from blood culture — phone the clinician'
    }
  ];
})();
