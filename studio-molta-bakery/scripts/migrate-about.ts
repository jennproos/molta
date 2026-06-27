import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-06-27'})

client
  .createOrReplace({
    _id: 'about',
    _type: 'about',
    body: [
      {
        _type: 'block',
        _key: 'para1',
        style: 'normal',
        children: [{_type: 'span', _key: 's1', text: 'my name is Cole and I\'m a baker. I fucking love bread. I started Molta because I want to feed people and make people happy!', marks: []}],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'para2',
        style: 'normal',
        children: [{_type: 'span', _key: 's2', text: 'I\'m very passionate about using organic stone ground flour because it contains beneficial nutrients. combined with long fermentation it is easy on the digestive system and provides incredible flavor.', marks: []}],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'para3',
        style: 'normal',
        children: [{_type: 'span', _key: 's3', text: 'currently planning some more popups and I can\'t wait to serve y\'all!', marks: []}],
        markDefs: [],
      },
      {
        _type: 'block',
        _key: 'para4',
        style: 'normal',
        children: [{_type: 'span', _key: 's4', text: 'NOW GO SPREAD SOME LOVE AND ENJOY LIFE!! LOVE Y\'ALL! 🌾❤️', marks: []}],
        markDefs: [],
      },
    ],
  })
  .then(() => console.log('✓ Created About document'))
  .catch((err: Error) => console.error('✗ Failed:', err.message))
