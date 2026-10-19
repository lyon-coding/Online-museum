// Artists, their paintings (chronological) and the room design of each gallery.
//
// Images: every painting is resolved against Wikimedia Commons at runtime
// (see js/images.js). A painting is shown only if one of these succeeds:
//   files   – exact Commons file names, checked with the Commons API
//   article – the English Wikipedia article whose lead image is a Commons file
//   search  – a Commons file search; `all` is a list of regular expressions that
//             must ALL match the (lower-cased, accent-free) file name
// Paintings that cannot be confirmed on Commons are left out of the museum.

export const ARTISTS = [
  // ───────────────────────────────── ROOTS ─────────────────────────────────
  {
    id: 'manet',
    name: 'Édouard Manet',
    short: 'Manet',
    born: 1832,
    died: 1883,
    nationality: 'French',
    movement: 'realism',
    bio:
      'Born into the Parisian upper middle class, Manet trained with the academic painter Thomas Couture but learned most in the Louvre and from the Spanish masters Velázquez and Goya. ' +
      'He never exhibited with the Impressionists, seeking success at the official Salon instead — yet his scandalous pictures of modern Paris made him their hero and figurehead.',
    roots:
      'Velázquez\'s flat backgrounds, Goya\'s blacks, Courbet\'s Realism, Japanese prints, and Old Masters he quoted openly — Titian, Raphael.',
    room: { wall: '#7a3337', floor: 'herringbone', frame: 'gilt', light: '#ffe0b5', props: ['bar', 'bench'] },
    paintings: [
      {
        title: 'Music in the Tuileries', year: 1862, date: '1862',
        desc: 'A crowd of fashionable Parisians gathers under the trees — Manet himself, Baudelaire, Offenbach and Fantin-Latour among them. Faces dissolve into quick dabs of paint. It is one of the first paintings of modern urban leisure, the subject the Impressionists would make their own.',
        files: ['Edouard Manet - Music in the Tuileries Gardens - Google Art Project.jpg', 'Manet, Edouard - Music in the Tuileries Gardens.jpg'],
        article: 'Music in the Tuileries'
      },
      {
        title: 'Le Déjeuner sur l\'herbe', year: 1863, date: '1863', collection: 'Musée d\'Orsay, Paris',
        desc: 'Rejected by the Salon and shown at the Salon des Refusés, it caused a scandal: a nude woman picnicking with two men in modern dress, a second woman bathing behind them. The poses come from an old engraving after Raphael, but the harsh frontal light and flat modelling were entirely new.',
        files: ['Edouard Manet - Luncheon on the Grass - Google Art Project.jpg'],
        article: 'Le Déjeuner sur l\'herbe'
      },
      {
        title: 'Olympia', year: 1863.5, date: '1863 (exhibited 1865)', collection: 'Musée d\'Orsay, Paris',
        desc: 'Manet turned Titian\'s Venus of Urbino into a Parisian courtesan who stares straight at the viewer. Critics were outraged as much by the flat, barely modelled body and the abrupt contrasts as by the subject.',
        files: ['Edouard Manet - Olympia - Google Art Project 3.jpg', 'Edouard Manet - Olympia - Google Art Project.jpg'],
        article: 'Olympia (Manet)'
      },
      {
        title: 'The Fifer', year: 1866, date: '1866', collection: 'Musée d\'Orsay, Paris',
        desc: 'A boy from the Imperial Guard plays his fife against an empty grey background with no floor or horizon — only a small shadow at his feet anchors him in space. Flat areas of red, black and white, almost no modelling: Manet had just seen Velázquez in Madrid. The Salon rejected it.',
        files: ['Edouard Manet - The Fifer - Google Art Project.jpg', 'Edouard Manet - Le Fifre.jpg'],
        article: 'The Fifer'
      },
      {
        title: 'The Balcony', year: 1868, date: '1868–69', collection: 'Musée d\'Orsay, Paris',
        desc: 'Berthe Morisot, whom Manet had just met, sits in front, her dark eyes the focus of the picture. Inspired by Goya\'s Majas on a Balcony, the figures seem strangely disconnected from one another — a mood of modern, urban detachment.',
        files: ['Edouard Manet - The Balcony - Google Art Project.jpg'],
        article: 'The Balcony (Manet)'
      },
      {
        title: 'The Railway', year: 1873, date: '1873', collection: 'National Gallery of Art, Washington',
        desc: 'A woman and a child by the railings above the Gare Saint-Lazare — the train itself reduced to a cloud of steam. Painted partly outdoors with a lighter palette, it shows Manet moving toward the young Impressionists.',
        files: ['Edouard Manet - The Railway - Google Art Project.jpg'],
        article: 'The Railway (painting)'
      },
      {
        title: 'Boating', year: 1874, date: '1874', collection: 'Metropolitan Museum of Art, New York',
        desc: 'Painted at Argenteuil in the summer Manet worked beside Monet and Renoir. The tilted, cropped view and the flat blue water recall Japanese prints, and the bright open-air light is fully Impressionist.',
        files: ['Edouard Manet - Boating - Google Art Project.jpg', 'Manet, Edouard - Boating.jpg'],
        article: 'Boating (Manet)'
      },
      {
        title: 'A Bar at the Folies-Bergère', year: 1882, date: '1882', collection: 'Courtauld Gallery, London',
        desc: 'Manet\'s last major work. The barmaid faces us, but the mirror behind her shows a reflection that does not quite add up — a puzzle about looking, modern loneliness and the illusion of the picture surface.',
        files: ['Edouard Manet, A Bar at the Folies-Bergère.jpg'],
        article: 'A Bar at the Folies-Bergère'
      }
    ]
  },

  // ───────────────────────────── IMPRESSIONISM ─────────────────────────────
  {
    id: 'monet',
    name: 'Claude Monet',
    short: 'Monet',
    born: 1840,
    died: 1926,
    nationality: 'French',
    movement: 'impressionism',
    bio:
      'Raised in Le Havre, Monet was taught by Eugène Boudin to paint outdoors, directly in front of the motif. He became the most consistent Impressionist, devoting his life to recording the fleeting effects of light, ' +
      'and in his last decades at Giverny painted his water garden on an almost abstract scale.',
    roots:
      'Boudin and Jongkind\'s open-air seascapes, Manet\'s modern subjects, the Barbizon painters, Turner and Constable (seen in London in 1870–71), and the Japanese prints he collected.',
    room: { wall: '#c9d6d2', floor: 'parquet', frame: 'gilt', light: '#fff1d6', props: ['pond', 'bench'] },
    paintings: [
      {
        title: 'Women in the Garden', year: 1866, date: '1866', collection: 'Musée d\'Orsay, Paris',
        desc: 'A large canvas painted largely outdoors — Monet dug a trench in the garden so he could lower the canvas and reach the top. Sunlight and coloured shadow, not the figures, are the real subject. The Salon rejected it.',
        files: ['Claude Monet - Women in the Garden.jpg', 'Claude Monet - Femmes au jardin.jpg'],
        article: 'Women in the Garden'
      },
      {
        title: 'La Grenouillère', year: 1869, date: '1869',
        desc: 'Painted side by side with Renoir at a popular bathing spot on the Seine. To catch the flickering reflections Monet used quick, broken strokes of unmixed colour. That summer the Impressionist technique was born.',
        files: ['Claude Monet - La Grenouillère.jpg'],
        article: 'La Grenouillère (Monet)'
      },
      {
        title: 'Impression, Sunrise', year: 1872, date: '1872', collection: 'Musée Marmottan Monet, Paris',
        desc: 'The port of Le Havre in morning mist, painted in a few minutes. Shown at the first independent exhibition of 1874, its title led a critic to mock the whole group as "Impressionists" — and the name stuck.',
        files: ['Monet - Impression, Sunrise.jpg', 'Claude Monet, Impression, soleil levant.jpg'],
        article: 'Impression, Sunrise'
      },
      {
        title: 'Woman with a Parasol – Madame Monet and Her Son', year: 1875, date: '1875', collection: 'National Gallery of Art, Washington',
        desc: 'Camille Monet and their son Jean on a hill at Argenteuil, seen from below against a moving sky. Wind, light and rapid brushwork make it feel like a moment rather than a pose.',
        files: ['Claude Monet - Woman with a Parasol - Madame Monet and Her Son - Google Art Project.jpg'],
        article: 'Woman with a Parasol – Madame Monet and Her Son'
      },
      {
        title: 'La Gare Saint-Lazare', year: 1877, date: '1877',
        desc: 'Locomotives breathe clouds of steam under the glass-and-iron roof of the Paris station. One of a dozen views Monet painted there in 1877, treating the machinery of the modern city as a study in light and atmosphere.',
        files: ['Claude Monet - La Gare Saint-Lazare.jpg', 'Claude Monet - The Gare Saint-Lazare.jpg'],
        search: { q: 'Claude Monet Gare Saint-Lazare 1877', all: ['monet', 'lazare'] }
      },
      {
        title: 'Stacks of Wheat (Haystacks series)', year: 1890, date: '1890–91',
        desc: 'Stacks of wheat in a field at the end of summer, glowing in warm light with violet-blue shadows. From 1890 Monet painted the same stacks again and again, at different hours and seasons — his first true series. The motif barely changes; each canvas records one particular light and atmosphere.',
        files: ['Claude Monet - Stacks of Wheat (End of Summer) - 1985.1103 - Art Institute of Chicago.jpg'],
        search: { q: 'Claude Monet Stacks of Wheat haystacks', all: ['monet', 'wheat|haystack|meules'] }
      },
      {
        title: 'Rouen Cathedral (series)', year: 1893, date: '1892–94',
        desc: 'The cathedral façade in the light of the setting sun. The carved stone dissolves into thick, crusted strokes of orange, pink and blue: the building has become a screen for changing light. One of more than thirty views Monet painted from a window opposite.',
        files: ['Claude Monet - Rouen Cathedral, Facade (Sunset).JPG'],
        search: { q: 'Claude Monet Rouen Cathedral facade', all: ['monet', 'rouen'] }
      },
      {
        title: 'Bridge over a Pond of Water Lilies', year: 1899, date: '1899',
        desc: 'A Japanese-style footbridge arches over a pond covered with water lilies, framed by dense green foliage. Monet created this motif himself, in the water garden of his house at Giverny; it would be almost his only subject for the rest of his life.',
        files: ['Claude Monet - Bridge over a Pond of Water Lilies.jpg'],
        article: 'Bridge over a Pond of Water Lilies',
        search: { q: 'Claude Monet Bridge over a Pond of Water Lilies 1899', all: ['monet', 'bridge over a pond|japanese footbridge|pont japonais', '1899'] }
      },
      {
        title: 'Water Lilies', year: 1906, date: '1906', collection: 'Art Institute of Chicago',
        desc: 'The horizon has disappeared: only the water\'s surface remains, with floating lilies and the reflections of sky and trees. With no edges and no single focus, the picture becomes a field of colour and light.',
        files: ['Claude Monet - Water Lilies - 1906, Ryerson.jpg'],
        search: { q: 'Claude Monet Water Lilies 1906 Art Institute', all: ['monet', 'water lil|nympheas', '1906'] }
      }
    ]
  },
  {
    id: 'renoir',
    name: 'Pierre-Auguste Renoir',
    short: 'Renoir',
    born: 1841,
    died: 1919,
    nationality: 'French',
    movement: 'impressionism',
    bio:
      'Born in Limoges and apprenticed as a porcelain painter in Paris, Renoir met Monet, Sisley and Bazille in Charles Gleyre\'s studio. He became the Impressionist of human pleasure — dances, picnics, friends. ' +
      'In the 1880s, troubled that Impressionism lacked form, he turned back to drawing and the classical nude.',
    roots:
      'The Rococo painters he copied in the Louvre (Watteau, Boucher, Fragonard), Delacroix\'s colour, Courbet, and painting outdoors with Monet.',
    room: { wall: '#e4cfc0', floor: 'parquet', frame: 'gilt', light: '#ffe6c4', props: ['cafe', 'bench'] },
    paintings: [
      {
        title: 'La Grenouillère', year: 1869, date: '1869',
        desc: 'Renoir\'s version of the bathing place he painted alongside Monet. He focused more on the people, but used the same quick, flickering strokes for water and light.',
        article: 'La Grenouillère (Renoir)',
        search: { q: 'Renoir La Grenouillère 1869', all: ['renoir', 'grenouill'] }
      },
      {
        title: 'La Loge', year: 1874, date: '1874', collection: 'Courtauld Gallery, London',
        search: { q: 'Renoir La Loge 1874 Courtauld', all: ['renoir', '\\bloge\\b', 'courtauld|1874|theatre box'] },
        desc: 'A fashionable couple in a theatre box: she faces us, on display in her striped dress, while he looks elsewhere through his opera glasses. The black-and-white stripes are painted with loose bravura. Shown at the first Impressionist exhibition in 1874.',
        files: ['Pierre-Auguste Renoir - La Loge (The Theatre Box) - Google Art Project.jpg'],
        article: 'La Loge (Renoir)'
      },
      {
        title: 'Bal du moulin de la Galette', year: 1876, date: '1876', collection: 'Musée d\'Orsay, Paris',
        desc: 'A Sunday afternoon dance in Montmartre, with Renoir\'s friends among the crowd. Patches of sunlight filtering through the trees dapple faces and clothes — Impressionism applied to a crowded scene of modern happiness.',
        files: ['Pierre-Auguste Renoir, Le Moulin de la Galette.jpg'],
        article: 'Bal du moulin de la Galette'
      },
      {
        title: 'The Swing', year: 1876.5, date: '1876', collection: 'Musée d\'Orsay, Paris',
        desc: 'Dappled light falls across a young woman\'s dress. Its blue and violet shadows looked strange to viewers at the time — yet coloured shadows were exactly what the Impressionists had discovered by looking outdoors.',
        files: ['Pierre-Auguste Renoir - The Swing - Google Art Project.jpg'],
        article: 'The Swing (Renoir)'
      },
      {
        title: 'Luncheon of the Boating Party', year: 1880, date: '1880–81', collection: 'The Phillips Collection, Washington',
        desc: 'Friends relax on the balcony of the Maison Fournaise on the Seine; the young woman with the dog is Aline Charigot, Renoir\'s future wife. A summation of Impressionist pleasure — but the figures are firmer, a sign of the change to come.',
        files: ['Pierre-Auguste Renoir - Luncheon of the Boating Party - Google Art Project.jpg'],
        article: 'Luncheon of the Boating Party'
      },
      {
        title: 'Two Sisters (On the Terrace)', year: 1881, date: '1881', collection: 'Art Institute of Chicago',
        desc: 'Crisp, detailed figures in front of a feathery, almost dissolving landscape: Renoir is beginning to separate drawing from atmosphere.',
        files: ['Pierre-Auguste Renoir - Two Sisters (On the Terrace) - Google Art Project.jpg'],
        article: 'Two Sisters (On the Terrace)'
      },
      {
        title: 'Dance at Bougival', year: 1883, date: '1883', collection: 'Museum of Fine Arts, Boston',
        desc: 'Painted after a journey to Italy where Renoir discovered Raphael and the frescoes of Pompeii. The dancers are now clearly outlined and solid; the Impressionist dissolve is kept for the background.',
        files: ['Pierre-Auguste Renoir - Dance at Bougival - Google Art Project.jpg'],
        article: 'Dance at Bougival'
      },
      {
        title: 'The Large Bathers', year: 1884, date: '1884–87', collection: 'Philadelphia Museum of Art',
        desc: 'Three nudes by a stream, drawn with sharp contours and smooth, porcelain-like modelling — Renoir\'s "dry" period. The poses come from a 17th-century relief in the gardens of Versailles: an Impressionist deliberately returning to classical drawing.',
        files: ['Pierre-Auguste Renoir, French - The Large Bathers - Google Art Project.jpg'],
        search: { q: 'Renoir Large Bathers Philadelphia', all: ['renoir', 'large bathers|grandes baigneuses'] }
      },
      {
        title: 'Young Girls at the Piano', year: 1892, date: '1892',
        search: { q: 'Renoir Young Girls at the Piano 1892', all: ['renoir', 'piano'] },
        desc: 'Two girls lean over a music score at the piano, one fair-haired in white, one dark-haired in red. Renoir painted several versions in 1892; one was bought by the French state, his first official recognition. Soft, warm colour and rounded forms mark his late style.',
        files: ['Pierre-Auguste Renoir - Jeunes filles au piano.jpg'],
        article: 'Young Girls at the Piano'
      }
    ]
  },
  {
    id: 'degas',
    name: 'Edgar Degas',
    short: 'Degas',
    born: 1834,
    died: 1917,
    nationality: 'French',
    movement: 'impressionism',
    bio:
      'A wealthy Parisian trained in the tradition of Ingres, Degas called himself a Realist rather than an Impressionist and disliked painting outdoors. Yet he co-organised the Impressionist exhibitions and brought a radically new way of seeing: ' +
      'off-centre compositions, cropped figures and views from above, drawn from photography and Japanese prints.',
    roots: 'Ingres\'s line, Italian Renaissance drawing, photography, Japanese woodcuts and Manet\'s modern-life subjects.',
    room: { wall: '#2e3a4b', floor: 'darkwood', frame: 'gilt', light: '#ffe7c7', props: ['dancer', 'bench'] },
    paintings: [
      {
        title: 'The Bellelli Family', year: 1858, date: '1858–67', collection: 'Musée d\'Orsay, Paris',
        desc: 'Degas\'s aunt and her family in Florence. Beneath the classical composition lies psychological tension: the father turned away, the mother distant, one daughter caught between them.',
        files: ['Edgar Degas - The Bellelli Family - Google Art Project.jpg'],
        article: 'The Bellelli Family'
      },
      {
        title: 'The Orchestra at the Opera', year: 1870, date: 'c. 1870', collection: 'Musée d\'Orsay, Paris',
        desc: 'The musicians fill the picture, while the dancers on stage are cut off at the head by the top edge — a framing borrowed from photography and unheard of in academic painting.',
        files: ['Edgar Degas - The Orchestra at the Opera - Google Art Project.jpg'],
        article: 'The Orchestra at the Opera'
      },
      {
        title: 'The Dance Class', year: 1874, date: 'c. 1874',
        desc: 'The ballet master Jules Perrot leads a rehearsal. Degas shows not the performance but the waiting, stretching and fidgeting — modern life behind the scenes.',
        article: 'The Dance Class (Degas)',
        search: { q: 'Degas The Dance Class 1874', all: ['degas', 'dance class|classe de danse'] }
      },
      {
        title: 'Place de la Concorde', year: 1875, date: '1875', collection: 'Hermitage Museum, St Petersburg',
        desc: 'Viscount Lepic and his daughters stride across the square in different directions, cut off by the frame, with a huge empty space in the middle — like a snapshot. Taken from Germany after 1945 and long thought lost, it reappeared in Russia in 1995.',
        article: 'Place de la Concorde (Degas)',
        search: { q: 'Degas Place de la Concorde Lepic', all: ['degas', 'concorde'] }
      },
      {
        title: 'L\'Absinthe (In a Café)', year: 1875.5, date: '1875–76', collection: 'Musée d\'Orsay, Paris',
        desc: 'Two figures sit isolated in a Paris café, the tables zig-zagging away from us. Shown in London in 1893 it was attacked as a lesson in moral degradation; today it reads as an image of urban loneliness.',
        files: ['Edgar Degas - In a Café - Google Art Project 2.jpg', 'Edgar Degas - In a Café - Google Art Project.jpg'],
        article: 'L\'Absinthe'
      },
      {
        title: 'The Star (Dancer on Stage)', year: 1878, date: 'c. 1878', collection: 'Musée d\'Orsay, Paris',
        desc: 'Pastel. Seen from a box above, a prima ballerina floats in the stage light while a man in black waits in the wings. Degas made pastel a major medium, building colour up in layers.',
        search: { q: 'Degas L\'Étoile dancer on stage', all: ['degas', 'etoile|the star|dancer on stage'] }
      },
      {
        title: 'The Tub', year: 1886, date: '1886', collection: 'Musée d\'Orsay, Paris',
        desc: 'Pastel. A woman washing, seen from above as if "through a keyhole", the shelf at right tilted flat like a Japanese print. Shown at the last Impressionist exhibition in 1886.',
        search: { q: 'Degas The Tub 1886 pastel', all: ['degas', '\\btub\\b'] }
      },
      {
        title: 'Blue Dancers', year: 1897, date: 'c. 1897', collection: 'Musée d\'Orsay, Paris',
        desc: 'A group of dancers adjusting their costumes in the wings, seen close up and cropped by the frame. With failing eyesight, the late Degas worked in broad strokes of saturated colour; the figures merge into a rhythmic pattern of blue and green.',
        article: 'Blue Dancers',
        search: { q: 'Degas Blue Dancers', all: ['degas', 'blue dancers|danseuses bleues'] }
      }
    ]
  },
  {
    id: 'pissarro',
    name: 'Camille Pissarro',
    short: 'Pissarro',
    born: 1830,
    died: 1903,
    nationality: 'Danish-French',
    movement: 'impressionism',
    bio:
      'Born on the Caribbean island of St Thomas, Pissarro was the oldest and most generous of the Impressionists — the only one to show at all eight of their exhibitions. ' +
      'Mentor to Cézanne and Gauguin, an early guide to Van Gogh and, in 1886, a convert to Seurat\'s dots, he is connected to almost every painter in this museum.',
    roots: 'Corot and the Barbizon landscape painters, Courbet\'s Realism, and English landscape painting (Constable, Turner) studied in London in 1870–71.',
    room: { wall: '#b3ab8a', floor: 'parquet', frame: 'gilt', light: '#fff0d2', props: ['easel', 'planters'] },
    paintings: [
      {
        title: 'Jalais Hill, Pontoise', year: 1867, date: '1867', collection: 'Metropolitan Museum of Art, New York',
        desc: 'A village on a hillside, with sturdy blocks of houses, fields and a road climbing past them, laid in with broad strokes. Even before Impressionism, Pissarro built his landscapes from solid, clearly ordered planes.',
        search: { q: 'Camille Pissarro Jalais Hill Pontoise', all: ['pissarro', 'jalais'] }
      },
      {
        title: 'The Avenue, Sydenham', year: 1871, date: '1871', collection: 'National Gallery, London',
        desc: 'A tree-lined avenue in south London on a soft spring day, with a church at the far end and strollers on the pavement. Pissarro had fled the Franco-Prussian War to London; the grey English light shows in the painting\'s subtle, silvery tones.',
        article: 'The Avenue, Sydenham',
        search: { q: 'Pissarro The Avenue Sydenham', all: ['pissarro', 'sydenham'] }
      },
      {
        title: 'Hoarfrost', year: 1873, date: '1873', collection: 'Musée d\'Orsay, Paris',
        desc: 'A frozen ploughed field near Pontoise under a low winter sun, long blue shadows crossing the furrows. At the first Impressionist exhibition in 1874 the critic Louis Leroy mocked it as palette scrapings on a dirty canvas.',
        search: { q: 'Pissarro Hoarfrost gelée blanche', all: ['pissarro', 'hoarfrost|gelee blanche'] }
      },
      {
        title: 'The Red Roofs', year: 1877, date: '1877', collection: 'Musée d\'Orsay, Paris',
        desc: 'The red-roofed houses of a village near Pontoise glimpsed through a screen of bare winter trees. The whole surface is woven from small, dense, crusted strokes of paint — Pissarro\'s richest Impressionist texture.',
        search: { q: 'Pissarro red roofs 1877', all: ['pissarro', 'red roofs|toits rouges'] }
      },
      {
        title: 'Apple Picking', year: 1887, date: 'c. 1886–88',
        desc: 'Women gather apples under the trees of an orchard at Éragny, in bright sunlight. In 1886 Pissarro adopted the new divisionist technique of small dots of pure colour — the only one of the original Impressionists to do so — and the figures here are built from touches of colour that vibrate in the eye.',
        search: { q: 'Pissarro Apple Picking Eragny', all: ['pissarro', 'apple|pommes'] }
      },
      {
        title: 'Boulevard Montmartre, Spring', year: 1897, date: '1897',
        desc: 'The boulevard seen from a hotel window high above: carriages and crowds stream between rows of trees in fresh green leaf. Pissarro painted this same view more than a dozen times, at different hours and in different weather.',
        article: 'Boulevard Montmartre, Spring',
        search: { q: 'Pissarro Boulevard Montmartre spring', all: ['pissarro', 'montmartre', 'spring|printemps'] }
      },
      {
        title: 'The Boulevard Montmartre at Night', year: 1897.5, date: '1897', collection: 'National Gallery, London',
        desc: 'His only night scene: wet pavements reflecting gas and electric lamps. The modern city becomes pure flickering light.',
        files: ['Camille Pissarro, The Boulevard Montmartre at Night, 1897.jpg'],
        article: 'The Boulevard Montmartre at Night'
      }
    ]
  },
  {
    id: 'morisot',
    name: 'Berthe Morisot',
    short: 'Morisot',
    born: 1841,
    died: 1895,
    nationality: 'French',
    movement: 'impressionism',
    bio:
      'From a wealthy family, Morisot trained privately — women could not enter the École des Beaux-Arts — and studied with Corot. She exhibited at seven of the eight Impressionist exhibitions, painting the domestic spaces and private lives open to a woman of her class, ' +
      'with the most daring, feathery brushwork of the whole group.',
    roots: 'Camille Corot\'s landscapes, copying in the Louvre, and her close dialogue with Manet, whose brother she married.',
    room: { wall: '#dce4e8', floor: 'parquet', frame: 'gilt', light: '#fff4e2', props: ['vanity', 'bench'] },
    paintings: [
      {
        title: 'The Mother and Sister of the Artist', year: 1869, date: '1869–70', collection: 'National Gallery of Art, Washington',
        desc: 'Her mother reads while her sister Edma, in white, listens. Manet himself retouched the picture just before it went to the Salon — to Morisot\'s dismay.',
        search: { q: 'Berthe Morisot Mother and Sister of the Artist', all: ['morisot', 'mother|sister|lecture'] }
      },
      {
        title: 'The Cradle', year: 1872, date: '1872', collection: 'Musée d\'Orsay, Paris',
        desc: 'Her sister Edma watches over her sleeping baby through a translucent veil. Shown at the first Impressionist exhibition in 1874.',
        files: ['Berthe Morisot - The Cradle - Google Art Project.jpg', 'Berthe Morisot, Le berceau.jpg'],
        article: 'The Cradle (Morisot)'
      },
      {
        title: 'Eugène Manet on the Isle of Wight', year: 1875, date: '1875', collection: 'Musée Marmottan Monet, Paris',
        desc: 'Her new husband Eugène — Édouard Manet\'s brother — looks out of a window at the harbour of Cowes. The view from inside to outside, through glass and curtains, is a recurring theme in her work.',
        search: { q: 'Berthe Morisot Eugène Manet Isle of Wight', all: ['morisot', 'wight'] }
      },
      {
        title: 'Woman at Her Toilette', year: 1877, date: 'c. 1875–80', collection: 'Art Institute of Chicago',
        desc: 'White on white: dress, curtains, flowers and powder dissolve into swift zig-zag strokes. Few painters went as far toward pure brushwork in the 1870s.',
        search: { q: 'Berthe Morisot Woman at Her Toilette', all: ['morisot', 'toilette'] }
      },
      {
        title: 'Summer\'s Day', year: 1879, date: '1879', collection: 'National Gallery, London',
        desc: 'Two women in a boat on the lake in the Bois de Boulogne. The water is a few loose diagonal strokes; critics called her technique unfinished — today it looks remarkably modern.',
        article: 'Summer\'s Day (Morisot)',
        search: { q: 'Berthe Morisot Summer\'s Day', all: ['morisot', 'summer'] }
      },
      {
        title: 'In the Dining Room', year: 1886, date: '1886', collection: 'National Gallery of Art, Washington',
        desc: 'A maid pauses in the dining room, a little dog at her feet. Painted in the year of the last Impressionist exhibition, with the energetic, sketch-like handling that was Morisot\'s signature.',
        search: { q: 'Berthe Morisot In the Dining Room', all: ['morisot', 'dining'] }
      }
    ]
  },

  // ────────────────────── NEO- AND POST-IMPRESSIONISM ──────────────────────
  {
    id: 'cezanne',
    name: 'Paul Cézanne',
    short: 'Cézanne',
    born: 1839,
    died: 1906,
    nationality: 'French',
    movement: 'post',
    bio:
      'The son of a banker from Aix-en-Provence, Cézanne began with dark, violent pictures, learned Impressionism from Pissarro, then spent decades largely alone in Provence trying "to make of Impressionism something solid and durable, like the art of the museums". ' +
      'He built pictures from patches of colour and shifting viewpoints. Both Picasso and Matisse are said to have called him "the father of us all".',
    roots: 'Delacroix and Courbet in his youth, the Venetian and Baroque masters in the Louvre, and above all Pissarro\'s patient study of nature at Pontoise.',
    room: { wall: '#c7b086', floor: 'terracotta', frame: 'wood', light: '#ffe9c9', props: ['stilllife', 'geometry'] },
    paintings: [
      {
        title: 'The House of the Hanged Man', year: 1873, date: '1873', collection: 'Musée d\'Orsay, Paris',
        desc: 'Painted at Auvers while working beside Pissarro. The palette brightens, but houses and road are built from dense, interlocking blocks — already a picture of construction rather than fleeting light. Shown at the first Impressionist exhibition.',
        article: 'The House of the Hanged Man',
        search: { q: 'Cézanne House of the Hanged Man Auvers', all: ['cezanne', 'hanged|pendu'] }
      },
      {
        title: 'The Bay of Marseille, Seen from L\'Estaque', year: 1885, date: 'c. 1885',
        desc: 'Seen from the hills above L\'Estaque, the sea becomes a single flat plane of deep blue, the village a cluster of ochre cubes and the far mountains a band of grey-violet. Cézanne wrote that the view was "like a playing card: red roofs against the blue sea".',
        search: { q: 'Cézanne Bay of Marseille seen from L\'Estaque', all: ['cezanne', 'estaque'] }
      },
      {
        title: 'Mont Sainte-Victoire with Large Pine', year: 1887, date: 'c. 1887', collection: 'Courtauld Gallery, London',
        desc: 'The mountain he painted more than sixty times. A pine branch frames the valley, which is laid in as a patchwork of green and ochre planes, near and far held together on the surface.',
        search: { q: 'Cézanne Mont Sainte-Victoire large pine', all: ['cezanne', 'victoire', 'pine'] }
      },
      {
        title: 'Boy in a Red Waistcoat', year: 1888, date: '1888–90', collection: 'National Gallery of Art, Washington',
        desc: 'A young Italian model, Michelangelo di Rosa, in a red waistcoat and white shirt. Cézanne painted him four times. Limbs lengthen and lean to balance the composition: faithfulness to the structure of the picture matters more than faithfulness to the model.',
        article: 'Boy in a Red Waistcoat',
        search: { q: 'Cézanne Boy in a Red Waistcoat', all: ['cezanne', 'waistcoat|red vest|gilet rouge'] }
      },
      {
        title: 'The Card Players', year: 1892, date: '1890–95', collection: 'Musée d\'Orsay, Paris',
        desc: 'Two peasants face each other across a table, a bottle between them, silent and monumental as statues. Cézanne painted five versions of the subject, gradually reducing it from several figures to these two.',
        files: ['Les Joueurs de cartes, par Paul Cézanne.jpg'],
        article: 'The Card Players'
      },
      {
        title: 'The Basket of Apples', year: 1893, date: 'c. 1893', collection: 'Art Institute of Chicago',
        desc: 'Look at the table edge: it does not line up on either side of the cloth, and the bottle leans. Cézanne combined several viewpoints in one picture — the idea Cubism would make its foundation.',
        article: 'The Basket of Apples',
        search: { q: 'Cézanne The Basket of Apples Art Institute', all: ['cezanne', 'basket of apples'] }
      },
      {
        title: 'The Large Bathers', year: 1898, date: '1898–1905', collection: 'Philadelphia Museum of Art',
        desc: 'His largest painting, worked on for seven years: nude bathers beneath trees that lean together like the arches of a cathedral, forming one great triangle. Bodies are simplified and distorted to serve that architecture.',
        files: ['Paul Cézanne, French - The Large Bathers - Google Art Project.jpg'],
        search: { q: 'Cézanne The Large Bathers Philadelphia', all: ['cezanne', 'bathers|baigneuses', 'philadelphia|google art'] }
      },
      {
        title: 'Still Life with Apples and Oranges', year: 1899, date: 'c. 1899', collection: 'Musée d\'Orsay, Paris',
        desc: 'Apples, oranges, a flowered jug and a white cloth heaped on a tilting table, seen from several heights at once; the cloth spills forward like a mountain landscape. Cézanne advised treating nature "by means of the cylinder, the sphere and the cone".',
        article: 'Still Life with Apples and Oranges',
        search: { q: 'Cézanne Still Life with Apples and Oranges', all: ['cezanne', 'apples and oranges|pommes et oranges'] }
      },
      {
        title: 'Mont Sainte-Victoire (late version)', year: 1904, date: '1904–06',
        desc: 'The mountain rises above a plain laid in as a mosaic of separate patches of green, ochre and violet, with parts of the canvas left bare. Near and far are no longer separated by perspective; both are built from the same blocks of colour.',
        search: { q: 'Cézanne Mont Sainte-Victoire 1904 1906', all: ['cezanne', 'victoire', '190[4-6]'] }
      }
    ]
  },
  {
    id: 'seurat',
    name: 'Georges Seurat',
    short: 'Seurat',
    born: 1859,
    died: 1891,
    nationality: 'French',
    movement: 'neo',
    bio:
      'Trained at the École des Beaux-Arts in the tradition of Ingres, Seurat studied the colour science of Chevreul, Rood and Charles Blanc and set out to make Impressionism scientific. ' +
      'His method — small dots of pure colour mixed by the viewer\'s eye — launched Neo-Impressionism. He died at 31, leaving only seven large canvases.',
    roots: 'Ingres and Puvis de Chavannes\'s classical calm, Delacroix\'s colour, Impressionist subject matter and the optical theories of Chevreul and Rood.',
    room: { wall: '#e6dfcb', floor: 'stone', frame: 'white', light: '#fff6e6', props: ['dotrug', 'parasol'] },
    paintings: [
      {
        title: 'Bathers at Asnières', year: 1884, date: '1884', collection: 'National Gallery, London',
        desc: 'Rejected by the Salon, it was shown at the first Salon des Indépendants. Working men rest by the Seine with factory chimneys behind: a modern subject, but with the stillness of a classical frieze. Seurat later added dotted touches.',
        article: 'Bathers at Asnières',
        search: { q: 'Seurat Bathers at Asnières', all: ['seurat', 'asnieres'] }
      },
      {
        title: 'A Sunday Afternoon on the Island of La Grande Jatte', year: 1884.5, date: '1884–86', collection: 'Art Institute of Chicago',
        desc: 'Two years of work and dozens of studies. Some forty figures are frozen into geometric silhouettes and the surface is built from countless dots of colour. Shown at the last Impressionist exhibition in 1886, it announced a new movement.',
        files: ['A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg'],
        article: 'A Sunday Afternoon on the Island of La Grande Jatte'
      },
      {
        title: 'Les Poseuses (Models)', year: 1886, date: '1886–88', collection: 'Barnes Foundation, Philadelphia',
        desc: 'Seurat\'s answer to critics who said his method could not render the human figure: three models in his studio, with the Grande Jatte hanging on the wall behind them.',
        article: 'Les Poseuses',
        search: { q: 'Seurat Les Poseuses models', all: ['seurat', 'poseuses|models'] }
      },
      {
        title: 'Circus Sideshow (Parade de cirque)', year: 1887, date: '1887–88', collection: 'Metropolitan Museum of Art, New York',
        desc: 'A night-time street show under gas lamps, painted in muted, dotted tones. Flat, frontal and strictly horizontal — a step from Impressionism toward a decorative, almost abstract order.',
        article: 'Circus Sideshow',
        search: { q: 'Seurat Circus Sideshow parade', all: ['seurat', 'sideshow|parade'] }
      },
      {
        title: 'Le Chahut', year: 1889, date: '1889–90', collection: 'Kröller-Müller Museum, Otterlo',
        desc: 'A cancan at a café-concert. Following the theories of Charles Henry, upward-slanting lines were meant to express gaiety: line and colour are now chosen for their emotional effect — an idea that leads toward abstraction.',
        files: ['Georges Seurat - Le Chahut - Google Art Project.jpg'],
        article: 'Le Chahut'
      },
      {
        title: 'Young Woman Powdering Herself', year: 1889.5, date: '1889–90', collection: 'Courtauld Gallery, London',
        desc: 'A portrait of his companion Madeleine Knobloch. Seurat first painted his own face in the frame on the wall, then painted it over with a vase of flowers.',
        article: 'Young Woman Powdering Herself',
        search: { q: 'Seurat Young Woman Powdering Herself', all: ['seurat', 'powdering|poudrant'] }
      },
      {
        title: 'The Channel of Gravelines, Grand Fort-Philippe', year: 1890, date: '1890', collection: 'Musée de l\'Annonciade, Saint-Tropez',
        desc: 'A quiet harbour on the Channel coast — quays, a few boats, still water under a pale sky — built from small, regular dots of colour. Emptied of people, Seurat\'s seascapes are made of light alone, among his most serene works.',
        files: ['Seurat-Gravelines-Annonciade.jpg'],
        search: { q: 'Seurat Gravelines Annonciade', all: ['seurat', 'gravelines'] }
      },
      {
        title: 'The Circus', year: 1891, date: '1891', collection: 'Musée d\'Orsay, Paris',
        desc: 'Left unfinished at his sudden death. Rhythmic curves and a limited palette of primaries — yellow, red, blue — turn movement into pattern.',
        files: ['Georges Seurat, 1891, Le Cirque (The Circus), oil on canvas, 185 x 152 cm, Musée d\'Orsay, Paris.jpg'],
        article: 'The Circus (Seurat)'
      }
    ]
  },
  {
    id: 'signac',
    name: 'Paul Signac',
    short: 'Signac',
    born: 1863,
    died: 1935,
    nationality: 'French',
    movement: 'neo',
    bio:
      'A self-taught painter and passionate sailor, Signac met Seurat in 1884 and became Neo-Impressionism\'s organiser and theorist after Seurat\'s early death. ' +
      'His book "From Eugène Delacroix to Neo-Impressionism" (1899) and his house in Saint-Tropez made him the bridge between the dot and the bold colour of the Fauves.',
    roots: 'Monet\'s Impressionism (which first made him want to paint), Seurat\'s method and Chevreul\'s colour science.',
    room: { wall: '#cde1e8', floor: 'stone', frame: 'white', light: '#f6fbff', props: ['sailboat', 'bench'] },
    paintings: [
      {
        title: 'The Dining Room (Breakfast)', year: 1886, date: '1886–87', collection: 'Kröller-Müller Museum, Otterlo',
        desc: 'A rigid, almost mechanical bourgeois family scene in the new dotted technique. The light from the window is broken down into its component colours.',
        search: { q: 'Paul Signac dining room breakfast', all: ['signac', 'dining|breakfast|petit dejeuner|salle a manger'] }
      },
      {
        title: 'Portrait of Félix Fénéon', year: 1890, date: '1890', collection: 'Museum of Modern Art, New York',
        desc: 'The critic who named Neo-Impressionism holds a flower against a swirling background inspired by a Japanese kimono pattern. The full title is a mock-scientific joke: "Against the Enamel of a Background Rhythmic with Beats and Angles, Tones and Tints".',
        article: 'Portrait of Félix Fénéon',
        search: { q: 'Signac portrait Félix Fénéon opus 217', all: ['signac', 'feneon'] }
      },
      {
        title: 'Women at the Well', year: 1892, date: '1892', collection: 'Musée d\'Orsay, Paris',
        desc: 'Provençal women at a well above Saint-Tropez. The dots have grown into larger, mosaic-like tiles of colour, and the forms into decorative arabesques.',
        search: { q: 'Paul Signac Women at the Well femmes au puits', all: ['signac', 'well|puits'] }
      },
      {
        title: 'The Red Buoy', year: 1895, date: '1895', collection: 'Musée d\'Orsay, Paris',
        desc: 'The harbour of Saint-Tropez, its reflections broken into separate bricks of pure colour. A single red buoy anchors the composition — colour used for its own sake.',
        search: { q: 'Paul Signac red buoy bouée rouge', all: ['signac', 'buoy|bouee'] }
      },
      {
        title: 'The Papal Palace, Avignon', year: 1900, date: '1900', collection: 'Musée d\'Orsay, Paris',
        desc: 'The medieval fortress glows pink and gold above the Rhône. Signac\'s broad, square touches and intense colour are one step from Fauvism.',
        search: { q: 'Paul Signac Palais des Papes Avignon', all: ['signac', 'avignon'] }
      }
    ]
  },
  {
    id: 'vangogh',
    name: 'Vincent van Gogh',
    short: 'Van Gogh',
    born: 1853,
    died: 1890,
    nationality: 'Dutch',
    movement: 'post',
    bio:
      'A former art dealer and lay preacher, Van Gogh began painting only at 27. In ten years he produced some 860 paintings, moving from the dark peasant pictures of Holland to the blazing colour of Paris, Arles and Saint-Rémy. ' +
      'He sold almost nothing in his lifetime; within fifteen years of his death his work had transformed the course of painting.',
    roots:
      'Millet\'s peasant subjects, the dark Hague School, Rembrandt and Hals; then, in Paris in 1886–88, the Impressionists, Pissarro, Signac\'s dots, and the Japanese prints he collected by the hundreds.',
    room: { wall: '#2f4d77', floor: 'terracotta', frame: 'wood', light: '#ffe2a8', props: ['vgchair', 'sunflowers'] },
    paintings: [
      {
        title: 'The Potato Eaters', year: 1885, date: '1885', collection: 'Van Gogh Museum, Amsterdam',
        desc: 'His first major work: a peasant family eating by lamplight, in heavy earth colours. He wanted to show that they had dug the earth with the same hands they put in the dish — honest and coarse, before he discovered colour in Paris.',
        article: 'The Potato Eaters',
        search: { q: 'Van Gogh The Potato Eaters 1885', all: ['gogh', 'potato|aardappeleters|kartoffel'] }
      },
      {
        title: 'Self-Portrait with Grey Felt Hat', year: 1887, date: '1887',
        desc: 'Two years in Paris transformed him. The face is built from separate, directional dashes of complementary colour, learned from the Neo-Impressionists but given a new rhythmic energy.',
        files: ['Vincent van Gogh - Self-portrait with grey felt hat - Google Art Project.jpg'],
        search: { q: 'Van Gogh self-portrait grey felt hat', all: ['gogh', 'gr[ae]y felt hat'] }
      },
      {
        title: 'Sunflowers', year: 1888, date: '1888',
        desc: 'Painted to decorate Gauguin\'s room in the Yellow House at Arles: yellow on yellow, a near-impossible test of colour, in thick, sculpted paint.',
        article: 'Sunflowers (Van Gogh series)',
        search: { q: 'Van Gogh Sunflowers 1888 vase', all: ['gogh', 'sunflowers'] }
      },
      {
        title: 'Café Terrace at Night', year: 1888.6, date: '1888', collection: 'Kröller-Müller Museum, Otterlo',
        desc: 'His first painting with a starry sky — a night scene painted without black, only blues, violets and the yellow glow of the gas lamp.',
        article: 'Café Terrace at Night',
        search: { q: 'Van Gogh Café Terrace at Night', all: ['gogh', 'terrace|terras'] }
      },
      {
        title: 'The Night Café', year: 1888.7, date: '1888', collection: 'Yale University Art Gallery',
        desc: 'An all-night café in Arles: blood-red walls, a green ceiling, a billiard table and lamps with glaring halos. "I have tried to express the terrible passions of humanity by means of red and green," he wrote to his brother Theo — colour used for emotion rather than description.',
        article: 'The Night Café',
        search: { q: 'Van Gogh The Night Café', all: ['gogh', 'night cafe|cafe de nuit'] }
      },
      {
        title: 'Starry Night Over the Rhône', year: 1888.75, date: '1888', collection: 'Musée d\'Orsay, Paris',
        desc: 'The gas lamps of Arles reflected in the river beneath the Great Bear, a couple strolling in the foreground. Painted outdoors, at night.',
        files: ['Starry Night Over the Rhone.jpg', 'Vincent van Gogh - Starry Night Over the Rhône - Google Art Project.jpg'],
        search: { q: 'Van Gogh Starry Night over the Rhône 1888 Orsay', all: ['gogh|starry night over the rhone', 'rhone'] }
      },
      {
        title: 'Bedroom in Arles', year: 1888.8, date: '1888',
        desc: 'Flat areas of colour and thick contours, like a Japanese print. Van Gogh wanted the picture to suggest "absolute rest" — yet the tilted perspective adds an unsettling tension.',
        article: 'Bedroom in Arles',
        search: { q: 'Van Gogh Bedroom in Arles', all: ['gogh', 'bedroom|slaapkamer|chambre'] }
      },
      {
        title: 'Irises', year: 1889, date: '1889', collection: 'J. Paul Getty Museum, Los Angeles',
        desc: 'Painted in his first week at the asylum of Saint-Rémy. Strong outlines and flat colour recall Japanese prints; a single white iris stands out among the blue.',
        files: ['Irises-Vincent van Gogh.jpg'],
        article: 'Irises (painting)'
      },
      {
        title: 'The Starry Night', year: 1889.5, date: '1889', collection: 'Museum of Modern Art, New York',
        desc: 'Painted from memory and imagination at Saint-Rémy: the sky churns in great spirals and the cypress rises like a flame. Not what he saw, but what he felt — a landmark on the road to Expressionism.',
        files: ['Van Gogh - Starry Night - Google Art Project.jpg'],
        article: 'The Starry Night'
      },
      {
        title: 'Wheatfield with Crows', year: 1890, date: '1890', collection: 'Van Gogh Museum, Amsterdam',
        desc: 'One of his last paintings, at Auvers. Three paths lead nowhere under a stormy sky. He wrote of painting "vast fields of wheat under troubled skies" to express "sadness, extreme loneliness".',
        article: 'Wheatfield with Crows',
        search: { q: 'Van Gogh Wheatfield with Crows', all: ['gogh', 'crows|kraaien'] }
      }
    ]
  },
  {
    id: 'gauguin',
    name: 'Paul Gauguin',
    short: 'Gauguin',
    born: 1848,
    died: 1903,
    nationality: 'French',
    movement: 'post',
    bio:
      'A Paris stockbroker who collected and then practised Impressionism under Pissarro, Gauguin gave up finance after the 1882 crash. In Brittany, Arles, Tahiti and the Marquesas he sought a "primitive" world and an art of flat colour, strong outline and symbol — Synthetism. ' +
      'His work, shown in Paris in 1903 and in a large retrospective in 1906, was decisive for the Fauves.',
    roots:
      'Pissarro and Impressionism, Degas\'s drawing, Cézanne (whose still lifes he owned), Japanese prints, cloisonné enamel and stained glass, Breton folk art and Polynesian art.',
    room: { wall: '#7d4128', floor: 'darkwood', frame: 'wood', light: '#ffd9a0', props: ['palms', 'idol'] },
    paintings: [
      {
        title: 'Vision After the Sermon', year: 1888, date: '1888', collection: 'Scottish National Gallery, Edinburgh',
        desc: 'Breton women see the story of the sermon — Jacob wrestling with the angel — on a field of pure red. Reality and vision share one flat surface: a manifesto of Synthetism.',
        article: 'Vision After the Sermon',
        search: { q: 'Gauguin Vision after the Sermon', all: ['gauguin', 'vision|sermon'] }
      },
      {
        title: 'The Yellow Christ', year: 1889, date: '1889', collection: 'Buffalo AKG Art Museum',
        desc: 'A crucifixion set in the Breton autumn, with heavy outlines and flat yellow, inspired by a painted wooden crucifix in a chapel near Pont-Aven.',
        files: ['Gauguin Il Cristo giallo.jpg'],
        article: 'The Yellow Christ'
      },
      {
        title: 'Tahitian Women on the Beach', year: 1891, date: '1891', collection: 'Musée d\'Orsay, Paris',
        desc: 'From his first stay in Tahiti: two monumental figures pressed against the picture surface in broad, flat areas of colour.',
        article: 'Tahitian Women on the Beach',
        search: { q: 'Gauguin Tahitian Women on the Beach 1891', all: ['gauguin', 'tahitian women|femmes de tahiti|sur la plage'] }
      },
      {
        title: 'When Will You Marry? (Nafea Faa Ipoipo)', year: 1892, date: '1892',
        desc: 'Two Tahitian women — one in a traditional pareo, one in a high-necked missionary dress — old and new Tahiti side by side, in bands of flat, saturated colour.',
        article: 'When Will You Marry?',
        search: { q: 'Gauguin Nafea Faa Ipoipo', all: ['gauguin', 'nafea|marry'] }
      },
      {
        title: 'Spirit of the Dead Watching (Manao tupapau)', year: 1892.5, date: '1892', collection: 'Buffalo AKG Art Museum',
        desc: 'His young Tahitian companion lies afraid of the tupapau, the spirit of the dead, who sits behind her. The colours were chosen for mood, not appearance — Gauguin often compared his harmonies to music.',
        article: 'Spirit of the Dead Watching',
        search: { q: 'Gauguin Manao tupapau', all: ['gauguin', 'tupapau|spirit of the dead'] }
      },
      {
        title: 'Where Do We Come From? What Are We? Where Are We Going?', year: 1897, date: '1897–98', collection: 'Museum of Fine Arts, Boston',
        desc: 'His largest canvas, conceived as a testament. Read from right to left, it runs from birth to old age — a philosophical frieze in Symbolist flat colour.',
        files: ['Paul Gauguin - D\'ou venons-nous.jpg'],
        article: 'Where Do We Come From? What Are We? Where Are We Going?'
      },
      {
        title: 'Two Tahitian Women', year: 1899, date: '1899', collection: 'Metropolitan Museum of Art, New York',
        desc: 'Two women stand close to the picture surface like figures in a classical relief, one holding a tray of red mango blossoms. Calm, monumental and simplified, they embody Gauguin\'s late vision of an earthly paradise.',
        article: 'Two Tahitian Women',
        search: { q: 'Gauguin Two Tahitian Women 1899', all: ['gauguin', 'two tahitian women'] }
      }
    ]
  },

  // ─────────────────────── EXPRESSIONISM & FAUVISM ─────────────────────────
  {
    id: 'munch',
    name: 'Edvard Munch',
    short: 'Munch',
    born: 1863,
    died: 1944,
    nationality: 'Norwegian',
    movement: 'expressionism',
    bio:
      'The Norwegian painter of love, anxiety and death. After encountering Impressionism, Van Gogh and Gauguin in Paris (1889–91), Munch developed a Symbolist style of wavy lines and expressive colour. ' +
      'His 1892 exhibition in Berlin was closed after a scandal, and German Expressionism grew from his example.',
    roots: 'Norwegian naturalism (Christian Krohg), Impressionism, Van Gogh\'s and Gauguin\'s colour and line, Symbolist poetry and the bohemian circles of Kristiania and Berlin.',
    room: { wall: '#2b2632', floor: 'darkwood', frame: 'black', light: '#ffc9a8', sky: '#ff5a3a', props: ['bench'] },
    paintings: [
      {
        title: 'The Sick Child', year: 1885, date: '1885–86', collection: 'National Museum, Oslo',
        desc: 'His dying sister Sophie, painted from memory. Munch scraped and repainted the surface for a year; critics in Kristiania called it unfinished. It was his break with naturalism.',
        article: 'The Sick Child (Munch)',
        search: { q: 'Munch The Sick Child 1885', all: ['munch', 'sick child|syke barn'] }
      },
      {
        title: 'Starry Night', year: 1893, date: '1893', collection: 'J. Paul Getty Museum, Los Angeles',
        desc: 'The shore at Åsgårdstrand under a deep blue night sky: a rounded mass of trees, a white fence, and the light of a star reflected in the water. Munch turns a landscape into a state of mind — melancholy and longing.',
        article: 'Starry Night (Munch)',
        search: { q: 'Edvard Munch Starry Night 1893', all: ['munch', 'starry night|stjernenatt'] }
      },
      {
        title: 'The Scream', year: 1893.5, date: '1893', collection: 'National Museum, Oslo',
        desc: '"I sensed an infinite scream passing through nature," Munch wrote. The landscape bends in waves around the figure: emotion has become line and colour. The icon of Expressionism.',
        files: ['Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg'],
        article: 'The Scream'
      },
      {
        title: 'Vampire (Love and Pain)', year: 1893.8, date: '1893–95',
        desc: 'A woman bends over a man, her red hair flowing over him. Munch called it "Love and Pain"; a writer friend gave it the title "Vampire".',
        search: { q: 'Edvard Munch Vampire love and pain', all: ['munch', 'vampire|vampyr'] }
      },
      {
        title: 'Madonna', year: 1894, date: '1894',
        desc: 'Part Virgin, part lover, crowned with a red halo. Munch painted several versions; the lines around her body radiate like an aura.',
        article: 'Madonna (Munch)',
        search: { q: 'Edvard Munch Madonna painting', all: ['munch', 'madonna'] }
      },
      {
        title: 'Anxiety', year: 1894.5, date: '1894', collection: 'Munch Museum, Oslo',
        desc: 'The same blood-red sky and fjord as The Scream, now with a procession of pale, staring faces walking toward the viewer.',
        article: 'Anxiety (Munch)',
        search: { q: 'Edvard Munch Anxiety 1894', all: ['munch', 'anxiety|angst'] }
      },
      {
        title: 'The Dance of Life', year: 1899, date: '1899–1900', collection: 'National Museum, Oslo',
        desc: 'Three stages of a woman\'s life — innocence in white, passion in red, grief in black — on a moonlit shore. Part of his life-long "Frieze of Life" cycle.',
        article: 'The Dance of Life',
        search: { q: 'Edvard Munch The Dance of Life', all: ['munch', 'dance of life|livets dans'] }
      },
      {
        title: 'The Girls on the Bridge', year: 1901, date: '1901',
        desc: 'A bridge cutting diagonally into the picture, a dark mass of trees and a curving shore: a calm scene, but built from the same swinging lines as his anxious images.',
        article: 'The Girls on the Bridge',
        search: { q: 'Edvard Munch girls on the bridge', all: ['munch', 'girls on the bridge|pikene pa broen'] }
      }
    ]
  },
  {
    id: 'matisse',
    name: 'Henri Matisse',
    short: 'Matisse',
    born: 1869,
    died: 1954,
    nationality: 'French',
    movement: 'fauvism',
    bio:
      'A lawyer\'s clerk who discovered painting while recovering from appendicitis, Matisse studied under Gustave Moreau, learned from Cézanne, Signac and Gauguin, and in 1905 led the Fauves. ' +
      'For the rest of his long life he pursued "an art of balance, of purity and serenity", using colour itself as the structure of the picture.',
    roots: 'Gustave Moreau\'s teaching, Cézanne\'s construction, Signac\'s pure colour, Gauguin\'s flat areas, Islamic decorative art and the late Renoir.',
    room: { wall: '#b3342d', floor: 'tiles', frame: 'white', light: '#fff1dc', props: ['goldfish', 'planters'] },
    paintings: [
      {
        title: 'Luxe, Calme et Volupté', year: 1904, date: '1904', collection: 'Musée d\'Orsay, Paris',
        desc: 'Painted after a summer with Signac in Saint-Tropez; the title comes from a Baudelaire poem. Divisionist dots, but in strident, unnatural colours — Neo-Impressionism on the verge of Fauvism.',
        article: 'Luxe, Calme et Volupté',
        search: { q: 'Henri Matisse Luxe Calme et Volupté', all: ['matisse', 'luxe'] }
      },
      {
        title: 'Portrait of André Derain', year: 1905.2, date: '1905', collection: 'Tate, London',
        desc: 'Painted at Collioure in the summer of 1905, when Matisse and Derain worked side by side. The face is built from slabs of green, red and blue — colour freed from description, weeks before the word "Fauves" was coined.',
        files: ['André Derain, par Henri Matisse.jpg'],
        search: { q: 'Henri Matisse portrait of André Derain 1905', all: ['matisse', "andre derain, par henri matisse|portrait of andre derain"] }
      },
      {
        title: 'Woman with a Hat', year: 1905.4, date: '1905', collection: 'San Francisco Museum of Modern Art',
        desc: 'Madame Matisse with green and violet shadows across her face. At the 1905 Salon d\'Automne it caused an uproar; the critic Louis Vauxcelles called the painters in that room "fauves" — wild beasts.',
        article: 'Woman with a Hat',
        search: { q: 'Henri Matisse Woman with a Hat 1905', all: ['matisse', 'woman with a hat|femme au chapeau'] }
      },
      {
        title: 'The Green Stripe (Portrait of Madame Matisse)', year: 1905.5, date: '1905', collection: 'Statens Museum for Kunst, Copenhagen',
        desc: 'A green stripe down the middle of his wife\'s face replaces conventional shading. Colour now builds the form by itself.',
        article: 'The Green Stripe',
        search: { q: 'Henri Matisse The Green Stripe', all: ['matisse', 'green stripe|raie verte'] }
      },
      {
        title: 'Le Bonheur de Vivre (The Joy of Life)', year: 1906, date: '1905–06', collection: 'Barnes Foundation, Philadelphia',
        desc: 'Nudes dance, play music and embrace in a glade of pure, flat colour — pink, orange, green, violet — bound together by long, flowing contours. Matisse\'s vision of a golden age, and one of the largest pictures of the Fauve years.',
        article: 'Le Bonheur de Vivre',
        search: { q: 'Henri Matisse Le bonheur de vivre', all: ['matisse', 'bonheur de vivre|joy of life'] }
      },
      {
        title: 'Blue Nude (Souvenir of Biskra)', year: 1907, date: '1907', collection: 'Baltimore Museum of Art',
        desc: 'A reclining nude modelled with harsh blue contours, her body twisted and enlarged like carved sculpture; the palm fronds recall Matisse\'s trip to the Algerian oasis of Biskra. He worked out the same pose in a clay sculpture.',
        article: 'Blue Nude (Souvenir of Biskra)',
        search: { q: 'Henri Matisse Blue Nude Souvenir of Biskra', all: ['matisse', 'biskra|blue nude|nu bleu'] }
      },
      {
        title: 'Harmony in Red (The Dessert)', year: 1908, date: '1908', collection: 'Hermitage Museum, St Petersburg',
        desc: 'First painted in blue, then repainted red. The pattern of the tablecloth climbs the wall: table and wall merge into one flat decorative surface, with the window as a picture within the picture.',
        article: 'Harmony in Red (The Red Room)',
        search: { q: 'Henri Matisse Harmony in Red', all: ['matisse', 'harmony in red|la desserte|red room'] }
      },
      {
        title: 'Dance', year: 1910, date: '1909–10',
        desc: 'A ring of five dancers, painted for the Moscow collector Sergei Shchukin, who also commissioned its companion, Music. Figures, ground and sky are reduced to a few flat colours: painting as pure rhythm.',
        article: 'Dance (Matisse)',
        search: { q: 'Henri Matisse La Danse 1910 Hermitage', all: ['matisse', 'dance|danse', '1910|hermitage'] }
      },
      {
        title: 'The Red Studio', year: 1911, date: '1911', collection: 'Museum of Modern Art, New York',
        desc: 'His studio dissolved into a single field of Venetian red, the furniture reduced to yellow outlines. His own paintings float on the walls — a picture about painting itself.',
        article: 'The Red Studio',
        search: { q: 'Henri Matisse The Red Studio', all: ['matisse', 'red studio|atelier rouge'] }
      },
      {
        title: 'Goldfish', year: 1912, date: '1912', collection: 'Pushkin Museum, Moscow',
        desc: 'Four orange fish in a glass bowl, seen from the side and from above at once, surrounded by plants and flowers.',
        article: 'Goldfish (Matisse)',
        search: { q: 'Henri Matisse Goldfish 1912', all: ['matisse', 'goldfish|poissons rouges'] }
      }
    ]
  },
  {
    id: 'derain',
    name: 'André Derain',
    short: 'Derain',
    born: 1880,
    died: 1954,
    nationality: 'French',
    movement: 'fauvism',
    bio:
      'Derain met Vlaminck in 1900 and Matisse in 1901, and spent the summer of 1905 painting with Matisse at Collioure — the birth of Fauvism. Sent to London by the dealer Ambroise Vollard, he painted the Thames in arbitrary, blazing colour. ' +
      'From 1907, close to Picasso, he turned to Cézanne\'s structure, and later to a classical style.',
    roots: 'Van Gogh (whose 1901 Paris retrospective he visited with Vlaminck), Neo-Impressionist colour, Gauguin and Cézanne.',
    room: { wall: '#2c6a68', floor: 'stone', frame: 'wood', light: '#fff0d8', props: ['bench', 'planters'] },
    paintings: [
      {
        title: 'Mountains at Collioure', year: 1905, date: '1905', collection: 'National Gallery of Art, Washington',
        desc: 'Painted with Matisse in the summer of 1905: short strokes of pure colour borrowed from the Neo-Impressionists, but scattered freely, with bare canvas between them.',
        search: { q: 'André Derain Mountains at Collioure', all: ['derain', 'collioure', 'mountain|montagne'] }
      },
      {
        title: 'Portrait of Henri Matisse', year: 1905.5, date: '1905', collection: 'Tate, London',
        desc: 'Matisse\'s face and beard built from bold strokes of red, green and orange. That summer at Collioure the two friends painted each other.',
        search: { q: 'André Derain portrait of Henri Matisse 1905', all: ['derain', "henri matisse, par andre derain|portrait of (henri )?matisse|portrait (de |d.)henri matisse"] }
      },
      {
        title: 'Charing Cross Bridge', year: 1906, date: '1906',
        desc: 'The railway bridge over the Thames, with boats and quays, painted in blazing unmixed blue, green and orange instead of London\'s famous grey fog. The dealer Ambroise Vollard had sent Derain to London to paint the city.',
        search: { q: 'André Derain Charing Cross Bridge', all: ['derain', 'charing cross'] }
      },
      {
        title: 'The Pool of London', year: 1906.3, date: '1906', collection: 'Tate, London',
        desc: 'Cargo boats on the Thames in flat, hot colours and strong outlines, the water laid in patches of green and blue.',
        search: { q: 'André Derain Pool of London', all: ['derain', 'pool of london'] }
      },
      {
        title: 'Big Ben', year: 1906.5, date: '1906',
        desc: 'The Houses of Parliament at sunset as an almost abstract arrangement of yellow, orange and blue.',
        search: { q: 'André Derain Big Ben', all: ['derain', 'big ben'] }
      },
      {
        title: 'The Turning Road, L\'Estaque', year: 1906.7, date: '1906', collection: 'Museum of Fine Arts, Houston',
        desc: 'Painted at L\'Estaque, Cézanne\'s motif — but with Gauguin-like flat colour: figures and trees in reds, purples and blues, on a scale meant to rival the old masters.',
        search: { q: 'André Derain Turning Road L\'Estaque', all: ['derain', 'estaque'] }
      },
      {
        title: 'Bathers', year: 1907, date: '1907',
        desc: 'Heavy, simplified nudes in a landscape of muted greens and ochres. Here Derain leaves Fauve colour behind for solid volume and firm structure.',
        search: { q: 'André Derain Bathers 1907 baigneuses', all: ['derain', 'bathers|baigneuses'] }
      }
    ]
  },

  // ───────────────────────────── ABSTRACTION ───────────────────────────────
  {
    id: 'kandinsky',
    name: 'Wassily Kandinsky',
    short: 'Kandinsky',
    born: 1866,
    died: 1944,
    nationality: 'Russian-French',
    movement: 'abstraction',
    bio:
      'A Moscow law lecturer who gave up his career at 30 to study painting in Munich. Kandinsky moved from Russian fairy tales and Fauvist landscapes to some of the first paintings without recognisable objects (around 1910–13). ' +
      'He co-founded Der Blaue Reiter, wrote "Concerning the Spiritual in Art" (1911), and later taught at the Bauhaus.',
    roots: 'Russian folk art and icons, Monet\'s Haystacks, Wagner\'s music, Fauvist colour, Symbolism and Theosophy.',
    room: { wall: '#ebe8e1', floor: 'concrete', frame: 'black', light: '#ffffff', props: ['floatingshapes'] },
    paintings: [
      {
        title: 'The Blue Rider', year: 1903, date: '1903', collection: 'Foundation E.G. Bührle, Zürich',
        desc: 'A rider in a blue cloak gallops across a meadow — a motif of spiritual quest that would give the 1911 group its name.',
        article: 'The Blue Rider (painting)',
        search: { q: 'Kandinsky Der Blaue Reiter 1903', all: ['kandinsky', 'blue rider|blaue reiter', '1903'] }
      },
      {
        title: 'Railway near Murnau', year: 1909, date: '1909', collection: 'Lenbachhaus, Munich',
        desc: 'A train crosses the Bavarian landscape at Murnau, where Kandinsky spent his summers with Gabriele Münter. Fauvist colour laid in flat patches; the forms are already loosening their outlines.',
        files: ['Kandinsky Eisenbahn bei Murnau PA291090.jpg'],
        search: { q: 'Kandinsky Eisenbahn bei Murnau', all: ['kandinsky', 'eisenbahn|railway'] }
      },
      {
        title: 'Composition IV', year: 1911, date: '1911', collection: 'Kunstsammlung Nordrhein-Westfalen, Düsseldorf',
        desc: 'Cossacks with lances, castles on a hill, a rainbow — all half-dissolved into black lines and bright patches. Kandinsky deliberately "veiled" the subject so that colour and line could act on their own.',
        search: { q: 'Kandinsky Composition IV 1911', all: ['kandinsky', 'composition iv\\b'] }
      },
      {
        title: 'Improvisation 28 (second version)', year: 1912, date: '1912', collection: 'Solomon R. Guggenheim Museum, New York',
        desc: 'For Kandinsky an "Improvisation" was a spontaneous expression of inner feeling, like musical improvisation. Biblical themes of deluge and salvation are hidden in the swirl.',
        search: { q: 'Kandinsky Improvisation 28', all: ['kandinsky', 'improvisation 28'] }
      },
      {
        title: 'Composition VI', year: 1913, date: '1913', collection: 'Hermitage Museum, St Petersburg',
        desc: 'Begun as a picture of the Flood. After many studies Kandinsky kept only the feeling of catastrophe and renewal, expressed by colliding colours and lines.',
        search: { q: 'Kandinsky Composition VI 1913', all: ['kandinsky', 'composition vi\\b'] }
      },
      {
        title: 'Composition VII', year: 1913.5, date: '1913', collection: 'Tretyakov Gallery, Moscow',
        desc: 'Often called the most complex painting of the pre-war era: painted in a few days after more than thirty studies. Kandinsky thought of his Compositions as visual symphonies.',
        article: 'Composition VII',
        search: { q: 'Kandinsky Composition VII 1913', all: ['kandinsky', 'composition vii\\b|composition 7\\b'] }
      },
      {
        title: 'Composition VIII', year: 1923, date: '1923', collection: 'Solomon R. Guggenheim Museum, New York',
        desc: 'Painted while teaching at the Bauhaus. The lyrical storms of 1913 have become circles, triangles and lines — a precise geometric vocabulary showing contact with Russian Constructivism.',
        article: 'Composition VIII',
        search: { q: 'Kandinsky Composition VIII 1923', all: ['kandinsky', 'composition viii\\b|composition 8\\b'] }
      },
      {
        title: 'Yellow-Red-Blue', year: 1925, date: '1925', collection: 'Centre Pompidou, Paris',
        desc: 'A summary of his colour theory: yellow is sharp and active, blue deep and spiritual, red in between — a visual equivalent of a musical chord.',
        article: 'Yellow-Red-Blue',
        search: { q: 'Kandinsky Yellow Red Blue 1925', all: ['kandinsky', 'yellow.{0,3}red.{0,3}blue|gelb.{0,3}rot.{0,3}blau|jaune.{0,3}rouge.{0,3}bleu'] }
      },
      {
        title: 'Several Circles', year: 1926, date: '1926', collection: 'Solomon R. Guggenheim Museum, New York',
        desc: 'Transparent circles float in dark space like planets. "The circle," Kandinsky wrote, "is the synthesis of the greatest oppositions."',
        search: { q: 'Kandinsky Several Circles 1926', all: ['kandinsky', 'several circles|einige kreise'] }
      }
    ]
  },
  {
    id: 'marc',
    name: 'Franz Marc',
    short: 'Marc',
    born: 1880,
    died: 1916,
    nationality: 'German',
    movement: 'expressionism',
    bio:
      'Son of a Munich painter, Marc believed animals lived in purer harmony with nature than humans and painted them in symbolic colours: blue for the spiritual and masculine, yellow for the gentle and feminine, red for heavy matter. ' +
      'With Kandinsky he founded Der Blaue Reiter in 1911. He was killed at Verdun in 1916, aged 36.',
    roots: 'Van Gogh (seen in Paris in 1903 and 1907), Gauguin, Kandinsky\'s ideas on colour, and Delaunay\'s prismatic colour after 1912.',
    room: { wall: '#1e3b69', floor: 'darkwood', frame: 'black', light: '#fff2d8', props: ['crystals'] },
    paintings: [
      {
        title: 'Blue Horse I', year: 1911, date: '1911', collection: 'Lenbachhaus, Munich',
        desc: 'A young horse in pure blue against a landscape of red, yellow and green, painted in the year of the first Blaue Reiter exhibition. Colour carries meaning, not description.',
        article: 'Blue Horse I',
        search: { q: 'Franz Marc Blue Horse I', all: ['marc', 'blue horse|blaues pferd'] }
      },
      {
        title: 'The Yellow Cow', year: 1911.3, date: '1911', collection: 'Solomon R. Guggenheim Museum, New York',
        desc: 'A leaping yellow cow — the joyous, feminine principle in Marc\'s colour symbolism — in a landscape of blue mountains.',
        article: 'The Yellow Cow',
        search: { q: 'Franz Marc The Yellow Cow', all: ['marc', 'yellow cow|gelbe kuh'] }
      },
      {
        title: 'The Large Blue Horses', year: 1911.6, date: '1911', collection: 'Walker Art Center, Minneapolis',
        desc: 'Three horses fused into one rhythmic blue mass whose curves echo the hills behind them.',
        article: 'The Large Blue Horses',
        search: { q: 'Franz Marc The Large Blue Horses', all: ['marc', 'large blue horses|grossen blauen pferde'] }
      },
      {
        title: 'The Fate of the Animals', year: 1913, date: '1913', collection: 'Kunstmuseum Basel',
        desc: 'An apocalyptic vision of animals in a collapsing, burning forest, painted a year before the First World War. Damaged by fire in 1916, its right side was later restored by Paul Klee.',
        article: 'The Fate of the Animals',
        search: { q: 'Franz Marc Tierschicksale Fate of the Animals', all: ['marc', 'fate of the animals|tierschicksale'] }
      },
      {
        title: 'Deer in the Forest', year: 1913.5, date: '1913–14',
        desc: 'Deer curl up asleep in a forest splintered into luminous, transparent planes of colour, like light passing through a prism. The animals and the forest seem made of the same crystalline substance.',
        search: { q: 'Franz Marc Deer in the Forest Rehe im Walde', all: ['marc', 'deer in the forest|rehe im walde'] }
      },
      {
        title: 'Fighting Forms', year: 1914, date: '1914', collection: 'Pinakothek der Moderne, Munich',
        desc: 'Two swirling forces, red and black-blue, collide. With no animals left, Marc had crossed into abstraction just months before the war.',
        article: 'Fighting Forms',
        search: { q: 'Franz Marc Fighting Forms Kämpfende Formen', all: ['marc', 'fighting forms|kampfende formen'] }
      }
    ]
  },

  // ──────────────────────────────── CUBISM ─────────────────────────────────
  {
    id: 'gris',
    name: 'Juan Gris',
    short: 'Gris',
    born: 1887,
    died: 1927,
    nationality: 'Spanish',
    movement: 'cubism',
    bio:
      'Born José Victoriano González in Madrid, Gris moved to Paris in 1906 and lived next to Picasso in the Bateau-Lavoir studios, watching Cubism being invented. He began painting seriously in 1911 and became Cubism\'s great systematiser, ' +
      'building pictures from a geometric grid and only then fitting objects into it. He died at 40.',
    roots: 'Cézanne, the early Cubism of Picasso and Braque, and his training in engineering and mathematics in Madrid.',
    room: { wall: '#8b8e92', floor: 'concrete', frame: 'black', light: '#fffaf0', props: ['cubistblocks', 'bench'] },
    paintings: [
      {
        title: 'Portrait of Pablo Picasso', year: 1912, date: '1912', collection: 'Art Institute of Chicago',
        desc: 'Gris\'s homage to his friend, shown at the 1912 Salon des Indépendants. The figure is cut by a regular diagonal grid, and each section is lit from a different direction.',
        article: 'Portrait of Pablo Picasso (Gris)',
        search: { q: 'Juan Gris Portrait of Pablo Picasso', all: ['juan gris', 'picasso'] }
      },
      {
        title: 'Still Life with Bottles and Knife', year: 1912.5, date: '1912', collection: 'Kröller-Müller Museum, Otterlo',
        desc: 'Cubism made orderly: bottles, a knife and a plate seen from several angles at once, within a strict structure of planes.',
        search: { q: 'Juan Gris still life bottles knife', all: ['juan gris', 'knife|couteau'] }
      },
      {
        title: 'Violin and Checkerboard', year: 1913, date: '1913',
        desc: 'A violin split into overlapping planes, part shown in light, part in shadow, next to the flat pattern of a draughts board — real pattern and abstract structure side by side.',
        search: { q: 'Juan Gris violin checkerboard', all: ['juan gris', 'violin|violon', 'checker|damier|chess'] }
      },
      {
        title: 'The Sunblind', year: 1914, date: '1914', collection: 'Tate, London',
        desc: 'Newspaper and paper pasted onto the canvas, combined with charcoal and gouache. Real materials enter the picture: this is Synthetic Cubism.',
        search: { q: 'Juan Gris The Sunblind 1914', all: ['juan gris', 'sunblind|le store'] }
      },
      {
        title: 'Still Life with Checked Tablecloth', year: 1915, date: '1915', collection: 'Metropolitan Museum of Art, New York',
        desc: 'Bright, flat planes interlock like a jigsaw: a newspaper, a bottle, a glass, a fruit bowl, each shown from its most characteristic angle.',
        search: { q: 'Juan Gris Still Life with Checked Tablecloth', all: ['juan gris', 'checked tablecloth'] }
      },
      {
        title: 'Portrait of Josette', year: 1916, date: '1916', collection: 'Museo Reina Sofía, Madrid',
        desc: 'His partner Josette, seated, rebuilt from a few large, sombre planes of grey, black and brown. Gris said he started from abstract shapes and only then turned them into an object: "I make a bottle out of a cylinder."',
        search: { q: 'Juan Gris Portrait of Josette 1916', all: ['juan gris', 'josette'] }
      },
      {
        title: 'Harlequin with Guitar', year: 1917, date: 'c. 1917–19',
        desc: 'Harlequin, the melancholy clown of the commedia dell\'arte, holding a guitar — assembled from crisp, interlocking flat shapes in a few strong colours.',
        search: { q: 'Juan Gris Harlequin with Guitar', all: ['juan gris', 'harlequin|arlequin'] }
      }
    ]
  },
  {
    id: 'delaunay',
    name: 'Robert Delaunay',
    short: 'Delaunay',
    born: 1885,
    died: 1941,
    nationality: 'French',
    movement: 'cubism',
    bio:
      'Largely self-taught, Delaunay passed through Neo-Impressionism and a Cézanne phase before painting the Eiffel Tower shattered into fragments (1909–11). ' +
      'With his wife Sonia Delaunay he developed "simultaneism": contrasting colours placed side by side to create rhythm, depth and movement. The poet Apollinaire named it Orphism.',
    roots: 'Seurat\'s and Chevreul\'s colour contrasts, Cézanne\'s planes, Cubism, and the modern city — the Eiffel Tower, airplanes, electric light.',
    room: { wall: '#f0eee8', floor: 'concrete', frame: 'white', light: '#ffffff', props: ['discs', 'eiffel'] },
    paintings: [
      {
        title: 'Saint-Séverin', year: 1909, date: '1909',
        desc: 'The ambulatory of a Gothic church in Paris, its columns bending under the pressure of light — the first step of what he called his "destructive" phase.',
        search: { q: 'Robert Delaunay Saint-Séverin', all: ['delaunay', 'severin'] }
      },
      {
        title: 'Eiffel Tower', year: 1910.5, date: '1910–11',
        desc: 'The tower, symbol of modern Paris, seen from several viewpoints at once and broken apart as if shaken by its own energy, with the surrounding buildings collapsing around it.',
        search: { q: 'Robert Delaunay Tour Eiffel 1911', all: ['robert delaunay', 'eiffel', '1910|1911'] }
      },
      {
        title: 'The City of Paris', year: 1911.5, date: '1910–12', collection: 'Centre Pompidou, Paris',
        desc: 'A huge canvas shown at the 1912 Salon des Indépendants: the Three Graces of classical art between the Seine quays and the Eiffel Tower, all fragmented into a shimmering pink and blue mosaic.',
        search: { q: 'Robert Delaunay La Ville de Paris', all: ['delaunay', 'ville de paris|city of paris'] }
      },
      {
        title: 'Windows Open Simultaneously', year: 1912, date: '1912',
        desc: 'In the "Windows" series the subject almost vanishes: a glimpse of the Eiffel Tower through panes of contrasting colour. Light itself becomes the subject.',
        search: { q: 'Robert Delaunay Simultaneous Windows', all: ['robert delaunay', 'window|fenetre'] }
      },
      {
        title: 'Circular Forms, Moon No. 3', year: 1913, date: '1913',
        desc: 'The moon and its halo reduced to concentric rings and segments of contrasting colour. No object remains — among the first entirely non-figurative paintings made in Paris.',
        files: ['Robert Delaunay - Circular Forms, Moon No. 3 - 1913 - Private collection.jpg'],
        search: { q: 'Robert Delaunay Formes circulaires lune', all: ['robert delaunay', 'circular|circulaire'] }
      },
      {
        title: 'Homage to Blériot', year: 1914, date: '1914', collection: 'Kunstmuseum Basel',
        desc: 'Celebrating Louis Blériot\'s 1909 flight across the Channel: propellers, a biplane and the Eiffel Tower whirl in rings of pure colour. Modern technology and abstraction in a single image.',
        article: 'Homage to Blériot',
        search: { q: 'Robert Delaunay Homage to Blériot', all: ['delaunay', 'bleriot'] }
      }
    ]
  },
  {
    id: 'mondrian',
    name: 'Piet Mondrian',
    short: 'Mondrian',
    born: 1872,
    died: 1944,
    nationality: 'Dutch',
    movement: 'abstraction',
    bio:
      'Trained as a traditional Dutch landscape painter, Mondrian went through a "Luminist" phase of pure colour and then, in Paris from 1912, through Cubism. Step by step he reduced trees, dunes and the sea to horizontal and vertical lines. ' +
      'By 1920, with the De Stijl group, he had arrived at Neo-Plasticism: black lines, white, and the three primary colours.',
    roots: 'The Hague School landscape tradition, Van Gogh and Neo-Impressionist colour, Theosophy and above all Cubism.',
    room: { wall: '#f5f4ef', floor: 'mondrian', frame: 'none', light: '#ffffff', props: ['colorblocks'] },
    paintings: [
      {
        title: 'Windmill in Sunlight', year: 1908, date: '1908', collection: 'Kunstmuseum Den Haag',
        desc: 'Red, blue and yellow blaze in broken strokes against the sky. In his "Luminist" period Mondrian adopted the pure colours of the Neo-Impressionists and the Fauves.',
        search: { q: 'Mondriaan Molen in zonlicht windmill sunlight', all: ['mondria', 'zonlicht|sunlight|winkel'] }
      },
      {
        title: 'Evening; Red Tree', year: 1908.5, date: '1908–10', collection: 'Kunstmuseum Den Haag',
        desc: 'A twisting tree in red against a deep blue dusk, its branches spreading like veins across the sky. Mondrian painted trees again and again over the next four years; this is where the series begins, in expressive colour.',
        article: 'Evening; Red Tree',
        search: { q: 'Mondriaan Avond de rode boom', all: ['mondria', 'red tree|rode boom'] }
      },
      {
        title: 'Gray Tree', year: 1911, date: '1911', collection: 'Kunstmuseum Den Haag',
        desc: 'Colour has drained away to greys and black; the branches become a network of curving lines spread evenly across the surface. The tree is turning into a structure — Mondrian was absorbing the Cubism he had just discovered.',
        article: 'Gray Tree',
        search: { q: 'Mondriaan De grijze boom', all: ['mondria', 'gr[ae]y tree|grijze boom'] }
      },
      {
        title: 'Flowering Apple Tree', year: 1912, date: '1912', collection: 'Kunstmuseum Den Haag',
        desc: 'Without the title, the tree is no longer recognisable: short curved and straight lines form an oval, Cubist-style lattice.',
        search: { q: 'Mondriaan Bloeiende appelboom', all: ['mondria', 'apple|appelboom'] }
      },
      {
        title: 'Composition 10 in Black and White (Pier and Ocean)', year: 1915, date: '1915', collection: 'Kröller-Müller Museum, Otterlo',
        desc: 'A sea of short horizontal and vertical dashes: the rhythm of waves breaking on a pier, reduced to plus and minus signs. Only the title remembers the subject.',
        search: { q: 'Mondriaan Pier and Ocean compositie 10', all: ['mondria', 'pier|ocean|oceaan|compositie 10|composition 10'] }
      },
      {
        title: 'Composition with Large Red Plane, Yellow, Black, Gray and Blue', year: 1921, date: '1921', collection: 'Kunstmuseum Den Haag',
        desc: 'The mature Neo-Plastic style: thick black lines, a dominant red plane and smaller fields of colour in perfectly balanced asymmetry.',
        search: { q: 'Mondrian Composition with Large Red Plane 1921', all: ['mondria', 'large red|groot rood'] }
      },
      {
        title: 'Composition with Red, Blue and Yellow', year: 1930, date: '1930', collection: 'Kunsthaus Zürich',
        desc: 'The best-known image of De Stijl: a large red square balanced by a small blue one and a sliver of yellow. Mondrian believed such pure relationships expressed a universal harmony.',
        article: 'Composition with Red, Blue and Yellow',
        search: { q: 'Mondrian Composition with Red Blue and Yellow 1930', all: ['mondria', 'red.{0,3}blue.{0,5}yellow|rood.{0,3}blauw.{0,5}geel', '1930'] }
      },
      {
        title: 'Broadway Boogie Woogie', year: 1942, date: '1942–43', collection: 'Museum of Modern Art, New York',
        desc: 'Painted in New York, where Mondrian had fled the war. The black lines are gone, replaced by flickering yellow streets and small coloured blocks — the grid of Manhattan and the rhythm of boogie-woogie jazz.',
        article: 'Broadway Boogie Woogie',
        search: { q: 'Mondrian Broadway Boogie Woogie', all: ['mondria', 'boogie'] }
      }
    ]
  },
  {
    id: 'malevich',
    name: 'Kazimir Malevich',
    short: 'Malevich',
    born: 1879,
    died: 1935,
    nationality: 'Russian-Ukrainian',
    movement: 'abstraction',
    bio:
      'Born in Kyiv to Polish parents, Malevich passed through Impressionism, Cézanne, Primitivism and Cubo-Futurism in barely ten years. In December 1915, at the "0.10" exhibition in Petrograd, he unveiled Suprematism — ' +
      'painting reduced to flat geometric forms on white — with the Black Square hung high in a corner like an icon.',
    roots: 'Russian icons and folk prints, Cézanne, Cubism (seen in Moscow in the collection of Sergei Shchukin), Italian Futurism and Russian avant-garde poetry.',
    room: { wall: '#f7f7f4', floor: 'white', frame: 'none', light: '#ffffff', props: ['suprematist'] },
    paintings: [
      {
        title: 'Morning in the Village after Snowstorm', year: 1912, date: '1912', collection: 'Solomon R. Guggenheim Museum, New York',
        desc: 'Peasants trudge through the snow among houses and trees built from shining metallic cones and cylinders: the Russian village turned into a world of geometric, machine-like forms.',
        search: { q: 'Malevich Morning in the Village after Snowstorm', all: ['malevi|malewi', 'morning|snowstorm'] }
      },
      {
        title: 'The Knifegrinder', year: 1912.5, date: '1912–13', collection: 'Yale University Art Gallery',
        desc: 'Cubo-Futurism: the knifegrinder\'s hands, feet and the stairs repeat in successive positions, like a chronophotograph — Cubist fragmentation set in motion.',
        article: 'The Knifegrinder',
        search: { q: 'Malevich The Knifegrinder', all: ['malevi|malewi', 'knife|grinder'] }
      },
      {
        title: 'An Englishman in Moscow', year: 1914, date: '1914', collection: 'Stedelijk Museum, Amsterdam',
        desc: '"Alogism": a fish, a sabre, a church, a ladder and random words collide around a man in a top hat. Logic itself is broken — a short step from abandoning objects altogether.',
        article: 'An Englishman in Moscow',
        search: { q: 'Malevich An Englishman in Moscow', all: ['malevi|malewi', 'englishman'] }
      },
      {
        title: 'Black Square', year: 1915, date: '1915', collection: 'Tretyakov Gallery, Moscow',
        desc: 'Shown at the "0.10" exhibition, hung in the corner where Russian homes place an icon. Malevich called it the "zero of form": the end of painting as a picture of something, and the beginning of Suprematism.',
        article: 'Black Square (painting)',
        search: { q: 'Malevich Black Square 1915', all: ['malevi|malewi', 'black square|chernyi kvadrat|schwarzes quadrat'] }
      },
      {
        title: 'Red Square', year: 1915.3, date: '1915', collection: 'State Russian Museum, St Petersburg',
        desc: 'Its full title — "Painterly Realism of a Peasant Woman in Two Dimensions" — is ironic: a slightly tilted red quadrilateral on white is all that is left of the subject.',
        article: 'Red Square (painting)',
        search: { q: 'Malevich Red Square peasant woman two dimensions', all: ['malevi|malewi', 'red square|peasant woman'] }
      },
      {
        title: 'Suprematist Composition: Airplane Flying', year: 1915.6, date: '1915', collection: 'Museum of Modern Art, New York',
        desc: 'Floating coloured bars and rectangles evoke flight. Suprematism aimed to express "the supremacy of pure feeling" through weightless forms in infinite white space.',
        search: { q: 'Malevich Suprematist Composition Airplane Flying', all: ['malevi|malewi', 'airplane|aeroplane'] }
      },
      {
        title: 'Supremus No. 55', year: 1916, date: '1916',
        desc: 'In the "Supremus" series, overlapping coloured forms seem to drift and rotate, as if seen from far above the earth.',
        files: ['Supremus 55 (Malevich, 1916).jpg'],
        search: { q: 'Malevich Supremus 55', all: ['malevi|malewi', 'supremus 55'] }
      },
      {
        title: 'Suprematist Composition: White on White', year: 1918, date: '1918', collection: 'Museum of Modern Art, New York',
        desc: 'A white square tilted on a slightly warmer white ground. The end point of Suprematism: colour has vanished, leaving only the faintest difference — and infinity.',
        article: 'Suprematist Composition: White on White',
        search: { q: 'Malevich White on White 1918', all: ['malevi|malewi', 'white on white'] }
      }
    ]
  }
];

