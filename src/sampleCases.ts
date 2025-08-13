export type Subject = 'Clinical' | 'Histopathology';
export type Fitz = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export type DermCase = {
  id: string;                 // required so we never pass undefined
  imageUrl: string;
  vignette: string;
  correctAnswer: string;
  options: string[];
  explanations: { [key: string]: string };
  subject: Subject;           // matches TestBuilder + App filters
  fitzpatrick?: Fitz;         // optional
  tags: string[];             // <-- needed by logAttempt
};

// ensure every option has an explanation string
const withCompleteExplanations = (
  c: Omit<DermCase, 'explanations'> & { explanations: DermCase['explanations'] }
): DermCase => {
  const map: Record<string, string> = {};
  c.options.forEach(o => { map[o] = c.explanations[o] ?? 'Explanation coming soon.'; });
  return { ...c, explanations: map };
};

export const sampleCases: DermCase[] = [
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
  }),

  withCompleteExplanations({
    id: 'clinical-psoriasis-1',
    imageUrl: '/images/psoriasistypeI.png',
    vignette:
      'A 29-year-old man presents with well-demarcated erythematous plaques with silvery scales on the extensor surfaces of his elbows and knees.',
    correctAnswer: 'Psoriasis',
    options: ['Psoriasis', 'Lichen Planus', 'Tinea', 'Contact Dermatitis'],
    explanations: {
      'Psoriasis': 'Correct. Classic findings include erythematous plaques with silvery scale on extensor surfaces.',
      'Lichen Planus':
        'Incorrect. Lichen planus lesions are violaceous, flat-topped, and more commonly found on wrists or mucosa.',
      'Tinea':
        'Incorrect. Tinea corporis shows annular plaques with central clearing, not silvery scale.',
      'Contact Dermatitis':
        'Incorrect. Contact dermatitis is more likely to be vesicular and located where an irritant/allergen was applied.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['plaques', 'extensors', 'scale'],
  }),

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
      'Psoriasis': 'Incorrect. Plaques with silvery scale on extensor surfaces.',
    },
    fitzpatrick: 'V',
    subject: 'Clinical',
    tags: ['annular', 'central-clearing', 'dermatophyte'],
  }),

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
      'Scabies':
        'Incorrect. Often involves burrows and intense nocturnal pruritus, frequently on hands, wrists, and genitalia.',
    },
    fitzpatrick: 'III',
    subject: 'Clinical',
    tags: ['flexural', 'atopy', 'peds'],
  }),

  withCompleteExplanations({
    id: 'clinical-bcc-1',
    imageUrl: '/images/bcctypeI.png',
    vignette:
      'A 65-year-old man presents with a pearly papule on his upper lip that has been slowly growing over months.',
    correctAnswer: 'Basal Cell Carcinoma',
    options: ['Basal Cell Carcinoma', 'Melanoma', 'Nevus', 'Actinic Keratosis'],
    explanations: {
      'Basal Cell Carcinoma': 'Correct. Pearly papules with telangiectasias on sun-exposed areas are classic.',
      'Melanoma': 'Incorrect. Often pigmented and asymmetric with irregular borders.',
      'Nevus': 'Incorrect. Benign and stable in size/color.',
      'Actinic Keratosis': 'Incorrect. Rough, scaly patches—not nodular or pearly.',
    },
    fitzpatrick: 'I',
    subject: 'Clinical',
    tags: ['pearly', 'telangiectasia', 'NMSC'],
  }),

  withCompleteExplanations({
    id: 'clinical-melanoma-1',
    imageUrl: '/images/melanomatypeVI.png',
    vignette:
      'A 50-year-old woman notices a dark, irregularly shaped and enlarging patch on the sole of her foot.',
    correctAnswer: 'Melanoma',
    options: ['Melanoma', 'Seborrheic Keratosis', 'Pigmented BCC', 'Blue Nevus'],
    explanations: {
      'Melanoma': 'Correct. Acral lentiginous melanoma is common in darker skin types and presents on palms/soles.',
      'Seborrheic Keratosis': 'Incorrect. Stuck-on waxy lesions, not enlarging patches.',
      'Pigmented BCC': 'Incorrect. Rare on soles; typically pearly nodules.',
      'Blue Nevus': 'Incorrect. Stable, symmetric, and benign.',
    },
    fitzpatrick: 'VI',
    subject: 'Clinical',
    tags: ['acral', 'irregular', 'melanocytic'],
  }),

  // HISTOPATHOLOGY
  withCompleteExplanations({
    id: 'histo-lp-1',
    imageUrl: '/images/histo-lichenplanus.png',
    vignette:
      'Histology reveals a band-like lymphocytic infiltrate at the dermoepidermal junction and sawtoothing of the rete ridges.',
    correctAnswer: 'Lichen Planus',
    options: ['Lichen Planus', 'Psoriasis', 'Lupus Erythematosus', 'Erythema Multiforme'],
    explanations: {
      'Lichen Planus': 'Correct. Lichenoid infiltrate and sawtooth rete ridges.',
      'Psoriasis': 'Incorrect. Parakeratosis, elongated rete ridges, Munro abscesses.',
      'Lupus Erythematosus': 'Incorrect. Basal vacuolization and thickened basement membrane.',
      'Erythema Multiforme': 'Incorrect. Interface dermatitis with necrotic keratinocytes.',
    },
    subject: 'Histopathology',
    tags: ['lichenoid', 'sawtooth'],
  }),

  withCompleteExplanations({
    id: 'histo-psoriasis-1',
    imageUrl: '/images/histo-psoriasis.png',
    vignette:
      'Histologic exam reveals parakeratosis, Munro microabscesses, and elongation of rete ridges.',
    correctAnswer: 'Psoriasis',
    options: ['Psoriasis', 'Seborrheic Dermatitis', 'Lichen Planus', 'Eczema'],
    explanations: {
      'Psoriasis': 'Correct. Parakeratosis and neutrophils in stratum corneum (Munro microabscesses).',
      'Seborrheic Dermatitis': 'Incorrect. More spongiosis; Malassezia/yeast may be present.',
      'Lichen Planus': 'Incorrect. Band-like lichenoid infiltrate.',
      'Eczema': 'Incorrect. Spongiosis without Munro abscesses/parakeratosis.',
    },
    subject: 'Histopathology',
    tags: ['parakeratosis', 'munro'],
  }),

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
      'Trichoepithelioma': 'Incorrect. More differentiation; lacks classic palisading.',
    },
    subject: 'Histopathology',
    tags: ['palisading', 'retraction'],
  }),

  withCompleteExplanations({
    id: 'histo-melanoma-1',
    imageUrl: '/images/histo-melanoma.png',
    vignette:
      'Histology shows atypical melanocytes at the dermoepidermal junction and invading into the dermis.',
    correctAnswer: 'Melanoma',
    options: ['Melanoma', 'Nevus', 'Basal Cell Carcinoma', 'Dermatofibroma'],
    explanations: {
      'Melanoma': 'Correct. Atypical melanocytes with dermal invasion.',
      'Nevus': 'Incorrect. Benign melanocytes are uniform and non-invasive.',
      'Basal Cell Carcinoma': 'Incorrect. Basaloid nests with palisading, not melanocytes.',
      'Dermatofibroma': 'Incorrect. Spindle cells and epidermal hyperplasia.',
    },
    subject: 'Histopathology',
    tags: ['atypical melanocytes', 'invasion'],
  }),
];