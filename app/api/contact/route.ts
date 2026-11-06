import type { NextRequest } from 'next/server';
import { handleInquiry } from '@/lib/inquiry-server';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) { return handleInquiry(req, 'contactMessage'); }
