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
      'A 42-year-old woman presents with pruritic, polygonal, violaceous papules on her wrists. She denies recent medication use.',
    correctAnswer: 'Lichen Planus',
    options: ['Lichen Planus', 'Psoriasis', 'Tinea', 'Atopic Dermatitis'],
    explanations: {
      'Lichen Planus':
        'Correct. Lichen planus presents with pruritic, purple, polygonal, planar papules and plaques, commonly on the wrists.',
      'Psoriasis':
        'Incorrect. Psoriasis typically presents as erythematous plaques with silvery scale on extensor surfaces, not violaceous papules.',
      'Tinea':
        'Incorrect. Tinea corporis presents with annular scaling plaques with central clearing, not violaceous papules.',
      'Atopic Dermatitis':
        'Incorrect. Atopic dermatitis typically affects flexural areas in children and presents with erythema and lichenification.',
    },
    fitzpatrick: 'IV',
    subject: 'Clinical',
    tags: ['lichenoid', 'pruritic', 'wrist'],
    skinToneNotes: {
      general:
        'Erythema may be subtle or appear violaceous in darker skin. Wickham striae can be easier to appreciate with side-lighting. Post-inflammatory dyspigmentation (PIH) is common after resolution, especially in darker tones.',
      variants: {
        I: 'Red-purple papules; Wickham striae stark white against pink background.',
        II: 'Violaceous hue with clear white striae; erythema readily visible.',
        III: 'Dusky violaceous papules; erythema less conspicuous; early PIH on healing.',
        IV: 'Gray-violet papules with fine white striae; PIH frequent and persistent.',
        V: 'Gray-brown to violaceous papules; scale subtle; PIH prominent.',
        VI: 'Dark brown/violaceous papules; striae can appear chalky; PIH can be significant and long-lasting.',
      },
      pearls: [
        'Check mucosa (buccal Wickham striae) if cutaneous erythema is subtle.',
        'Dermoscopy: white reticular lines over a violaceous background.',
      ],
      pitfalls: [
        'Mislabeling as lichen simplex chronicus or prurigo nodularis when erythema is underappreciated.',
        'Missing drug-induced lichenoid eruptions—always review meds.',
      ],
    },
  }),

  // CLINICAL — PSORIASIS
  withCompleteExplanations({
    id: 'clinical-psoriasis-1',
    imageUrl: '/images/psoriasistypeI.png',
    vignette:
      'A 29-year-old man presents with well-demarcated erythematous plaques with silvery scales on the extensor surfaces of his elbows and knees.',
    correctAnswer: 'Psoriasis',
    options: ['Psoriasis', 'Lichen Planus', 'Tinea', 'Contact Dermatitis'],
    explanations: {
      Psoriasis: 'Correct. Classic findings include erythematous plaques with silvery scale on extensor surfaces.',
      'Lichen Planus':
        'Incorrect. Lichen planus lesions are violaceous, flat-topped, and more commonly found on wrists or mucosa.',
      Tinea:
        'Incorrect. Tinea corporis shows annular plaques with central clearing, not silvery scale.',
      'Contact Dermatitis':
        'Incorrect. Contact dermatitis is more likely to be vesicular and located where an irritant/allergen was applied.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['plaques', 'extensors', 'scale'],
    skinToneNotes: {
      general:
        'Erythema shifts toward violaceous or hyperpigmented tones in darker skin; gray-white scale is often more reliable than background redness. PIH/PIHp (hypo) may follow flares.',
      variants: {
        I: 'Bright red plaques with silvery scale; erythema obvious.',
        II: 'Red plaques with conspicuous scale and fissuring.',
        III: 'Violaceous-red plaques; scale contrasts less with background.',
        IV: 'Deep violaceous/brown-red plaques; scale remains useful for detection.',
        V: 'Hyperpigmented to dark-brown plaques with gray-white scale; erythema minimal.',
        VI: 'Dark brown/black plaques; look for thick scale and sharp borders rather than redness.',
      },
      pearls: [
        'Assess severity by induration/area when erythema is subtle.',
        'Check scalp, umbilicus, and nails (pitting/onycholysis) where tone differences matter less.',
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
      'A 24-year-old athlete reports an expanding annular rash with central clearing and raised border on his thigh.',
    correctAnswer: 'Tinea Corporis',
    options: ['Tinea Corporis', 'Nummular Eczema', 'Pityriasis Rosea', 'Psoriasis'],
    explanations: {
      'Tinea Corporis': 'Correct. Presents with an annular, scaly, pruritic plaque with central clearing.',
      'Nummular Eczema': 'Incorrect. Coin-shaped eczematous plaques but lacks central clearing.',
      'Pityriasis Rosea': 'Incorrect. Usually begins with a herald patch followed by a Christmas tree-like distribution.',
      Psoriasis: 'Incorrect. Plaques with silvery scale on extensor surfaces.',
    },
    fitzpatrick: 'V',
    subject: 'Clinical',
    tags: ['annular', 'central-clearing', 'dermatophyte'],
    skinToneNotes: {
      general:
        'Border erythema may be subtle in darker skin; rely on the raised scaly edge and centrifugal growth. Central area may be hypo- or hyperpigmented rather than “normal”.',
      variants: {
        I: 'Pink-red annular plaque with scaly advancing border.',
        II: 'Red annular plaque; central clearing readily visible.',
        III: 'Brown-red rim; scale is key sign; central area often tan.',
        IV: 'Hyperpigmented rim with fine scale; clearing appears lighter than surrounding skin.',
        V: 'Dark brown rim; gray scale at margin; central area may look lighter (hypo) or darker (hyper).',
        VI: 'Black-brown rim; erythema minimal—feel for texture and look for trailing scale.',
      },
      pearls: [
        'KOH from the active border improves accuracy when color cues are muted.',
        'Beware tinea incognito after topical steroids—border becomes less obvious.',
      ],
      pitfalls: [
        'Calling nummular eczema when erythema is faint—confirm with KOH.',
        'Assuming central clearing must match surrounding tone; dyspigmentation is common.',
      ],
    },
  }),

  // CLINICAL — ATOPIC DERMATITIS
  withCompleteExplanations({
    id: 'clinical-ad-1',
    imageUrl: '/images/adtypeIII.png',
    vignette:
      'A 10-year-old child has dry, itchy patches of skin in the antecubital fossa and popliteal folds, with a history of asthma and allergic rhinitis.',
    correctAnswer: 'Atopic Dermatitis',
    options: ['Atopic Dermatitis', 'Contact Dermatitis', 'Lichen Simplex', 'Scabies'],
    explanations: {
      'Atopic Dermatitis':
        'Correct. Commonly affects flexural areas in children and is associated with other atopic diseases.',
      'Contact Dermatitis':
        'Incorrect. Localized to area of contact and lacks the typical distribution of AD.',
      'Lichen Simplex':
        'Incorrect. Thickened, lichenified plaques from chronic scratching, usually in adults.',
      Scabies:
        'Incorrect. Often involves burrows and intense nocturnal pruritus, frequently on hands, wrists, and genitalia.',
    },
    fitzpatrick: 'III',
    subject: 'Clinical',
    tags: ['flexural', 'atopy', 'peds'],
    skinToneNotes: {
      general:
        'Erythema may appear violaceous or ashen in darker skin. Papular/follicular patterns and lichenification are more prominent; PIH/PIHp common.',
      variants: {
        I: 'Pink-red eczematous patches/plaques with excoriations.',
        II: 'Red, weepy patches in flexures; erythema clear.',
        III: 'Violaceous-red patches with follicular accentuation; early dyspigmentation.',
        IV: 'Gray-violet plaques; papular eczema common; PIH notable on resolution.',
        V: 'Brown-gray lichenified plaques; xerosis accentuates scale lines.',
        VI: 'Dark brown to slate-gray plaques; erythema minimal—texture and distribution guide dx.',
      },
      pearls: [
        'Look for Dennie–Morgan folds and periorbital darkening regardless of tone.',
        'Treat PIH expectations proactively; control inflammation to limit dyspigmentation.',
      ],
      pitfalls: [
        'Under-treating due to “not red enough”—assess by itch, sleep impact, and lichenification.',
        'Confusing with scabies or PR in papular variants—check hands, wrists, and contact history.',
      ],
    },
  }),

  // CLINICAL — BASAL CELL CARCINOMA
  withCompleteExplanations({
    id: 'clinical-bcc-1',
    imageUrl: '/images/bcctypeI.png',
    vignette:
      'A 65-year-old man presents with a pearly papule on his upper lip that has been slowly growing over months.',
    correctAnswer: 'Basal Cell Carcinoma',
    options: ['Basal Cell Carcinoma', 'Melanoma', 'Nevus', 'Actinic Keratosis'],
    explanations: {
      'Basal Cell Carcinoma': 'Correct. Pearly papules with telangiectasias on sun-exposed areas are classic.',
      Melanoma: 'Incorrect. Often pigmented and asymmetric with irregular borders.',
      Nevus: 'Incorrect. Benign and stable in size/color.',
      'Actinic Keratosis': 'Incorrect. Rough, scaly patches—not nodular or pearly.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['pearly', 'telangiectasia', 'NMSC'],
    skinToneNotes: {
      general:
        'In darker skin, BCC is less common and more often pigmented; telangiectasias are harder to see. Look for rolled/raised borders, translucency, and ulceration rather than “pinkness”.',
      variants: {
        I: 'Pearly pink papule with arborizing telangiectasias.',
        II: 'Pearly/erythematous nodule; central ulcer or crust possible.',
        III: 'Tan to brown pearly nodule; vessels less obvious.',
        IV: 'Brown pearly papule or plaque with rolled edge; subtle translucency.',
        V: 'Dark brown/black nodular lesion with shiny surface; mimics melanoma.',
        VI: 'Black shiny nodule or plaque; look for ulceration/rolled border over redness.',
      },
      pearls: [
        'Dermoscopy: arborizing vessels and shiny white structures even when erythema is muted.',
        'Pigmented BCC is common in deeper tones—maintain biopsy threshold.',
      ],
      pitfalls: [
        'Mislabeling as seborrheic keratosis or scar when telangiectasias are not visible.',
        'Assuming “too dark to be BCC”—pigmented variants are real.',
      ],
    },
  }),

  // CLINICAL — MELANOMA (ACRAL)
  withCompleteExplanations({
    id: 'clinical-melanoma-1',
    imageUrl: '/images/melanomatypeVI.png',
    vignette:
      'A 50-year-old woman notices a dark, irregularly shaped and enlarging patch on the sole of her foot.',
    correctAnswer: 'Melanoma',
    options: ['Melanoma', 'Seborrheic Keratosis', 'Pigmented BCC', 'Blue Nevus'],
    explanations: {
      Melanoma:
        'Correct. Acral lentiginous melanoma is common in darker skin types and presents on palms/soles.',
      'Seborrheic Keratosis': 'Incorrect. Stuck-on waxy lesions, not enlarging patches.',
      'Pigmented BCC': 'Incorrect. Rare on soles; typically pearly nodules.',
      'Blue Nevus': 'Incorrect. Stable, symmetric, and benign.',
    },
    fitzpatrick: 'VI',
    subject: 'Clinical',
    tags: ['acral', 'irregular', 'melanocytic'],
    skinToneNotes: {
      general:
        'Acral/subungual sites are relatively more common presentations in darker skin. Color often very dark; borders irregular. Delays occur when lesions are mistaken for trauma, tinea nigra, or nevus.',
      variants: {
        I: 'Acral melanoma less common but possible; look for irregular brown/black macule with asymmetry.',
        II: 'Variegated brown macule/patch; irregular network on dermoscopy.',
        III: 'Dark brown macule with blurry borders; parallel ridge pattern on dermoscopy is worrisome.',
        IV: 'Deep brown to black patch with irregular borders and color variegation.',
        V: 'Jet-black to very dark lesion; Hutchinson sign around nail is key subungually.',
        VI: 'Black macule/patch with irregular shape; late presentation more likely—high suspicion on soles/nails.',
      },
      pearls: [
        'Examine palms, soles, and nails routinely across all tones.',
        'Dermoscopy: parallel ridge pattern and irregular diffuse pigmentation are red flags.',
      ],
      pitfalls: [
        'Attributing to friction, warts, or tinea nigra without dermoscopy or follow-up.',
        'Waiting for “redness” or symptoms—color alone is not reassuring.',
      ],
    },
  }),

  // HISTOPATHOLOGY — LICHEN PLANUS
  withCompleteExplanations({
    id: 'histo-lp-1',
    imageUrl: '/images/histo-lichenplanus.png',
    vignette:
      'Histology reveals a band-like lymphocytic infiltrate at the dermoepidermal junction and sawtoothing of the rete ridges.',
    correctAnswer: 'Lichen Planus',
    options: ['Lichen Planus', 'Psoriasis', 'Lupus Erythematosus', 'Erythema Multiforme'],
    explanations: {
      'Lichen Planus': 'Correct. Lichenoid infiltrate and sawtooth rete ridges.',
      Psoriasis: 'Incorrect. Parakeratosis, elongated rete ridges, Munro abscesses.',
      'Lupus Erythematosus': 'Incorrect. Basal vacuolization and thickened basement membrane.',
      'Erythema Multiforme': 'Incorrect. Interface dermatitis with necrotic keratinocytes.',
    },
    subject: 'Histopathology',
    tags: ['lichenoid', 'sawtooth'],
    skinToneNotes: {
      general:
        'Histopathologic features are consistent across skin tones. Pigment incontinence and melanophages can be more prominent in darker skin, explaining more persistent PIH clinically.',
      variants: {
        I: 'Classic lichenoid/interface changes; minimal pigment incontinence.',
        II: 'Similar findings; mild melanin drop-out may be seen.',
        III: 'More melanophages in superficial dermis correlate with dyspigmentation.',
        IV: 'Pigment incontinence often evident beneath the interface change.',
        V: 'Conspicuous dermal melanophages; strong PIH clinically.',
        VI: 'Prominent pigment incontinence; clinical dyspigmentation can outlast inflammation.',
      },
      pearls: ['Correlate with oral mucosa findings when skin changes are subtle.'],
      pitfalls: ['Overcalling drug-induced lichenoid reaction without clinical correlation.'],
    },
  }),

  // HISTOPATHOLOGY — PSORIASIS
  withCompleteExplanations({
    id: 'histo-psoriasis-1',
    imageUrl: '/images/histo-psoriasis.png',
    vignette:
      'Histologic exam reveals parakeratosis, Munro microabscesses, and elongation of rete ridges.',
    correctAnswer: 'Psoriasis',
    options: ['Psoriasis', 'Seborrheic Dermatitis', 'Lichen Planus', 'Eczema'],
    explanations: {
      Psoriasis:
        'Correct. Parakeratosis and neutrophils in stratum corneum (Munro microabscesses).',
      'Seborrheic Dermatitis': 'Incorrect. More spongiosis; Malassezia/yeast may be present.',
      'Lichen Planus': 'Incorrect. Band-like lichenoid infiltrate.',
      Eczema: 'Incorrect. Spongiosis without Munro abscesses/parakeratosis.',
    },
    subject: 'Histopathology',
    tags: ['parakeratosis', 'munro'],
    skinToneNotes: {
      general:
        'Microscopic criteria do not vary by skin tone. Clinical erythema may be muted in darker skin, but histology—parakeratosis, Munro abscesses, elongation of rete ridges—remains the same.',
      variants: {
        I: 'Standard psoriasiform hyperplasia and neutrophils in stratum corneum.',
        II: 'Same hallmark features; tone does not alter histology.',
        III: 'Unchanged histology; correlate with thicker plaques clinically.',
        IV: 'Unchanged; dyspigmentation is clinical, not histologic.',
        V: 'Unchanged; consider PIH when counseling.',
        VI: 'Unchanged; color differences are clinical.',
      },
      pearls: ['Use histology to anchor severity assessment when clinical redness is subtle.'],
      pitfalls: ['Over-relying on clinical color to exclude psoriasis.'],
    },
  }),

  // HISTOPATHOLOGY — BCC
  withCompleteExplanations({
    id: 'histo-bcc-1',
    imageUrl: '/images/histo-bcc1.png',
    vignette:
      'Histopathology shows nests of basaloid cells with peripheral palisading and retraction artifact.',
    correctAnswer: 'Basal Cell Carcinoma',
    options: ['Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Sebaceous Carcinoma', 'Trichoepithelioma'],
    explanations: {
      'Basal Cell Carcinoma': 'Correct. Peripheral palisading and stromal retraction (clefting).',
      'Squamous Cell Carcinoma': 'Incorrect. Keratin pearls and intercellular bridges.',
      'Sebaceous Carcinoma': 'Incorrect. Vacuolated cytoplasm; mitotic figures.',
      Trichoepithelioma: 'Incorrect. More differentiation; lacks classic palisading.',
    },
    subject: 'Histopathology',
    tags: ['palisading', 'retraction'],
    skinToneNotes: {
      general:
        'Histology is consistent across tones. Pigmented BCC (melanin within tumor/stroma) is more frequent in darker skin clinically, but diagnostic basaloid nests and palisading are unchanged.',
      variants: {
        I: 'Typical basaloid nests with clefting; little melanin.',
        II: 'Same core features; pigment uncommon.',
        III: 'Occasional melanin within nests/stroma may be seen.',
        IV: 'Pigment more likely yet criteria are identical.',
        V: 'Pigmented BCC common—melanin in nests—but palisading/retraction remain key.',
        VI: 'Pigment often present; rely on architecture, not color.',
      },
      pearls: ['Dermoscopy/clinic may suggest melanoma; histology clarifies BCC via palisading and mucinous stroma.'],
      pitfalls: ['Overcalling melanoma solely due to abundant pigment—evaluate architecture and immunostains if needed.'],
    },
  }),

  // HISTOPATHOLOGY — MELANOMA
  withCompleteExplanations({
    id: 'histo-melanoma-1',
    imageUrl: '/images/histo-melanoma.png',
    vignette:
      'Histology shows atypical melanocytes at the dermoepidermal junction and invading into the dermis.',
    correctAnswer: 'Melanoma',
    options: ['Melanoma', 'Nevus', 'Basal Cell Carcinoma', 'Dermatofibroma'],
    explanations: {
      Melanoma: 'Correct. Atypical melanocytes with dermal invasion.',
      Nevus: 'Incorrect. Benign melanocytes are uniform and non-invasive.',
      'Basal Cell Carcinoma': 'Incorrect. Basaloid nests with palisading, not melanocytes.',
      Dermatofibroma: 'Incorrect. Spindle cells and epidermal hyperplasia.',
    },
    subject: 'Histopathology',
    tags: ['atypical melanocytes', 'invasion'],
    skinToneNotes: {
      general:
        'Histopathologic criteria (asymmetry, atypical melanocytes, pagetoid spread, invasion) are identical across tones. Clinically, acral/subungual sites are a larger share of cases in darker skin.',
      variants: {
        I: 'Conventional patterns predominate; tone has no histologic effect.',
        II: 'Same diagnostic criteria; subtypes vary clinically.',
        III: 'Unchanged histology; correlate with acral possibility if site matches.',
        IV: 'Unchanged; consider regression vs. PIH clinically.',
        V: 'Unchanged; acral/subungual lesions are proportionally more common clinically.',
        VI: 'Unchanged; anticipate later clinical stage due to color cue subtlety, not tissue differences.',
      },
      pearls: [
        'When site is acral, evaluate for lentiginous growth and measure Breslow precisely.',
        'Document regression and ulceration carefully; management implications are the same across tones.',
      ],
      pitfalls: ['Relying on clinical color to reassure—histology drives diagnosis.'],
    },
  }),
];