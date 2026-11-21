/* =====================================================================
   LabGenie SOP Guidebook · atlas-haem.js
   Haematology atlas: blood-film stains, RBC / WBC morphology, PBF in
   disease, film-making SOP, histology stains; plus procedure diagrams
   added to existing pre-analytical guides. Drawings are schematic.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  ['Haematology atlas'].forEach(c => G.GCATS.includes(c) || G.GCATS.push(c));
  const CAT = 'Haematology atlas';

  G.GUIDES.push(
    {
      id: 'pbfsop', n: 'Making, Staining & Reporting a Blood Film', ic: '🩸', cat: CAT, aka: 'blood film smear wedge technique feathered edge monolayer pbf reporting platelet estimate wbc estimate grading',
      sec: [
        { h: 'Wedge (push) technique', v: 'dia', d: { k: 'smear', cap: 'Small drop near the label end, spreader at 30–45°, let blood spread along the edge, then push in one smooth movement.' }, li: ['Thin film: lower angle or slower push. Thick film: steeper angle or faster push.', 'High Hct (polycythaemia, newborn): smaller drop, lower angle. Low Hct: larger drop, steeper angle.', 'A good film covers ⅔–¾ of the slide, has a smooth feathered edge, no streaks, holes or ridges.'] },
        { h: 'Staining (Leishman, pH 6.8)', v: 'flow', d: [['Air-dry quickly', 'fan / wave, no heat', '#f2d0d6', 'Slow drying shrinks cells.'], ['Flood with Leishman stain', '1–2 min', '#6a3a9a', 'Methanol in the stain fixes the cells.'], ['Add buffer pH 6.8', '2 × volume, 8–10 min', '#8a7ac0', 'Mix gently until a metallic scum forms.'], ['Rinse with buffer', '1–2 min', '#e0d8f0', 'Let the buffer stand to differentiate.'], ['Dry upright', 'wipe the back of the slide', '#ffffff', '']] },
        { h: 'Systematic examination', st: ['10×: overall staining, distribution, platelet clumps / fibrin at the feathered edge, rouleaux, large abnormal cells.', '40×: estimate WBC — average per field × 2000 ≈ WBC/µL (check against the analyser count).', '100× oil in the monolayer: 100-cell differential, RBC morphology, platelet morphology, inclusions / parasites.', 'Platelet estimate: average per oil field (10 fields) × 15,000–20,000 ≈ platelets/µL (8–20 per field ≈ normal).', 'Correlate everything with CBC indices and analyser flags before reporting.'] },
        { h: 'Grading RBC morphology', tb: { hd: ['Grade', 'Approximate % of cells'], r: [['Slight / 1+', 'Occasional (about 5–10 %)'], ['Moderate / 2+', '~ 10–20 %'], ['Marked / 3+', '> 20 %'], ['Schistocytes', 'Report as % — > 1 % is significant in adults']] }, tip: 'Report clinically important findings (blasts, schistocytes, parasites, sickle cells) at once, even if few.' },
        { h: 'Reporting template', li: ['RBC: size, colour, poikilocytes (graded), inclusions, rouleaux / agglutination, nRBC per 100 WBC.', 'WBC: estimate, differential %, abnormal / immature cells, toxic changes.', 'Platelets: estimate, clumps, giant forms.', 'Parasites: species and stage; parasitaemia.', 'Impression / suggestion (e.g. “Microcytic hypochromic picture — suggest iron studies / HbA2”).'] },
        { h: 'Common artefacts', tb: { hd: ['Artefact', 'Cause'], r: [['Crenated cells (echinocytes) everywhere', 'Old EDTA sample, slow drying, glass effect'], ['Refractile “holes” in RBC', 'Water in methanol / stain, humid drying'], ['Smudge / broken cells', 'Rough spreading, fragile lymphocytes (CLL)'], ['Too blue', 'Buffer too alkaline, thick film, over-staining'], ['Too pink, pale nuclei', 'Buffer too acidic, over-washing'], ['Stain precipitate', 'Unfiltered stain, stain dried on slide']] } }
      ]
    },
    {
      id: 'giemsa', n: 'Giemsa Stain & Malaria Films', ic: '🦟', cat: CAT, aka: 'giemsa malaria thick film thin film parasitaemia ph 7.2 schuffner dots plasmodium falciparum vivax',
      sec: [
        { h: 'Thick & thin film on one slide', st: ['Thin film: wedge technique at one end of the slide.', 'Thick film: 2–3 small drops spread into a 1–1.5 cm circle (newsprint just readable through it).', 'Dry thick films flat for ≥ 30 min (no heat).', 'Fix ONLY the thin film in methanol for 30 s — keep methanol off the thick film.'] },
        { h: 'Staining', v: 'flow', d: [['3 % Giemsa in pH 7.2 buffer', '30–45 min (routine)', '#5a4fb0', 'Or 10 % Giemsa for 10 min (rapid).'], ['Rinse gently', 'buffered water', '#dfe8f5', 'Do not flood the thick film off the slide.'], ['Air-dry', 'thick film flat', '#ffffff', '']] },
        { h: 'Colour guide (pH 7.2)', v: 'sw', d: [['Parasite chromatin', '#b3245a', 'red / pink dot'], ['Parasite cytoplasm', '#5146b8', 'blue'], ['Schüffner’s dots (vivax / ovale)', '#e07a8e', 'pink stippling of enlarged RBC'], ['Malaria pigment', '#3b2a1a', 'brown-black'], ['Red cells (thin film)', '#e8a3ab', 'pale pink']] },
        { h: 'What to look for', v: 'cells', d: [['ring', 'Ring forms', 'Thin rings with 1–2 chromatin dots, often multiple per cell → P. falciparum.'], ['gam', 'Banana gametocyte', 'Crescent-shaped → P. falciparum.'], ['viv', 'P. vivax trophozoite', 'Enlarged RBC, Schüffner’s dots, amoeboid parasite.'], ['nrm', 'Normal RBC', 'For comparison.']] },
        { h: 'Counting parasites', tb: { hd: ['Film', 'Method'], r: [['Thick film', 'Count parasites against 200 WBC → parasites/µL = count × WBC/µL ÷ 200 (use 8000/µL if WBC unknown).'], ['Thin film', 'Infected RBC per 1000 RBC → % parasitaemia (> 2 % or > 100,000/µL = high, severe-malaria criterion > 5 % in many guidelines).'], ['Negative', 'Examine ≥ 100 thick-film fields before reporting “no parasites seen”.']] } },
        { h: 'Tips', li: ['Repeat films 12–24-hourly (up to 3 sets) if the first is negative and malaria is still suspected.', 'Platelets on red cells can mimic rings — look for chromatin and cytoplasm.', 'Report species, stages seen and parasite density; P. falciparum and high parasitaemia are critical results.'] }
      ]
    },
    {
      id: 'supravital', n: 'Reticulocyte, Heinz Body & Perls’ Iron Stains', ic: '🧿', cat: CAT, aka: 'reticulocyte count new methylene blue supravital brilliant cresyl blue heinz bodies hbh perls prussian blue iron stain sideroblast rpi corrected retic',
      sec: [
        { h: 'Manual reticulocyte count', st: ['Mix equal volumes of EDTA blood and 1 % new methylene blue (2–3 drops each).', 'Incubate 15–20 min at 37 °C or room temperature.', 'Re-mix, make thin films, air-dry (no counterstain needed).', 'Count reticulocytes among 1000 RBC (Miller ocular disc speeds this up).'] },
        { h: 'Calculations', tb: { hd: ['Index', 'Formula'], r: [['Retic %', 'Reticulocytes ÷ RBC counted × 100'], ['Absolute retic', 'Retic % × RBC count (normal ≈ 25–100 × 10⁹/L)'], ['Corrected retic %', 'Retic % × Hct ÷ 45'], ['RPI', 'Corrected retic % ÷ maturation time (1.0 at Hct 45, 1.5 at 35, 2.0 at 25, 2.5 at 15)'], ['Interpretation', 'RPI > 2–3: marrow responding (bleeding, haemolysis). RPI < 2: under-production.']] } },
        { h: 'Inclusions you will see', v: 'cells', d: [['retic', 'Reticulocyte', 'Blue RNA network (new methylene blue).'], ['heinz', 'Heinz bodies', 'Denatured Hb at the membrane: G6PD deficiency, unstable Hb.'], ['hbh', 'HbH inclusions', '“Golf ball” dots after 1–2 h in brilliant cresyl blue: HbH disease.'], ['sidero', 'Ring sideroblast', 'Perls’: ≥ 5 iron granules around ≥ ⅓ of the nucleus.']] },
        { h: 'Perls’ Prussian blue (marrow iron)', st: ['Fix air-dried marrow smear in methanol for 10 min.', 'Freshly mix equal volumes of 2 % potassium ferrocyanide and 2 % hydrochloric acid; stain 20 min.', 'Rinse; counterstain with neutral red / safranin for 10–15 s.', 'Grade storage iron in particles; count ring sideroblasts per 100 erythroblasts (≥ 15 % = sideroblastic anaemia / MDS-RS).'], tip: 'Run an iron-positive control slide every time — absent iron must be a true finding.' }
      ]
    },
    {
      id: 'rbcmorph', n: 'RBC Morphology Atlas', ic: '🔴', cat: CAT, aka: 'rbc morphology poikilocytes target cell spherocyte schistocyte sickle tear drop elliptocyte burr acanthocyte stomatocyte stippling howell jolly pappenheimer nrbc rouleaux agglutination microcyte macrocyte polychromasia bite cell',
      sec: [
        { h: 'Size & colour', v: 'cells', d: [['nrm', 'Normal discocyte', '7–8 µm, central pallor ≈ ⅓ of the cell.'], ['mic', 'Microcyte, hypochromic', 'Iron deficiency, thalassaemia, anaemia of chronic disease, sideroblastic anaemia.'], ['mac', 'Macrocyte', 'Oval: B12 / folate deficiency. Round: liver disease, alcohol, hypothyroidism.'], ['pol', 'Polychromatic cell', 'Young RBC (reticulocyte): haemolysis, bleeding, response to treatment.']] },
        { h: 'Shape changes (poikilocytes)', v: 'cells', d: [['sph', 'Spherocyte', 'No pallor: hereditary spherocytosis, warm AIHA, burns, ABO HDN.'], ['tgt', 'Target cell', 'Liver disease, HbC / HbE, thalassaemia, post-splenectomy.'], ['ell', 'Elliptocyte / pencil cell', 'Hereditary elliptocytosis; pencil cells in iron deficiency.'], ['tear', 'Tear-drop cell', 'Myelofibrosis, marrow infiltration, thalassaemia, megaloblastic anaemia.'], ['sic', 'Sickle cell', 'HbSS, HbSC, HbS/β-thalassaemia.'], ['sch', 'Schistocyte (fragment)', 'MAHA — TTP, HUS, DIC, HELLP, prosthetic valves. Urgent if > 1 %.'], ['bite', 'Bite cell', 'Oxidative haemolysis: G6PD deficiency, dapsone.'], ['ech', 'Burr cell (echinocyte)', 'Uraemia, pyruvate kinase deficiency, or artefact (old EDTA).'], ['aca', 'Acanthocyte (spur cell)', 'Severe liver disease, abetalipoproteinaemia, post-splenectomy.'], ['sto', 'Stomatocyte', 'Alcohol, liver disease, hereditary stomatocytosis, artefact.']] },
        { h: 'Inclusions & arrangements', v: 'cells', d: [['bs', 'Basophilic stippling', 'Lead poisoning, thalassaemia, sideroblastic anaemia.'], ['hj', 'Howell-Jolly body', 'Hyposplenism / post-splenectomy, megaloblastic anaemia.'], ['pap', 'Pappenheimer bodies', 'Iron granules: sideroblastic anaemia, post-splenectomy.'], ['nrbc', 'Nucleated RBC', 'Haemolysis, marrow infiltration, hypoxia, normal in newborns — correct the WBC count.'], ['rou', 'Rouleaux', 'Myeloma, high globulin / fibrinogen — matches very high ESR.'], ['agg', 'Agglutination', 'Cold agglutinins (Mycoplasma, CAD) — irregular clumps.']] },
        { h: 'Correction of WBC for nRBC', tb: { hd: ['Step', 'Formula'], r: [['Corrected WBC', 'Measured WBC × 100 ÷ (100 + nRBC per 100 WBC)'], ['When', 'If nRBC ≥ 5 per 100 WBC and the analyser does not correct automatically']] } }
      ]
    },
    {
      id: 'wbcmorph', n: 'WBC & Platelet Morphology Atlas', ic: '⚪', cat: CAT, aka: 'wbc morphology neutrophil band lymphocyte atypical reactive monocyte eosinophil basophil blast auer rod plasma cell smudge cell toxic granulation hypersegmented platelet giant platelet myelocyte left shift',
      sec: [
        { h: 'Normal leucocytes', v: 'cells', d: [['neu', 'Neutrophil', '2–5 lobes, lilac granules. 40–75 %.'], ['band', 'Band form', 'Non-segmented horseshoe nucleus. > 10 % → left shift (infection).'], ['lym', 'Lymphocyte', 'Round dense nucleus, thin blue rim. 20–45 %.'], ['mono', 'Monocyte', 'Largest cell, folded nucleus, grey-blue cytoplasm, vacuoles. 2–10 %.'], ['eos', 'Eosinophil', 'Bilobed nucleus, orange-red granules. 1–6 %.'], ['baso', 'Basophil', 'Dark purple-black granules hide the nucleus. 0–1 %.']] },
        { h: 'Reactive & abnormal cells', v: 'cells', d: [['tox', 'Toxic granulation / vacuoles', 'Sepsis, severe inflammation, G-CSF therapy.'], ['hyp', 'Hypersegmented neutrophil', '≥ 6 lobes: B12 / folate deficiency.'], ['alym', 'Reactive lymphocyte', 'Abundant blue cytoplasm hugging RBC: EBV, dengue, CMV, hepatitis.'], ['myelo', 'Myelocyte', 'Left shift, leuco-erythroblastic picture, CML.'], ['blast', 'Blast', 'High N:C ratio, fine chromatin, nucleoli: acute leukaemia — urgent report.'], ['auer', 'Auer rod', 'Myeloid blast (AML); bundles in APL — emergency (DIC risk).'], ['plasma', 'Plasma cell', 'Eccentric clock-face nucleus, deep blue cytoplasm, perinuclear halo: myeloma, reactive.'], ['smudge', 'Smudge cell', 'Fragile lymphocytes in CLL (adding albumin reduces smudging).']] },
        { h: 'Platelets', v: 'cells', d: [['plt', 'Normal platelets', '2–3 µm granular fragments; 8–20 per oil field ≈ normal count.'], ['gplt', 'Giant platelet', 'ITP (young platelets), MPN, inherited macrothrombocytopenia.']], tip: 'Low platelet count with clumps at the feathered edge = EDTA pseudo-thrombocytopenia — recollect in citrate.' },
        { h: 'Absolute counts matter', li: ['Absolute count = WBC × % ÷ 100 — interpret absolutes, not just percentages.', 'Neutropenia: ANC < 1.5 ×10⁹/L (severe < 0.5). Note benign ethnic neutropenia.', 'Lymphocytosis in adults > 4 ×10⁹/L; persistent > 5 ×10⁹/L B-cells → consider CLL (flow cytometry).'] }
      ]
    },
    {
      id: 'pbfdx', n: 'PBF in Disease — Patterns & CBC Clues', ic: '🔬', cat: CAT, aka: 'pbf disease iron deficiency thalassaemia megaloblastic spherocytosis aiha sickle g6pd maha ttp dic aml all cml cll sepsis dengue infectious mononucleosis malaria itp myelofibrosis myeloma liver disease renal failure lead aplastic',
      sec: [
        { h: 'Red-cell disorders', v: 'pbf', d: [
          { n: 'Iron-deficiency anaemia', k: ['mic', 'ell', 'tgt'], up: ['RDW', 'Platelets (reactive)', 'TIBC'], dn: ['Hb', 'MCV', 'MCH', 'MCHC', 'Ferritin', 'Transferrin sat.'], f: 'Microcytic hypochromic cells, pencil cells, anisocytosis.', tip: 'Mentzer index (MCV ÷ RBC) > 13 favours iron deficiency.' },
          { n: 'β-thalassaemia trait', k: ['mic', 'tgt', 'bs'], up: ['RBC count', 'HbA2 (> 3.5 %)'], dn: ['MCV (very low)', 'MCH'], nm: ['RDW', 'Ferritin'], f: 'Uniform microcytes, target cells, basophilic stippling; Hb only mildly low.', tip: 'Mentzer < 13. Correct iron deficiency before interpreting HbA2.' },
          { n: 'β-thalassaemia major / HbE-β', k: ['nrbc', 'tgt', 'tear', 'mic'], up: ['nRBC', 'Retic', 'HbF', 'Bilirubin', 'Ferritin (overload)'], dn: ['Hb (severe)', 'MCV', 'MCH'], f: 'Marked anisopoikilocytosis, target cells, tear drops, many nRBC.' },
          { n: 'Megaloblastic anaemia (B12 / folate)', k: ['mac', 'hyp', 'tear', 'hj'], up: ['MCV (often > 110)', 'RDW', 'LDH (very high)', 'Indirect bilirubin'], dn: ['Hb', 'WBC', 'Platelets', 'Retic', 'B12 or folate'], f: 'Oval macrocytes, hypersegmented neutrophils, pancytopenia.' },
          { n: 'Hereditary spherocytosis', k: ['sph', 'pol'], up: ['MCHC (> 36)', 'Retic', 'Bilirubin', 'LDH'], dn: ['Hb', 'Haptoglobin'], f: 'Spherocytes, polychromasia; DAT negative; EMA test reduced.' },
          { n: 'Warm autoimmune haemolysis', k: ['sph', 'pol', 'nrbc'], up: ['Retic', 'MCV (retic)', 'LDH', 'Bilirubin', 'DAT (IgG ± C3)'], dn: ['Hb', 'Haptoglobin'], f: 'Spherocytes, polychromasia, occasional nRBC.' },
          { n: 'Sickle cell anaemia', k: ['sic', 'tgt', 'hj', 'nrbc'], up: ['Retic', 'Bilirubin', 'LDH', 'WBC', 'HbS (HPLC)'], dn: ['Hb'], f: 'Sickle cells, target cells, Howell-Jolly bodies (autosplenectomy).' },
          { n: 'G6PD deficiency — acute haemolysis', k: ['bite', 'heinz', 'pol'], up: ['Retic', 'Bilirubin', 'LDH'], dn: ['Hb', 'Haptoglobin', 'G6PD (may be falsely normal acutely)'], f: 'Bite / blister cells; Heinz bodies on supravital stain.' },
          { n: 'MAHA — TTP / HUS / DIC', k: ['sch', 'sph', 'pol'], up: ['LDH', 'Retic', 'Bilirubin', 'Creatinine (HUS)', 'PT / D-dimer (DIC)'], dn: ['Platelets', 'Hb', 'Haptoglobin', 'Fibrinogen (DIC)'], f: 'Schistocytes > 1 %. Normal PT / aPTT favours TTP (send ADAMTS13) — emergency.' },
          { n: 'Lead poisoning', k: ['bs', 'mic'], up: ['Blood lead', 'Zinc protoporphyrin'], dn: ['Hb'], f: 'Coarse basophilic stippling with microcytosis.' }
        ] },
        { h: 'White-cell disorders', v: 'pbf', d: [
          { n: 'Acute myeloid leukaemia', k: ['blast', 'auer'], up: ['WBC (often)', 'Blasts ≥ 20 %', 'LDH'], dn: ['Hb', 'Platelets', 'Neutrophils'], f: 'Blasts with Auer rods; in APL, abnormal promyelocytes + DIC.', tip: 'Report new blasts immediately — flow cytometry and marrow follow.' },
          { n: 'Acute lymphoblastic leukaemia', k: ['blast', 'lym'], up: ['WBC', 'Blasts', 'LDH', 'Uric acid'], dn: ['Hb', 'Platelets'], f: 'Small–medium blasts, scanty cytoplasm, no Auer rods.' },
          { n: 'Chronic myeloid leukaemia', k: ['myelo', 'baso', 'eos', 'band'], up: ['WBC (very high)', 'Basophils', 'Eosinophils', 'Myelocytes', 'Platelets'], dn: ['Hb (mild)'], f: 'Whole spectrum of granulocytes with a “myelocyte bulge”; confirm BCR-ABL1.' },
          { n: 'Chronic lymphocytic leukaemia', k: ['lym', 'smudge'], up: ['Lymphocytes (> 5 ×10⁹/L B-cells)'], dn: ['Hb / platelets (advanced)'], f: 'Small mature lymphocytes with many smudge cells.' },
          { n: 'Bacterial infection / sepsis', k: ['tox', 'band', 'neu'], up: ['WBC', 'Neutrophils', 'Bands', 'CRP', 'Procalcitonin'], dn: ['Lymphocytes', 'Platelets (sepsis)'], f: 'Neutrophilia with left shift, toxic granulation, Döhle bodies, vacuoles.' },
          { n: 'Dengue (critical phase)', k: ['alym', 'plt'], up: ['Hct (haemoconcentration)', 'Reactive lymphocytes', 'AST > ALT'], dn: ['WBC', 'Platelets', 'Neutrophils'], f: 'Leucopenia, thrombocytopenia, reactive lymphocytes.', tip: 'Rising Hct with falling platelets is a warning sign of plasma leakage.' },
          { n: 'Infectious mononucleosis (EBV)', k: ['alym', 'lym'], up: ['Lymphocytes', 'Reactive lymphocytes > 10 %', 'ALT'], dn: ['Platelets (mild)'], f: 'Many large reactive lymphocytes; heterophile / EBV VCA-IgM positive.' },
          { n: 'Multiple myeloma', k: ['rou', 'plasma'], up: ['ESR (very high)', 'Total protein / globulin', 'Calcium', 'Creatinine', 'M-band'], dn: ['Hb', 'Albumin'], f: 'Rouleaux, occasional plasma cells; background bluish staining.' }
        ] },
        { h: 'Platelet, marrow & parasite patterns', v: 'pbf', d: [
          { n: 'Immune thrombocytopenia (ITP)', k: ['gplt', 'plt'], up: ['MPV', 'Immature platelet fraction'], dn: ['Platelets (isolated)'], nm: ['Hb', 'WBC', 'PT / aPTT'], f: 'Few, often large platelets; otherwise normal film.', tip: 'Exclude EDTA clumping (check the feathered edge, recollect in citrate).' },
          { n: 'Myelofibrosis / marrow infiltration', k: ['tear', 'nrbc', 'myelo', 'gplt'], up: ['LDH', 'Platelets / WBC (early)'], dn: ['Hb', 'Platelets (late)'], f: 'Leuco-erythroblastic picture: tear drops, nRBC, myelocytes; dry tap on aspiration.' },
          { n: 'Aplastic anaemia', k: ['nrm', 'lym'], up: ['MCV (mild)'], dn: ['Hb', 'WBC', 'Neutrophils', 'Platelets', 'Retic'], f: 'Pancytopenia without abnormal cells — needs marrow trephine.' },
          { n: 'P. falciparum malaria', k: ['ring', 'gam'], up: ['LDH', 'Bilirubin'], dn: ['Platelets', 'Hb'], f: 'Multiple small rings, appliqué forms, banana gametocytes; RBC not enlarged.', tip: 'Report species and parasitaemia urgently.' },
          { n: 'P. vivax malaria', k: ['viv'], up: [], dn: ['Platelets', 'Hb'], f: 'Enlarged RBC with Schüffner’s dots; all stages present.' },
          { n: 'Liver disease / alcohol', k: ['tgt', 'aca', 'mac'], up: ['MCV (round macrocytes)', 'GGT', 'Bilirubin'], dn: ['Platelets (hypersplenism)'], f: 'Round macrocytes, target cells, acanthocytes in severe disease.' },
          { n: 'Chronic kidney disease', k: ['ech', 'nrm'], up: ['Urea', 'Creatinine'], dn: ['Hb (normocytic)'], f: 'Normocytic normochromic anaemia with burr cells.' },
          { n: 'Post-splenectomy / hyposplenism', k: ['hj', 'tgt', 'pap'], up: ['Platelets', 'Lymphocytes'], dn: [], f: 'Howell-Jolly bodies, target cells, Pappenheimer bodies, acanthocytes.' },
          { n: 'Cold agglutinin disease', k: ['agg', 'sph'], up: ['MCV (spurious)', 'MCHC (spurious > 37)', 'LDH'], dn: ['RBC count (spurious)', 'Hb'], f: 'Red-cell clumps; re-run CBC after warming to 37 °C.' }
        ] }
      ]
    },
    {
      id: 'histo', n: 'H&E and Papanicolaou (Pap) Stains', ic: '🧻', cat: CAT, aka: 'haematoxylin eosin h&e histopathology tissue section pap smear papanicolaou cytology cervical og-6 ea-50 fixation',
      sec: [
        { h: 'H&E for tissue sections', v: 'flow', d: [['Dewax & rehydrate', 'xylene → alcohols → water', '#e8e3d8'], ['Harris haematoxylin', '5–10 min', '#3b2a7a', 'Stains nuclei.'], ['Differentiate (1 % acid-alcohol)', 'a few seconds', '#f1e8e8', 'Removes excess dye.'], ['Blue (Scott’s / running tap water)', '2–5 min', '#2f5fb0', 'Nuclei turn crisp blue.'], ['Eosin', '1–3 min', '#e06a8a', 'Cytoplasm and connective tissue.'], ['Dehydrate, clear, mount', 'alcohols → xylene → DPX', '#f5f1e6']] },
        { h: 'H&E colours', v: 'sw', d: [['Nuclei', '#3b2a7a', 'blue-purple'], ['Cytoplasm', '#e7a3bd', 'pink'], ['Red cells', '#d8344f', 'bright red'], ['Collagen', '#f2c4d2', 'pale pink'], ['Muscle', '#d06a8e', 'deeper pink']] },
        { h: 'Pap stain (cytology)', st: ['Fix wet in 95 % ethanol immediately (≥ 15 min) — air-drying spoils nuclear detail.', 'Hydrate → Harris haematoxylin → blue.', 'OG-6 (orange G) for keratin.', 'EA-50 (eosin-azure + light green) for cytoplasm.', 'Dehydrate, clear, mount.'] },
        { h: 'Pap colours', v: 'sw', d: [['Superficial squamous cells', '#f08aa0', 'pink / orange'], ['Intermediate & parabasal cells', '#7ab8a8', 'blue-green'], ['Keratinised cells', '#f0a03c', 'orange'], ['Nuclei', '#1f2a5a', 'blue-black']] },
        { h: 'Specimen adequacy (Bethesda)', li: ['Conventional smear ≥ 8,000–12,000 squamous cells; liquid-based ≥ 5,000.', 'Note presence / absence of the transformation-zone component.', 'Unsatisfactory if > 75 % of cells are obscured by blood, inflammation or drying.'] }
      ]
    }
  );

  /* procedure diagrams added to existing guides */
  const addSec = (id, s, at) => { const g = G.GUIDES.find(x => x.id === id); if (g) g.sec.splice(at == null ? 0 : at, 0, s); };
  addSec('centri', { h: 'Balance the rotor', v: 'dia', d: { k: 'balance', cap: 'Place tubes of equal weight directly opposite each other; use a water-filled balance tube for odd numbers.' } }, 0);
  addSec('cap', { h: 'Heel-prick sites (infants)', v: 'dia', d: { k: 'heel', cap: 'Use the medial or lateral edge of the plantar heel surface only.' } }, 1);
  addSec('veni', { h: 'Choosing the vein', v: 'dia', d: { k: 'veins', cap: 'Median cubital first, cephalic second; basilic only if nothing else (close to the brachial artery and median nerve).' } }, 0);
})();