// The lobby is a special room with no paintings: the start of the visit.
export const LOBBY = {
  id: 'lobby',
  name: 'Entrance Hall',
  short: 'Entrance',
  movement: null,
  room: { wall: '#ece5d8', floor: 'marble', frame: 'gilt', light: '#fff4e0', props: ['rotunda'] }
};

// "Followed by": doors on the far wall of `from`, and on the entrance wall of `to`.
// The text explains how the later artist grew out of the earlier one.
export const INFLUENCES = [
  { from: 'lobby', to: 'manet', text: 'The visit starts in the 1860s, with the painter who brought modern Paris into the Salon and gave the young Impressionists their example.' },

  { from: 'manet', to: 'monet', text: 'Manet\'s Déjeuner sur l\'herbe of 1863 inspired the young Monet to paint his own huge picnic picture in 1865–66. By 1874 the influence ran both ways: Manet painted beside Monet at Argenteuil and lightened his palette.' },
  { from: 'manet', to: 'renoir', text: 'Renoir belonged to the "Batignolles group" that met around Manet at the Café Guerbois. Manet\'s modern subjects and fresh, direct paint showed them a way out of academic convention.' },
  { from: 'manet', to: 'degas', text: 'Degas and Manet met in the Louvre around 1862, both studying Velázquez. Both used the Old Masters to paint modern Paris — cafés, racecourses, the Opera — and remained friends and rivals.' },
  { from: 'manet', to: 'morisot', text: 'Morisot met Manet in the Louvre in 1868, posed for The Balcony and married his brother Eugène in 1874. Their exchange went both ways: she encouraged Manet to paint outdoors.' },

  { from: 'manet', to: 'pissarro', text: 'Pissarro, two years older than Manet, also showed at the Salon des Refusés of 1863 and joined the circle that gathered around Manet at the Café Guerbois — the group that would become the Impressionists.' },
  { from: 'monet', to: 'signac', text: 'Signac decided to become a painter after seeing an exhibition of Monet\'s work in Paris in 1880. His early landscapes were fully Impressionist — until he met Seurat in 1884.' },

  { from: 'monet', to: 'kandinsky', text: 'In Moscow in 1896, Kandinsky saw one of Monet\'s Haystacks. At first he could not tell what it showed — yet it moved him deeply. He later wrote that this was when he first sensed that a painting might not need an object at all.' },

  { from: 'pissarro', to: 'cezanne', text: 'Pissarro was Cézanne\'s mentor. Side by side at Pontoise and Auvers in 1872–74, he persuaded Cézanne to lighten his dark, heavy palette and to paint patiently from nature.' },
  { from: 'pissarro', to: 'gauguin', text: 'Gauguin, still a stockbroker and Sunday painter, learned Impressionism from Pissarro, painting with him at Pontoise around 1879–81. Pissarro also introduced him to Cézanne.' },
  { from: 'pissarro', to: 'seurat', text: 'Pissarro saw in Seurat\'s system a way to give discipline to Impressionist colour. He adopted the dot himself in 1886 and insisted that Seurat and Signac be included in the last Impressionist exhibition.' },
  { from: 'pissarro', to: 'vangogh', text: 'Arriving in Paris in 1886, Van Gogh met Pissarro, who explained the Impressionist palette to him. Vincent\'s dark Dutch earth tones gave way to colour within months.' },

  { from: 'degas', to: 'gauguin', text: 'Degas was among the first to buy Gauguin\'s work and defended him when others mocked him. Gauguin admired Degas\'s drawing and his bold, cropped compositions.' },
  { from: 'renoir', to: 'matisse', text: 'Renoir\'s late, sensuous colour and decorative nudes were admired by Matisse, who visited the elderly painter at his home in Cagnes in 1917–18.' },

  { from: 'cezanne', to: 'matisse', text: 'In 1899 Matisse bought a small painting of bathers by Cézanne with money he could not spare. He kept it for 37 years, calling it his source of faith and perseverance.' },
  { from: 'cezanne', to: 'gris', text: 'Cézanne built pictures from planes of colour and shifting viewpoints. After his 1907 memorial retrospective, Picasso and Braque turned these ideas into Cubism, and Juan Gris gave Cubism its most rigorous, architectural form.' },
  { from: 'cezanne', to: 'delaunay', text: 'Delaunay went through a "Cézannian" period in 1906–09 before breaking up the city of Paris into faceted, light-filled planes.' },
  { from: 'cezanne', to: 'malevich', text: 'Malevich\'s path to the pure square began with Cézanne: around 1909–10 he painted in a "Cézannist" manner, then moved through Cubism and Cubo-Futurism.' },

  { from: 'seurat', to: 'delaunay', text: 'Seurat\'s optical colour — Chevreul\'s law of simultaneous contrast — became the basis of Delaunay\'s "simultaneism": colours placed side by side to create light and movement.' },
  { from: 'signac', to: 'matisse', text: 'In the summer of 1904 Matisse painted with Signac in Saint-Tropez. The result, Luxe, Calme et Volupté (bought by Signac), applies the dot with unnatural colour — one step from Fauvism.' },
  { from: 'signac', to: 'mondrian', text: 'Around 1908–09 Mondrian painted dunes, lighthouses and windmills with the dotted, pure colour of the Neo-Impressionists — his "Luminist" phase, a stage on the way to abstraction.' },

  { from: 'vangogh', to: 'munch', text: 'Munch saw Van Gogh\'s work during his years in Paris around 1889–91. Like Van Gogh, he used colour and swirling line to carry emotion: the root of Expressionism.' },
  { from: 'vangogh', to: 'derain', text: 'At the 1901 Van Gogh retrospective at the Bernheim-Jeune gallery in Paris, Derain introduced his friend Vlaminck to Matisse. Van Gogh\'s pure, intense colour became a model for the Fauves.' },
  { from: 'vangogh', to: 'marc', text: 'German Expressionists revered Van Gogh. Franz Marc was deeply moved by his paintings in Paris in 1907 and found in them a way to make colour carry feeling.' },

  { from: 'gauguin', to: 'munch', text: 'Gauguin\'s Synthetism — flat areas of colour, bold contours, symbolic rather than descriptive — fed directly into Munch\'s Symbolist images.' },
  { from: 'gauguin', to: 'matisse', text: 'Gauguin\'s flat fields of colour and his simplification of forms, seen in the 1906 Paris retrospective, were essential to the Fauves. Matisse later travelled to Tahiti himself, in 1930.' },

  { from: 'munch', to: 'marc', text: 'Munch\'s Berlin scandal of 1892 made him a key reference for German painters. The Expressionist movements that followed — Die Brücke in Dresden, Der Blaue Reiter in Munich — built on his use of colour and line for emotion.' },

  { from: 'matisse', to: 'kandinsky', text: 'Kandinsky lived near Paris in 1906–07 and saw the Fauves. His Murnau landscapes of 1908–09 explode into Fauvist colour, before dissolving into abstraction.' },
  { from: 'derain', to: 'gris', text: 'From 1907 Derain, close to Picasso, turned from Fauve colour to Cézanne-like structure — the same turn that produced Cubism, which Juan Gris would systematise.' },

  { from: 'gris', to: 'mondrian', text: 'Mondrian moved to Paris in 1912 and absorbed Cubism, mainly through the work of Picasso and Braque — the circle in which Gris worked. He broke his trees into grids of lines that led straight to abstraction.' },
  { from: 'gris', to: 'malevich', text: 'Malevich learned Cubism from the Paris pictures in Moscow collections and fused it with Futurist movement — Cubo-Futurism, his last step before Suprematism.' }
];

