import { Request } from 'express';

export interface DeviceInfo {
  deviceType: string;
  browser?: string;
  os?: string;
}

export function extractDeviceInfo(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  //Detection type d'appareil
  let deviceType = 'desktop';
  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone')
  ) {
    deviceType = 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'tablet';
  }

  // Detection du navigateur
  let browser: string | undefined;
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('opera')) browser = 'Opera';

  //Detection de l'OS
  let os: string | undefined;
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'Mac';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';

  return {
    deviceType,
    browser,
    os,
  };
}

export function getClientIP(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    (req.headers['x-real-ip'] as string) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    '127.0.0.1'
  );
}
