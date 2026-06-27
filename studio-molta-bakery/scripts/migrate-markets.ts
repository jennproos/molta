import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-27'})

const MONTH_TO_NUM: Record<string, string> = {
  JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
  JUL: '07', AUG: '08', SEPT: '09', OCT: '10', NOV: '11', DEC: '12',
}

const markets = [
  {month: 'JUL', day: 11, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'JUL', day: 18, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'JUL', day: 25, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'AUG', day: 1,  name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'AUG', day: 8,  name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'AUG', day: 15, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'AUG', day: 22, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'AUG', day: 29, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'SEPT', day: 12, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'SEPT', day: 19, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
  {month: 'SEPT', day: 26, name: 'Creston Farmers Market', location: 'Grand Rapids, MI', time: '9am – 1pm'},
]

const docs = markets.map((m) => ({
  _type: 'marketEvent',
  name: m.name,
  date: `2026-${MONTH_TO_NUM[m.month]}-${String(m.day).padStart(2, '0')}`,
  location: m.location,
  time: m.time,
}))

const tx = client.transaction()
docs.forEach((doc) => tx.create(doc))

tx.commit()
  .then((res) => console.log(`✓ Created ${res.results.length} market events`))
  .catch((err) => console.error('✗ Migration failed:', err.message))
