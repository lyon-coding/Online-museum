// Art movements shown in the museum, in the order they appear on the timeline.
// "roots" answers "where did this come from?", "became" answers "what did it turn into?".

export const MOVEMENTS = [
  {
    id: 'realism',
    name: 'Realism & the painting of modern life',
    short: 'Realism',
    start: 1848,
    end: 1880,
    color: '#a07d52',
    roots:
      'Gustave Courbet\'s Realism (1850s) rejected history and mythology in favour of ordinary people painted at full scale. ' +
      'Manet added the lessons of Velázquez and Goya — flat light, bold blacks, no polished finish — and pointed it all at contemporary Paris. ' +
      'Photography, Japanese woodblock prints and the Barbizon landscape painters, who worked outdoors, completed the mix.',
    became:
      'Younger painters around Manet at the Café Guerbois took his modern subjects and loose handling outdoors, into the changing light. ' +
      'That step — from the studio to the riverbank — is Impressionism.'
  },
  {
    id: 'impressionism',
    name: 'Impressionism',
    short: 'Impressionism',
    start: 1867,
    end: 1900,
    color: '#5f9dc4',
    roots:
      'Manet\'s modern subjects, the Barbizon habit of painting outdoors, new portable paint tubes, and colour theory showing that shadows are coloured, not grey. ' +
      'Refused by the official Salon, the group organised its own exhibition in 1874; a critic mocked Monet\'s "Impression, Sunrise", and the name stuck.',
    became:
      'By the mid-1880s Impressionism was criticised as formless — "just an eye", as Cézanne said of Monet, "but what an eye". ' +
      'Painters split into those who wanted more structure (Seurat\'s science, Cézanne\'s geometry) and those who wanted more emotion and symbol (Van Gogh, Gauguin). Both roads lead to the 20th century.'
  },
  {
    id: 'neo',
    name: 'Neo-Impressionism (Pointillism)',
    short: 'Neo-Impressionism',
    start: 1884,
    end: 1910,
    color: '#d6a33a',
    roots:
      'Impressionist colour, made systematic with the optical science of Michel-Eugène Chevreul and Ogden Rood: pure colours placed side by side in small dots are mixed by the viewer\'s eye.',
    became:
      'The idea that colour can be organised independently of what it describes passed to the Fauves (Matisse painted with Signac in 1904), to Mondrian\'s "Luminist" phase, and to Delaunay\'s Orphism.'
  },
  {
    id: 'post',
    name: 'Post-Impressionism',
    short: 'Post-Impressionism',
    start: 1878,
    end: 1906,
    color: '#c9643a',
    roots:
      'Not a group but a generation that started from Impressionism and pushed past it: Cézanne toward solid structure, Van Gogh toward expressive colour and brushwork, Gauguin toward flat colour and symbolism.',
    became:
      'Cézanne\'s geometry leads to Cubism; Van Gogh and Gauguin\'s liberated colour leads to Fauvism and Expressionism. ' +
      'The large memorial retrospectives in Paris — Van Gogh 1901 and 1905, Gauguin 1903 and 1906, Cézanne 1907 — were each a turning point for the young painters who saw them.'
  },
  {
    id: 'expressionism',
    name: 'Symbolism & Expressionism',
    short: 'Expressionism',
    start: 1885,
    end: 1920,
    color: '#9a3b55',
    roots:
      'Van Gogh\'s emotional colour, Gauguin\'s symbolic flat forms and the Symbolist belief that a painting should express an inner state rather than describe the outer world.',
    became:
      'In Germany it gave rise to Die Brücke (Dresden, 1905) and Der Blaue Reiter (Munich, 1911). The Blaue Reiter\'s search for a "spiritual" art carried Kandinsky over the threshold into pure abstraction.'
  },
  {
    id: 'fauvism',
    name: 'Fauvism',
    short: 'Fauvism',
    start: 1904,
    end: 1910,
    color: '#e0542f',
    roots:
      'Neo-Impressionist pure colour (Signac), Van Gogh\'s intensity and Gauguin\'s flat fields of colour. Matisse and Derain fused them in Collioure in the summer of 1905.',
    became:
      'A short, explosive movement. Its freed colour fed German Expressionism and Kandinsky\'s Murnau landscapes, while its painters turned — after the 1907 Cézanne retrospective — toward structure, the moment Cubism appeared.'
  },
  {
    id: 'cubism',
    name: 'Cubism & Orphism',
    short: 'Cubism',
    start: 1907,
    end: 1925,
    color: '#7d8590',
    roots:
      'Cézanne\'s way of building a picture from planes and multiple viewpoints, together with African and Iberian sculpture. Pablo Picasso and Georges Braque invented Cubism in 1907–1909 (their works are still under copyright and are not shown here); Juan Gris and Robert Delaunay developed it.',
    became:
      'Once the object was broken into planes, it could disappear altogether. Cubism was the springboard for Mondrian\'s De Stijl, Malevich\'s Suprematism and Delaunay\'s pure colour discs.'
  },
  {
    id: 'abstraction',
    name: 'Abstraction',
    short: 'Abstraction',
    start: 1910,
    end: 1945,
    color: '#2f5ea8',
    roots:
      'Two roads: Expressionist colour and music-like composition (Kandinsky), and the Cubist grid and plane (Mondrian, Malevich). Around 1910–1915 several painters, independently, removed the recognisable object from painting.',
    became:
      'Geometric abstraction shaped the Bauhaus, modern design and architecture; Kandinsky\'s lyrical abstraction — and Monet\'s late Water Lilies — were rediscovered by the Abstract Expressionists in New York after 1945.'
  },
  {
    id: 'constructivism',
    name: 'Constructivism, De Stijl & the Bauhaus',
    short: 'Constructivism & Bauhaus',
    start: 1915,
    end: 1933,
    color: '#c0392b',
    roots:
      'Malevich\'s Suprematism and Mondrian\'s Neo-Plasticism, both born of Cubism, met the hopes of the Russian Revolution and of post-war Europe. ' +
      'If pure form and colour could be the whole of a painting, the young artists asked, why not of a poster, a chair, a house or a city? ' +
      'In Vitebsk, Moscow, Leiden and the new Bauhaus school at Weimar (1919), painting became a laboratory for building a new world.',
    became:
      'The Bauhaus moved to Dessau in 1925 and was closed by the Nazis in 1933; Stalin\'s Socialist Realism ended the Russian avant-garde. ' +
      'Their teachers and students emigrated, and their ideas became the language of modern architecture, typography and design worldwide.'
  },
  {
    id: 'dada',
    name: 'Dada',
    short: 'Dada',
    start: 1916,
    end: 1924,
    color: '#b8962e',
    roots:
      'Disgust at the slaughter of the First World War. In neutral Zurich in 1916, at the Cabaret Voltaire, a group of refugee artists and poets declared war on reason, taste and "art" itself — the culture that had led to the trenches. ' +
      'They borrowed Cubist collage, Futurist noise and provocation, and the abstract forms of the new painting, and added chance, nonsense and the machine.',
    became:
      'Dada spread to New York, Berlin, Cologne, Hanover and Paris, then burned itself out around 1922–24. ' +
      'In Paris, André Breton kept its revolt but gave it a purpose — exploring the unconscious. His Manifesto of Surrealism of 1924 turned Dada into Surrealism.'
  },
  {
    id: 'surrealism',
    name: 'Surrealism',
    short: 'Surrealism',
    start: 1924,
    end: 1950,
    color: '#6a4c93',
    roots:
      'Dada\'s revolt, Sigmund Freud\'s theory of dreams and the unconscious, and the "metaphysical" paintings of Giorgio de Chirico, whose empty squares and long shadows seemed to come from a dream. ' +
      'Breton defined Surrealism in 1924 as "pure psychic automatism": thought dictated without any control by reason.',
    became:
      'Fleeing the Second World War, the Surrealists reached New York. Their automatic drawing and dream space — Miró above all — showed the young American painters a way to let the hand and the unconscious lead: Abstract Expressionism, after 1945.'
  }
];

export const movementById = Object.fromEntries(MOVEMENTS.map((m) => [m.id, m]));
