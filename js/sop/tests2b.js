/* =====================================================================
   LabGenie SOP Guidebook · tests2b.js
   Additional test guides: endocrinology (incl. special-handling panels),
   tumour markers, immunology, therapeutic drug monitoring, infection
   serology / molecular, body fluids. Approximate, method-dependent ranges.
   ===================================================================== */
(function () {
  'use strict';
  const G = (window.SOPG = window.SOPG || {});
  const RT = 'Room temp (20–25 °C)', CD = 'Refrigerated (2–8 °C)', FZ = 'Frozen (−20 °C)', FZ7 = 'Frozen (−70 °C)';
  const TDMNOTE = 'Use a plain red tube (no gel) — some drugs adsorb to separator gel.';

  G.TESTS.push(
    /* ===================== ENDOCRINOLOGY ===================== */
    {
      id: 'acth', n: 'ACTH (Adrenocorticotropic Hormone)', aka: 'acth corticotropin addison cushing adrenal insufficiency pituitary', dept: 'Endocrinology', cat: 'Adrenal', sp: 'EDTA plasma', tube: 'ice', vol: '3 mL (pre-chilled plastic EDTA tube)',
      time: '07:00–10:00 with a paired cortisol; record exact time.', pre: ['Pre-chill the tube; plastic tubes only (ACTH sticks to glass).', 'Place on ice immediately.'], proc: ['Refrigerated centrifuge within 30 min; separate plasma into a plastic tube.', 'Freeze at once if not analysed within 2 h.'],
      ref: { u: ['pg/mL', 'pmol/L'], r: [['Adult, morning (07–10 h)', '7.2–63.3', '1.6–13.9'], ['Evening', 'About half of morning value', '']] },
      hi: ['Primary adrenal insufficiency (Addison’s), Cushing’s disease, ectopic ACTH (lung carcinoid / SCLC), CAH, stress.'], lo: ['Adrenal Cushing’s (cortisol-secreting tumour), exogenous steroids, hypopituitarism.'],
      corr: ['Low cortisol + high ACTH → primary adrenal failure; low cortisol + low / normal ACTH → secondary (pituitary or steroid use).', 'High cortisol + high ACTH → pituitary / ectopic Cushing’s; high cortisol + suppressed ACTH → adrenal source.'],
      hx: ['All steroid use (oral, inhaled, topical, joint injections), shift work, acute illness, pregnancy.'], st: [['On ice, unspun', '≤ 30 min'], [CD + ', separated plasma', '3 h'], [FZ, '1 month']], hil: { h: 'Proteases degrade ACTH — reject haemolysed samples.' }, rej: ['Not chilled / delayed separation', 'Glass tube', 'Haemolysed sample', 'Collection time not recorded'],
      spc: 'Pre-chilled plastic EDTA tube → ice → refrigerated centrifuge within 30 min → freeze plasma.',
      m: [['Sandwich immunoassay (CLIA / ECLIA)', 'Analyser', 'Detects intact ACTH 1-39.']]
    },
    {
      id: 'raa', n: 'Renin, Aldosterone & Aldosterone : Renin Ratio (ARR)', aka: 'renin aldosterone arr aldosterone renin ratio primary aldosteronism conn hyperaldosteronism resistant hypertension pra drc', dept: 'Endocrinology', cat: 'Adrenal', sp: 'EDTA plasma (renin) + serum / plasma (aldosterone)', tube: 'lav', vol: '2 × 3 mL',
      time: 'Mid-morning: patient out of bed ≥ 2 h, then seated 5–15 min before sampling.', pre: ['Correct hypokalaemia first (low K⁺ suppresses aldosterone).', 'Unrestricted salt intake.', 'Stop interfering drugs if safe: spironolactone, eplerenone, amiloride, triamterene and diuretics ≥ 4 weeks; ACE-i, ARBs, β-blockers, dihydropyridine CCBs, NSAIDs ~2 weeks. Use verapamil, hydralazine or α-blockers meanwhile.'], proc: ['Keep at room temperature — do NOT put renin samples on ice (cold activates prorenin → falsely high renin).', 'Centrifuge at room temperature within 2 h; freeze plasma promptly.'],
      ref: { u: ['conventional', 'SI'], r: [['Aldosterone — upright', '4–31 ng/dL', '111–860 pmol/L'], ['Plasma renin activity (PRA) — upright', '0.5–4.0 ng/mL/h', ''], ['ARR screening positive (PRA-based)', '> 20–30 (ng/dL per ng/mL/h) with aldosterone > 15 ng/dL', '> 750 pmol/L per ng/mL/h'], ['Direct renin concentration (DRC)', 'Assay-specific (mU/L)', '']] },
      hi: ['Primary aldosteronism: high aldosterone + suppressed renin → high ARR.', 'Secondary hyperaldosteronism: both high (renal artery stenosis, diuretics, heart failure, cirrhosis).'], lo: ['Both low: Liddle syndrome, liquorice, Cushing’s, CAH variants.', 'High renin + low aldosterone: Addison’s disease.'],
      corr: ['A positive ARR needs confirmation (saline infusion, captopril or oral salt-loading test) before imaging / adrenal vein sampling.', 'Hypertension + hypokalaemia or resistant hypertension → screen.'],
      hx: ['Antihypertensive drugs and stop dates, K⁺ level, salt intake, pregnancy, oestrogen / OCP (drospirenone lowers DRC → false-positive ARR).'], st: [[RT + ', unspun', '≤ 2 h'], [FZ + ', separated plasma', '3 months']], hil: { h: 'Minor.', l: 'May interfere with immunoassays.' }, rej: ['Renin sample placed on ice / refrigerated before separation', 'Posture or drug history not documented'],
      spc: 'Room temperature (not ice) for renin; posture and drug-washout documented on the request.',
      m: [['Aldosterone: CLIA / LC-MS/MS', 'Immunoassay / reference', 'LC-MS/MS avoids cross-reactivity.'], ['PRA: angiotensin I generation', 'Enzyme kinetic', 'Measures renin activity (ng/mL/h).'], ['DRC: sandwich CLIA', 'Immunoassay', 'Measures renin mass; ARR cut-offs differ.']]
    },
    {
      id: 'gh', n: 'Growth Hormone (GH) & IGF-1', aka: 'growth hormone gh igf-1 igf1 somatomedin acromegaly gigantism short stature', dept: 'Endocrinology', cat: 'Pituitary', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'IGF-1: any time. Random GH is not useful (pulsatile) — use dynamic tests.', pre: ['GH deficiency: stimulation test (insulin tolerance, glucagon, arginine). Acromegaly: GH suppression in 75 g OGTT.'], proc: ['Separate promptly; freeze if delayed.'],
      ref: { u: ['IGF-1 ng/mL', ''], r: [['Child 6–10 y', '50–330', ''], ['Adolescent 13–16 y', '190–590', ''], ['Adult 21–30 y', '115–355', ''], ['Adult 31–50 y', '90–275', ''], ['Adult 51–70 y', '70–235', ''], ['GH nadir in OGTT (normal suppression)', '< 1 µg/L (< 0.4 with sensitive assays)', '']] },
      hi: ['Acromegaly / gigantism, puberty, pregnancy.'], lo: ['GH deficiency, malnutrition, liver disease, hypothyroidism, poorly controlled diabetes, oral oestrogen, anorexia.'],
      corr: ['Raised age-matched IGF-1 + failure of GH suppression on OGTT → acromegaly → pituitary MRI.', 'IGF-1 ranges are assay- and age-specific — always use the kit’s age table.'],
      hx: ['Growth charts, bone age, puberty stage, nutrition, oestrogen therapy.'], st: [[RT, '1 day'], [CD, '3 days'], [FZ, '6 months']], hil: {}, rej: ['Random GH requested to diagnose deficiency (advise dynamic test)'],
      m: [['IGF-1 / GH: CLIA sandwich', 'Analyser', 'IGF-1 assays include an IGFBP-release step.']]
    },
    {
      id: 'dheas', n: 'DHEA-S (Dehydroepiandrosterone Sulfate)', aka: 'dheas dhea-s adrenal androgen hirsutism virilisation pcos', dept: 'Endocrinology', cat: 'Adrenal', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time (little diurnal variation).', pre: [], proc: ['Stable.'],
      ref: { u: ['µg/dL', 'µmol/L'], r: [['Female 20–29 y', '65–380', '1.8–10.2'], ['Female 40–49 y', '25–220', '0.7–6.0'], ['Male 20–29 y', '280–640', '7.6–17.4'], ['Male 50–59 y', '70–310', '1.9–8.4']] },
      hi: ['Adrenal tumour (> 700 µg/dL — urgent imaging), CAH, PCOS (mild), Cushing’s disease.'], lo: ['Adrenal insufficiency, steroid therapy, ageing.'],
      corr: ['Rapid-onset virilisation + very high DHEA-S → adrenal carcinoma; high testosterone with normal DHEA-S → ovarian source.'],
      hx: ['Onset / speed of hirsutism, menstrual history, DHEA supplements, steroid use.'], st: [[RT, '1 day'], [CD, '2 weeks'], [FZ, '1 year']], hil: {}, rej: [],
      m: [['Competitive CLIA / ECLIA', 'Analyser', '']]
    },
    {
      id: 'ohp', n: '17-Hydroxyprogesterone (17-OHP)', aka: '17ohp 17-ohp 17 hydroxyprogesterone cah congenital adrenal hyperplasia 21 hydroxylase newborn screening', dept: 'Endocrinology', cat: 'Adrenal', sp: 'Serum (newborn: dried blood spot)', tube: 'gold', vol: '2 mL',
      time: 'Adult women: early-morning sample in the follicular phase (day 3–7). Newborn screen: heel-prick after 24–48 h of life.', pre: ['Avoid sampling during luteal phase (falsely high).'], proc: ['Stable.'],
      ref: { u: ['ng/dL', 'nmol/L'], r: [['Female follicular', '15–70', '0.5–2.1'], ['Female luteal', '35–290', '1.0–8.7'], ['Male adult', '27–199', '0.8–6.0'], ['NCAH screening cut-off (follicular)', '> 200', '> 6'], ['Diagnostic of 21-OH deficiency', '> 1000', '> 30']] },
      hi: ['21-hydroxylase deficiency (classic / non-classic CAH), luteal phase, pregnancy, preterm / sick neonates.'], lo: [],
      corr: ['Borderline basal values → ACTH (Synacthen) stimulation test.', 'Salt-wasting crisis in neonate: hyponatraemia + hyperkalaemia + ambiguous genitalia.'],
      hx: ['Cycle day, pregnancy, gestational age / birth weight (newborn), steroids.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '6 months']], hil: {}, rej: ['Newborn spot collected < 24 h of life (false positives)'],
      m: [['LC-MS/MS', 'Preferred', 'Avoids cross-reactivity in neonates.'], ['Immunoassay', 'Screening', 'False positives in preterm infants.']]
    },
    {
      id: 'meta', n: 'Metanephrines & Catecholamines', aka: 'metanephrines normetanephrine catecholamines vma pheochromocytoma phaeochromocytoma paraganglioma adrenaline noradrenaline', dept: 'Endocrinology', cat: 'Adrenal', sp: 'Plasma (EDTA) or 24-h urine', tube: 'ice', vol: '4 mL plasma or full 24-h urine',
      time: 'Plasma: supine for 30 min after cannula insertion, then draw. Urine: 24-h collection with acid preservative (per lab).', pre: ['Avoid caffeine, nicotine and alcohol for 24 h; strenuous exercise beforehand.', 'Interfering drugs: tricyclics, SNRIs, MAOIs, levodopa, phenoxybenzamine, sympathomimetics (decongestants); paracetamol interferes with some HPLC methods.', 'Catecholamines / VMA: avoid bananas, vanilla, citrus, chocolate for 48 h (less relevant for metanephrines by LC-MS/MS).'], proc: ['Plasma: on ice, centrifuge within 1 h, freeze.', 'Urine: keep refrigerated during collection; record volume.'],
      ref: { u: ['plasma nmol/L', ''], r: [['Plasma free normetanephrine', '< 0.9 (rises with age)', ''], ['Plasma free metanephrine', '< 0.5', ''], ['Strongly suggestive', '≥ 3–4 × upper limit', '']] },
      hi: ['Phaeochromocytoma / paraganglioma.', 'False positives: seated sampling, stress, drugs, renal failure, OSA, heart failure.'], lo: [],
      corr: ['Mild elevations (< 2× URL) are usually false positives — repeat supine with drug review or clonidine suppression test.', 'Episodic headache, sweating, palpitations with hypertension → test.'],
      hx: ['Medications, posture during sampling, adrenal incidentaloma, MEN2 / VHL / NF1 family history.'], st: [['Plasma on ice, unspun', '≤ 1 h'], [FZ7 + ', separated plasma', '6 months'], ['Acidified 24-h urine, 2–8 °C', '1 week']], hil: { h: 'Minor.' }, rej: ['Seated / non-rested plasma sample (flag)', 'Unacidified urine where the method requires it'],
      spc: 'Supine rest 30 min with cannula; on ice; urine needs acid preservative.',
      m: [['LC-MS/MS', 'Reference', 'Plasma free or urine fractionated metanephrines.'], ['HPLC-ECD / ELISA', 'Alternative', 'More drug / diet interference.']]
    },
    {
      id: 'hiaa', n: '5-HIAA (24-h Urine)', aka: '5 hiaa 5-hiaa hydroxyindoleacetic acid carcinoid neuroendocrine serotonin', dept: 'Endocrinology', cat: 'Neuroendocrine', sp: '24-h urine (acid preservative)', tube: 'u24', vol: 'Entire 24-h collection',
      time: 'Avoid serotonin-rich foods for 48–72 h before and during collection.', pre: ['Avoid: bananas, pineapple, kiwi, plums, avocado, tomatoes, aubergine, walnuts, pecans.', 'Drugs raising 5-HIAA: paracetamol, guaifenesin, some cough mixtures; lowering: MAOIs, levodopa (discuss before stopping).'], proc: ['Acid preservative (HCl / acetic acid per lab); keep cool; record volume.'],
      ref: { u: ['mg / 24 h', 'µmol / 24 h'], r: [['Adult', '2–9', '10–47']] },
      hi: ['Midgut neuroendocrine tumour with carcinoid syndrome; dietary / drug interference; malabsorption (coeliac, Whipple — mild).'], lo: ['Renal impairment, MAOIs.'],
      corr: ['Flushing, diarrhoea, wheeze, right-heart valve disease + high 5-HIAA → carcinoid syndrome; chromogranin A supports.'],
      hx: ['Diet and drugs during the 3 days before collection.'], st: [['Acidified urine, 2–8 °C', '1 week'], [FZ, '1 month']], rej: ['No acid preservative (if required)', 'Incomplete collection'],
      m: [['HPLC-ECD / LC-MS/MS', 'Reference', '']]
    },
    {
      id: 'ucort', n: 'Cushing’s Screening (24-h UFC, Late-night Salivary, 1 mg DST)', aka: 'cushing urine free cortisol ufc dexamethasone suppression test dst late night salivary cortisol hypercortisolism', dept: 'Endocrinology', cat: 'Adrenal', sp: '24-h urine / saliva / serum', tube: 'u24', vol: 'Full 24-h urine (× 2–3) · saliva swab · serum',
      time: 'DST: 1 mg dexamethasone at 23:00, serum cortisol at 08:00 next morning. Salivary: at 23:00 on two nights.', pre: ['No food, drink, smoking or tooth brushing 30 min before saliva collection.', 'Note oestrogen / OCP (raises CBG → falsely high serum cortisol in DST), enzyme-inducing drugs (faster dexamethasone breakdown).'], proc: ['UFC: no preservative / boric acid per lab; keep cool; measure creatinine to check completeness.'],
      ref: { u: ['result', ''], r: [['24-h UFC (LC-MS/MS)', '< 45–50 µg / 24 h (method-specific)', ''], ['1 mg overnight DST — normal suppression', 'Cortisol < 1.8 µg/dL (< 50 nmol/L)', ''], ['Late-night salivary cortisol', 'Below kit cut-off (~ < 0.1–0.15 µg/dL)', '']] },
      hi: ['Cushing’s syndrome; pseudo-Cushing (depression, alcohol, obesity, uncontrolled diabetes); pregnancy; high fluid intake (UFC).'], lo: ['Adrenal insufficiency; incomplete urine collection.'],
      corr: ['Two different abnormal first-line tests are needed before ACTH testing and imaging.', 'Measure dexamethasone level with the DST if results are unexpected.'],
      hx: ['All steroid exposure, OCP, CYP3A4 inducers (carbamazepine, rifampicin, phenytoin), shift work, alcohol.'], st: [[CD + ', urine', '1 week'], ['Saliva, room temp', '1 week'], [FZ, 'Months']], rej: ['Incomplete 24-h collection (low creatinine)', 'Saliva contaminated with blood / food'],
      m: [['LC-MS/MS', 'Preferred', 'Specific; avoids metabolite cross-reactivity.'], ['Immunoassay', 'Alternative', 'Higher values; method-specific ranges.']]
    },
    {
      id: 'calcitonin', n: 'Calcitonin', aka: 'calcitonin medullary thyroid carcinoma mtc men2 c cell', dept: 'Endocrinology', cat: 'Thyroid', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Fasting morning sample.', pre: ['Stop PPIs if clinically safe (raise calcitonin).'], proc: ['Calcitonin is unstable: separate within 1 h (ideally chilled) and freeze.'],
      ref: { u: ['pg/mL', ''], r: [['Male', '< 10 (method-specific)', ''], ['Female', '< 6', '']] },
      hi: ['Medullary thyroid carcinoma, C-cell hyperplasia (MEN2), CKD, PPIs, hypercalcaemia, smokers, other neuroendocrine tumours.'], lo: [],
      corr: ['After MTC surgery, calcitonin + CEA doubling time indicates prognosis.', 'Not the same as procalcitonin.'],
      hx: ['Thyroid nodule, family history of MTC / MEN2 (RET), PPI use, kidney function.'], st: [['Unspun, room temp', '≤ 1 h'], [FZ + ', separated', '3 months']], rej: ['Delayed separation at room temperature'],
      spc: 'Separate within 1 h and freeze.',
      m: [['CLIA / ECLIA sandwich', 'Analyser', '']]
    },
    {
      id: 'tg', n: 'Thyroglobulin & Thyroid Antibodies (Anti-TPO, Anti-Tg, TRAb)', aka: 'thyroglobulin tg anti tpo anti-tpo anti tg trab tsh receptor antibody graves hashimoto thyroid cancer follow up', dept: 'Endocrinology', cat: 'Thyroid', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Tg for cancer follow-up: same laboratory and method each time; > 6 weeks after FNA or surgery.', pre: ['Always measure anti-Tg with Tg — antibodies make Tg falsely low.'], proc: ['Stable.'],
      ref: { u: ['result', ''], r: [['Anti-TPO', '< 34 IU/mL (method-specific)', ''], ['Anti-Tg', '< 115 IU/mL (method-specific)', ''], ['TRAb', '< 1.75 IU/L', ''], ['Tg after total thyroidectomy + ablation (excellent response)', '< 0.2 ng/mL (stimulated < 1)', '']] },
      hi: ['Anti-TPO / anti-Tg: Hashimoto’s thyroiditis, Graves’, postpartum thyroiditis (risk of hypothyroidism).', 'TRAb: Graves’ disease (predicts neonatal thyrotoxicosis in pregnancy).', 'Tg: residual / recurrent differentiated thyroid cancer, goitre, thyroiditis.'], lo: [],
      corr: ['Subclinical hypothyroidism + positive anti-TPO → higher progression risk.', 'Rising anti-Tg after thyroid cancer surgery is itself a marker of possible recurrence.'],
      hx: ['Thyroid surgery / RAI dates, pregnancy, biotin, recent FNA.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '1 year']], hil: {}, rej: [],
      m: [['CLIA / ECLIA', 'Analyser', 'Tg assays vary widely — never switch methods during follow-up.'], ['LC-MS/MS Tg', 'Specialised', 'Used when anti-Tg is present.']]
    },
    {
      id: 'gastrin', n: 'Gastrin (Fasting)', aka: 'gastrin gastrinoma zollinger ellison zes peptic ulcer achlorhydria', dept: 'Endocrinology', cat: 'Neuroendocrine', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: '12-h fast. Stop PPIs ≥ 1 week and H2 blockers 48 h only if clinically safe (discuss with the clinician).', pre: [], proc: ['Separate promptly and freeze (gastrin degrades at room temperature).'],
      ref: { u: ['pg/mL', ''], r: [['Fasting adult', '< 100', ''], ['Gastrinoma likely (with gastric pH < 2)', '> 1000', '']] },
      hi: ['Gastrinoma (ZES), PPI / H2 blocker use, atrophic gastritis / pernicious anaemia (achlorhydria), H. pylori, CKD, G-cell hyperplasia.'], lo: [],
      corr: ['Always interpret with gastric pH; high gastrin with high gastric pH → achlorhydria, not gastrinoma.'],
      hx: ['Acid-suppressing drugs, refractory ulcers, diarrhoea, MEN1 family history.'], st: [['Unspun, room temp', '≤ 1 h'], [FZ + ', separated', '1 month']], rej: ['Non-fasting sample', 'On PPI (flag on report)'],
      m: [['CLIA / RIA', 'Immunoassay', '']]
    },

    /* ===================== TUMOUR MARKERS ===================== */
    {
      id: 'chga', n: 'Chromogranin A', aka: 'chromogranin a cga neuroendocrine tumour net carcinoid', dept: 'Tumor markers', cat: 'Neuroendocrine', sp: 'Serum / EDTA plasma', tube: 'gold', vol: '2 mL',
      time: 'Fasting; stop PPIs 2 weeks before if safe.', pre: [], proc: ['Use the same method for serial monitoring.'],
      ref: { u: ['ng/mL', ''], r: [['Adult', '< 100 (method-specific)', '']] },
      hi: ['Neuroendocrine tumours, phaeochromocytoma.', 'False ↑: PPIs, atrophic gastritis, CKD, heart failure, liver disease, IBD.'], lo: [],
      corr: ['Best for monitoring a known NET; not a screening test.'],
      hx: ['PPI use, renal function.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '6 months']], rej: [],
      m: [['ELISA / TRACE immunoassay', 'Specialised', 'Results differ between kits.']]
    },
    {
      id: 'he4', n: 'HE4 & ROMA Index', aka: 'he4 human epididymis protein 4 roma ovarian cancer adnexal mass ca-125', dept: 'Tumor markers', cat: 'Gynaecological', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time; record menopausal status.', pre: [], proc: ['Measure CA-125 on the same platform for ROMA.'],
      ref: { u: ['result', ''], r: [['HE4 — premenopausal', '< 70 pmol/L', ''], ['HE4 — postmenopausal', '< 140 pmol/L', ''], ['ROMA high risk — premenopausal', '≥ 11.4 % (platform-specific)', ''], ['ROMA high risk — postmenopausal', '≥ 29.9 %', '']] },
      hi: ['Epithelial ovarian cancer, endometrial cancer.', 'False ↑: CKD, smoking, older age.'], lo: [],
      corr: ['HE4 is less affected than CA-125 by endometriosis, fibroids and menstruation — ROMA combines both.'],
      hx: ['Menopausal status, renal function, smoking.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '6 months']], rej: [],
      m: [['CLIA / ELISA', 'Immunoassay', 'ROMA formula is assay-specific.']]
    },

    /* ===================== IMMUNOLOGY ===================== */
    {
      id: 'ana', n: 'ANA (IIF on HEp-2) & ENA Profile', aka: 'ana antinuclear antibody hep-2 ena sm rnp ro la ssa ssb scl-70 jo-1 centromere sle sjogren scleroderma connective tissue', dept: 'Immunology', cat: 'Autoantibodies', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Any time.', pre: [], proc: ['Report titre and ICAP pattern (homogeneous, speckled, nucleolar, centromere, cytoplasmic).'],
      ref: { u: ['result', ''], r: [['ANA IIF', 'Negative at < 1:80 (or < 1:160)', ''], ['ENA antibodies', 'Negative', '']] },
      hi: ['SLE (> 95 %), Sjögren’s, systemic sclerosis, MCTD, myositis, autoimmune hepatitis.', 'Low titres in healthy people (~13 % at 1:80; more in elderly), infections, malignancy, drugs (hydralazine, procainamide, isoniazid, anti-TNF).'], lo: [],
      corr: ['Homogeneous → anti-dsDNA / histone; speckled → ENA; centromere → limited systemic sclerosis; nucleolar → systemic sclerosis.', 'Positive ANA alone does not mean disease — needs clinical features.'],
      hx: ['Joint pain, rash, photosensitivity, dry eyes / mouth, Raynaud’s, drugs.'], st: [[CD, '1 week'], [FZ, '1 year']], hil: { h: 'Gross haemolysis may give background staining.', l: 'Lipaemia may increase background.' }, rej: [],
      m: [['Indirect immunofluorescence (HEp-2 cells)', 'Gold standard', 'Titre + pattern.'], ['ELISA / CLIA / line immunoassay', 'ENA', 'Specific antigens.']]
    },
    {
      id: 'dsdna', n: 'Anti-dsDNA Antibodies', aka: 'anti dsdna double stranded dna sle lupus nephritis crithidia', dept: 'Immunology', cat: 'Autoantibodies', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time; with C3 / C4 for activity monitoring.', pre: [], proc: ['Same method for serial monitoring.'],
      ref: { u: ['IU/mL', ''], r: [['Negative (method-specific)', '< 10–30', '']] },
      hi: ['SLE (highly specific), especially with lupus nephritis; activity correlates with titre.'], lo: [],
      corr: ['Rising anti-dsDNA with falling C3 / C4 → flare risk.', 'Crithidia IIF is most specific; ELISA more sensitive.'],
      hx: ['Known SLE, renal involvement, treatment changes.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['ELISA / CLIA', 'Quantitative', ''], ['Crithidia luciliae IIF', 'Confirmation', 'Kinetoplast staining.']]
    },
    {
      id: 'anca', n: 'ANCA (PR3 / MPO)', aka: 'anca c-anca p-anca pr3 mpo vasculitis gpa wegener mpa egpa rpgn pulmonary renal', dept: 'Immunology', cat: 'Autoantibodies', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Urgent in suspected rapidly progressive GN or pulmonary-renal syndrome (same-day result).', pre: [], proc: ['Antigen-specific PR3 and MPO immunoassay first (international consensus); IIF optional.'],
      ref: { u: ['result', ''], r: [['PR3-ANCA', 'Negative (method-specific)', ''], ['MPO-ANCA', 'Negative', '']] },
      hi: ['PR3 (c-ANCA): granulomatosis with polyangiitis.', 'MPO (p-ANCA): microscopic polyangiitis, EGPA, renal-limited vasculitis.', 'Atypical p-ANCA: IBD, autoimmune liver disease; drug-induced (hydralazine, levamisole-cut cocaine, PTU).'], lo: [],
      corr: ['Positive ANCA + haematuria / rising creatinine → urgent nephrology referral.'],
      hx: ['Sinusitis, haemoptysis, haematuria, rash, neuropathy, drugs.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['PR3 / MPO CLIA / ELISA', 'First line', ''], ['IIF on ethanol- and formalin-fixed neutrophils', 'Pattern', 'c-ANCA cytoplasmic; p-ANCA perinuclear.']]
    },
    {
      id: 'c3c4', n: 'Complement C3 & C4', aka: 'complement c3 c4 ch50 hereditary angioedema c1 inhibitor sle glomerulonephritis', dept: 'Immunology', cat: 'Proteins', sp: 'Serum', tube: 'gold', vol: '2 mL',
      time: 'Any time.', pre: [], proc: ['Separate within 2 h; CH50 / C1-inhibitor function need frozen (−70 °C) serum.'],
      ref: { u: ['mg/dL', 'g/L'], r: [['C3', '90–180', '0.9–1.8'], ['C4', '10–40', '0.1–0.4']] },
      hi: ['Acute-phase response, pregnancy.'], lo: ['Both ↓: active SLE, cryoglobulinaemia, immune-complex GN.', 'C3 ↓, C4 normal: post-streptococcal GN, C3 glomerulopathy, aHUS.', 'C4 ↓, C3 normal: hereditary angioedema (check C1-inhibitor), cryoglobulinaemia.'],
      corr: ['Recurrent swelling without urticaria + low C4 → C1-inhibitor level and function.'],
      hx: ['SLE activity, recent sore throat / skin infection, recurrent angioedema.'], st: [[RT, '< 2 h unseparated'], [CD + ', separated', '3 days'], [FZ7, '6 months (CH50)']], rej: ['Delayed separation (in-vitro activation)'],
      m: [['Immunoturbidimetry / nephelometry', 'Chemistry analyser', ''], ['CH50 / AH50', 'Functional', 'Screens for complement deficiency.']]
    },
    {
      id: 'ttg', n: 'Coeliac Serology (tTG-IgA, Total IgA, EMA, DGP)', aka: 'coeliac celiac ttg tissue transglutaminase iga ema endomysial dgp gliadin gluten', dept: 'Immunology', cat: 'Autoantibodies', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Patient must be eating gluten (≥ 1 meal with gluten daily for 6 weeks) before testing.', pre: ['Always measure total IgA with tTG-IgA.'], proc: ['Stable.'],
      ref: { u: ['result', ''], r: [['tTG-IgA', 'Negative (method-specific, e.g. < 7–20 U/mL)', ''], ['Total IgA (adult)', '70–400 mg/dL', '']] },
      hi: ['Coeliac disease; type 1 diabetes, autoimmune thyroid disease, Down / Turner syndrome (higher prevalence).'], lo: [],
      corr: ['IgA deficiency (2–3 % of coeliacs) → tTG-IgA false negative → use DGP-IgG / tTG-IgG.', 'Children: tTG-IgA ≥ 10× ULN + positive EMA on a second sample can allow diagnosis without biopsy (ESPGHAN).'],
      hx: ['Gluten intake, IgA deficiency, iron deficiency, chronic diarrhoea, short stature, family history.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: ['Patient on a gluten-free diet (flag — false negative)'],
      m: [['tTG-IgA ELISA / CLIA', 'First line', ''], ['EMA IIF (monkey oesophagus)', 'Confirmation', 'Highly specific.'], ['DGP-IgG', 'IgA-deficient patients', '']]
    },
    {
      id: 'hlab27', n: 'HLA-B27', aka: 'hla b27 ankylosing spondylitis axial spondyloarthritis reactive arthritis uveitis', dept: 'Immunology', cat: 'Genetic markers', sp: 'Whole blood (EDTA)', tube: 'lav', vol: '3 mL',
      time: 'Any time.', pre: [], proc: ['Flow cytometry: keep at room temperature, test within 48 h; PCR is more stable.'],
      ref: { u: ['result', ''], r: [['General population', 'Positive in ~6–8 %', '']] },
      hi: ['Ankylosing spondylitis (~90 % positive), reactive arthritis, psoriatic / IBD arthritis, acute anterior uveitis.'], lo: [],
      corr: ['A positive result supports but does not diagnose spondyloarthritis — combine with MRI / X-ray and clinical criteria.'],
      hx: ['Inflammatory back pain, uveitis, family history.'], st: [[RT + ', EDTA', '48 h (flow) · 1 week (PCR)']], rej: ['Refrigerated / old sample for flow cytometry'],
      m: [['Flow cytometry', 'Screening', 'Anti-B27 antibody; cross-reacts with B7.'], ['PCR (SSP)', 'Confirmation', 'Genotyping.']]
    },
    {
      id: 'ige', n: 'Total IgE & Specific IgE (Allergy)', aka: 'ige total ige specific ige allergy atopy immunocap rast abpa parasite', dept: 'Immunology', cat: 'Allergy', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Any time; antihistamines do not affect blood IgE (unlike skin-prick tests).', pre: [], proc: ['Stable.'],
      ref: { u: ['result', ''], r: [['Total IgE — adult', '< 100 IU/mL', ''], ['Total IgE — infant < 1 y', '< 15 IU/mL', ''], ['Total IgE — child 1–5 y', '< 60 IU/mL', ''], ['Specific IgE', '< 0.35 kUA/L (class 0)', '']] },
      hi: ['Atopy (asthma, eczema, rhinitis), helminth infection (common in endemic areas), ABPA (often > 1000 IU/mL), hyper-IgE syndrome, EGPA.'], lo: [],
      corr: ['Specific IgE shows sensitisation, not necessarily clinical allergy — correlate with history.', 'High total IgE + eosinophilia → check stool for parasites.'],
      hx: ['Allergen exposure, asthma control, deworming, anti-IgE therapy (omalizumab).'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['Fluoroenzyme immunoassay (ImmunoCAP)', 'Specific IgE', ''], ['CLIA / ELISA', 'Total IgE', '']]
    },
    {
      id: 'cryo', n: 'Cryoglobulins', aka: 'cryoglobulins cryoglobulinaemia hepatitis c vasculitis purpura waldenstrom', dept: 'Immunology', cat: 'Proteins', sp: 'Serum (kept at 37 °C)', tube: 'red', vol: '10 mL',
      time: 'Fasting preferred (lipids cloud the serum).', pre: ['Pre-warm syringe and plain tubes to 37 °C; transport in a 37 °C flask / warm water.'], proc: ['Clot at 37 °C for 1 h, centrifuge warm.', 'Store serum at 4 °C for up to 7 days and inspect daily for precipitate; quantify (cryocrit) and type by immunofixation.'],
      ref: { u: ['result', ''], r: [['Normal', 'Not detected', '']] },
      hi: ['Type I (monoclonal): myeloma, Waldenström.', 'Type II / III (mixed): hepatitis C (most common), autoimmune disease (Sjögren’s, SLE), lymphoma.'], lo: [],
      corr: ['Often with low C4 and positive RF; check HCV.', 'Purpura, arthralgia, neuropathy, glomerulonephritis.'],
      hx: ['HCV / HBV, autoimmune disease, lymphoproliferative disease, cold sensitivity.'], st: [['37 °C until separated', '—'], ['Serum at 4 °C', '7 days (observation)']], rej: ['Sample cooled before separation (false negative)'],
      spc: 'Keep at 37 °C from collection until the serum is separated.',
      m: [['Cold precipitation + cryocrit', 'Manual', ''], ['Immunofixation of washed precipitate', 'Typing', '']]
    },

    /* ===================== THERAPEUTIC DRUG MONITORING ===================== */
    {
      id: 'digoxin', n: 'Digoxin Level', aka: 'digoxin tdm digitalis toxicity heart failure atrial fibrillation', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: 'At least 6–8 h after the last dose (ideally just before the next dose).', pre: ['Record dose, time of last dose and sampling time.', TDMNOTE], proc: ['Stable.'],
      ref: { u: ['ng/mL', 'nmol/L'], r: [['Heart failure target', '0.5–0.9', '0.6–1.2'], ['General therapeutic', '0.8–2.0', '1.0–2.6'], ['Toxic', '> 2.0', '> 2.6']] },
      hi: ['Overdose, renal impairment, elderly, interacting drugs (amiodarone, verapamil, quinidine, macrolides).', 'False ↑: digoxin-like substances (neonates, pregnancy, renal / liver failure), spironolactone (some assays).'], lo: ['Poor adherence, malabsorption, early sampling error.'],
      corr: ['Toxicity is more likely with low K⁺, low Mg²⁺, high Ca²⁺ even at “normal” levels — check electrolytes and creatinine.', 'After digoxin-specific antibody (Fab) treatment, total digoxin is not interpretable.'],
      hx: ['Nausea, visual changes (yellow vision), bradycardia / arrhythmias, renal function.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '6 months']], rej: ['Collected < 6 h after the dose (flag)'],
      m: [['Immunoassay (CLIA / CMIA / turbidimetric)', 'Analyser', '']]
    },
    {
      id: 'lithium', n: 'Lithium Level', aka: 'lithium tdm bipolar toxicity', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: '12 h after the last dose (trough); 5–7 days after a dose change.', pre: ['NEVER use a lithium-heparin tube (falsely toxic result).'], proc: ['Stable.'],
      ref: { u: ['mmol/L', ''], r: [['Maintenance', '0.6–1.0', ''], ['Elderly', '0.4–0.8', ''], ['Toxic', '> 1.5', ''], ['Severe toxicity', '> 2.5', '']] },
      hi: ['Dehydration, renal impairment, NSAIDs, ACE-i / ARBs, thiazides, overdose.'], lo: ['Non-adherence, pregnancy (increased clearance).'],
      corr: ['Monitor creatinine / eGFR, TSH and calcium every 6 months.', 'Tremor, ataxia, confusion, vomiting → urgent level.'],
      hx: ['Dose and timing, new drugs, vomiting / diarrhoea, fluid intake.'], crit: '> 1.5 mmol/L', st: [[RT, '1 day'], [CD, '1 week']], rej: ['Lithium-heparin tube', 'Sampling time not 12 h post-dose (flag)'],
      m: [['ISE / colorimetric / flame photometry / AAS', 'Analyser', '']]
    },
    {
      id: 'valproate', n: 'Valproate (Valproic Acid) Level', aka: 'valproate valproic acid sodium valproate tdm epilepsy', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: 'Trough (before the morning dose) at steady state (2–4 days).', pre: [TDMNOTE], proc: ['Stable.'],
      ref: { u: ['µg/mL', 'µmol/L'], r: [['Therapeutic (total)', '50–100', '350–700'], ['Toxic', '> 150', '> 1040']] },
      hi: ['Overdose, hypoalbuminaemia (free fraction ↑), aspirin interaction.'], lo: ['Non-adherence, carbapenems (sharp fall), enzyme inducers.'],
      corr: ['Check ammonia and LFTs if confused (hyperammonaemia can occur with normal levels).', 'Low albumin / uraemia → consider free valproate level.'],
      hx: ['Seizure control, pregnancy (teratogenic), albumin, interacting drugs.'], st: [[RT, '1 day'], [CD, '1 week'], [FZ, '3 months']], rej: ['Gel tube (some methods)'],
      m: [['Immunoassay', 'Analyser', '']]
    },
    {
      id: 'phenytoin', n: 'Phenytoin Level', aka: 'phenytoin epanutin tdm epilepsy free phenytoin albumin correction', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: 'Trough at steady state (5–7 days or longer — non-linear kinetics); IV loading: 2–4 h after.', pre: [TDMNOTE], proc: ['Stable.'],
      ref: { u: ['µg/mL', 'µmol/L'], r: [['Total phenytoin', '10–20', '40–80'], ['Free phenytoin', '1–2', '4–8']] },
      hi: ['Small dose increases cause large level rises (saturable metabolism); interactions (fluconazole, isoniazid, amiodarone).'], lo: ['Non-adherence, enzyme inducers, pregnancy.'],
      corr: ['Low albumin: corrected = measured ÷ (0.2 × albumin g/dL + 0.1) (use 0.1 × albumin + 0.1 in renal failure) — or measure free level.', 'Toxicity: nystagmus, ataxia, slurred speech.'],
      hx: ['Albumin, renal failure, interacting drugs, seizure control.'], st: [[RT, '1 day'], [CD, '1 week']], rej: ['Gel tube'],
      m: [['Immunoassay', 'Analyser', '']]
    },
    {
      id: 'carbamazepine', n: 'Carbamazepine Level', aka: 'carbamazepine tegretol tdm epilepsy trigeminal neuralgia hla-b 1502', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: 'Trough; steady state takes 2–4 weeks after starting (auto-induction).', pre: [TDMNOTE], proc: ['Stable.'],
      ref: { u: ['µg/mL', 'µmol/L'], r: [['Therapeutic', '4–12', '17–51'], ['Toxic', '> 15', '> 63']] },
      hi: ['Interactions (erythromycin, clarithromycin, fluconazole, verapamil, grapefruit).'], lo: ['Auto-induction, non-adherence, enzyme inducers.'],
      corr: ['Check sodium (hyponatraemia), CBC and LFTs.', 'HLA-B*15:02 screening recommended before starting in South / Southeast Asian patients (SJS / TEN risk).'],
      hx: ['Rash, dizziness, diplopia, new drugs.'], st: [[RT, '1 day'], [CD, '1 week']], rej: ['Gel tube'],
      m: [['Immunoassay', 'Analyser', 'Epoxide metabolite is not measured by most immunoassays.']]
    },
    {
      id: 'vanco', n: 'Vancomycin Level', aka: 'vancomycin tdm trough auc mrsa nephrotoxicity', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Serum', tube: 'red', vol: '2 mL',
      time: 'Trough: within 30 min before the 4th dose (steady state). AUC dosing: peak 1–2 h after the infusion ends plus a trough.', pre: ['Record exact dose, infusion start / end and sampling times.', 'Never sample from the line used for the infusion.'], proc: ['Stable.'],
      ref: { u: ['mg/L', ''], r: [['Trough — most infections', '10–15', ''], ['Trough — serious infections (traditional)', '15–20', ''], ['AUC₂₄ target (guideline)', '400–600 mg·h/L', '']] },
      hi: ['Renal impairment, elderly, high dose, interacting nephrotoxins (piperacillin-tazobactam, aminoglycosides).'], lo: ['Augmented renal clearance (young, sepsis, burns), under-dosing.'],
      corr: ['Monitor creatinine at least twice weekly; rising creatinine → re-check level.'],
      hx: ['Renal function, weight, dialysis, other nephrotoxic drugs.'], st: [[RT, '1 day'], [CD, '3 days']], rej: ['Sampling time / dose time not documented', 'Drawn from the infusion line'],
      m: [['Immunoassay (turbidimetric / CMIA)', 'Analyser', '']]
    },
    {
      id: 'tacro', n: 'Tacrolimus & Ciclosporin (Whole Blood)', aka: 'tacrolimus ciclosporin cyclosporine tdm transplant immunosuppressant trough c0 c2', dept: 'Therapeutic drugs', cat: 'TDM', sp: 'Whole blood (EDTA)', tube: 'lav', vol: '2 mL',
      time: 'Trough (C0) 12 h after the dose, just before the next; ciclosporin C2 exactly 2 h post-dose if used.', pre: ['Whole blood only — the drug is concentrated in red cells. Do not centrifuge.'], proc: ['Stable in EDTA whole blood.'],
      ref: { u: ['ng/mL', ''], r: [['Tacrolimus C0 (depends on organ and time after transplant)', '5–15', ''], ['Ciclosporin C0', '100–300', '']] },
      hi: ['CYP3A4 inhibitors (azoles, macrolides, diltiazem, grapefruit), diarrhoea (tacrolimus), liver dysfunction.'], lo: ['Non-adherence, CYP3A4 inducers (rifampicin, carbamazepine, phenytoin, St John’s wort).'],
      corr: ['Check creatinine, K⁺, Mg²⁺, glucose (tacrolimus) and BP.'],
      hx: ['Transplant type and date, dose timing, new drugs.'], st: [[RT + ', whole blood', '1 week'], [CD, '2 weeks']], rej: ['Plasma / serum sent instead of whole blood', 'Clotted sample'],
      m: [['LC-MS/MS', 'Reference', 'Specific for the parent drug.'], ['Immunoassay', 'Analyser', 'Metabolite cross-reactivity gives higher values.']]
    },

    /* ===================== INFECTION SEROLOGY / MOLECULAR ===================== */
    {
      id: 'torch', n: 'TORCH Serology (Toxoplasma, Rubella, CMV, HSV)', aka: 'torch toxoplasma rubella cmv cytomegalovirus hsv herpes igm igg avidity pregnancy congenital infection', dept: 'Serology', cat: 'Antenatal / congenital', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Pregnancy: ideally early first trimester (baseline). Newborn: within the first 2–3 weeks.', pre: ['Send gestational age and the reason for testing.'], proc: ['Positive IgM → IgG avidity (and repeat after 2–3 weeks).'],
      ref: { u: ['result', ''], r: [['IgM', 'Negative', ''], ['IgG', 'Positive = past infection / immunity', ''], ['IgG avidity — high', 'Infection > 3–4 months ago', '']] },
      hi: ['IgM +: recent infection, persistent IgM (months), or false positive (cross-reactivity, RF).', 'IgG seroconversion between paired samples → recent infection.'], lo: [],
      corr: ['High-avidity IgG in early pregnancy excludes infection in the past ~4 months (toxoplasma) / ~3 months (CMV).', 'Newborn IgG is maternal — use IgM, PCR (urine / saliva for CMV within 3 weeks).', 'Do not order TORCH as a blanket screen; test the specific infection.'],
      hx: ['Rash / fever in pregnancy, cat exposure, raw meat, rubella vaccination, childcare work (CMV), ultrasound findings.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['CLIA / ELISA IgG and IgM', 'Analyser', ''], ['IgG avidity', 'Modified ELISA', 'Urea elution.'], ['PCR', 'Molecular', 'Amniotic fluid, newborn urine / saliva.']]
    },
    {
      id: 'hpylori', n: 'Helicobacter pylori Tests', aka: 'h pylori helicobacter stool antigen urea breath test serology peptic ulcer gastritis', dept: 'Serology', cat: 'GI infection', sp: 'Stool / breath / serum', tube: 'stool', vol: 'Pea-sized stool',
      time: 'Stool antigen / breath test: stop PPIs 2 weeks and antibiotics / bismuth 4 weeks beforehand.', pre: ['Test of cure ≥ 4 weeks after finishing eradication therapy (stool antigen or breath test — not serology).'], proc: ['Stool: refrigerate if not tested the same day.'],
      ref: { u: ['result', ''], r: [['Stool antigen', 'Negative', ''], ['Urea breath test', 'Negative (below cut-off)', ''], ['Serology IgG', 'Negative', '']] },
      hi: ['Active infection (stool antigen / breath test).', 'Serology IgG stays positive for months–years after cure.'], lo: ['False negative: PPIs, antibiotics, bismuth, upper GI bleeding.'],
      corr: ['Serology cannot confirm active infection or cure — use stool antigen / breath test.'],
      hx: ['PPIs, antibiotics, previous eradication, dyspepsia, ulcer, family history of gastric cancer.'], st: [['Stool, room temp', '1 day'], ['Stool, 2–8 °C', '3 days'], ['Stool, −20 °C', 'Months']], rej: ['Patient on PPI (flag — may be false negative)', 'Liquid / watery stool (some kits)'],
      m: [['Monoclonal stool antigen (ELISA / ICT)', 'Active infection', ''], ['¹³C / ¹⁴C urea breath test', 'Active infection', 'Bacterial urease releases labelled CO₂.'], ['IgG serology', 'Exposure only', '']]
    },
    {
      id: 'brucella', n: 'Brucella Serology', aka: 'brucella brucellosis rose bengal sat tube agglutination 2me undulant fever zoonosis raw milk', dept: 'Serology', cat: 'Zoonoses', sp: 'Serum', tube: 'gold', vol: '3 mL',
      time: 'Acute and convalescent (2–4 weeks) samples.', pre: ['If blood culture is also requested, tell the laboratory — Brucella is a high-risk organism for laboratory staff.'], proc: ['Screen with Rose Bengal; titrate positives by SAT; dilute well past 1:640 to avoid prozone.'],
      ref: { u: ['titre', ''], r: [['SAT — significant (endemic area)', '≥ 1:160', ''], ['SAT — significant (non-endemic)', '≥ 1:80', ''], ['Rising titre', '≥ 4-fold in paired sera', '']] },
      hi: ['Brucellosis.', 'Cross-reactions: Yersinia enterocolitica O:9, Vibrio cholerae, Francisella, Salmonella.'], lo: ['Early infection, prozone at very high antibody levels (false negative).'],
      corr: ['2-ME test (IgG) helps separate active / chronic infection from residual IgM.'],
      hx: ['Raw milk / cheese, livestock work, abattoir, veterinary or lab exposure; fever with sweats, back pain, orchitis.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['Rose Bengal plate test', 'Screening', ''], ['Standard tube agglutination (SAT) ± 2-ME', 'Titre', ''], ['ELISA IgM / IgG', 'Serology', '']]
    },
    {
      id: 'resp', n: 'Respiratory Viruses (SARS-CoV-2, Influenza, RSV)', aka: 'covid sars cov 2 coronavirus influenza flu rsv rapid antigen rt-pcr nasopharyngeal swab', dept: 'Serology', cat: 'Respiratory infection', sp: 'Nasopharyngeal / nasal swab', tube: 'sterile', vol: 'Flocked swab in viral transport medium (VTM)',
      time: 'Within the first 5–7 days of symptoms for antigen tests.', pre: ['Use synthetic flocked swabs (not cotton, calcium alginate or wooden shafts — they inhibit PCR).', 'Full PPE (respirator, eye protection) for collection.'], proc: ['Place swab in VTM, break shaft, cap tightly; triple packaging for transport.'],
      ref: { u: ['result', ''], r: [['RT-PCR', 'Not detected', ''], ['Rapid antigen', 'Negative', '']] },
      hi: ['Infection; PCR can stay positive for weeks after recovery (non-infectious RNA).'], lo: ['False negative: poor swab technique, late sampling, wrong swab, delayed transport.'],
      corr: ['Negative antigen with high suspicion → confirm by PCR.', 'Ct value is a rough guide to viral load (assay-specific).'],
      hx: ['Symptom onset date, vaccination, contact history, immunosuppression.'], st: [['VTM, 2–8 °C', '72 h'], ['VTM, −70 °C', 'Long-term']], rej: ['Cotton / wooden swab', 'Leaking container', 'Dry swab without medium (unless validated)'],
      m: [['RT-PCR / multiplex PCR', 'Molecular', 'Most sensitive.'], ['Rapid antigen (ICT / FIA)', 'POCT', 'Best in early high-viral-load phase.']]
    },
    {
      id: 'hbv', n: 'Hepatitis B Markers & HBV DNA', aka: 'hepatitis b hbsag anti-hbs anti-hbc igm hbeag anti-hbe hbv dna viral load vaccine immunity', dept: 'Serology', cat: 'Hepatitis', sp: 'Serum / EDTA plasma (DNA)', tube: 'gold', vol: '5 mL',
      time: 'Any time.', pre: ['Confidential reporting.'], proc: ['HBV DNA: separate EDTA plasma within 6 h; freeze if delayed.'],
      ref: { u: ['interpretation', ''], r: [['HBsAg − · anti-HBc − · anti-HBs −', 'Susceptible (vaccinate)', ''], ['HBsAg − · anti-HBc − · anti-HBs ≥ 10 mIU/mL', 'Immune by vaccination', ''], ['HBsAg − · anti-HBc + · anti-HBs +', 'Past infection, immune', ''], ['HBsAg + · anti-HBc IgM +', 'Acute infection', ''], ['HBsAg + > 6 months · IgM anti-HBc −', 'Chronic infection', ''], ['HBsAg − · anti-HBc + only', 'Occult / resolving / false positive — check HBV DNA', '']] },
      hi: ['HBeAg +: high replication, high infectivity; HBV DNA guides treatment.'], lo: [],
      corr: ['Chronic HBV: monitor ALT, HBV DNA, AFP / ultrasound (HCC surveillance).', 'Before chemotherapy / rituximab: test HBsAg and anti-HBc (reactivation risk).'],
      hx: ['Vaccination, transfusion, dialysis, tattoos, household / sexual contacts, mother’s HBsAg status, immunosuppression.'], st: [[CD, '5–7 days (serology)'], [FZ, '1 year'], ['EDTA whole blood for DNA, room temp', '≤ 6–24 h']], rej: ['Unlabelled sample — never test'],
      m: [['CLIA / ECLIA / ELISA', 'Serology', 'HBsAg, anti-HBs (quantitative), anti-HBc, HBeAg / anti-HBe.'], ['Real-time PCR', 'Molecular', 'HBV DNA in IU/mL.'], ['Rapid ICT', 'Screening', 'HBsAg only.']]
    },
    {
      id: 'hivvl', n: 'HIV Viral Load & CD4 Count', aka: 'hiv viral load rna cd4 count art monitoring treatment failure', dept: 'Serology', cat: 'HIV', sp: 'EDTA plasma (VL) · EDTA whole blood (CD4)', tube: 'lav', vol: '2 × 4 mL',
      time: 'VL: 6 months after starting ART, then yearly (or per national guideline).', pre: ['Confidential labelling and reporting.'], proc: ['Viral load: separate plasma within 6 h (24 h max as whole blood), freeze at −70 °C if delayed.', 'CD4: keep EDTA whole blood at room temperature (do not refrigerate); test within 48 h.'],
      ref: { u: ['result', ''], r: [['Viral load — suppressed', '< 50 copies/mL (target-not-detected)', ''], ['Virological failure (WHO)', '> 1000 copies/mL on 2 tests', ''], ['CD4 — adult', '500–1500 cells/µL', ''], ['CD4 — advanced disease', '< 200 cells/µL', '']] },
      hi: ['VL ↑: non-adherence, resistance, drug interactions, recent infection / vaccination (blips).'], lo: ['CD4 ↓: HIV progression, acute infections, steroids.'],
      corr: ['CD4 < 200 → PCP prophylaxis; < 100 → screen for cryptococcal antigen (CrAg).'],
      hx: ['ART regimen and adherence, TB co-infection, pregnancy.'], st: [['EDTA whole blood, room temp', 'VL ≤ 24 h · CD4 ≤ 48 h'], ['Plasma, −70 °C', 'Long-term']], rej: ['Refrigerated CD4 sample', 'Clotted sample', 'Unseparated VL sample > 24 h'],
      m: [['Real-time RT-PCR', 'Viral load', 'Copies/mL; log changes ≥ 0.5 are significant.'], ['Flow cytometry', 'CD4', 'Absolute count and %.'], ['POC CD4 / VL', 'Decentralised', '']]
    },
    {
      id: 'tbtest', n: 'TB Diagnostics (IGRA, Xpert MTB/RIF, AFB Smear)', aka: 'tuberculosis tb igra quantiferon xpert genexpert mtb rif afb sputum latent tb', dept: 'Serology', cat: 'Tuberculosis', sp: 'Blood (IGRA) · sputum (Xpert / smear)', tube: 'sterile', vol: 'IGRA tubes 1 mL each · sputum 2–5 mL',
      time: 'Sputum: 2 samples, one early morning. IGRA: any time.', pre: ['IGRA: fill each special tube exactly to the line, shake 10 times; keep at room temperature and incubate at 37 °C within 16 h.', 'Sputum: deep cough, not saliva; collect in open air or a ventilated booth.'], proc: ['Process sputum in a biosafety cabinet.'],
      ref: { u: ['result', ''], r: [['IGRA (QuantiFERON)', 'Negative: < 0.35 IU/mL', ''], ['Xpert MTB/RIF', 'MTB not detected', '']] },
      hi: ['IGRA +: latent or active TB (cannot distinguish).', 'Xpert: MTB detected ± rifampicin resistance (refer for MDR-TB work-up).'], lo: ['IGRA indeterminate: immunosuppression, low lymphocytes, delayed incubation.'],
      corr: ['BCG vaccination does not affect IGRA (unlike tuberculin skin test).', 'Xpert is the WHO-recommended initial test; smear microscopy is used for treatment monitoring.'],
      hx: ['Cough > 2 weeks, weight loss, night sweats, contact history, HIV, diabetes, previous TB treatment.'], st: [['IGRA tubes, room temp', 'Incubate within 16 h'], ['Sputum, 2–8 °C', '3–7 days']], rej: ['Saliva instead of sputum', 'IGRA tubes refrigerated or under / over-filled', 'Leaking sputum container'],
      m: [['Interferon-γ release assay', 'Blood', 'T-cell IFN-γ response to TB antigens (ELISA).'], ['Cartridge-based real-time PCR', 'Sputum', 'MTB DNA + rpoB mutations in ~2 h.'], ['ZN / fluorescence microscopy', 'Sputum', 'Acid-fast bacilli.']]
    },
    {
      id: 'lepto', n: 'Leptospirosis & Scrub Typhus Serology', aka: 'leptospira leptospirosis weil scrub typhus orientia rickettsia weil felix eschar igm elisa mat', dept: 'Serology', cat: 'Tropical fever', sp: 'Serum (± EDTA blood for PCR)', tube: 'gold', vol: '3 mL',
      time: 'IgM after day 5–7 of fever; repeat in 1–2 weeks. PCR on blood in the first week.', pre: [], proc: ['Stable; paired sera tested together.'],
      ref: { u: ['result', ''], r: [['Leptospira IgM ELISA', 'Negative', ''], ['Leptospira MAT', '≥ 4-fold rise or single high titre (locally defined)', ''], ['Scrub typhus IgM ELISA', 'Below local OD cut-off', '']] },
      hi: ['Leptospirosis: flood water, rice fields, rodents; jaundice + AKI + thrombocytopenia (Weil’s).', 'Scrub typhus: eschar, rural / bush exposure; responds to doxycycline.'], lo: ['Early sampling (before antibodies appear).'],
      corr: ['Weil-Felix (OX-K) has poor sensitivity and specificity — prefer IgM ELISA / PCR.', 'Consider both in acute undifferentiated fever with negative dengue / malaria tests.'],
      hx: ['Occupation (farmer, sewer worker), flooding, forest / field exposure, eschar, travel.'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['IgM ELISA / ICT', 'Serology', ''], ['MAT (microscopic agglutination)', 'Reference (leptospira)', 'Live serovar panel; reference labs only.'], ['PCR', 'Molecular', 'Early phase.']]
    },
    {
      id: 'kala', n: 'Kala-azar (Visceral Leishmaniasis) Tests', aka: 'kala azar visceral leishmaniasis rk39 ld bodies amastigote pkdl splenomegaly', dept: 'Serology', cat: 'Tropical fever', sp: 'Serum / finger-prick blood; tissue aspirate', tube: 'gold', vol: '2 mL',
      time: 'Fever > 2 weeks with splenomegaly in an endemic area.', pre: [], proc: ['rK39 ICT per kit; tissue aspirates stained with Giemsa.'],
      ref: { u: ['result', ''], r: [['rK39 ICT', 'Negative', '']] },
      hi: ['Visceral leishmaniasis; rK39 stays positive for years after cure.'], lo: ['Early disease, HIV co-infection (lower sensitivity).'],
      corr: ['rK39 cannot diagnose relapse — use tissue (bone marrow / splenic) aspirate for LD bodies.', 'Pancytopenia, hypergammaglobulinaemia, weight loss support the diagnosis.'],
      hx: ['Residence / travel in endemic districts, previous kala-azar treatment, HIV, skin lesions (PKDL).'], st: [[CD, '1 week'], [FZ, '1 year']], rej: [],
      m: [['rK39 immunochromatography', 'Rapid', ''], ['Giemsa-stained aspirate', 'Parasitological', 'Amastigotes (LD bodies) in macrophages.'], ['PCR', 'Molecular', '']]
    },

    /* ===================== BODY FLUIDS ===================== */
    {
      id: 'fluid', n: 'Pleural & Ascitic Fluid Analysis', aka: 'pleural fluid ascitic fluid ascites effusion light criteria saag sbp ada exudate transudate', dept: 'Clinical Pathology', cat: 'Body fluids', sp: 'Fluid + paired serum', tube: 'sterile', vol: 'EDTA (cells) · plain (chemistry) · culture bottles · heparinised syringe (pH) · 50+ mL for cytology',
      time: 'Send paired blood (protein, LDH, albumin, glucose) at the same time.', pre: ['Pleural pH: anaerobic heparinised syringe, analyse on the blood-gas analyser within 1 h.', 'Inoculate blood-culture bottles at the bedside for suspected infection.'], proc: ['Cell count within 1 h (EDTA); cytology fixed or refrigerated.'],
      ref: { u: ['interpretation', ''], r: [['Exudate (Light’s, any one)', 'Fluid / serum protein > 0.5 · fluid / serum LDH > 0.6 · fluid LDH > ⅔ serum ULN', ''], ['SAAG ≥ 1.1 g/dL', 'Portal hypertension', ''], ['Ascitic neutrophils ≥ 250 /µL', 'Spontaneous bacterial peritonitis', ''], ['Pleural pH < 7.2', 'Complicated effusion / empyema — drain', ''], ['ADA > 40 U/L', 'Suggests TB (high-prevalence areas)', '']] },
      hi: ['Exudates: infection, malignancy, TB, PE, pancreatitis (fluid amylase ↑).', 'Transudates: heart failure, cirrhosis, nephrotic syndrome.'], lo: ['Fluid glucose < 60 mg/dL: empyema, TB, RA, malignancy.'],
      corr: ['Lymphocytic exudate + high ADA → TB pleurisy.', 'Triglyceride > 110 mg/dL → chylothorax.'],
      hx: ['Diuretics (can make transudates look like exudates), liver disease, malignancy, TB contact.'], st: [[RT, 'Cell count ≤ 1 h'], [CD, 'Chemistry / cytology 24–48 h']], hil: { h: 'Traumatic tap raises RBC / LDH.' }, rej: ['Clotted EDTA sample (cell count)', 'pH sample with air or > 1 h old'],
      m: [['Cell count (chamber / body-fluid mode analyser)', 'Haematology', ''], ['Chemistry (protein, LDH, albumin, glucose, ADA)', 'Analyser', ''], ['Cytology (cytospin / cell block)', 'Pathology', '']]
    },
    {
      id: 'synov', n: 'Synovial Fluid Analysis', aka: 'synovial fluid joint aspirate crystals gout pseudogout septic arthritis polarised microscopy msu cppd', dept: 'Clinical Pathology', cat: 'Body fluids', sp: 'Joint aspirate', tube: 'lav', vol: 'EDTA / heparin (cells, crystals) + sterile container (culture)',
      time: 'Examine crystals within 24 h (ideally within 6 h).', pre: ['Avoid powdered / oxalate tubes — they create artefactual crystals.'], proc: ['Wet prep under compensated polarised light.'],
      ref: { u: ['interpretation', ''], r: [['Normal WBC', '< 200 /µL', ''], ['Non-inflammatory', '200–2000 /µL', ''], ['Inflammatory', '2000–50,000 /µL', ''], ['Septic (likely)', '> 50,000 /µL, > 90 % neutrophils', ''], ['MSU (gout)', 'Needle-shaped, strongly negative birefringence', ''], ['CPPD (pseudogout)', 'Rhomboid, weakly positive birefringence', '']] },
      hi: ['Septic arthritis, gout, pseudogout, RA, reactive arthritis.'], lo: [],
      corr: ['Crystals and infection can coexist — always send for Gram stain / culture.'],
      hx: ['Joint involved, previous gout, prosthetic joint, steroid injection, immunosuppression.'], st: [[RT, '≤ 24 h (crystals); cell count ≤ 1 h']], rej: ['Powdered / oxalate tube', 'Clotted sample for cell count'],
      m: [['Polarised light microscopy', 'Crystals', ''], ['Cell count & differential', 'Haematology', '']]
    },
    {
      id: 'sweat', n: 'Sweat Chloride Test', aka: 'sweat chloride cystic fibrosis cf pilocarpine iontophoresis macroduct', dept: 'Clinical Pathology', cat: 'Special tests', sp: 'Sweat', tube: 'sterile', vol: '≥ 15 µL (Macroduct) in 30 min',
      time: 'Infants > 2 weeks old and > 2 kg (≥ 36 weeks corrected); patient well and hydrated.', pre: ['Avoid sites with eczema, oedema or broken skin.'], proc: ['Pilocarpine iontophoresis, collect 30 min, analyse within a few hours (sealed).'],
      ref: { u: ['mmol/L', ''], r: [['CF unlikely', '≤ 29', ''], ['Intermediate', '30–59', ''], ['CF likely', '≥ 60', '']] },
      hi: ['Cystic fibrosis; also adrenal insufficiency, hypothyroidism, malnutrition, eczema (false positive).'], lo: ['Oedema, insufficient sweat (QNS — repeat).'],
      corr: ['Intermediate results → CFTR genetic testing.'],
      hx: ['Newborn screen result, meconium ileus, recurrent chest infections, failure to thrive, salty skin.'], st: [['Sealed collector, room temp', 'Analyse within 72 h per method']], rej: ['Quantity not sufficient (< 15 µL in 30 min)', 'Evaporation / contamination'],
      m: [['Coulometric chloridometry', 'Reference', ''], ['Conductivity', 'Screening only', '']]
    }
  );
})();
