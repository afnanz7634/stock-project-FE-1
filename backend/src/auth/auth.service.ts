import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private firebase: admin.app.App;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
    if (!privateKey) {
      throw new Error('FIREBASE_PRIVATE_KEY is not defined');
    }

    this.firebase = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      }),
    });
  }

  async validateUser(token: string): Promise<any> {
    try {
      const decodedToken = await this.firebase.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      return null;
    }
  }

  async createCustomToken(uid: string): Promise<string> {
    return this.firebase.auth().createCustomToken(uid);
  }

  async generateJWT(user: any): Promise<string> {
    const payload = { 
      email: user.email, 
      uid: user.uid,
      sub: user.uid 
    };
    return this.jwtService.sign(payload);
  }
} 