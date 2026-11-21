/* =====================================================================
   LabGenie SOP Guidebook · methods.js
   Common test methods per test guide: [method, tag, principle / note].
   Methods vary by analyser and kit — always confirm with the kit insert.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  G.METHODS = {
    cbc: [
      ['Electrical impedance (Coulter principle)', 'Analyser', 'Cells passing through an aperture change the electrical resistance; pulses are counted and sized → RBC, WBC, PLT counts, MCV, RDW.'],
      ['Flow cytometry (laser scatter + fluorescence)', '5-part differential', 'Forward / side scatter and nucleic-acid dye fluorescence separate neutrophils, lymphocytes, monocytes, eosinophils, basophils; flags blasts and NRBC.'],
      ['SLS-haemoglobin / cyanmethaemoglobin', 'Photometry ~540 nm', 'Hb is converted to a stable coloured complex (SLS is cyanide-free; HiCN is the ICSH reference).'],
      ['Manual methods', 'Backup / verification', 'Neubauer haemocytometer counts, microhaematocrit, manual differential on a Romanowsky-stained film.']
    ],
    esr: [
      ['Westergren', 'ICSH reference', 'Citrated blood (4:1) in a 200 mm vertical tube; fall of the RBC column read at exactly 60 min.'],
      ['Closed / modified Westergren systems', 'Semi-automated', 'Vacuum ESR tubes read by optical sensors at 30 or 60 min (results corrected to 60-min Westergren).'],
      ['Capillary photometric kinetics', 'Automated (e.g. 20 s)', 'Measures early RBC aggregation optically; results are converted to Westergren units.'],
      ['Wintrobe', 'Historic', 'EDTA blood in a 100 mm tube; less sensitive at high ESR.']
    ],
    pbf: [
      ['Romanowsky stains', 'Manual microscopy', 'Leishman, Giemsa, Wright or May-Grünwald-Giemsa stain cells by the azure B–eosin Y effect; pH 6.8 buffer for morphology.'],
      ['Digital morphology', 'AI pre-classification', 'Automated slide scanners (e.g. CellaVision) pre-classify WBC and RBC; a trained person must verify.']
    ],
    retic: [
      ['Supravital stain (new methylene blue)', 'Manual', 'RNA precipitates as a blue reticulum; count 1000 RBC (Miller disc) and express as %.'],
      ['Flow cytometry with RNA dyes', 'Analyser', 'Thiazole orange / oxazine fluorescence gives retic %, absolute count, IRF and Ret-He.']
    ],
    bgrp: [
      ['Slide / tile agglutination', 'Screening', 'Rapid forward grouping only — not adequate for transfusion.'],
      ['Tube agglutination', 'Standard', 'Forward (cells + anti-A, anti-B, anti-D) and reverse (plasma + A₁ and B cells) grouping, read after centrifugation.'],
      ['Column agglutination (gel / bead)', 'Semi-automated', 'Agglutinates are trapped in the gel; standardised reading and documentation (also used for antibody screen and crossmatch).'],
      ['Solid-phase / microplate', 'Automated', 'High-throughput grouping and screening on blood-bank analysers.']
    ],
    mp: [
      ['Giemsa thick & thin film', 'Gold standard', 'Thick film for detection and counting, thin film for species and parasitaemia %.'],
      ['Rapid diagnostic test (RDT)', 'Immunochromatography', 'HRP-2 (P. falciparum) and pLDH / aldolase (pan-species) antigen; HRP-2 can stay positive for weeks after cure.'],
      ['QBC (acridine orange)', 'Fluorescence', 'Centrifuged capillary tube; parasites fluoresce — fast but species identification is difficult.'],
      ['PCR / LAMP', 'Molecular', 'Most sensitive; species confirmation and low parasitaemia.']
    ],
    pt: [
      ['Clot detection — optical / mechanical', 'Coagulometer', 'Citrated plasma + thromboplastin (tissue factor) + Ca²⁺; time to fibrin clot detected by turbidity change or steel-ball viscosity.'],
      ['INR calculation', 'Warfarin monitoring', 'INR = (patient PT ÷ mean normal PT)^ISI; enter the ISI and MNPT for each new reagent lot.'],
      ['POCT', 'Electrochemical', 'Capillary whole-blood INR meters — verify against the lab method.']
    ],
    aptt: [
      ['Clot detection — optical / mechanical', 'Coagulometer', 'Plasma + contact activator (silica, kaolin or ellagic acid) + phospholipid, then CaCl₂; time to clot.'],
      ['Mixing study (1:1 with normal plasma)', 'Follow-up', 'Correction → factor deficiency; no correction → inhibitor (lupus anticoagulant, factor VIII inhibitor).']
    ],
    ddimer: [
      ['Latex-enhanced immunoturbidimetry', 'Quantitative', 'Anti-D-dimer antibody-coated latex agglutinates; turbidity read on coagulation / chemistry analysers.'],
      ['ELISA / ELFA', 'High-sensitivity', 'Used for VTE exclusion with low pre-test probability.'],
      ['Latex slide / POCT cards', 'Semi-quantitative', 'Rapid but less sensitive; not suitable for exclusion of VTE on its own.']
    ],
    glucose: [
      ['Glucose oxidase–peroxidase (GOD-POD, Trinder)', 'Photometry ~505 nm', 'Glucose → gluconic acid + H₂O₂; peroxidase forms a pink quinoneimine dye.'],
      ['Hexokinase–G6PD', 'Reference, UV 340 nm', 'Glucose is phosphorylated, then NADPH formation is measured; fewest interferences.'],
      ['Glucose dehydrogenase / oxidase electrodes', 'POCT, blood gas', 'Amperometric sensors in glucometers; some GDH strips read maltose / galactose falsely.']
    ],
    hba1c: [
      ['Ion-exchange HPLC', 'NGSP / IFCC traceable', 'Separates HbA1c and detects Hb variants (HbS, HbE, HbF).'],
      ['Immunoturbidimetric inhibition', 'Chemistry analyser', 'Antibody to the N-terminal glycated β-chain; the result is a ratio to total Hb.'],
      ['Enzymatic (fructosyl peptide oxidase)', 'Chemistry analyser', 'Protease releases glycated dipeptides that are measured enzymatically.'],
      ['Boronate affinity / capillary electrophoresis', 'POCT / specialised', 'Boronate binds all glycated Hb (less affected by variants).']
    ],
    renal: [
      ['Urea: urease–GLDH kinetic', 'UV 340 nm', 'Urea → NH₃; GLDH uses NADH (fall in absorbance). Berthelot (indophenol) is the colorimetric alternative.'],
      ['Creatinine: Jaffe kinetic (alkaline picrate)', 'Photometry ~510 nm', 'Orange-red complex; rate-blanked or compensated for non-creatinine chromogens (ketones, cephalosporins, bilirubin).'],
      ['Creatinine: enzymatic', 'IDMS-traceable', 'Creatininase → creatinase → sarcosine oxidase → H₂O₂; fewer interferences; preferred for eGFR, children.']
    ],
    lyte: [
      ['Indirect ISE', 'Chemistry analysers', 'Sample is diluted before measurement — high lipid / protein causes pseudohyponatraemia.'],
      ['Direct ISE', 'Blood gas / POCT', 'Undiluted whole blood or plasma; unaffected by lipid / protein volume.'],
      ['Bicarbonate: enzymatic (PEPC)', 'UV 340 nm', 'Total CO₂ on chemistry analysers; calculated HCO₃⁻ on blood-gas analysers.'],
      ['Flame photometry', 'Historic', 'Na⁺ / K⁺ emission intensity.']
    ],
    ca: [
      ['Calcium: o-cresolphthalein complexone or Arsenazo III', 'Photometry', 'Total calcium; correct for albumin or measure ionised calcium.'],
      ['Ionised calcium: ISE', 'Blood gas', 'Anaerobic heparinised sample; pH-dependent.'],
      ['Phosphate: phosphomolybdate', 'UV 340 nm', 'Unreduced ammonium phosphomolybdate complex.'],
      ['Magnesium: xylidyl blue / calmagite / enzymatic', 'Photometry', 'Avoid haemolysed samples (RBC Mg is higher).']
    ],
    lipid: [
      ['Cholesterol: CHOD-PAP', 'Enzymatic colorimetric', 'Cholesterol esterase + oxidase → H₂O₂ → Trinder dye.'],
      ['Triglyceride: GPO-PAP', 'Enzymatic colorimetric', 'Lipase → glycerol → GK → GPO → H₂O₂; glycerol-blank where available.'],
      ['HDL / LDL: direct homogeneous', 'Detergent / PEG-modified enzymes', 'Selectively measure one lipoprotein class without precipitation.'],
      ['LDL: calculated', 'Friedewald / Martin-Hopkins / Sampson', 'Friedewald is invalid when TG > 400 mg/dL (4.5 mmol/L) or non-fasting with high TG; ultracentrifugation is the reference.']
    ],
    lft: [
      ['ALT / AST: IFCC kinetic', 'UV 340 nm', 'NADH consumption; with pyridoxal-5′-phosphate per IFCC.'],
      ['ALP: p-nitrophenyl phosphate', '405 nm', 'Release of yellow p-nitrophenol in AMP buffer.'],
      ['GGT: Szasz / IFCC', '405 nm', 'L-γ-glutamyl-3-carboxy-4-nitroanilide substrate.'],
      ['Bilirubin: diazo (Jendrassik-Grof) or vanadate oxidation', 'Photometry', 'Total with accelerator (caffeine); direct without; protect from light.'],
      ['Albumin: bromocresol green (BCG) / purple (BCP)', 'Dye binding', 'BCG overestimates at low albumin; BCP preferred in renal patients by some labs.'],
      ['Total protein: Biuret', 'Photometry ~546 nm', 'Cu²⁺ complexes with peptide bonds.']
    ],
    cardiac: [
      ['High-sensitivity troponin I / T', 'CLIA / ECLIA sandwich', 'ng/L results; 99th-percentile URL is assay-specific — never mix assays for serial samples.'],
      ['POCT troponin', 'Immunofluorescence', 'Fast but usually less sensitive than lab hs-assays.'],
      ['CK: IFCC kinetic', 'UV 340 nm', 'Creatine phosphate → ATP → hexokinase/G6PD → NADPH.'],
      ['CK-MB', 'Immunoinhibition or mass CLIA', 'Mass assay is preferred; immunoinhibition is affected by macro-CK / CK-BB.'],
      ['NT-proBNP / BNP', 'CLIA / ECLIA', 'Heart-failure rule-out; age-dependent cut-offs.']
    ],
    amylase: [
      ['Amylase: blocked p-nitrophenyl maltoheptaoside (EPS-G7) / CNP-G3', '405 nm', 'Enzymatic cleavage releases a chromophore; IFCC method.'],
      ['Lipase: colorimetric (DGGR / methylresorufin) or turbidimetric', 'Photometry', 'More specific than amylase for pancreatitis.']
    ],
    iron: [
      ['Serum iron: ferrozine / ferene', 'Colorimetric', 'Fe³⁺ released from transferrin by acid, reduced to Fe²⁺, forms a coloured complex.'],
      ['UIBC / TIBC', 'Colorimetric', 'Excess iron saturates transferrin; unbound iron is measured (TIBC = iron + UIBC).'],
      ['Transferrin', 'Immunoturbidimetry', 'Transferrin saturation % = iron ÷ TIBC × 100.'],
      ['Ferritin', 'CLIA / ECLIA / latex turbidimetry', 'Watch for hook effect at very high levels (HLH, Still’s disease).']
    ],
    crp: [
      ['Latex-enhanced immunoturbidimetry', 'Quantitative', 'Standard and high-sensitivity (0.1–10 mg/L) ranges.'],
      ['Latex slide agglutination', 'Semi-quantitative', 'Titre by doubling dilutions; screening only.'],
      ['Nephelometry / POCT', 'Quantitative', 'Light scatter measurement; POCT cartridges for primary care.']
    ],
    uric: [
      ['Uricase–peroxidase (Trinder)', 'Photometry ~520 nm', 'Uric acid → allantoin + H₂O₂ → coloured dye. Rasburicase in the tube continues to break down urate (keep on ice).'],
      ['Uricase UV (293 nm)', 'Reference', 'Fall in absorbance as uric acid is oxidised.']
    ],
    ammonia: [
      ['Glutamate dehydrogenase (GLDH)', 'UV 340 nm', 'NH₃ + α-ketoglutarate + NADPH → glutamate; fall in absorbance. Fill tube fully, on ice, analyse within 30 min.'],
      ['Dry chemistry', 'Slide method', 'Bromophenol-blue indicator slides (e.g. Vitros).']
    ],
    lactate: [
      ['Lactate oxidase–peroxidase', 'Colorimetric', 'Lactate → pyruvate + H₂O₂ → Trinder dye.'],
      ['Lactate oxidase electrode', 'Blood gas / POCT', 'Amperometric — fastest for sepsis / critical care.']
    ],
    uacr: [
      ['Urine albumin', 'Immunoturbidimetry', 'Measures albumin specifically (microalbumin range).'],
      ['Urine creatinine', 'Jaffe / enzymatic', 'Corrects for urine concentration: ACR (mg/g or mg/mmol).'],
      ['Total protein', 'Pyrogallol red-molybdate / benzethonium turbidimetry', 'Detects albumin and globulins / light chains (24-h or PCR).'],
      ['Dipstick protein', 'Protein error of indicator', 'Screening; mainly albumin, misses light chains.']
    ],
    thyroid: [
      ['TSH: third-generation sandwich immunoassay', 'CLIA / ECLIA', 'Functional sensitivity ≤ 0.01 mIU/L.'],
      ['FT4 / FT3: competitive (analogue / two-step)', 'CLIA / ECLIA', 'Biotin, heterophile antibodies and binding-protein abnormalities interfere.'],
      ['ELISA', 'Manual / semi-automated', 'Microplate format for smaller labs.'],
      ['Equilibrium dialysis + LC-MS/MS', 'Reference', 'Gold standard for free T4.']
    ],
    repro: [
      ['FSH, LH, prolactin: sandwich immunoassay', 'CLIA / ECLIA', 'Screen high prolactin for macroprolactin (PEG precipitation).'],
      ['Estradiol, progesterone, testosterone: competitive immunoassay', 'CLIA / ECLIA', 'Poor accuracy at low levels (women, children, men on therapy) — use LC-MS/MS where possible.'],
      ['AMH', 'CLIA / ELISA', 'Method-specific values (pmol/L vs ng/mL; 1 ng/mL ≈ 7.14 pmol/L).'],
      ['LC-MS/MS', 'Reference', 'Steroid profiling; avoids antibody cross-reactivity.']
    ],
    cortisol: [
      ['Competitive immunoassay', 'CLIA / ECLIA', 'Prednisolone and 11-deoxycortisol may cross-react.'],
      ['LC-MS/MS', 'Specific', 'Preferred for dynamic tests and patients on steroids.'],
      ['Late-night salivary cortisol', 'ELISA / LC-MS/MS', 'Cushing’s screening.']
    ],
    bhcg: [
      ['Quantitative serum β-hCG', 'CLIA / ECLIA sandwich', 'Total hCG in mIU/mL (IU/L); used for doubling time and monitoring.'],
      ['Urine card / strip', 'Immunochromatography', 'Qualitative; cut-off around 20–25 mIU/mL; can miss very early pregnancy and the high-dose hook effect.']
    ],
    vitd: [
      ['25-OH vitamin D: competitive immunoassay', 'CLIA / ECLIA', 'Total D2 + D3; equimolar recognition varies between kits.'],
      ['LC-MS/MS', 'Gold standard', 'Separates D2, D3 and the C3-epimer.'],
      ['Vitamin B12 / folate', 'Competitive CLIA (intrinsic factor / folate-binding protein)', 'Anti-intrinsic-factor antibodies can falsely normalise B12; active B12 (holoTC) is an alternative.']
    ],
    pth: [
      ['Intact PTH (second generation)', 'CLIA / ECLIA sandwich', 'Detects PTH 1-84 and 7-84 fragments; EDTA plasma is more stable than serum.'],
      ['Third-generation (bio-intact 1-84)', 'CLIA', 'Specific for full-length PTH; used in CKD by some labs.']
    ],
    insulin: [
      ['Insulin / C-peptide: sandwich immunoassay', 'CLIA / ECLIA / ELISA', 'Haemolysis degrades insulin (insulin-degrading enzyme); separate quickly.'],
      ['HOMA-IR (calculated)', 'Formula', 'Fasting insulin (µIU/mL) × fasting glucose (mmol/L) ÷ 22.5.']
    ],
    psa: [
      ['Total & free PSA', 'CLIA / ECLIA sandwich', 'WHO-standardised; % free PSA = free ÷ total × 100 (same platform).'],
      ['Rapid card', 'Immunochromatography', 'Qualitative screening only — confirm quantitatively.']
    ],
    tmark: [
      ['CEA, AFP, CA-125, CA 19-9, CA 15-3', 'CLIA / ECLIA sandwich', 'Results are method-specific — do not switch methods while monitoring a patient.'],
      ['ELISA', 'Microplate', 'Batch testing in smaller labs.']
    ],
    urme: [
      ['Reagent strip (dipstick)', 'Reflectance photometry', 'pH (double indicator), protein (protein error — albumin), glucose (GOD-POD), ketones (nitroprusside), blood (peroxidase-like Hb activity), bilirubin (diazo), urobilinogen (Ehrlich / diazo), nitrite (Griess), leucocyte esterase (indoxyl ester), SG (polyelectrolyte pKa).'],
      ['Sediment microscopy', 'Manual', '10 mL urine, centrifuge ~400 g for 5 min, resuspend 0.5 mL; report cells per HPF, casts per LPF.'],
      ['Automated urine particle analysis', 'Flow cytometry / digital imaging', 'Counts RBC, WBC, bacteria, casts, crystals; review flagged samples manually.'],
      ['Confirmatory tests', 'Chemical', 'Benedict’s (reducing sugars), sulphosalicylic acid (all proteins incl. Bence-Jones), Rothera’s (ketones), Fouchet’s (bilirubin).']
    ],
    ucs: [
      ['Semi-quantitative culture', 'Calibrated loop', '1 µL loop × 1000 or 10 µL loop × 100 = CFU/mL; CLED or chromogenic agar ± blood agar.'],
      ['Identification', 'Biochemical / automated / MALDI-TOF', 'Conventional biochemicals, automated ID cards (e.g. VITEK 2) or mass spectrometry.'],
      ['Susceptibility', 'Disc diffusion / MIC', 'Kirby-Bauer, broth microdilution, gradient strips (E-test) — interpret with current CLSI / EUCAST breakpoints.']
    ],
    srme: [
      ['Direct wet mounts', 'Microscopy', 'Saline (motile trophozoites) and Lugol’s iodine (cyst nuclei).'],
      ['Concentration', 'Formol-ether sedimentation / flotation', 'Increases detection of ova and cysts.'],
      ['Occult blood: immunochemical (FIT)', 'Immunoassay', 'Specific for human globin; no diet restriction; preferred for screening.'],
      ['Occult blood: guaiac (gFOBT)', 'Peroxidase', 'Affected by red meat, vitamin C, iron, NSAIDs.'],
      ['Antigen tests', 'ICT / ELISA', 'H. pylori stool antigen, rotavirus / adenovirus, Giardia / Cryptosporidium; faecal calprotectin.']
    ],
    csf: [
      ['Cell count & differential', 'Counting chamber + cytospin', 'Count within 1 h (cells lyse); correct for traumatic tap.'],
      ['Glucose / protein', 'Hexokinase or GOD / turbidimetry', 'Always pair CSF glucose with a blood glucose.'],
      ['Gram, India ink, ZN stains', 'Microscopy', 'Rapid organism detection.'],
      ['Culture, CrAg LFA, multiplex PCR', 'Microbiology / molecular', 'Cryptococcal antigen lateral flow; meningitis-encephalitis PCR panels.'],
      ['Xanthochromia', 'Spectrophotometry', 'Bilirubin / oxyhaemoglobin peaks for suspected subarachnoid haemorrhage (>12 h after onset).']
    ],
    semen: [
      ['Manual microscopy (WHO 2021)', 'Reference', 'Motility on a 37 °C slide, concentration with an improved Neubauer haemocytometer, morphology on stained smears (strict criteria), vitality by eosin-nigrosin.'],
      ['CASA', 'Computer-assisted', 'Automated motility / concentration — validate against manual.'],
      ['MAR / Immunobead test', 'Antisperm antibodies', 'Percentage of motile sperm bound to particles.']
    ],
    dengue: [
      ['NS1 antigen', 'ICT / ELISA', 'Best in days 1–5 of fever.'],
      ['IgM / IgG antibodies', 'ICT / MAC-ELISA', 'IgM from day 4–5; high IgG early suggests secondary infection.'],
      ['RT-PCR', 'Molecular', 'Days 1–5; serotyping.']
    ],
    widal: [
      ['Widal tube agglutination', 'Serology', 'O and H antibody titres; a 4-fold rise in paired sera is significant. The slide test is screening only.'],
      ['Rapid IgM tests (Typhidot, Tubex)', 'ICT', 'Variable performance.'],
      ['Blood culture', 'Gold standard', 'Highest yield in the first week; bone-marrow culture if on antibiotics.']
    ],
    viral: [
      ['Rapid immunochromatographic tests', 'Screening', 'HBsAg, anti-HCV, HIV-1/2; follow the national testing algorithm.'],
      ['ELISA / CLIA / ECLIA', 'Lab screening', '4th-generation HIV Ag/Ab combo; HBsAg and anti-HCV on immunoassay analysers.'],
      ['Confirmation', 'Molecular / supplementary', 'HIV: three-test strategy or immunoblot; HCV: HCV RNA PCR; HBV: HBV DNA; blood banks use NAT.'],
      ['Syphilis: VDRL / RPR + TPHA / TPPA / EIA', 'Flocculation + treponemal', 'Non-treponemal titre for activity / response; treponemal test to confirm.']
    ],
    rheum: [
      ['RF', 'Latex agglutination / immunoturbidimetry', 'Quantitative IU/mL by turbidimetry or nephelometry.'],
      ['ASO', 'Latex agglutination / immunoturbidimetry', 'Paired samples 2 weeks apart show a rising titre.'],
      ['Anti-CCP', 'ELISA / CLIA', 'More specific for rheumatoid arthritis than RF.']
    ],
    bcs: [
      ['Automated continuous-monitoring culture', 'BACT/ALERT · BACTEC', 'CO₂ sensor (colorimetric / fluorescent) flags positives; standard 5-day protocol.'],
      ['Manual bottles', 'Biphasic / broth', 'Daily inspection with blind subcultures.'],
      ['Positive-bottle work-up', 'Gram + rapid ID', 'Gram stain (critical call), subculture, direct MALDI-TOF or multiplex PCR panels, direct AST.']
    ]
  };
})();
