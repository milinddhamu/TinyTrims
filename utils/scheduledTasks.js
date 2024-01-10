import mongoose from 'mongoose'
import UserModel from '@/models/UserModel';
const removeExpiredLinks = async () => {
  try {
    const users = await UserModel.find(); // Fetch all users

    for (const user of users) {
      for (const domain of user.domains) {
        domain.links = domain.links.filter((link) => {
          const linkTimestamp = new Date(link.timestamp.$numberDouble);
          const now = new Date();

          // Check if the link's timestamp is within the last 24 hours
          return now - linkTimestamp <= 24 * 60 * 60 * 1000;
        });
      }
    }

    // Save the updated users back to the database
    await Promise.all(users.map((user) => user.save()));

    console.log('Expired links removed successfully.');
  } catch (error) {
    console.error('Error removing expired links:', error);
    throw error;
  }
};

export default removeExpiredLinks;
