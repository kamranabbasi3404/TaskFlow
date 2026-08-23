import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TaskModel from '@/models/Task';
import WorkspaceModel from '@/models/Workspace';
import ActivityModel from '@/models/Activity';
import { validateTaskForm } from '@/lib/validation';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const userEmail = (searchParams.get('userEmail') || req.headers.get('x-user-email') || '').toLowerCase().trim();
    if (!userEmail) {
      return NextResponse.json({ success: true, data: [] });
    }

    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'dueDateAsc';

    const query: any = { userEmail };

    if (workspaceId && workspaceId !== 'all') {
      query.workspaceId = workspaceId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { dueDate: 1 };
    if (sortBy === 'dueDateDesc') sortOption = { dueDate: -1 };
    if (sortBy === 'createdAt') sortOption = { createdAt: -1 };

    const tasks = await TaskModel.find(query).sort(sortOption);

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    console.error('GET /api/tasks Error:', error.message);
    return NextResponse.json({
      success: true,
      data: [],
      offline: true,
      error: error.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const userEmail = (body.userEmail || req.headers.get('x-user-email') || '').toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User email is required' }, { status: 400 });
    }

    const validation = validateTaskForm(body);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 });
    }

    const task = await TaskModel.create({
      userEmail,
      workspaceId: body.workspaceId,
      title: body.title.trim(),
      description: body.description ? body.description.trim() : '',
      priority: body.priority || 'Medium',
      status: body.status || 'To Do',
      dueDate: new Date(body.dueDate),
    });

    console.log(' Task saved successfully to MongoDB Atlas:', task.title, 'ID:', task._id);

    let workspaceName = '';
    try {
      const ws = await WorkspaceModel.findById(body.workspaceId);
      if (ws) workspaceName = ws.name;
    } catch {}

    // Automatically log activity
    await ActivityModel.create({
      userEmail,
      action: 'task_created',
      message: `Task "${task.title}" created${workspaceName ? ` in ${workspaceName}` : ''}`,
      taskTitle: task.title,
      workspaceName,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error(' POST /api/tasks Save Failed Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error', dbError: true },
      { status: 500 }
    );
  }
}
