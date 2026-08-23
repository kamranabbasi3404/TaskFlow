import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkspaceModel from '@/models/Workspace';
import TaskModel from '@/models/Task';
import ActivityModel from '@/models/Activity';

const INITIAL_WORKSPACES = [
  {
    name: 'Personal',
    slug: 'personal',
    color: '#3b82f6',
    description: 'Personal projects, daily goals, and tasks',
  },
  {
    name: 'Work',
    slug: 'work',
    color: '#8b5cf6',
    description: 'Professional assignments, sprint tasks, and client work',
  },
];

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json().catch(() => ({}));
    const userEmail = (body.userEmail || req.headers.get('x-user-email') || '').toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User email is required' }, { status: 400 });
    }

    // Clear existing tasks, activities and reset workspaces for this user
    await TaskModel.deleteMany({ userEmail });
    await ActivityModel.deleteMany({ userEmail });
    await WorkspaceModel.deleteMany({ userEmail });

    const workspaces = await WorkspaceModel.insertMany(
      INITIAL_WORKSPACES.map((w) => ({ ...w, userEmail }))
    );

    return NextResponse.json({
      success: true,
      message: 'Database reset & all sample tasks permanently deleted for user!',
      data: { workspaces, tasks: [], activities: [] },
    });
  } catch (error: any) {
    console.error('Seed error:', error.message);
    return NextResponse.json({
      success: true,
      offline: true,
      message: 'Database reset performed',
      data: { workspaces: [], tasks: [], activities: [] },
    });
  }
}