// Same generation / same movement: side doors in the middle of the long walls.
export const CONTEMPORARIES = [
  { a: 'monet', b: 'renoir', text: 'In the summer of 1869 Monet and Renoir painted side by side at La Grenouillère on the Seine — the moment the Impressionist technique was born.' },
  { a: 'monet', b: 'pissarro', text: 'Both fled to London during the Franco-Prussian War (1870–71), studied Turner and Constable together, and co-founded the independent exhibition of 1874.' },
  { a: 'renoir', b: 'morisot', text: 'Close friends from the 1880s on: Renoir often visited Morisot, and her soft, feathery handling and his warm colour developed in dialogue.' },
  { a: 'degas', b: 'pissarro', text: 'Around 1879–80 Degas and Pissarro worked together on experimental etchings for a planned print journal, "Le Jour et la Nuit".' },
  { a: 'degas', b: 'morisot', text: 'Both were from the upper middle class, both preferred interiors and figures to landscape, and both stood by the independent exhibitions from the very first one in 1874.' },
  { a: 'seurat', b: 'signac', text: 'Signac met Seurat in 1884 at the Salon des Indépendants they helped to found. He adopted Seurat\'s method and became its chief theorist after Seurat\'s death.' },
  { a: 'vangogh', b: 'gauguin', text: 'Two months together in the Yellow House at Arles in autumn 1888 ended in a violent quarrel — but each pushed the other toward colour freed from description.' },
  { a: 'vangogh', b: 'signac', text: 'In the spring of 1887 Van Gogh painted alongside Signac on the banks of the Seine at Asnières, adopting dotted, broken strokes of pure colour. Signac later visited him in Arles.' },
  { a: 'cezanne', b: 'gauguin', text: 'Gauguin owned several Cézannes and tried to learn his "formula"; Cézanne distrusted the younger man. Both, in different ways, replaced Impressionist sensation with construction.' },
  { a: 'matisse', b: 'derain', text: 'Summer 1905 in Collioure: Matisse and Derain invented Fauvism together. Their pictures at that autumn\'s Salon earned them the name "wild beasts".' },
  { a: 'kandinsky', b: 'marc', text: 'Co-founders of Der Blaue Reiter in Munich in 1911. Their almanac argued that art must express "inner necessity" rather than outward appearance.' },
  { a: 'marc', b: 'delaunay', text: 'Delaunay showed at the first Blaue Reiter exhibition in 1911, and in 1912 Marc visited him in Paris. Delaunay\'s prismatic colour broke Marc\'s animals into crystalline planes.' },
  { a: 'gris', b: 'delaunay', text: 'Both showed Cubist work at the 1912 Salon des Indépendants. The poet Apollinaire coined the term "Orphism" for Delaunay\'s colourful branch of Cubism.' },
  { a: 'kandinsky', b: 'malevich', text: 'After 1914 both worked in Moscow\'s new revolutionary art institutions. Two Russian-born pioneers, arriving at abstraction by very different roads — music and emotion for one, geometry for the other.' },
  { a: 'mondrian', b: 'malevich', text: 'Between 1915 and 1917, independently — Malevich in Russia, Mondrian in neutral Holland — both reduced painting to flat geometric elements: Suprematism and De Stijl.' }
];

export const artistById = Object.fromEntries([LOBBY, ...ARTISTS].map((a) => [a.id, a]));
