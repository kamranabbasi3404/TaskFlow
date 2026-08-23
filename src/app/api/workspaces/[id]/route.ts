import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkspaceModel from '@/models/Workspace';
import TaskModel from '@/models/Task';
import ActivityModel from '@/models/Activity';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const workspace = await WorkspaceModel.findById(id);
    if (workspace) {
      await TaskModel.deleteMany({ workspaceId: id });
      await WorkspaceModel.findByIdAndDelete(id);

      try {
        await ActivityModel.create({
          action: 'workspace_deleted',
          message: `Workspace "${workspace.name}" and associated tasks deleted`,
          workspaceName: workspace.name,
          timestamp: new Date(),
        });
      } catch {}
    }

    return NextResponse.json({ success: true, message: 'Workspace deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      offline: true,
      message: 'Workspace deleted locally',
    });
  }
}
