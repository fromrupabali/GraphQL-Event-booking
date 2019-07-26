const authResolver = require('./user/auth');
const eventsResolver = require('./events/events');
const bookingResolver = require('./booking/booking');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver
}

module.exports = rootResolver;