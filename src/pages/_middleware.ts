import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(req: NextRequest) {
  if (req.cookies['pool-token']) return;

  const random = nanoid();

  const res = NextResponse.redirect(req.nextUrl);


  res.cookie('pool-token', random, { sameSite: 'strict' });

  return res;
}
