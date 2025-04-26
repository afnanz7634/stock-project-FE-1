import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { StockService } from '../stock/stock.service';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, DocumentData, CollectionReference, Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

interface Alert {
  userId: string;
  symbol: string;
  threshold: number;
  type: 'above' | 'below';
  email: string;
  active: boolean;
  createdAt: string;
  triggered: boolean;
}

@Injectable()
export class AlertsService {
  private firestore: Firestore;
  private alertsCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly mailerService: MailerService,
    private readonly stockService: StockService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry
  ) {
    const firebaseConfig = {
      apiKey: this.configService.get<string>('FIREBASE_API_KEY'),
      authDomain: this.configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: this.configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: this.configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
      appId: this.configService.get<string>('FIREBASE_APP_ID'),
    };
    const app = initializeApp(firebaseConfig);
    this.firestore = getFirestore(app);
    this.alertsCollection = collection(this.firestore, 'alerts');
    this.setupAlertChecker();
  }

  private setupAlertChecker() {
    // Check alerts every 1 minute
    const job = new CronJob('* * * * *', () => {
      this.checkAlerts();
    });
  
    this.schedulerRegistry.addCronJob('alertChecker', job);
    job.start();
  }

  async addAlert(userId: string, alert: {
    symbol: string;
    threshold: number;
    type: 'above' | 'below';
    email: string;
  }) {
    debugger
    try {
      const docRef = await addDoc(this.alertsCollection, {
        ...alert,
        userId,
        active: true,
        createdAt: new Date().toISOString(),
        triggered: false
      });
      return { id: docRef.id, ...alert };
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  async removeAlert(userId: string, symbol: string) {
    try {
      debugger
      const q = query(
        this.alertsCollection,
        where('userId', '==', userId),
        where('symbol', '==', symbol)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  async getUserAlerts(userId: string) {
    try {
      debugger
      const q = query(this.alertsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Alert)
      }));
    } catch (error) {
      console.error('Error getting alerts:', error);
      throw error;
    }
  }

  async checkAlerts() {
    try {
      const querySnapshot = await getDocs(this.alertsCollection);
      for (const doc of querySnapshot.docs) {
        const alert = doc.data() as Alert;
        if (!alert.active) continue;

        const quote = await this.stockService.getStockQuote(alert.symbol);
        const currentPrice = quote.c;

        if (
          (alert.type === 'above' && currentPrice >= alert.threshold) ||
          (alert.type === 'below' && currentPrice <= alert.threshold)
        ) {
          await this.sendAlertEmail(alert, currentPrice);
          await updateDoc(doc.ref, { triggered: true });
        }
      }
    } catch (error) {
      console.error('Error checking alerts:', error);
      throw error;
    }
  }

  private async sendAlertEmail(alert: Alert, currentPrice: number) {
    await this.mailerService.sendMail({
      to: alert.email,
      subject: `Stock Alert: ${alert.symbol}`,
      text: `The price of ${alert.symbol} has ${alert.type === 'above' ? 'risen above' : 'fallen below'} your threshold of ${alert.threshold}. Current price: ${currentPrice}`,
    });
  }
}