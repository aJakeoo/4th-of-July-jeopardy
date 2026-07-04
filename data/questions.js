// 4th of July Jeopardy — question bank
// 6 categories, 5 clues each at $100/$200/$300/$400/$500.

export const CATEGORIES = [
  {
    name: 'General\nAmerican History',
    clues: [
      {
        value: 100,
        question: 'This 1803 land deal with France roughly doubled the size of the U.S.',
        answer: 'What is the Louisiana Purchase?',
      },
      {
        value: 200,
        question: 'This war, fought 1861–65, ended slavery and preserved the Union.',
        answer: 'What is the Civil War?',
      },
      {
        value: 300,
        question: 'This 1869 achievement in Utah connected the country coast to coast by rail.',
        answer: 'What is the transcontinental railroad?',
      },
      {
        value: 400,
        question: 'This 1920 amendment guaranteed women the right to vote.',
        answer: 'What is the 19th Amendment?',
      },
      {
        value: 500,
        question: "This economic collapse, starting in 1929, led to FDR's New Deal.",
        answer: 'What is the Great Depression?',
      },
    ],
  },
  {
    name: 'Americana',
    clues: [
      {
        value: 100,
        question: 'Named the national symbol in 1782, this bird still graces the Great Seal.',
        answer: 'What is the bald eagle?',
      },
      {
        value: 200,
        question: 'This legendary highway once connected Chicago all the way to Los Angeles.',
        answer: 'What is Route 66?',
      },
      {
        value: 300,
        question: 'This phrase pairs a dessert with a sport to describe anything quintessentially American.',
        answer: 'What is "as American as apple pie"?',
      },
      {
        value: 400,
        question: 'This diner staple pairs a beef patty with melted cheese between a bun.',
        answer: 'What is a cheeseburger?',
      },
      {
        value: 500,
        question: 'This community sewing gathering is a classic piece of American folk tradition.',
        answer: 'What is a quilting bee?',
      },
    ],
  },
  {
    name: 'Revolutionary\nWar',
    clues: [
      {
        value: 100,
        question: 'This "shot heard round the world" kicked off the war in 1775 in this Massachusetts town.',
        answer: 'What is Lexington (or Concord)?',
      },
      {
        value: 200,
        question: "This brutal winter encampment tested Washington's army in Pennsylvania, 1777–78.",
        answer: 'What is Valley Forge?',
      },
      {
        value: 300,
        question: "This French aristocrat became one of Washington's most trusted generals.",
        answer: 'Who is the Marquis de Lafayette?',
      },
      {
        value: 400,
        question: 'This 1781 battle, backed by French naval support, effectively ended the war.',
        answer: 'What is the Battle/Siege of Yorktown?',
      },
      {
        value: 500,
        question: 'This 1783 treaty formally ended the war and recognized American independence.',
        answer: 'What is the Treaty of Paris?',
      },
    ],
  },
  {
    name: 'Michigan',
    clues: [
      {
        value: 100,
        question: 'Detroit earned this nickname over a century of car manufacturing dominance.',
        answer: 'What is "Motor City"?',
      },
      {
        value: 200,
        question: 'This is the only Great Lake located entirely within U.S. borders.',
        answer: 'What is Lake Michigan?',
      },
      {
        value: 300,
        question: 'Founded in 1817, this Ann Arbor school is one of the oldest public universities in the country.',
        answer: 'What is the University of Michigan?',
      },
      {
        value: 400,
        question: 'Nicknamed "The Cereal City," this Michigan town is home to Kellogg\'s headquarters.',
        answer: 'What is Battle Creek?',
      },
      {
        value: 500,
        question: 'Pioneered by Henry Ford in Highland Park in 1913, this innovation transformed manufacturing worldwide.',
        answer: 'What is the moving assembly line?',
      },
    ],
  },
  {
    name: 'Red, White\n& Boom',
    clues: [
      {
        value: 100,
        question: 'This chemical element, when burned, produces the classic red color in fireworks.',
        answer: 'What is strontium?',
      },
      {
        value: 200,
        question: 'This backyard tradition involves grilling burgers, dogs, and corn on the cob.',
        answer: 'What is a cookout/barbecue?',
      },
      {
        value: 300,
        question: "This city's fireworks show lights up the East River every July 4th.",
        answer: 'What is New York City?',
      },
      {
        value: 400,
        question: 'Produced by burning copper compounds, this is the hardest firework color to pull off.',
        answer: 'What is blue?',
      },
      {
        value: 500,
        question: "Held every July 4th at Coney Island, this Nathan's Famous event tests competitive eating.",
        answer: 'What is the Hot Dog Eating Contest?',
      },
    ],
  },
  {
    name: 'Presidents\n& the 4th',
    clues: [
      {
        value: 100,
        question: 'This founding father and second president died on July 4, 1826.',
        answer: 'Who is John Adams?',
      },
      {
        value: 200,
        question: 'Author of the Declaration, this third president died hours before Adams, same day, same year.',
        answer: 'Who is Thomas Jefferson?',
      },
      {
        value: 300,
        question: 'This fifth president died on July 4, 1831 — the third president to die on Independence Day.',
        answer: 'Who is James Monroe?',
      },
      {
        value: 400,
        question: 'The only president born on the 4th of July, this 30th president arrived in 1872.',
        answer: 'Who is Calvin Coolidge?',
      },
      {
        value: 500,
        question: 'Jefferson and Adams both died on July 4, 1826 — exactly this many years after the Declaration was adopted.',
        answer: 'What is 50?',
      },
    ],
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CATEGORIES;
}
