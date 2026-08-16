import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'riyadalquran-secret-key-2026-digitalocean'
);

export interface AdminSession {
  userId: string;
  username: string;
  role: string;
  type: 'admin';
}

export interface ParentSession {
  studentId: string;
  studentName: string;
  sequence: string;
  type: 'parent';
}

export type SessionPayload = AdminSession | ParentSession;

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('riyad_session')?.value;
  if (!token) return null;

  return await verifySessionToken(token);
}

export async function getCurrentAdmin() {
  const session = await getCurrentSession();
  if (!session || session.type !== 'admin') return null;

  const admin = await db.adminUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      role: true,
      imageUrl: true,
    },
  });

  return admin;
}

export async function getCurrentStudent() {
  const session = await getCurrentSession();
  if (!session || session.type !== 'parent') return null;

  const student = await db.student.findUnique({
    where: { id: session.studentId },
    include: {
      teacher: true,
      grades: true,
    },
  });

  return student;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('riyad_session');
}
