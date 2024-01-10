// pages/api/schedule.js

import removeExpiredLinks from '@/utils/scheduledTasks';
import { NextResponse } from "next/server";

export const GET = async(req, res) => {
  try {
    await removeExpiredLinks();
    return NextResponse.json({ message: "hello there!" }, { status: 200 });
  } catch (error) {
    console.error('Error in scheduled task:', error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
