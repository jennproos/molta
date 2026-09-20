import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-27'})

// NOTE: All prices below are placeholders — update them in the Studio once
// real pricing is set. Testimonials are intentionally left unseeded; add
// real customer quotes under Services → Testimonials in the Studio.

function portableText(paragraphs: string[], keyPrefix: string) {
  return paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `${keyPrefix}${i + 1}`,
    style: 'normal',
    children: [{_type: 'span', _key: `${keyPrefix}${i + 1}s`, text, marks: []}],
    markDefs: [],
  }))
}

const pastryBoxService = {
  _id: 'pastryBoxService',
  _type: 'pastryBoxService',
  description: portableText(
    [
      "Cole makes a variety pastry box that's yours to enjoy — pick it up or have it delivered for a small fee. Choose a one-time box or set up a recurring subscription on the schedule that works for you.",
    ],
    'pbDesc',
  ),
  oneTimePurchaseAvailable: true,
  frequencyOptions: ['Twice a week', 'Once a week', 'Every other week', 'Once a month'],
  sizes: [
    {_key: 'small', name: 'Small', price: 28, description: 'Serves 2–3'},
    {_key: 'medium', name: 'Medium', price: 42, description: 'Serves 4–6'},
    {_key: 'large', name: 'Large', price: 58, description: 'Serves 6–8'},
  ],
  maxPastryTypesPerBox: 4,
  pastryOptions: [
    {_key: 'crumbleBar', name: 'Blueberry Crumble Bar'},
    {_key: 'cinnamonRolls', name: 'Cinnamon Rolls'},
    {_key: 'focaccia', name: 'Focaccia with Labneh'},
    {
      _key: 'morningBuns',
      name: 'Morning Buns',
      flavorOptions: ['Pistachio White Chocolate', 'Double Chocolate', 'Plain', 'Sesame Pistachio'],
    },
    {_key: 'fruitCake', name: 'Fruit Cake'},
    {_key: 'blueberryMuffins', name: 'Blueberry Muffins'},
    {_key: 'speltCookies', name: 'Spelt Flour Chocolate Chip Cookies'},
  ],
  deliveryFee: 6,
  dietaryNote: 'Gluten-free and vegan options available upon request.',
}

const sandwichService = {
  _id: 'sandwichService',
  _type: 'sandwichService',
  description: portableText(
    [
      "Cole makes delicious sandwiches on his special slab bread for group orders — perfect for an office lunch. Pick up or have them delivered for a small fee.",
    ],
    'swDesc',
  ),
  groupOrderNote:
    'Group orders only, for now. Select your date, Cole confirms he can make it work, and your group enjoys fresh sandwiches together.',
  sandwiches: [
    {
      _key: 'riseShineBlt',
      name: 'Rise & Shine BLT',
      classicName: 'BLT',
      ingredients: ['Applewood-smoked bacon', 'Heirloom tomato', 'Butter lettuce', 'Garlic aioli', 'Molta slab bread'],
      price: 13,
    },
    {
      _key: 'grandItalian',
      name: 'The Grand Italian',
      classicName: 'Italian Sandwich',
      ingredients: ['Genoa salami', 'Capicola', 'Provolone', 'Pickled peppers', 'Red onion', 'House Italian dressing', 'Molta slab bread'],
      price: 13,
    },
    {
      _key: 'mortadellaMia',
      name: 'Mortadella Mia',
      classicName: 'Mortadella, Pistachio & Housemade Stracciatella',
      ingredients: ['Mortadella', 'Pistachio', 'Housemade stracciatella', 'Basil', 'Olive oil', 'Molta slab bread'],
      price: 14,
    },
  ],
  modificationNote: 'All sandwiches can be modified upon request.',
  dietaryNote: 'Gluten-free and vegan options available upon request.',
  deliveryFee: 10,
}

const breadSubscriptionService = {
  _id: 'breadSubscriptionService',
  _type: 'breadSubscriptionService',
  description: portableText(
    [
      'Sign up for a bread and/or English muffin subscription. Choose just English muffins, just loaves, or both, then set your frequency. Have it delivered for a small fee, or pick it up at Batches Kitchen.',
    ],
    'brDesc',
  ),
  frequencyOptions: ['Twice a week', 'Once a week', 'Every other week', 'Once a month'],
  products: [
    {_key: 'sourdough', name: 'Sourdough Loaf', category: 'bread', price: 9, description: 'Naturally leavened, organic stone-ground wheat'},
    {_key: 'wholeWheat', name: 'Whole Wheat Loaf', category: 'bread', price: 8, description: 'Hearty and wholesome, baked fresh weekly'},
    {_key: 'countryRye', name: 'Country Rye Loaf', category: 'bread', price: 9, description: 'Rye and wheat blend with a deep, malty crust'},
    {_key: 'englishMuffins', name: 'English Muffins (6-pack)', category: 'englishMuffins', price: 7, description: 'Griddled and fork-split, ready to toast'},
  ],
  deliveryFee: 5,
  pickupLocation: 'Batches Kitchen',
  pickupWindow: 'Saturdays, 9–11am',
}

Promise.all([
  client.createOrReplace(pastryBoxService),
  client.createOrReplace(sandwichService),
  client.createOrReplace(breadSubscriptionService),
])
  .then(() => console.log('✓ Seeded Pastry Box, Lunch Sandwiches, and Bread Subscription services'))
  .catch((err: Error) => console.error('✗ Migration failed:', err.message))
