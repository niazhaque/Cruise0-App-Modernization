process.env.AUTH0_ISSUER ||= 'https://dev-oo2oo6jk421zx72b.us.auth0.com/';
process.env.AUTH0_AUDIENCE ||= 'https://api.cruise0';

import express, { Request, Response } from 'express';
import cors from 'cors';
import { verifyJwt } from './jwt';

const app = express();
app.use(cors());

app.get('/protected', async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = await verifyJwt(req.header('authorization') || '');
    res.json({
      ok: true,
      ts: new Date().toISOString(),
      email: payload.email,
      email_verified: payload.email_verified
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(401).json({ ok: false, error: message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Local API running → http://localhost:${PORT}/protected`)
);
