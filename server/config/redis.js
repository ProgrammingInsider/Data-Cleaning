// import Redis from 'ioredis';

// const client = new Redis({
//   url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//   tls: {
//       rejectUnauthorized: false 
//   }
// });

// export default client;


import Redis from 'ioredis';

const client = new Redis({
  host: process.env.REDIS_HOST,  
  port: process.env.REDIS_PORT,
  tls: {
    rejectUnauthorized: false, 
  },
});

export default client;
