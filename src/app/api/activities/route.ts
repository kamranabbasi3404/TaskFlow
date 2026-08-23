import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import ActivityModel from '@/models/Activity';
import { DEFAULT_ACTIVITIES } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    let activities = await ActivityModel.find({})
      .sort({ timestamp: -1 })
      .limit(limit);

    if (activities.length === 0) {
      activities = await ActivityModel.insertMany(
        DEFAULT_ACTIVITIES.map((a) => ({
          action: a.action,
          message: a.message,
          taskTitle: a.taskTitle,
          workspaceName: a.workspaceName,
          timestamp: new Date(a.timestamp),
        }))
      );
    }

    return NextResponse.json({ success: true, data: activities });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_ACTIVITIES.slice(0, 5),
      offline: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { action, message, taskTitle, workspaceName } = body;

    if (!action || !message) {
      return NextResponse.json(
        { success: false, error: 'Action and message are required' },
        { status: 400 }
      );
    }

    const activity = await ActivityModel.create({
      action,
      message,
      taskTitle: taskTitle || '',
      workspaceName: workspaceName || '',
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: activity }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error', offline: true },
      { status: 200 }
    );
  }
}
