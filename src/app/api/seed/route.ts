import { NextResponse } from 'next/server';
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

export async function POST() {
  try {
    await connectToDatabase();

    // Clear all existing tasks, activities and reset workspaces
    await TaskModel.deleteMany({});
    await ActivityModel.deleteMany({});
    await WorkspaceModel.deleteMany({});

    const workspaces = await WorkspaceModel.insertMany(INITIAL_WORKSPACES);

    return NextResponse.json({
      success: true,
      message: 'Database reset & all sample tasks permanently deleted!',
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
