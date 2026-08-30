import dns from "dns"
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import mongoose from 'mongoose';
import 'dotenv/config';

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const reportCount = await mongoose.connection.collection('weatherreports').countDocuments();
  const eventCount = await mongoose.connection.collection('weatherevents').countDocuments();
  
  console.log(`Reports in DB: ${reportCount}`);
  console.log(`Events in DB: ${eventCount}`);
  
  if (reportCount > 0) {
    const lastReport = await mongoose.connection.collection('weatherreports').find().sort({ _id: -1 }).limit(1).toArray();
    console.log('Last report:', JSON.stringify(lastReport[0], null, 2));
  }
  
  process.exit(0);
}

check();
