import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import TaskModel from '@/models/Task';
import ActivityModel from '@/models/Activity';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await req.json();

    const existingTask = await TaskModel.findById(id);
    if (!existingTask) {
      return NextResponse.json({ success: true, offline: true, data: { _id: id, ...body } });
    }

    const oldStatus = existingTask.status;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      id,
      {
        ...(body.title && { title: body.title.trim() }),
        ...(body.description !== undefined && { description: body.description.trim() }),
        ...(body.priority && { priority: body.priority }),
        ...(body.status && { status: body.status }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
        ...(body.workspaceId && { workspaceId: body.workspaceId }),
      },
      { new: true }
    );

    // Log Activity
    try {
      if (body.status && body.status !== oldStatus) {
        await ActivityModel.create({
          action: 'task_status_changed',
          message: `Task "${updatedTask?.title}" marked as ${body.status}`,
          taskTitle: updatedTask?.title,
          timestamp: new Date(),
        });
      } else {
        await ActivityModel.create({
          action: 'task_updated',
          message: `Task "${updatedTask?.title}" updated`,
          taskTitle: updatedTask?.title,
          timestamp: new Date(),
        });
      }
    } catch {}

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error: any) {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      offline: true,
      data: { _id: params.id, ...body },
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const task = await TaskModel.findById(id);
    if (task) {
      await TaskModel.findByIdAndDelete(id);
      try {
        await ActivityModel.create({
          action: 'task_deleted',
          message: `Task "${task.title}" deleted`,
          taskTitle: task.title,
          timestamp: new Date(),
        });
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      offline: true,
      message: 'Task deleted locally',
    });
  }
}
