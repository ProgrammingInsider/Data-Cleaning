import Redis from 'ioredis';

const client = new Redis({
  url: `rediss://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  tls: {
      rejectUnauthorized: false 
  }
});

// Example usage:
// client.set('foo2', 'bar2');
// client.get('foo2', (err, result) => {
//     console.log(result); 
// });

export default client;