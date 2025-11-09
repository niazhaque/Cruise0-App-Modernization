// backend/lambda.ts
import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { verifyJwt } from './jwt';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const authHeader = event.headers?.authorization || event.headers?.Authorization || '';
    const payload = await verifyJwt(authHeader);

    // CORS + success
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type'
      },
      body: JSON.stringify({
        ok: true,
        message: 'Protected data OK',
        user: {
          sub: payload.sub,
          email: (payload as any).email,
          email_verified: (payload as any).email_verified,
          country: (payload as any)['https://cruise0.example/country'] || (payload as any)['https://cruise0/country']
        }
      })
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unauthorized';
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Authorization,Content-Type'
      },
      body: JSON.stringify({ ok: false, error: msg })
    };
  }
};
