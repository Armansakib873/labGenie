/* =====================================================================
   LabGenie SOP Guidebook · tests2a.js
   Additional test guides: coagulation, haematology, blood bank,
   biochemistry. Same fields as tests.js plus:
     st [[condition, time]] · hil {h,i,l,t} · rej [...] · spc special
     handling · m [[method, tag, principle]]
   Reference intervals are approximate and method-dependent.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  Object.assign(G.TUBES, { pink: ['Pink (K₂EDTA, blood bank)', '#ec4899'], navy: ['Royal blue (trace-element free)', '#1e3a8a'], u24: ['24-h urine container', '#ca8a04'], ice: ['Pre-chilled EDTA (on ice)', '#a78bfa'] });
  ['Immunology', 'Therapeutic drugs', 'Blood bank'].forEach(d => G.DEPTS.includes(d) || G.DEPTS.push(d));
  const RT = 'Room temp (20–25 °C)', CD = 'Refrigerated (2–8 °C)', FZ = 'Frozen (−20 °C)', FZ7 = 'Frozen (−70 °C)';
  const CIT = ['Under-filled citrate tube (< 90 % — wrong 9:1 ratio)', 'Clotted or haemolysed sample', 'Heparin contamination from a line'];

  G.TESTS.push(
    /* ===================== COAGULATION ===================== */
    {
      id: 'fib', n: 'Fibrinogen (Clauss)', aka: 'fibrinogen clauss factor i dic hypofibrinogenaemia', dept: 'Coagulation', cat: 'Coagulation factors', sp: 'Citrated plasma', tube: 'blue', vol: '2.7 mL (fill to the line)',
      time: 'Any time; no fasting.', pre: ['Draw a discard tube first if using a butterfly.', 'Mix gently 3–4 inversions.'], proc: ['Double-centrifuge to platelet-poor plasma (< 10 ×10⁹/L) if freezing.', 'Test within 4 h.'],
      ref: { u: ['mg/dL', 'g/L'], r: [['Adult', '200–400', '2.0–4.0'], ['Newborn', '170–400', '1.7–4.0'], ['Pregnancy (third trimester)', '350–650', '3.5–6.5']] },
      hi: ['Acute-phase response (infection, inflammation, surgery, malignancy).', 'Pregnancy, oral contraceptives, smoking, nephrotic syndrome.'], lo: ['DIC, massive bleeding / transfusion, liver failure.', 'Thrombolysis, L-asparaginase, congenital afibrinogenaemia / dysfibrinogenaemia.'],
      corr: ['DIC: ↓ fibrinogen + ↓ platelets + ↑ PT + ↑ D-dimer (ISTH score).', 'Postpartum haemorrhage: fibrinogen < 2 g/L predicts severe bleeding — give cryoprecipitate / concentrate.'],
      hx: ['Bleeding, pregnancy / postpartum, liver disease, thrombolytic or asparaginase therapy.'], crit: '< 100 mg/dL (1.0 g/L)', st: [[RT, '8 h'], [FZ, '2 weeks (−70 °C: 6 months)']], hil: { h: 'Reject.', l: 'Optical end-point unreliable — use mechanical detection.', t: 'Clots invalidate the test.' }, rej: CIT,
      m: [['Clauss (thrombin clotting time)', 'Reference', 'Diluted plasma + excess thrombin; clotting time is inversely proportional to fibrinogen (calibration curve).'], ['PT-derived fibrinogen', 'Optical analysers', 'Estimated from the PT clot curve — overestimates in DIC / dysfibrinogenaemia.'], ['Immunological (antigen)', 'Specialised', 'Antigen vs activity ratio detects dysfibrinogenaemia.']]
    },
    {
      id: 'tt', n: 'Thrombin Time (TT) & Reptilase Time', aka: 'thrombin time tt reptilase heparin contamination dabigatran', dept: 'Coagulation', cat: 'Screening tests', sp: 'Citrated plasma', tube: 'blue', vol: '2.7 mL',
      time: 'Any time.', pre: ['Avoid sampling from heparinised lines.'], proc: ['Test within 4 h at room temperature.'],
      ref: { u: ['seconds', ''], r: [['Thrombin time (method-dependent)', '14–19 s', ''], ['Reptilase time', '16–22 s', '']] },
      hi: ['Heparin (very sensitive) or dabigatran / argatroban.', 'Low fibrinogen or dysfibrinogenaemia, high FDPs / D-dimer, paraproteins (myeloma), amyloidosis.'], lo: ['Not clinically useful.'],
      corr: ['Prolonged TT + normal reptilase → heparin effect (reptilase is not affected by heparin).', 'Both prolonged → low or abnormal fibrinogen.', 'Normal TT excludes significant dabigatran levels.'],
      hx: ['Heparin / DOAC therapy, line sampling, liver disease, myeloma.'], st: [[RT, '4 h'], [FZ, '2 weeks']], hil: { h: 'Reject.', l: 'Optical detection unreliable.' }, rej: CIT,
      m: [['Clotting assay', 'Coagulometer', 'Standard thrombin added to plasma; time to fibrin clot.'], ['Reptilase (batroxobin)', 'Clotting assay', 'Snake-venom enzyme cleaves fibrinogen; insensitive to heparin.']]
    },
    {
      id: 'factor', n: 'Coagulation Factor Assays (VIII, IX, VWF)', aka: 'factor viii factor ix fviii fix von willebrand vwf ristocetin haemophilia hemophilia bleeding disorder', dept: 'Coagulation', cat: 'Coagulation factors', sp: 'Citrated platelet-poor plasma', tube: 'blue', vol: '2 × 2.7 mL',
      time: 'Not during acute illness, stress or late pregnancy if possible (FVIII / VWF rise).', pre: ['Atraumatic venepuncture; avoid prolonged tourniquet.', 'Record time of the last factor concentrate dose (recovery / trough levels).'], proc: ['Double-centrifuge to platelet-poor plasma.', 'Test FVIII within 2–4 h or freeze at −70 °C.'],
      ref: { u: ['% activity (IU/dL)', ''], r: [['Factor VIII / IX', '50–150 %', ''], ['VWF antigen / activity — blood group O', '40–150 %', ''], ['VWF antigen / activity — non-O', '60–170 %', ''], ['Haemophilia — severe / moderate / mild', '< 1 % / 1–5 % / 5–40 %', '']] },
      hi: ['FVIII / VWF: pregnancy, oestrogen, inflammation, exercise, stress, older age (acute-phase reactants).'], lo: ['Haemophilia A (VIII) / B (IX), von Willebrand disease, acquired FVIII inhibitor.', 'FIX: vitamin K deficiency, warfarin, liver disease.', 'DIC (consumption).'],
      corr: ['Isolated prolonged aPTT with normal PT → check VIII, IX, XI, XII and lupus anticoagulant.', 'VWF activity : antigen ratio < 0.7 → qualitative VWD (type 2).', 'Mixing study does not correct + bleeding → acquired haemophilia (urgent).'],
      hx: ['Personal / family bleeding history (use ISTH bleeding score).', 'Blood group O (VWF ~25 % lower), pregnancy, OCP.'], st: [[RT, '2–4 h'], [FZ7, '6 months'], [CD, 'Not recommended (cold activation, VWF loss)']], hil: { h: 'Reject.', l: 'Use mechanical / chromogenic methods.' }, rej: [...CIT, 'Refrigerated whole blood (loss of VWF / FVIII)'],
      spc: 'Process promptly; double-spin and freeze at −70 °C if not tested within 2–4 h.',
      m: [['One-stage clotting assay', 'Standard', 'Patient plasma dilutions mixed with factor-deficient plasma; aPTT-based (VIII, IX) or PT-based (II, V, VII, X).'], ['Chromogenic assay', 'Specialised', 'Measures FX activation with a colour substrate; needed for some modified factor concentrates.'], ['VWF:Ag, VWF:GPIbM / RCo activity', 'Immunoturbidimetry / aggregation', 'Antigen and platelet-binding activity.']]
    },
    {
      id: 'la', n: 'Lupus Anticoagulant (dRVVT / LA-aPTT)', aka: 'lupus anticoagulant la drvvt antiphospholipid aps anticardiolipin beta2 glycoprotein recurrent miscarriage thrombosis', dept: 'Coagulation', cat: 'Thrombophilia', sp: 'Citrated platelet-poor plasma', tube: 'blue', vol: '2 × 2.7 mL',
      time: 'Not during acute thrombosis or pregnancy if possible; ideally off anticoagulants.', pre: ['Note all anticoagulants (DOACs, heparin, warfarin) on the request.'], proc: ['Double-centrifuge (platelets < 10 ×10⁹/L) — residual platelets neutralise LA.', 'Freeze at −70 °C if not tested within 4 h.'],
      ref: { u: ['normalised ratio', ''], r: [['dRVVT screen / confirm ratio', '< 1.20 (negative)', ''], ['Antiphospholipid antibodies (aCL / anti-β2GPI)', '< 40 GPL / MPL units (or < 99th percentile)', '']] },
      hi: ['Antiphospholipid syndrome, SLE, infections, drugs (chlorpromazine, hydralazine).'], lo: [],
      corr: ['APS needs a clinical event + LA, aCL or anti-β2GPI positive on 2 occasions ≥ 12 weeks apart.', 'Triple positivity carries the highest thrombosis risk.'],
      hx: ['Unprovoked thrombosis, recurrent miscarriage, pre-eclampsia, thrombocytopenia, SLE.', 'DOACs give false-positive dRVVT; warfarin / heparin interfere (use DOAC-removal or timing).'], st: [[RT, '4 h'], [FZ7, '6 months']], hil: { h: 'Reject.' }, rej: [...CIT, 'Platelet-rich plasma (single spin only)'],
      m: [['dRVVT screen & confirm', 'Clotting', 'Russell’s viper venom activates FX; confirm reagent with excess phospholipid corrects LA.'], ['LA-sensitive aPTT ± mixing', 'Clotting', 'Second test using a different principle (ISTH requires two).'], ['aCL / anti-β2GPI', 'ELISA / CLIA', 'Solid-phase antibody tests (IgG / IgM).']]
    },
    {
      id: 'thrombo', n: 'Protein C, Protein S & Antithrombin', aka: 'protein c protein s antithrombin at iii thrombophilia factor v leiden prothrombin mutation', dept: 'Coagulation', cat: 'Thrombophilia', sp: 'Citrated platelet-poor plasma', tube: 'blue', vol: '2 × 2.7 mL',
      time: '≥ 6 weeks after an acute thrombosis; off warfarin ≥ 2 weeks; not in pregnancy.', pre: ['Document anticoagulants, OCP / HRT, pregnancy.'], proc: ['Double-centrifuge, freeze at −70 °C if delayed.'],
      ref: { u: ['% activity', ''], r: [['Protein C', '70–140 %', ''], ['Free protein S — male', '75–130 %', ''], ['Free protein S — female', '60–115 %', ''], ['Antithrombin', '80–120 %', ''], ['Protein C — newborn', '25–65 %', ''], ['Protein S — pregnancy', 'Falls to 30–50 %', '']] },
      hi: ['Acute-phase (protein S binding changes), heparin cofactor activity variation.'], lo: ['Hereditary deficiency (rare).', 'Warfarin (C, S), heparin (antithrombin), liver disease, DIC, acute thrombosis, nephrotic syndrome (AT loss), L-asparaginase, pregnancy / OCP (S).'],
      corr: ['Low protein C with warfarin start → warfarin skin necrosis risk.', 'Factor V Leiden / prothrombin G20210A are tested by PCR (not affected by anticoagulants).'],
      hx: ['Age at first thrombosis, family history, provoked vs unprovoked event.'], st: [[RT, '4 h'], [FZ7, '6 months']], hil: { h: 'Reject.', l: 'Use chromogenic / mechanical method.' }, rej: CIT,
      m: [['Chromogenic activity (C, AT)', 'Coagulation analyser', 'Activated protein / inhibition of FXa or thrombin measured with a colour substrate.'], ['Free protein S antigen', 'Immunoturbidimetry', 'Measures the active (free) fraction.'], ['Genetic (FV Leiden, PT20210)', 'PCR on EDTA blood', 'Not affected by anticoagulation.']]
    },
    {
      id: 'antixa', n: 'Anti-Xa (Heparin / LMWH Level)', aka: 'anti xa antixa heparin assay lmwh enoxaparin unfractionated heparin monitoring rivaroxaban apixaban level', dept: 'Coagulation', cat: 'Anticoagulant monitoring', sp: 'Citrated plasma', tube: 'blue', vol: '2.7 mL',
      time: 'LMWH: peak 3–4 h after the subcutaneous dose (after ≥ 3 doses). UFH infusion: 6 h after a dose change.', pre: ['Record drug, dose and exact time of last dose and sampling.'], proc: ['Centrifuge within 1 h (platelets release PF4 which neutralises heparin).', 'Calibrate with the right drug (UFH, LMWH or specific DOAC calibrators).'],
      ref: { u: ['IU/mL', ''], r: [['UFH therapeutic', '0.3–0.7', ''], ['LMWH treatment, twice daily (peak)', '0.5–1.0', ''], ['LMWH treatment, once daily (peak)', '1.0–2.0', ''], ['LMWH prophylaxis (peak)', '0.2–0.5', '']] },
      hi: ['Overdose, renal impairment (LMWH accumulation), low body weight.'], lo: ['Under-dosing, high body weight, antithrombin deficiency, high FVIII / fibrinogen (UFH resistance).'],
      corr: ['Preferred over aPTT for UFH monitoring when aPTT is unreliable (LA, high FVIII, factor deficiency).', 'Use in pregnancy, obesity, renal impairment, children on LMWH.'],
      hx: ['eGFR, weight, pregnancy, bleeding / thrombosis on treatment.'], st: [[RT, 'Separate within 1 h; plasma 4 h'], [FZ, '2 weeks']], hil: { h: 'Reject.', i: 'Bilirubin > 6 mg/dL interferes with chromogenic assays.', l: 'Interferes with chromogenic reading.' }, rej: [...CIT, 'Dose / sampling time not documented'],
      m: [['Chromogenic anti-Xa', 'Coagulation analyser', 'Heparin–antithrombin inhibits added FXa; residual FXa cleaves a colour substrate (inverse relationship).']]
    },
    {
      id: 'pfa', n: 'Platelet Function (PFA-100 / Aggregation)', aka: 'platelet function pfa closure time aggregation aspirin resistance bleeding time glanzmann bernard soulier', dept: 'Coagulation', cat: 'Platelet function', sp: 'Citrated whole blood', tube: 'blue', vol: '2 × 2.7 mL (3.2 % citrate)',
      time: 'Morning; patient rested. Avoid aspirin 7–10 days and NSAIDs 3 days if testing for an inherited disorder.', pre: ['Atraumatic draw; discard first tube.', 'Do not use the pneumatic tube system.'], proc: ['Keep at room temperature — never refrigerate.', 'Test within 4 h (aggregation: start after 30 min rest, finish within 4 h).', 'Platelets > 100 ×10⁹/L and Hct > 30 % needed for valid PFA results.'],
      ref: { u: ['seconds', ''], r: [['PFA Col / EPI closure time', '85–165 s (method-dependent)', ''], ['PFA Col / ADP closure time', '70–120 s', '']] },
      hi: ['Prolonged: VWD, aspirin (Col/EPI), inherited platelet defects (Glanzmann, Bernard-Soulier), uraemia, low Hct / platelets.'], lo: ['Shortened: high VWF / Hct (no clinical value).'],
      corr: ['Normal PFA does not exclude mild VWD or storage-pool disease.', 'Light transmission aggregation with agonists (ADP, collagen, arachidonic acid, ristocetin, epinephrine) characterises the defect.'],
      hx: ['All antiplatelet drugs, SSRIs, herbal supplements (ginkgo, fish oil), bleeding history.'], st: [[RT + ', whole blood', '4 h — never refrigerate']], hil: { h: 'Reject.', l: 'Lipaemic plasma invalidates optical aggregation.' }, rej: [...CIT, 'Refrigerated or > 4 h old', 'Sent by pneumatic tube'],
      m: [['PFA-100 / 200', 'Closure time', 'Whole blood flows through an aperture coated with collagen + epinephrine or ADP until a platelet plug closes it.'], ['Light transmission aggregometry', 'Reference', 'Platelet-rich plasma; light transmission rises as platelets aggregate with each agonist.']]
    },

    /* ===================== HEMATOLOGY / BLOOD BANK ===================== */
    {
      id: 'hbelectro', n: 'Haemoglobin Electrophoresis / HPLC (HbA2, HbF, variants)', aka: 'hb electrophoresis hplc hba2 hbf hbe hbs thalassaemia trait carrier screening haemoglobinopathy hemoglobinopathy', dept: 'Hematology', cat: 'Haemoglobinopathy', sp: 'Whole blood', tube: 'lav', vol: '2–3 mL',
      time: 'Any time. Defer ≥ 3 months after transfusion. Children: after 6 months of age for β-thalassaemia carrier status.', pre: ['Send with a recent CBC (MCV, MCH) and ferritin.'], proc: ['Stable in EDTA; run with known controls (A2 / F / S / E).'],
      ref: { u: ['% of total Hb', ''], r: [['HbA — adult', '96–98 %', ''], ['HbA2 — adult', '2.0–3.3 %', ''], ['HbF — adult', '< 1 %', ''], ['HbF — newborn', '60–80 %', ''], ['HbF — infant 6–12 months', '< 2–5 %', ''], ['β-thalassaemia trait', 'HbA2 3.5–7 %', ''], ['HbE trait', 'HbE 25–30 %', '']] },
      hi: ['HbA2 ↑: β-thalassaemia trait, megaloblastic anaemia, hyperthyroidism, HIV therapy.', 'HbF ↑: β-thal major / intermedia, HPFH, pregnancy, aplastic anaemia, JMML, sickle disease on hydroxyurea.'], lo: ['HbA2 ↓: iron deficiency (can mask β-trait), α-thalassaemia, δβ-thalassaemia.'],
      corr: ['Microcytosis with normal ferritin and normal HbA2 → consider α-thalassaemia (DNA testing).', 'HbE co-elutes with HbA2 on some HPLC systems (A2 window > 10 % suggests HbE).', 'Mentzer index (MCV / RBC) < 13 supports thalassaemia trait.'],
      hx: ['Transfusion in last 3 months, iron therapy, family / partner carrier status, consanguinity, ethnicity (HbE common in Bangladesh).'], st: [[RT + ', EDTA', '3 days'], [CD, '1 week'], [FZ7, 'Months (haemolysate)']], hil: { t: 'Clotted samples give erratic peaks.' }, rej: ['Clotted sample', 'Recent transfusion (< 3 months) — note on report'],
      m: [['Cation-exchange HPLC', 'Screening', 'Quantifies HbA2, HbF and presumptive variants by retention time.'], ['Capillary electrophoresis', 'Screening', 'Separates by charge; HbE and HbA2 resolve separately.'], ['Alkaline / acid gel electrophoresis', 'Confirmation', 'Classic separation; acid gel separates HbS from D / G.'], ['DNA analysis', 'Molecular', 'α-globin deletions, β-mutations — for prenatal diagnosis.']]
    },
    {
      id: 'g6pd', n: 'G6PD (Glucose-6-phosphate Dehydrogenase)', aka: 'g6pd deficiency favism haemolysis primaquine dapsone neonatal jaundice', dept: 'Hematology', cat: 'Red cell enzymes', sp: 'Whole blood', tube: 'lav', vol: '2 mL',
      time: 'Ideally 2–3 months after a haemolytic episode or transfusion.', pre: ['Send Hb / retic count with the sample.'], proc: ['Quantitative assay reported per g Hb.'],
      ref: { u: ['U/g Hb', ''], r: [['Adult (method-dependent)', '4.6–13.5 U/g Hb', ''], ['Deficient (WHO)', '< 30 % of normal mean', ''], ['Newborn', 'Higher than adult (use age range)', '']] },
      hi: ['Reticulocytosis (young cells have high G6PD).'], lo: ['G6PD deficiency (X-linked; males hemizygous).'],
      corr: ['Normal result during acute haemolysis can be false — old deficient cells already lysed; repeat after recovery.', 'Heterozygous females can test normal on screening — use quantitative assay.', 'Bite cells and Heinz bodies on film support oxidative haemolysis.'],
      hx: ['Drugs (primaquine, dapsone, nitrofurantoin, rasburicase, sulfonamides), fava beans, infection.', 'Neonatal jaundice, family history, transfusion in last 3 months.'], st: [[RT + ', EDTA', '1 day'], [CD + ', EDTA', '1 week']], hil: {}, rej: ['Clotted sample', 'Recent transfusion (note on report)'],
      m: [['Quantitative spectrophotometric', 'Reference', 'Rate of NADPH formation at 340 nm, normalised to Hb.'], ['Fluorescent spot test (Beutler)', 'Screening', 'NADPH fluoresces under UV; deficient samples stay dark.'], ['Point-of-care quantitative', 'POCT', 'Biosensor used before primaquine / tafenoquine.']]
    },
    {
      id: 'dat', n: 'Direct Antiglobulin Test (DAT / Direct Coombs)', aka: 'dat direct coombs antiglobulin aiha haemolytic disease newborn hdfn transfusion reaction igg c3d', dept: 'Blood bank', cat: 'Immunohaematology', sp: 'Whole blood (EDTA)', tube: 'pink', vol: '2–3 mL',
      time: 'Any time; for suspected transfusion reaction collect immediately after stopping the transfusion.', pre: ['EDTA prevents in-vitro complement binding (false-positive C3d).'], proc: ['Wash red cells 3–4 times in saline before adding AHG.', 'Polyspecific first; if positive, test monospecific anti-IgG and anti-C3d.'],
      ref: { u: ['result', ''], r: [['Normal', 'Negative', ''], ['Positive', 'Graded 1+ to 4+', '']] },
      hi: ['Warm AIHA (IgG ± C3), cold agglutinin disease (C3d only).', 'Haemolytic disease of the fetus / newborn, haemolytic transfusion reaction.', 'Drugs (methyldopa, cephalosporins, penicillin), IVIG, anti-CD38 therapy.'], lo: [],
      corr: ['DAT + with haemolysis markers (retic ↑, LDH ↑, haptoglobin ↓, bilirubin ↑, spherocytes) = immune haemolysis.', 'Positive DAT in ~0.1 % of healthy donors — interpret with clinical picture.'],
      hx: ['Recent transfusion (last 3 months), pregnancy, autoimmune disease, lymphoma / CLL, drugs.'], st: [[CD + ', EDTA', '7 days (test promptly for reaction work-up)']], hil: { h: 'Note gross haemolysis (may indicate in-vivo haemolysis — report).' }, rej: ['Clotted plain tube left in the fridge (cold auto-antibodies fix complement in vitro)', 'Labelling discrepancy'],
      m: [['Tube DAT', 'Standard', 'Washed red cells + anti-human globulin; agglutination shows coating with IgG / C3d.'], ['Column agglutination (gel card)', 'Standard', 'Graded reactions in AHG gel.']]
    },
    {
      id: 'kleihauer', n: 'Kleihauer-Betke / Fetomaternal Haemorrhage', aka: 'kleihauer betke fetomaternal haemorrhage fmh anti-d dose rhd negative mother fetal cells', dept: 'Blood bank', cat: 'Immunohaematology', sp: 'Maternal whole blood', tube: 'lav', vol: '2–3 mL',
      time: 'RhD-negative mother: after delivery of an RhD-positive baby or a sensitising event — ideally within 2 h, so anti-D can be given within 72 h.', pre: ['Collect at least 30–45 min after delivery so fetal cells mix in the circulation.'], proc: ['Make films within 24 h; acid-elute adult Hb (pH 3.3), counterstain.', 'Count fetal cells in ≥ 2000 adult cells (or use flow cytometry).'],
      ref: { u: ['estimated FMH', ''], r: [['Normal / typical', '< 4 mL fetal red cells', ''], ['FMH (mL fetal whole blood)', '≈ % fetal cells × 50', '']] },
      hi: ['Large FMH: placental abruption, trauma, manual placenta removal, caesarean, stillbirth.', 'False ↑: maternal HbF (HPFH, sickle cell, thalassaemia).'], lo: [],
      corr: ['Anti-D dose depends on FMH volume (e.g. 500 IU covers 4 mL fetal red cells; 300 µg covers ~30 mL whole blood).', 'Flow cytometry (anti-HbF) is more accurate and distinguishes maternal F-cells.'],
      hx: ['Mother’s and baby’s RhD type, anti-D already given, maternal haemoglobinopathy.'], st: [[RT + ', EDTA', '1 day'], [CD + ', EDTA', '3 days']], rej: ['Collected < 30 min after delivery', 'Clotted sample'],
      m: [['Acid elution (Kleihauer-Betke)', 'Manual', 'Adult HbA elutes at acid pH (ghost cells); fetal HbF cells stay pink.'], ['Flow cytometry (anti-HbF / anti-D)', 'Reference', 'Precise count of fetal cells.']]
    },
    {
      id: 'sickle', n: 'Sickling Test / HbS Solubility', aka: 'sickling test solubility hbs sickle cell trait disease sodium metabisulphite', dept: 'Hematology', cat: 'Haemoglobinopathy', sp: 'Whole blood', tube: 'lav', vol: '1–2 mL',
      time: 'Any time; not reliable under 6 months of age.', pre: ['Note Hb and recent transfusion.'], proc: ['Run positive (AS) and negative (AA) controls with every batch.'],
      ref: { u: ['result', ''], r: [['Normal', 'Negative', '']] },
      hi: ['Positive: sickle cell trait (AS), disease (SS), HbSC, HbS / β-thal.'], lo: [],
      corr: ['A positive screen cannot separate trait from disease — confirm by HPLC / electrophoresis.', 'False negative: infants < 6 months (high HbF), Hb < 7 g/dL, recent transfusion.', 'False positive: hyperproteinaemia (myeloma), lipaemia, polycythaemia, unstable Hbs.'],
      hx: ['Family history, painful crises, transfusions, ethnicity.'], st: [[CD + ', EDTA', '1 week']], hil: { l: 'False-positive turbidity.', t: 'High protein / WBC cause turbidity.' }, rej: ['Clotted sample'],
      m: [['Solubility (dithionite) test', 'Screening', 'Reduced HbS is insoluble in phosphate buffer → turbid solution.'], ['Metabisulphite slide test', 'Screening', 'Deoxygenated cells sickle under a sealed coverslip (read up to 24 h).']]
    },
    {
      id: 'osmofrag', n: 'Osmotic Fragility & EMA Binding Test', aka: 'osmotic fragility ema binding flow cytometry hereditary spherocytosis', dept: 'Hematology', cat: 'Red cell membrane', sp: 'Heparinised or EDTA whole blood', tube: 'green', vol: '3 mL + normal control sample',
      time: 'Fresh sample; process the same day.', pre: ['Send a normal control collected at the same time.'], proc: ['Osmotic fragility: test fresh and after 24 h incubation at 37 °C (more sensitive).', 'EMA (eosin-5-maleimide) flow test: EDTA within 24–48 h.'],
      ref: { u: ['% NaCl', ''], r: [['Initial lysis (fresh)', '0.45–0.50 %', ''], ['Complete lysis (fresh)', '0.30–0.33 %', ''], ['EMA mean fluorescence', '> 80–85 % of controls', '']] },
      hi: ['Increased fragility: hereditary spherocytosis, autoimmune haemolytic anaemia (spherocytes), burns.'], lo: ['Decreased fragility: thalassaemia, iron deficiency, liver disease (target cells), sickle cell.'],
      corr: ['Spherocytes + MCHC > 36 + DAT negative + family history → HS likely.', 'EMA binding is more specific and quicker than osmotic fragility.'],
      hx: ['Family history, splenomegaly, gallstones in youth, neonatal jaundice, recent transfusion.'], st: [[RT, 'Same day (EMA up to 48 h at 2–8 °C per kit)']], rej: ['No normal control sample', 'Haemolysed or clotted sample'],
      m: [['Osmotic fragility', 'Manual', 'Red cells in graded hypotonic saline; lysis curve read by Hb release at 540 nm.'], ['EMA binding', 'Flow cytometry', 'Dye binds band 3; reduced fluorescence in HS.']]
    },
    {
      id: 'coldagg', n: 'Cold Agglutinin Titre', aka: 'cold agglutinin titre mycoplasma cold agglutinin disease cad rbc agglutination', dept: 'Blood bank', cat: 'Immunohaematology', sp: 'Serum (clotted at 37 °C)', tube: 'red', vol: '5 mL',
      time: 'Any time.', pre: ['Pre-warm the tube; keep the sample at 37 °C (warm flask / water) until serum is separated.'], proc: ['Clot and centrifuge at 37 °C.', 'Titrate serum against group O cells at 4 °C; check thermal amplitude (room temp, 30 °C, 37 °C).'],
      ref: { u: ['titre (4 °C)', ''], r: [['Normal', '< 1:64', ''], ['Significant (CAD)', '≥ 1:512 with thermal amplitude ≥ 30 °C', '']] },
      hi: ['Mycoplasma pneumoniae, EBV (IM), CMV, cold agglutinin disease, lymphoma / Waldenström.'], lo: [],
      corr: ['On the CBC: falsely low RBC, high MCV and MCHC > 37 g/dL — re-run after warming at 37 °C.', 'DAT positive with C3d only.'],
      hx: ['Acrocyanosis in cold, recent atypical pneumonia, lymphoproliferative disease.'], st: [['Keep at 37 °C until separated', 'then serum 2–8 °C for 1 week']], rej: ['Sample cooled before separation (antibody absorbed onto cells — falsely low titre)'],
      spc: 'Keep at 37 °C from collection until the serum is separated.',
      m: [['Tube titration', 'Manual', 'Doubling dilutions with adult O cells at 4 °C; highest dilution with agglutination = titre.']]
    },
    {
      id: 'xmatch', n: 'Antibody Screen & Crossmatch', aka: 'crossmatch cross match antibody screen indirect coombs iat compatibility blood transfusion pretransfusion testing', dept: 'Blood bank', cat: 'Pre-transfusion', sp: 'Whole blood (EDTA)', tube: 'pink', vol: '6 mL',
      time: 'If transfused or pregnant in the last 3 months, sample must be < 72 h old at the time of transfusion.', pre: ['Positive patient ID at the bedside; label at the bedside, handwritten / printed per policy.', 'Do not collect from an arm with an IV infusion.'], proc: ['ABO / RhD group, antibody screen (IAT with 2–3 screening cells).', 'Antibody screen positive → identify with a panel and give antigen-negative units.', 'Crossmatch: immediate-spin (ABO check) or full IAT; electronic issue only if validated criteria are met.'],
      ref: { u: ['result', ''], r: [['Antibody screen', 'Negative', ''], ['Crossmatch', 'Compatible', '']] },
      hi: ['Positive screen: allo-antibodies (anti-D, -K, -E, -c, -Fyᵃ, -Jkᵃ…) from previous transfusion / pregnancy, auto-antibodies.', 'Pan-reactivity: warm auto-antibody, daratumumab (anti-CD38) therapy.'], lo: [],
      corr: ['Passive anti-D after prophylaxis can show a weak positive screen — check anti-D history.', 'Daratumumab: use DTT-treated cells; inform blood bank before therapy starts.'],
      hx: ['Previous transfusions and reactions, pregnancies, known antibodies, anti-D prophylaxis, IVIG, monoclonal antibodies.'], st: [[CD + ', EDTA', '7 days (but 72-h rule applies if recently transfused / pregnant)']], hil: { h: 'Haemolysis may mask a haemolytic crossmatch — request a new sample.' }, rej: ['Any discrepancy between form and sample label — zero tolerance', 'Unlabelled / pre-labelled / addressograph-only tube where policy forbids', 'Haemolysed sample', 'Sample older than the 72-h rule allows'],
      spc: 'Zero-tolerance labelling. Two-sample ABO confirmation before the first transfusion where policy requires.',
      m: [['Column agglutination IAT', 'Standard', 'Patient plasma + reagent / donor cells at 37 °C in AHG gel.'], ['Tube IAT', 'Standard', 'LISS-enhanced incubation at 37 °C, wash, add AHG.'], ['Electronic crossmatch', 'Validated IT', 'Allowed if two concordant groups and a negative antibody screen.']]
    },

    /* ===================== BIOCHEMISTRY ===================== */
    {
      id: 'ldh', n: 'Lactate Dehydrogenase (LDH)', aka: 'ldh ld lactate dehydrogenase haemolysis tumour lysis lymphoma tissue damage', dept: 'Biochemistry', cat: 'Enzymes', sp: 'Serum / heparin plasma', tube: 'gold', vol: '3 mL',
      time: 'Any time.', pre: ['Avoid haemolysis — RBC contain ~150× more LDH than serum.'], proc: ['Separate within 1–2 h.', 'Do not refrigerate or freeze (LD4 / LD5 are cold-labile).'],
      ref: { u: ['U/L (IFCC 37 °C)', ''], r: [['Adult', '125–220', ''], ['Child 1–9 y', '150–360', ''], ['Newborn', '≤ 1000', '']] },
      hi: ['Haemolysis (in vivo: haemolytic anaemia, TTP; very high in megaloblastic anaemia).', 'Lymphoma, leukaemia, metastatic tumours, tumour lysis.', 'MI (late), liver injury, muscle injury, PCP pneumonia, sepsis.'], lo: ['Not clinically significant.'],
      corr: ['LDH ↑ + haptoglobin ↓ + indirect bilirubin ↑ + retic ↑ → haemolysis.', 'LDH is a prognostic marker in lymphoma, melanoma and germ-cell tumours.'],
      hx: ['Chemotherapy (tumour lysis), anaemia, recent exercise / IM injection.'], st: [[RT, '3–7 days'], [CD, 'Avoid (LD4 / LD5 loss)'], [FZ, 'Avoid']], hil: { h: 'Major positive interference — reject.', l: 'Minor.' }, rej: ['Haemolysed sample', 'Refrigerated / frozen sample', 'Unseparated > 4 h'],
      m: [['IFCC kinetic (lactate → pyruvate)', 'UV 340 nm', 'NADH formation rate.'], ['Pyruvate → lactate (older)', 'UV 340 nm', 'NADH consumption; higher numerical values — not interchangeable.']]
    },
    {
      id: 'abg', n: 'Arterial Blood Gas (ABG)', aka: 'abg arterial blood gas ph pco2 po2 bicarbonate base excess acid base respiratory metabolic acidosis alkalosis', dept: 'Biochemistry', cat: 'Blood gas', sp: 'Arterial whole blood', tube: 'abg', vol: '1–2 mL in a dry (balanced) heparin syringe',
      time: 'Record FiO₂, oxygen device, ventilator settings and patient temperature.', pre: ['Do Allen’s test before radial puncture.', 'Expel all air bubbles immediately, cap the syringe, roll to mix.', 'Use dry heparin syringes — liquid heparin dilutes (↓ pCO₂, ↓ HCO₃⁻).'], proc: ['Analyse within 15 min at room temperature (plastic syringe — do not ice).', 'Mix thoroughly before injecting into the analyser.'],
      ref: { u: ['conventional', 'SI'], r: [['pH', '7.35–7.45', '7.35–7.45'], ['pCO₂', '35–45 mmHg', '4.7–6.0 kPa'], ['pO₂ (room air, adult)', '80–100 mmHg', '10.6–13.3 kPa'], ['HCO₃⁻', '22–26 mmol/L', '22–26 mmol/L'], ['Base excess', '−2 to +2 mmol/L', '−2 to +2 mmol/L'], ['SaO₂', '95–100 %', '0.95–1.00'], ['pO₂ — newborn', '60–70 mmHg', '8.0–9.3 kPa']] },
      hi: ['pCO₂ ↑: respiratory acidosis (COPD, hypoventilation, sedation).', 'HCO₃⁻ ↑: metabolic alkalosis (vomiting, diuretics).'], lo: ['pCO₂ ↓: respiratory alkalosis (anxiety, PE, sepsis, early asthma).', 'HCO₃⁻ ↓: metabolic acidosis (DKA, lactic acidosis, renal failure, diarrhoea).'],
      corr: ['Metabolic acidosis → calculate anion gap (Na − (Cl + HCO₃)); high AG: ketones, lactate, toxins, uraemia.', 'Expected pCO₂ in metabolic acidosis (Winter’s) = 1.5 × HCO₃ + 8 ± 2.', 'A–a gradient for unexplained hypoxaemia.'],
      hx: ['Oxygen therapy / FiO₂, ventilation, temperature, COPD, diabetes, vomiting / diarrhoea, drugs (salicylate).'], crit: 'pH < 7.20 or > 7.60 · pCO₂ < 20 or > 70 mmHg · pO₂ < 40 mmHg', st: [[RT + ', plastic syringe', '≤ 15–30 min'], ['Glass syringe on ice', '≤ 1 h (rarely used now)']], hil: { h: 'Haemolysis raises K⁺ on blood-gas electrolytes.', t: 'Clots block the analyser and give wrong results.' }, rej: ['Air bubbles present', 'Clotted sample', 'Delay > 30 min (pO₂ ↓, pCO₂ ↑, pH ↓, lactate ↑)', 'Venous sample sent as arterial (check SaO₂ vs pulse oximetry)'],
      spc: 'Anaerobic, bubble-free, analyse within 15 min. Record FiO₂ and temperature.',
      m: [['Potentiometric (pH, pCO₂ Severinghaus) & amperometric (pO₂ Clark) electrodes', 'Blood-gas analyser', 'Direct measurement; HCO₃⁻ and BE calculated.'], ['Co-oximetry', 'Multi-wavelength', 'SaO₂, COHb, MetHb.']]
    },
    {
      id: 'osmo', n: 'Serum & Urine Osmolality (Osmolal Gap)', aka: 'osmolality osmolarity osmolal gap toxic alcohol methanol ethylene glycol hyponatraemia siadh diabetes insipidus', dept: 'Biochemistry', cat: 'Electrolytes & water', sp: 'Serum + paired spot urine', tube: 'gold', vol: '3 mL + 10 mL urine',
      time: 'Paired serum and urine at the same time.', pre: ['Keep tubes capped (evaporation raises osmolality).'], proc: ['Freezing-point depression osmometer; calibrate daily.'],
      ref: { u: ['mOsm/kg', ''], r: [['Serum', '275–295', ''], ['Urine (random)', '50–1200', ''], ['Urine after 12-h fluid restriction', '> 850', ''], ['Osmolal gap', '< 10', '']] },
      hi: ['Serum ↑: dehydration, hypernatraemia, hyperglycaemia, uraemia, alcohols / mannitol (high osmolal gap).'], lo: ['Serum ↓: SIADH, water intoxication, true hyponatraemia.'],
      corr: ['Calculated osmolality = 2 Na + glucose (mg/dL)/18 + BUN (mg/dL)/2.8.', 'Osmolal gap > 10 → ethanol, methanol, ethylene glycol, isopropanol, mannitol.', 'Hyponatraemia with urine osm > 100 and urine Na > 30 (euvolaemic) → SIADH.'],
      hx: ['Alcohol / toxin ingestion, IV mannitol, diuretics, polyuria / polydipsia.'], st: [[RT + ', capped', '3 h'], [CD + ', capped', '24 h'], [FZ, '1 month']], hil: { l: 'Gross lipaemia: minor effect on freezing point.' }, rej: ['Uncapped sample', 'EDTA / citrate (additives add osmoles)'],
      m: [['Freezing-point depression', 'Osmometer', 'Each 1 mOsm/kg lowers freezing point by 0.00186 °C.'], ['Vapour-pressure osmometry', 'Osmometer', 'Misses volatile alcohols — not for osmolal gap.']]
    },
    {
      id: 'bhb', n: 'Ketones — β-Hydroxybutyrate (BHB)', aka: 'ketones beta hydroxybutyrate bhb dka ketoacidosis sglt2 euglycaemic starvation', dept: 'Biochemistry', cat: 'Diabetes', sp: 'Serum / plasma or capillary blood', tube: 'gold', vol: '2 mL',
      time: 'Any time; urgent in suspected DKA.', pre: ['Note SGLT2-inhibitor use.'], proc: ['Stable; no special handling.'],
      ref: { u: ['mmol/L', ''], r: [['Normal', '< 0.6', ''], ['Ketosis', '0.6–1.5', ''], ['High risk of DKA', '1.5–3.0', ''], ['DKA (with acidosis)', '> 3.0', '']] },
      hi: ['DKA, alcoholic ketoacidosis, starvation, prolonged vomiting, ketogenic diet, SGLT2 inhibitors (euglycaemic DKA).'], lo: [],
      corr: ['Urine nitroprusside detects acetoacetate, not BHB — can look “negative” early in DKA.', 'DKA: glucose > 250 mg/dL (or known diabetes), BHB ≥ 3, pH < 7.3 / HCO₃ < 18, high anion gap.'],
      hx: ['Insulin omission, SGLT2 inhibitors, alcohol, fasting, pregnancy.'], st: [[RT, '1 day'], [CD, '7 days']], hil: { h: 'Minor.' }, rej: [],
      m: [['Enzymatic (β-HBDH)', 'Photometry 340 nm', 'BHB → acetoacetate with NADH formation.'], ['Capillary meter', 'POCT', 'Electrochemical strip.']]
    },
    {
      id: 'fructosamine', n: 'Fructosamine', aka: 'fructosamine glycated albumin glycaemic control 2-3 weeks', dept: 'Biochemistry', cat: 'Diabetes', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time; no fasting.', pre: ['Send serum albumin / total protein.'], proc: ['Stable at room temperature.'],
      ref: { u: ['µmol/L', ''], r: [['Non-diabetic', '200–285', '']] },
      hi: ['Poor glycaemic control over the last 2–3 weeks; hypothyroidism.'], lo: ['Low albumin (nephrotic syndrome, liver disease, protein loss), hyperthyroidism.'],
      corr: ['Use when HbA1c is unreliable: Hb variants, haemolysis, recent transfusion, pregnancy, iron deficiency, CKD on EPO.'],
      hx: ['Hb variants, pregnancy, protein-losing states, recent treatment change.'], st: [[RT, '3 days'], [CD, '2 weeks'], [FZ, '2 months']], hil: { h: 'Minor.', i: 'Bilirubin may interfere (NBT method).', l: 'May interfere.' }, rej: [],
      m: [['NBT colorimetric', 'Photometry', 'Ketoamines reduce nitroblue tetrazolium in alkaline solution.'], ['Enzymatic glycated albumin', 'Photometry', 'Specific to albumin; reported as %.']]
    },
    {
      id: 'lpa', n: 'Lipoprotein(a) & Apolipoprotein B', aka: 'lpa lp(a) lipoprotein a apob apolipoprotein b cardiovascular risk familial', dept: 'Biochemistry', cat: 'Lipids', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Non-fasting acceptable. Lp(a) once in a lifetime is usually enough (genetically determined).', pre: [], proc: ['Report Lp(a) in nmol/L where possible (mg/dL conversion is isoform-dependent).'],
      ref: { u: ['conventional', 'SI'], r: [['Lp(a) desirable', '< 30 mg/dL', '< 75 nmol/L'], ['Lp(a) high risk', '> 50 mg/dL', '> 125 nmol/L'], ['ApoB desirable (general)', '< 90 mg/dL', '< 0.9 g/L'], ['ApoB target (very high risk)', '< 65 mg/dL', '< 0.65 g/L']] },
      hi: ['Lp(a): genetic, CKD, nephrotic syndrome, menopause, hypothyroidism.', 'ApoB: familial hypercholesterolaemia, metabolic syndrome, diabetes.'], lo: ['Liver disease, malnutrition, PCSK9 inhibitors.'],
      corr: ['High Lp(a) raises ASCVD risk independent of LDL — consider family cascade testing.', 'ApoB counts atherogenic particles; useful when TG is high or LDL is low with metabolic syndrome.'],
      hx: ['Premature CAD / stroke in family, statin therapy.'], st: [[RT, '1 day'], [CD, '7 days'], [FZ7, '6 months (avoid −20 °C for Lp(a))']], hil: { l: 'Lipaemia interferes with turbidimetric apolipoproteins.' }, rej: [],
      m: [['Immunoturbidimetry / nephelometry', 'Chemistry analyser', 'Isoform-insensitive calibrators recommended for Lp(a).']]
    },
    {
      id: 'hcy', n: 'Homocysteine', aka: 'homocysteine hcy b12 folate mthfr thrombosis cardiovascular', dept: 'Biochemistry', cat: 'Vitamins & metabolites', sp: 'EDTA plasma', tube: 'ice', vol: '3 mL',
      time: 'Fasting morning sample preferred.', pre: ['Place on ice immediately.'], proc: ['Centrifuge within 1 h — red cells keep releasing homocysteine (~10 %/h at room temperature).', 'Separate plasma; then stable.'],
      ref: { u: ['µmol/L', ''], r: [['Adult', '5–15', ''], ['Moderate hyperhomocysteinaemia', '15–30', ''], ['Severe', '> 100 (homocystinuria)', '']] },
      hi: ['B12, folate or B6 deficiency, CKD, hypothyroidism, MTHFR variants, methotrexate, anticonvulsants, smoking, homocystinuria.'], lo: [],
      corr: ['With low-normal B12: high homocysteine + high methylmalonic acid → functional B12 deficiency; high homocysteine + normal MMA → folate deficiency.'],
      hx: ['Vitamin supplements, kidney function, metformin / PPI (B12 ↓), methotrexate.'], st: [['Unspun whole blood on ice', '≤ 1 h (≤ 6 h on ice per some labs)'], [RT + ', separated plasma', '4 days'], [FZ, '1 year']], hil: { h: 'Minor.' }, rej: ['Unspun > 1 h at room temperature (falsely high)'],
      spc: 'On ice; separate within 1 h.',
      m: [['Enzymatic cycling', 'Chemistry analyser', 'Common on routine analysers.'], ['CLIA / HPLC / LC-MS/MS', 'Reference', 'After reduction of disulphide-bound forms.']]
    },
    {
      id: 'pct', n: 'Procalcitonin (PCT)', aka: 'procalcitonin pct sepsis bacterial infection antibiotic stewardship', dept: 'Biochemistry', cat: 'Inflammation', sp: 'Serum / plasma', tube: 'gold', vol: '2 mL',
      time: 'At presentation, then serially (24–48 h) to guide antibiotics.', pre: [], proc: ['Stable; analyse promptly in sepsis.'],
      ref: { u: ['ng/mL', ''], r: [['Healthy', '< 0.05', ''], ['LRTI — bacterial unlikely', '< 0.25', ''], ['Bacterial infection likely', '> 0.5', ''], ['Sepsis likely / severe', '> 2', ''], ['Newborn (first 48 h)', 'Physiological rise — use age-specific cut-offs', '']] },
      hi: ['Bacterial sepsis, pneumonia, pyelonephritis.', 'Non-infective: major surgery, trauma, burns, cardiogenic shock, medullary thyroid carcinoma, neonates.'], lo: ['Viral infections, localised infections, early sampling (< 6 h).'],
      corr: ['A fall ≥ 80 % from peak or to < 0.5 ng/mL supports stopping antibiotics.', 'CRP rises later and falls slower than PCT.'],
      hx: ['Time from symptom onset, surgery / trauma, antibiotics, CKD (slightly higher baseline).'], st: [[RT, '1 day'], [CD, '2 days'], [FZ, '3 months']], hil: {}, rej: [],
      m: [['CLIA / ECLIA / ELFA', 'Immunoassay', 'Sandwich assays; sensitive to 0.02–0.05 ng/mL.'], ['Immunoturbidimetric', 'Chemistry analyser', 'Check low-end sensitivity.'], ['Rapid semi-quantitative card', 'POCT', 'Banded categories only.']]
    },
    {
      id: 'bileacid', n: 'Serum Bile Acids', aka: 'bile acids obstetric cholestasis intrahepatic cholestasis of pregnancy icp itching pregnancy', dept: 'Biochemistry', cat: 'Liver', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Fasting (or note non-fasting — bile acids rise after meals).', pre: [], proc: ['Stable; separate within 2 h.'],
      ref: { u: ['µmol/L', ''], r: [['Fasting adult', '< 10', ''], ['Pregnancy: ICP diagnosis (non-fasting)', '≥ 19', ''], ['Severe ICP', '≥ 40', ''], ['Very high stillbirth risk', '≥ 100', '']] },
      hi: ['Intrahepatic cholestasis of pregnancy, hepatitis, cirrhosis, cholestasis, portosystemic shunt.'], lo: [],
      corr: ['Pregnancy itch (palms / soles) without rash + bile acids ≥ 19 µmol/L → ICP; repeat weekly; ALT often ↑.'],
      hx: ['Gestational age, itching, ursodeoxycholic acid therapy, meal time.'], st: [[RT, '3 days'], [CD, '1 week'], [FZ, '3 months']], hil: { h: 'Minor.', l: 'May interfere with enzymatic assay.' }, rej: [],
      m: [['Enzymatic cycling (3α-HSD)', 'Chemistry analyser', 'Measures total 3α-hydroxy bile acids.']]
    },
    {
      id: 'copper', n: 'Copper, Ceruloplasmin & Zinc', aka: 'copper ceruloplasmin caeruloplasmin zinc wilson disease trace elements menkes', dept: 'Biochemistry', cat: 'Trace elements', sp: 'Serum (trace-element tube)', tube: 'navy', vol: '3 mL',
      time: 'Zinc: fasting morning sample (falls after meals and diurnally).', pre: ['Use trace-element-free tubes and needles; no rubber stoppers in contact for long.'], proc: ['Zinc: separate within 45 min (RBC zinc ~10× higher).', 'Use acid-washed plastic aliquot tubes.'],
      ref: { u: ['conventional', 'SI'], r: [['Ceruloplasmin', '20–60 mg/dL', '0.2–0.6 g/L'], ['Copper — adult', '70–140 µg/dL', '11–22 µmol/L'], ['Zinc — adult', '70–120 µg/dL', '10.7–18.4 µmol/L'], ['24-h urine copper (Wilson’s likely)', '> 100 µg/day', '> 1.6 µmol/day']] },
      hi: ['Ceruloplasmin / copper ↑: pregnancy, oestrogen, inflammation (acute phase), malignancy.'], lo: ['Wilson disease (ceruloplasmin < 20 mg/dL), Menkes, malnutrition, nephrotic / protein-losing states.', 'Zinc ↓: malabsorption, diarrhoea, alcohol, inflammation, hypoalbuminaemia, acrodermatitis enteropathica.'],
      corr: ['Wilson disease: low ceruloplasmin + high 24-h urine copper + Kayser-Fleischer rings ± liver copper.', 'Inflammation can raise ceruloplasmin into the normal range in Wilson disease.'],
      hx: ['Liver disease in a young person, neuropsychiatric symptoms, family history, zinc / copper supplements, OCP.'], st: [[RT + ', separated', '1 week'], [FZ, 'Months']], hil: { h: 'Raises zinc — reject for zinc.' }, rej: ['Haemolysed sample (zinc)', 'Standard tubes / rubber contact (contamination)'],
      m: [['Ceruloplasmin: immunoturbidimetry', 'Chemistry analyser', ''], ['Copper / zinc: ICP-MS or atomic absorption', 'Reference', 'Colorimetric kits exist but are less accurate.']]
    },
    {
      id: 'lead', n: 'Blood Lead', aka: 'lead poisoning blood lead level pb toxicity basophilic stippling kohl surma turmeric', dept: 'Biochemistry', cat: 'Toxicology', sp: 'Whole blood (EDTA, lead-free tube)', tube: 'navy', vol: '2–3 mL venous',
      time: 'Any time.', pre: ['Venous sample preferred; for capillary, wash hands with soap and water first (skin contamination).', 'Use certified lead-free tubes.'], proc: ['Whole blood — do not centrifuge.'],
      ref: { u: ['µg/dL', 'µmol/L'], r: [['Children — reference value (CDC)', '< 3.5', '< 0.17'], ['Adults (non-occupational)', '< 5', '< 0.24'], ['Chelation usually considered (children)', '≥ 45', '≥ 2.17']] },
      hi: ['Lead paint dust, contaminated spices (e.g. adulterated turmeric), kohl / surma, traditional medicines, battery recycling, ceramics, occupational exposure.'], lo: [],
      corr: ['Microcytic anaemia with coarse basophilic stippling, ↑ zinc protoporphyrin.', 'Developmental delay, abdominal pain, neuropathy.'],
      hx: ['Occupation, home age / renovation, cosmetics, spices, pica in children, siblings’ results.'], st: [[RT + ', whole blood', '2 weeks'], [CD, '1 month']], rej: ['Non-certified tube', 'Clotted sample'],
      m: [['ICP-MS / graphite furnace AAS', 'Reference', 'Sensitive and specific.'], ['Anodic stripping voltammetry (LeadCare)', 'POCT screening', 'Confirm raised capillary results with a venous sample.']]
    },
    {
      id: 'hapto', n: 'Haptoglobin', aka: 'haptoglobin haemolysis intravascular', dept: 'Biochemistry', cat: 'Proteins', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time.', pre: [], proc: ['Stable.'],
      ref: { u: ['mg/dL', 'g/L'], r: [['Adult', '30–200', '0.3–2.0'], ['Newborn', 'Low / undetectable until 3–6 months', '']] },
      hi: ['Acute-phase (infection, inflammation, malignancy), steroids, nephrotic syndrome.'], lo: ['Intravascular haemolysis (often < 10 mg/dL), extravascular haemolysis, liver disease, congenital anhaptoglobinaemia, newborns.'],
      corr: ['Inflammation can keep haptoglobin normal despite haemolysis — interpret with LDH, bilirubin, retic, film.'],
      hx: ['Anaemia, recent transfusion, infection, liver disease.'], st: [[RT, '1 week'], [CD, '2 weeks']], hil: { h: 'In-vitro haemolysis lowers measured haptoglobin — reject.' }, rej: ['Haemolysed sample'],
      m: [['Immunoturbidimetry / nephelometry', 'Chemistry analyser', '']]
    },
    {
      id: 'spep', n: 'Serum Protein Electrophoresis & Immunofixation', aka: 'spep serum protein electrophoresis immunofixation ife m band paraprotein myeloma mgus monoclonal gammopathy', dept: 'Biochemistry', cat: 'Proteins', sp: 'Serum (not plasma)', tube: 'gold', vol: '3 mL',
      time: 'Any time.', pre: ['Serum only — fibrinogen in plasma gives a false band in the β–γ region.'], proc: ['Run with normal and abnormal controls; quantify any M-band by densitometry.'],
      ref: { u: ['g/dL', 'g/L'], r: [['Albumin', '3.5–5.0', '35–50'], ['α1-globulin', '0.1–0.3', '1–3'], ['α2-globulin', '0.6–1.0', '6–10'], ['β-globulin', '0.7–1.2', '7–12'], ['γ-globulin', '0.7–1.6', '7–16'], ['M-protein', 'Not detected', '']] },
      hi: ['M-band: myeloma, MGUS, Waldenström, plasmacytoma, AL amyloid, lymphoma / CLL.', 'Polyclonal γ ↑: chronic infection, liver cirrhosis (β–γ bridging), autoimmune disease, HIV.', 'α2 ↑: nephrotic syndrome, acute phase.'], lo: ['γ ↓: immunodeficiency, light-chain myeloma (suppressed), nephrotic syndrome.', 'Albumin ↓: liver disease, nephrotic syndrome, malnutrition, inflammation.'],
      corr: ['Any band → immunofixation to type (IgG / IgA / IgM, κ / λ) + serum free light chains.', 'CRAB features: Ca ↑, renal failure, anaemia, bone lesions.'],
      hx: ['Monoclonal antibody therapy (daratumumab / others appear as a small IgG-κ band).', 'Bone pain, anaemia, high ESR, renal impairment, recurrent infections.'], st: [[RT, '3 days'], [CD, '1 week'], [FZ, '3 months']], hil: { h: 'Free Hb gives a band in α2 / β.', l: 'Lipaemia distorts α / β zones.' }, rej: ['Plasma sample', 'Grossly haemolysed sample'],
      m: [['Capillary zone electrophoresis', 'Automated', 'High resolution; immunosubtraction for typing.'], ['Agarose gel electrophoresis', 'Semi-automated', 'Densitometric scanning.'], ['Immunofixation', 'Typing', 'Specific antisera precipitate each heavy / light chain.']]
    },
    {
      id: 'flc', n: 'Serum Free Light Chains (κ / λ) & Bence-Jones', aka: 'free light chains flc kappa lambda ratio bence jones urine protein electrophoresis myeloma amyloid', dept: 'Biochemistry', cat: 'Proteins', sp: 'Serum (+ 24-h urine for UPEP)', tube: 'gold', vol: '3 mL',
      time: 'Any time.', pre: [], proc: ['Dilute and re-test at high concentrations (antigen excess).'],
      ref: { u: ['mg/L', ''], r: [['Free κ', '3.3–19.4', ''], ['Free λ', '5.7–26.3', ''], ['κ / λ ratio', '0.26–1.65', ''], ['κ / λ ratio — CKD', '0.37–3.10', '']] },
      hi: ['Monoclonal: myeloma (light-chain), AL amyloidosis, MGUS, lymphoma.', 'Polyclonal ↑ (normal ratio): CKD, inflammation.'], lo: [],
      corr: ['Involved / uninvolved ratio ≥ 100 (with involved FLC ≥ 100 mg/L) is myeloma-defining.', 'UPEP / urine IFE detects Bence-Jones protein; dipstick misses light chains.'],
      hx: ['Renal impairment (use renal ratio), known myeloma treatment.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '6 months']], hil: { l: 'May interfere with turbidimetry.' }, rej: [],
      m: [['Nephelometry / turbidimetry (polyclonal anti-FLC)', 'Chemistry analyser', 'Results are method-specific — do not change methods during follow-up.']]
    },
    {
      id: 'igs', n: 'Immunoglobulins (IgG, IgA, IgM)', aka: 'immunoglobulins igg iga igm immunodeficiency hypogammaglobulinaemia', dept: 'Immunology', cat: 'Proteins', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time.', pre: [], proc: ['Stable.'],
      ref: { u: ['mg/dL', 'g/L'], r: [['IgG — adult', '700–1600', '7–16'], ['IgA — adult', '70–400', '0.7–4.0'], ['IgM — adult', '40–230', '0.4–2.3'], ['IgG — newborn (maternal)', '600–1600', '6–16'], ['IgG — child 1–3 y', '400–1300', '4–13'], ['IgA — child 1–3 y', '20–150', '0.2–1.5']] },
      hi: ['Polyclonal: chronic infections, liver disease (IgA in alcohol, IgM in PBC), autoimmune disease.', 'Monoclonal: myeloma (IgG / IgA), Waldenström (IgM).'], lo: ['Primary immunodeficiency (CVID, XLA, selective IgA deficiency).', 'Secondary: CLL, myeloma (suppressed), nephrotic syndrome, protein-losing enteropathy, steroids / rituximab.'],
      corr: ['Selective IgA deficiency → tTG-IgA is falsely negative (use IgG-based coeliac tests).', 'Recurrent sinopulmonary infections + low IgG → check vaccine responses.'],
      hx: ['Recurrent infections, IVIG therapy (raises IgG), rituximab, CLL / myeloma.'], st: [[RT, '1 week'], [CD, '2 weeks']], hil: { l: 'May interfere with turbidimetry.' }, rej: [],
      m: [['Immunoturbidimetry / nephelometry', 'Chemistry analyser', 'Age-specific ranges are essential in children.']]
    },
    {
      id: 'cysc', n: 'Cystatin C (eGFRcys)', aka: 'cystatin c egfr kidney function muscle mass', dept: 'Biochemistry', cat: 'Renal', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time; no fasting.', pre: [], proc: ['Stable.'],
      ref: { u: ['mg/L', ''], r: [['Adult < 50 y', '0.6–1.0 (method-dependent)', ''], ['Adult > 50 y', 'Up to ~1.2', '']] },
      hi: ['Reduced GFR, hyperthyroidism, high-dose steroids, inflammation, smoking.'], lo: ['Hypothyroidism.'],
      corr: ['Combined creatinine–cystatin C eGFR (CKD-EPI 2021) is the most accurate equation.', 'Useful when muscle mass is abnormal: amputees, sarcopenia, bodybuilders, cirrhosis, vegetarians.'],
      hx: ['Thyroid status, steroids, extremes of muscle mass.'], st: [[RT, '1 week'], [CD, '2 weeks']], hil: { l: 'May interfere.' }, rej: [],
      m: [['Particle-enhanced immunoturbidimetry / nephelometry', 'Chemistry analyser', 'Use IFCC-standardised calibrators.']]
    },
    {
      id: 'uelec', n: 'Urine Electrolytes & FeNa', aka: 'urine sodium potassium chloride fena fractional excretion urea feurea prerenal atn hyponatraemia', dept: 'Biochemistry', cat: 'Renal', sp: 'Spot urine + paired serum', tube: 'urine', vol: '10 mL urine + 3 mL blood',
      time: 'Before diuretics / IV fluids if possible; paired serum at the same time.', pre: [], proc: ['Analyse within 24 h (refrigerate).'],
      ref: { u: ['interpretation', ''], r: [['FeNa — prerenal', '< 1 %', ''], ['FeNa — intrinsic (ATN)', '> 2 %', ''], ['FeUrea — prerenal (on diuretics)', '< 35 %', ''], ['Urine Na — hypovolaemia', '< 20 mmol/L', '']] },
      hi: ['Urine Na ↑: diuretics, SIADH, adrenal insufficiency, salt-wasting nephropathy, ATN.'], lo: ['Urine Na ↓: hypovolaemia, heart failure, cirrhosis, hepatorenal syndrome.'],
      corr: ['FeNa = (urine Na × plasma Cr) ÷ (plasma Na × urine Cr) × 100.', 'Hypokalaemia: urine K > 20 mmol/L (or TTKG > 4) → renal loss.'],
      hx: ['Diuretics, IV fluids, vomiting / diarrhoea, contrast exposure.'], st: [[RT, '1 day'], [CD, '1 week']], rej: ['No paired serum sample'],
      m: [['ISE (urine mode)', 'Chemistry analyser', 'Indirect ISE with urine calibration.']]
    },
    {
      id: 'crcl', n: '24-hour Urine Creatinine Clearance', aka: '24 hour urine creatinine clearance gfr timed collection completeness', dept: 'Biochemistry', cat: 'Renal', sp: '24-h urine + serum creatinine', tube: 'u24', vol: 'Entire 24-h collection',
      time: 'Day 1: discard the first morning urine (note time). Collect every void for 24 h, including the first void the next morning at the same time.', pre: ['Give written instructions and a clean container; keep refrigerated during collection.', 'Avoid meat meals and strenuous exercise during the collection.'], proc: ['Measure and record total volume; mix well before aliquoting.', 'Blood creatinine drawn during the collection period.'],
      ref: { u: ['mL/min/1.73 m²', ''], r: [['Male (young adult)', '97–137', ''], ['Female (young adult)', '88–128', ''], ['Completeness — creatinine excretion male', '20–25 mg/kg/day', ''], ['Completeness — creatinine excretion female', '15–20 mg/kg/day', '']] },
      hi: ['Pregnancy, high protein intake, early diabetic hyperfiltration.'], lo: ['CKD, AKI, incomplete collection (most common error).'],
      corr: ['CrCl = (urine Cr × volume in mL) ÷ (plasma Cr × 1440).', 'Overestimates true GFR by ~10–20 % (tubular secretion).'],
      hx: ['Missed voids, cimetidine / trimethoprim (block secretion), muscle mass.'], st: [[CD + ' during collection', '24 h'], [CD + ' after', '4 days']], rej: ['Incomplete collection (missed void, low creatinine excretion)', 'No volume recorded', 'No serum creatinine'],
      m: [['Creatinine (Jaffe / enzymatic) in urine and serum', 'Calculation', '']]
    }
  );
})();
