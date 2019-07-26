const Booking = require('../../../models/booking');
const Event = require('../../../models/events');
const {transformBooking, transformEvent } = require('../merge/merge');
   
   module.exports = {
       bookings: async (args, req) => {
           if(!req.isAuth){
             throw new Error('Unauthorized');
           }
           try{
             const bookings = await Booking.find();
             return bookings.map(booking => {
                 return transformBooking(booking);
                  
             })
           }catch(err){
               throw err;
           }
       },
       
       
       bookEvent: async (args, req) => {
          if(!req.isAuth){
            throw new Error('Unauthorized');
         }
           try{
               const fetechedEvent = await Event.findOne({_id: args.eventId});
               const booking = new Booking({
                   user:req.userId,
                   event: fetechedEvent
               });
   
               const result = await booking.save();
               return transformBooking(result);
           }catch(err){
               throw err;
           }
       },
       cancelBooking: async (args, req) => {
          if(!req.isAuth){
             throw new Error('Unauthorized');
           }
         try{
           const booking = await Booking.findById(args.bookingId).populate('event');
           const event = transformEvent(booking.event);
           await Booking.deleteOne({_id: args.bookingId});
           return event;
   
         }catch(err){
           throw err;
         }
       }
   };