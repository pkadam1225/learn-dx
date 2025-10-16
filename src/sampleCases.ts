export type Subject = 'Clinical' | 'Histopathology';
export type Fitz = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

// Reusable notes type
export type SkinToneNotes = {
  general?: string;
  variants?: Partial<Record<Fitz, string>>;
  pearls?: string[];
  pitfalls?: string[];
};

export type DermCase = {
  id: string;
  imageUrl: string;
  vignette: string;
  leadIn?: string; // NEW: focused NBME-style question line
  correctAnswer: string;
  options: string[];
  explanations: { [key: string]: string };
  subject: Subject;
  fitzpatrick?: Fitz;
  tags: string[];
  // NEW
  skinToneNotes?: SkinToneNotes;
};

// ensure every option has an explanation string
const withCompleteExplanations = (
  c: Omit<DermCase, 'explanations'> & { explanations: DermCase['explanations'] }
): DermCase => {
  const map: Record<string, string> = {};
  c.options.forEach((o) => {
    map[o] = c.explanations[o] ?? 'Explanation coming soon.';
  });
  return { ...c, explanations: map };
};

export const sampleCases: DermCase[] = [
  // CLINICAL — LICHEN PLANUS
  withCompleteExplanations({
    id: 'clinical-lp-1',
    imageUrl: '/images/lichenplanustypeIV.png',
    vignette:
      'A 42-year-old woman has 2 months of intensely pruritic, flat-topped papules on the volar wrists and ankles. Exam shows polygonal violaceous papules with fine white lines.',
    leadIn: 'Which diagnosis best explains these findings?',
    correctAnswer: 'Lichen planus',
    options: ['Lichen planus', 'Psoriasis vulgaris', 'Tinea corporis', 'Atopic dermatitis'],
    explanations: {
      'Lichen planus':
        'Correct. Pruritic, polygonal, violaceous, planar papules with Wickham striae on flexor wrists/ankles.',
      'Psoriasis vulgaris':
        'Incorrect. Sharply demarcated erythematous plaques with silvery scale on extensor surfaces.',
      'Tinea corporis':
        'Incorrect. Annular plaque with central clearing and active scaly border.',
      'Atopic dermatitis':
        'Incorrect. Flexural eczematous pattern with lichenification/pruritus; color typically erythematous/violaceous.',
    },
    fitzpatrick: 'IV',
    subject: 'Clinical',
    tags: ['lichenoid', 'pruritic', 'wrist'],
    skinToneNotes: {
      general:
        'Erythema may be subtle or appear violaceous in darker skin. Wickham striae can be easier with side-lighting. PIH is common after resolution, especially in darker tones.',
      variants: {
        I: 'Red-purple papules; Wickham striae stark white.',
        II: 'Violaceous hue with clear white striae.',
        III: 'Dusky violaceous papules; early PIH.',
        IV: 'Gray-violet papules with fine white striae; PIH frequent.',
        V: 'Gray-brown to violaceous papules; scale subtle; PIH prominent.',
        VI: 'Dark brown/violaceous papules; chalky striae; PIH can be significant.',
      },
      pearls: [
        'Check mucosa (buccal Wickham striae).',
        'Dermoscopy: white reticular lines over violaceous background.',
      ],
      pitfalls: [
        'Confusing with lichen simplex/prurigo when erythema is underappreciated.',
        'Missing drug-induced lichenoid eruptions—always review meds.',
      ],
    },
  }),

  // CLINICAL — PSORIASIS
  withCompleteExplanations({
    id: 'clinical-psoriasis-1',
    imageUrl: '/images/psoriasistypeI.png',
    vignette:
      'A 29-year-old man has recurrent, well-demarcated plaques on the elbows and knees. He notes flaking of the scalp and intermittent nail pitting.',
    leadIn: 'Which of the following is the most likely diagnosis?',
    correctAnswer: 'Psoriasis vulgaris',
    options: ['Psoriasis vulgaris', 'Lichen planus', 'Tinea corporis', 'Allergic contact dermatitis'],
    explanations: {
      'Psoriasis vulgaris':
        'Correct. Extensor plaques with silvery scale; scalp and nail changes (pitting/onycholysis) support the diagnosis.',
      'Lichen planus':
        'Incorrect. Violaceous, flat-topped papules on wrists/ankles; Wickham striae.',
      'Tinea corporis':
        'Incorrect. Annular lesion with central clearing and active border.',
      'Allergic contact dermatitis':
        'Incorrect. Localized to exposure; vesicles/oozing may occur; distribution differs.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['plaques', 'extensors', 'scale'],
    skinToneNotes: {
      general:
        'Erythema shifts toward violaceous or hyperpigmented tones in darker skin; gray-white scale is often more reliable. PIH/PIHp may follow flares.',
      variants: {
        I: 'Bright red plaques with silvery scale.',
        II: 'Red plaques with conspicuous scale/fissuring.',
        III: 'Violaceous-red plaques; scale contrasts less.',
        IV: 'Deep violaceous/brown-red plaques; scale remains useful.',
        V: 'Hyperpigmented to dark-brown plaques with gray-white scale.',
        VI: 'Dark brown/black plaques; rely on thick scale and sharp borders.',
      },
      pearls: [
        'Assess severity by induration/area when erythema is subtle.',
        'Check scalp, umbilicus, and nails.',
      ],
      pitfalls: [
        'Underestimating severity due to muted erythema in darker tones.',
        'Confusing hyperpigmented plaques with tinea or eczema—perform KOH if uncertain.',
      ],
    },
  }),

  // CLINICAL — TINEA CORPORIS
  withCompleteExplanations({
    id: 'clinical-tinea-1',
    imageUrl: '/images/tineacorporistypeV.png',
    vignette:
      'A 24-year-old athlete reports an expanding pruritic annular rash with central clearing and a raised scaly border on the thigh.',
    leadIn: 'Which diagnosis best explains the lesion described?',
    correctAnswer: 'Tinea corporis',
    options: ['Tinea corporis', 'Nummular eczema', 'Pityriasis rosea', 'Psoriasis vulgaris'],
    explanations: {
      'Tinea corporis': 'Correct. Annular, scaly plaque with central clearing and active border.',
      'Nummular eczema': 'Incorrect. Coin-shaped eczematous plaques without central clearing.',
      'Pityriasis rosea': 'Incorrect. Herald patch followed by a Christmas tree distribution.',
      'Psoriasis vulgaris': 'Incorrect. Extensor plaques with silvery scale; not annular with clearing.',
    },
    fitzpatrick: 'V',
    subject: 'Clinical',
    tags: ['annular', 'central-clearing', 'dermatophyte'],
    skinToneNotes: {
      general:
        'Border erythema may be subtle in darker skin; rely on the raised scaly edge and centrifugal growth. Central area may be hypo- or hyperpigmented.',
      variants: {
        I: 'Pink-red annular plaque with scaly advancing border.',
        II: 'Red annular plaque; central clearing obvious.',
        III: 'Brown-red rim; scale is key sign.',
        IV: 'Hyperpigmented rim with fine scale; lighter central clearing.',
        V: 'Dark brown rim; gray scale; central area lighter or darker.',
        VI: 'Black-brown rim; feel for texture; look for trailing scale.',
      },
      pearls: [
        'KOH from the active border improves accuracy when color cues are muted.',
        'Beware tinea incognito after topical steroids.',
      ],
      pitfalls: [
        'Calling nummular eczema when erythema is faint—confirm with KOH.',
        'Assuming central clearing must match surrounding tone.',
      ],
    },
  }),

  // CLINICAL — ATOPIC DERMATITIS
  withCompleteExplanations({
    id: 'clinical-ad-1',
    imageUrl: '/images/adtypeIII.png',
    vignette:
      'A 10-year-old child has dry, itchy patches in the antecubital fossae and popliteal folds. History includes asthma and allergic rhinitis.',
    leadIn: 'Which diagnosis is most likely?',
    correctAnswer: 'Atopic dermatitis',
    options: ['Atopic dermatitis', 'Allergic contact dermatitis', 'Lichen simplex chronicus', 'Scabies'],
    explanations: {
      'Atopic dermatitis':
        'Correct. Flexural distribution in children with atopic comorbidities; lichenification common.',
      'Allergic contact dermatitis':
        'Incorrect. Localized to exposure; vesicles/oozing; lacks typical AD distribution.',
      'Lichen simplex chronicus':
        'Incorrect. Thickened lichenified plaque from chronic scratching, usually in adults.',
      'Scabies':
        'Incorrect. Burrows and intense nocturnal pruritus on hands, wrists, genitals.',
    },
    fitzpatrick: 'III',
    subject: 'Clinical',
    tags: ['flexural', 'atopy', 'peds'],
    skinToneNotes: {
      general:
        'Erythema may appear violaceous/ashen in darker skin. Papular/follicular patterns and lichenification are more prominent; PIH/PIHp common.',
      variants: {
        I: 'Pink-red eczematous patches/plaques.',
        II: 'Red, weepy patches; clear erythema.',
        III: 'Violaceous-red patches; follicular accentuation.',
        IV: 'Gray-violet plaques; papular eczema common.',
        V: 'Brown-gray lichenified plaques; xerosis accentuates lines.',
        VI: 'Dark brown to slate-gray plaques; rely on texture/distribution over redness.',
      },
      pearls: [
        'Look for Dennie–Morgan folds and periorbital darkening.',
        'Treat inflammation early to limit dyspigmentation.',
      ],
      pitfalls: [
        'Undertreating due to subtle erythema.',
        'Confusing with scabies/PR in papular variants.',
      ],
    },
  }),

  // CLINICAL — BASAL CELL CARCINOMA
  withCompleteExplanations({
    id: 'clinical-bcc-1',
    imageUrl: '/images/bcctypeI.png',
    vignette:
      'A 65-year-old man has a slowly enlarging papule on the upper lip. Exam shows a pearly, translucent papule with surface telangiectasias.',
    leadIn: 'Which is the most likely diagnosis?',
    correctAnswer: 'Basal cell carcinoma',
    options: [
      'Basal cell carcinoma',
      'Squamous cell carcinoma in situ (Bowen disease)',
      'Seborrheic keratosis',
      'Acquired melanocytic nevus'
    ],
    explanations: {
      'Basal cell carcinoma': 'Correct. Pearly/translucent papule with telangiectasias and rolled border on a sun-exposed site.',
      'Squamous cell carcinoma in situ (Bowen disease)': 'Incorrect. Scaly erythematous plaque with crust; not pearly/rolled.',
      'Seborrheic keratosis': 'Incorrect. Waxy “stuck-on” papule/plaque with comedo-like openings.',
      'Acquired melanocytic nevus': 'Incorrect. Symmetric, uniform color; usually stable.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['pearly', 'telangiectasia', 'NMSC'],
    skinToneNotes: {
      general:
        'In darker skin, BCC is less common and more often pigmented; telangiectasias are harder to see. Look for rolled/raised borders, translucency, and ulceration rather than redness.',
      variants: {
        I: 'Pearly pink papule with arborizing telangiectasias.',
        II: 'Pearly/erythematous nodule; central ulcer/crust possible.',
        III: 'Tan to brown pearly nodule; vessels less obvious.',
        IV: 'Brown pearly papule/plaque with rolled edge.',
        V: 'Dark brown/black shiny nodule; can mimic melanoma.',
        VI: 'Black shiny plaque; rely on border/ulceration over redness.',
      },
      pearls: [
        'Dermoscopy: arborizing vessels and shiny white structures even when erythema is muted.',
        'Pigmented BCC is common in deeper tones—maintain biopsy threshold.',
      ],
      pitfalls: [
        'Calling SK or scar when telangiectasias aren’t visible.',
        'Assuming “too dark to be BCC.”',
      ],
    },
  }),

  // CLINICAL — MELANOMA (ACRAL)
  withCompleteExplanations({
    id: 'clinical-melanoma-1',
    imageUrl: '/images/melanomatypeVI.png',
    vignette:
      'A 50-year-old woman notices a dark, irregularly shaped enlarging patch on the sole. Dermoscopy shows irregular diffuse pigmentation.',
    leadIn: 'Which diagnosis is most likely?',
    correctAnswer: 'Melanoma (acral lentiginous)',
    options: ['Melanoma (acral lentiginous)', 'Seborrheic keratosis', 'Acral melanocytic nevus', 'Tinea nigra'],
    explanations: {
      'Melanoma (acral lentiginous)':
        'Correct. Irregular, enlarging pigmented lesion on a sole/palm; high suspicion. Parallel ridge pattern on dermoscopy is classic.',
      'Seborrheic keratosis': 'Incorrect. Stuck-on, waxy papule/plaque; not an enlarging irregular patch on the sole.',
      'Acral melanocytic nevus': 'Incorrect. Stable, symmetric; benign network pattern.',
      'Tinea nigra': 'Incorrect. Superficial pigmented infection on palms/soles; scraping/KOH positive; usually uniform brown macule.',
    },
    fitzpatrick: 'VI',
    subject: 'Clinical',
    tags: ['acral', 'irregular', 'melanocytic'],
    skinToneNotes: {
      general:
        'Acral/subungual sites account for a greater share of melanoma in darker skin. Delays occur when mistaken for trauma, tinea nigra, or nevus.',
      variants: {
        I: 'Acral melanoma less common but possible; irregular brown/black macule.',
        II: 'Variegated brown macule/patch; irregular network.',
        III: 'Dark brown macule with blurry borders; parallel ridge pattern is worrisome.',
        IV: 'Deep brown to black patch with irregular borders.',
        V: 'Jet-black lesion; watch for Hutchinson sign subungually.',
        VI: 'Black macule/patch; late presentation more likely.',
      },
      pearls: [
        'Examine palms, soles, and nails routinely across all tones.',
        'Parallel ridge pattern and irregular diffuse pigmentation are red flags.',
      ],
      pitfalls: [
        'Attributing to friction, warts, or tinea nigra without dermoscopy or follow-up.',
        'Relying on “not red” to reassure.',
      ],
    },
  }),

  // HISTOPATHOLOGY — LICHEN PLANUS
  withCompleteExplanations({
    id: 'histo-lp-1',
    imageUrl: '/images/histo-lichenplanus.png',
    vignette:
      'Histology shows a dense, band-like lymphocytic infiltrate at the dermoepidermal junction with sawtoothing of the rete ridges.',
    leadIn: 'Which diagnosis is most consistent with these histologic findings?',
    correctAnswer: 'Lichen planus',
    options: ['Lichen planus', 'Psoriasis vulgaris', 'Cutaneous lupus erythematosus', 'Erythema multiforme'],
    explanations: {
      'Lichen planus': 'Correct. Lichenoid interface dermatitis with sawtooth rete.',
      'Psoriasis vulgaris': 'Incorrect. Parakeratosis, elongated rete ridges, Munro microabscesses.',
      'Cutaneous lupus erythematosus': 'Incorrect. Basal vacuolization, thickened basement membrane.',
      'Erythema multiforme': 'Incorrect. Interface dermatitis with necrotic keratinocytes.',
    },
    subject: 'Histopathology',
    tags: ['lichenoid', 'sawtooth'],
    skinToneNotes: { /* unchanged from yours */ },
  }),

  // HISTOPATHOLOGY — PSORIASIS
  withCompleteExplanations({
    id: 'histo-psoriasis-1',
    imageUrl: '/images/histo-psoriasis.png',
    vignette:
      'Sections show parakeratosis, neutrophils within the stratum corneum (Munro microabscesses), and elongated rete ridges.',
    leadIn: 'Which diagnosis is most consistent with these histologic findings?',
    correctAnswer: 'Psoriasis vulgaris',
    options: ['Psoriasis vulgaris', 'Seborrheic dermatitis', 'Lichen planus', 'Spongiotic dermatitis (eczema)'],
    explanations: {
      'Psoriasis vulgaris':
        'Correct. Parakeratosis with neutrophils (Munro microabscesses) and psoriasiform hyperplasia.',
      'Seborrheic dermatitis': 'Incorrect. More spongiosis; may show Malassezia; lacks Munro abscesses.',
      'Lichen planus': 'Incorrect. Band-like lichenoid infiltrate.',
      'Spongiotic dermatitis (eczema)': 'Incorrect. Spongiosis without parakeratosis with neutrophils.',
    },
    subject: 'Histopathology',
    tags: ['parakeratosis', 'munro'],
    skinToneNotes: { /* unchanged from yours */ },
  }),

  // HISTOPATHOLOGY — BCC
  withCompleteExplanations({
    id: 'histo-bcc-1',
    imageUrl: '/images/histo-bcc1.png',
    vignette:
      'Nests of basaloid cells with peripheral palisading and stromal retraction (clefting) are present.',
    leadIn: 'Which diagnosis is most consistent with these histologic findings?',
    correctAnswer: 'Basal cell carcinoma',
    options: ['Basal cell carcinoma', 'Squamous cell carcinoma', 'Sebaceous carcinoma', 'Trichoepithelioma'],
    explanations: {
      'Basal cell carcinoma': 'Correct. Basaloid nests with palisading and retraction artifact.',
      'Squamous cell carcinoma': 'Incorrect. Keratin pearls/intercellular bridges.',
      'Sebaceous carcinoma': 'Incorrect. Vacuolated cytoplasm; atypia/mitoses.',
      'Trichoepithelioma': 'Incorrect. More follicular differentiation; lacks classic retraction/palisading.',
    },
    subject: 'Histopathology',
    tags: ['palisading', 'retraction'],
    skinToneNotes: { /* unchanged from yours */ },
  }),

  // HISTOPATHOLOGY — MELANOMA
  withCompleteExplanations({
    id: 'histo-melanoma-1',
    imageUrl: '/images/histo-melanoma.png',
    vignette:
      'Atypical melanocytes are present along the dermoepidermal junction with pagetoid spread; invasive nests extend into the dermis.',
    leadIn: 'Which diagnosis is most consistent with these histologic findings?',
    correctAnswer: 'Melanoma',
    options: ['Melanoma', 'Acquired melanocytic nevus', 'Basal cell carcinoma', 'Dermatofibroma'],
    explanations: {
      'Melanoma': 'Correct. Atypical melanocytes with pagetoid spread and dermal invasion.',
      'Acquired melanocytic nevus': 'Incorrect. Uniform benign melanocytes; no invasion.',
      'Basal cell carcinoma': 'Incorrect. Basaloid nests with palisading.',
      'Dermatofibroma': 'Incorrect. Spindle cells and epidermal hyperplasia; not melanocytic.',
    },
    subject: 'Histopathology',
    tags: ['atypical melanocytes', 'invasion'],
    skinToneNotes: { /* unchanged from yours */ },
  }),
];