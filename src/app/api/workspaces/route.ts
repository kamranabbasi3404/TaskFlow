import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkspaceModel from '@/models/Workspace';
import ActivityModel from '@/models/Activity';
import { validateWorkspaceForm } from '@/lib/validation';
import { DEFAULT_WORKSPACES } from '@/lib/storage';

export async function GET() {
  try {
    await connectToDatabase();
    let workspaces = await WorkspaceModel.find({}).sort({ createdAt: 1 });

    // Auto-seed if database is empty
    if (workspaces.length === 0) {
      workspaces = await WorkspaceModel.insertMany(
        DEFAULT_WORKSPACES.map((w) => ({
          name: w.name,
          slug: w.slug,
          color: w.color,
          description: w.description,
        }))
      );
    }

    return NextResponse.json({ success: true, data: workspaces });
  } catch (error: any) {
    // Return 200 OK with default workspaces on offline mode to prevent console errors & slow loads
    return NextResponse.json({
      success: true,
      data: DEFAULT_WORKSPACES,
      offline: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, color, description } = body;

    const validation = validateWorkspaceForm(name);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const existing = await WorkspaceModel.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A workspace with a similar name already exists.' },
        { status: 400 }
      );
    }

    const workspace = await WorkspaceModel.create({
      name: name.trim(),
      slug,
      color: color || '#6366f1',
      description: description || '',
    });

    // Automatically log activity
    await ActivityModel.create({
      action: 'workspace_created',
      message: `Workspace "${workspace.name}" created`,
      workspaceName: workspace.name,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: workspace }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error', offline: true },
      { status: 200 }
    );
  }
}
