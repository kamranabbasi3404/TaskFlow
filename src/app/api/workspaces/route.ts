import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import WorkspaceModel from '@/models/Workspace';
import ActivityModel from '@/models/Activity';
import { validateWorkspaceForm } from '@/lib/validation';
import { DEFAULT_WORKSPACES } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userEmail = (searchParams.get('userEmail') || req.headers.get('x-user-email') || '').toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json({ success: true, data: [] });
    }

    let workspaces = await WorkspaceModel.find({ userEmail }).sort({ createdAt: 1 });

    // Auto-seed if database is empty for this specific user
    if (workspaces.length === 0) {
      workspaces = await WorkspaceModel.insertMany(
        DEFAULT_WORKSPACES.map((w) => ({
          userEmail,
          name: w.name,
          slug: w.slug,
          color: w.color,
          description: w.description,
        }))
      );
    } else {
      // Ensure all default workspaces (Personal and Work) exist for this user
      for (const defaultWs of DEFAULT_WORKSPACES) {
        const exists = workspaces.some(
          (w) => w.slug === defaultWs.slug || w.name.toLowerCase() === defaultWs.name.toLowerCase()
        );
        if (!exists) {
          let wsItem: any = await WorkspaceModel.findOne({ slug: defaultWs.slug, userEmail: '' }).catch(() => null);
          if (wsItem) {
            wsItem.userEmail = userEmail;
            await wsItem.save().catch(() => {});
          } else {
            wsItem = await WorkspaceModel.create({
              userEmail,
              name: defaultWs.name,
              slug: `${defaultWs.slug}-${Date.now().toString(36)}`,
              color: defaultWs.color,
              description: defaultWs.description,
            }).catch(() => null);
          }

          if (!wsItem) {
            wsItem = {
              _id: `ws-${defaultWs.slug}`,
              userEmail,
              name: defaultWs.name,
              slug: defaultWs.slug,
              color: defaultWs.color,
              description: defaultWs.description,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }

          if (defaultWs.slug === 'personal') {
            workspaces.unshift(wsItem);
          } else {
            workspaces.push(wsItem);
          }
        }
      }
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
    const userEmail = (body.userEmail || req.headers.get('x-user-email') || '').toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json({ success: false, error: 'User email is required' }, { status: 400 });
    }

    const validation = validateWorkspaceForm(name);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const existing = await WorkspaceModel.findOne({ userEmail, slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A workspace with a similar name already exists.' },
        { status: 400 }
      );
    }

    const workspace = await WorkspaceModel.create({
      userEmail,
      name: name.trim(),
      slug,
      color: color || '#6366f1',
      description: description || '',
    });

    // Automatically log activity
    await ActivityModel.create({
      userEmail,
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
