import { getAppDataPath } from "../helpers/fs";
import { logger } from '../logger';
import fs from 'fs';
import path from 'path';
import webpush, { type VapidKeys } from 'web-push';

const VAPID_PATH = path.join(getAppDataPath(), 'vapid.json');

function loadOrCreateVapidKeys(): VapidKeys {
    try {
        return loadVapidKeys();
    } catch (error) {
        logger.warn('VAPID keys not found, generating new ones.', error);
        return generateVapidKeys();
    }
}

function loadVapidKeys(): VapidKeys {
    if (fs.existsSync(VAPID_PATH)) {
        const vapidKeysJson = JSON.parse(fs.readFileSync(VAPID_PATH, 'utf-8'));
        const vapidKeys: VapidKeys = {
            publicKey: vapidKeysJson.publicKey,
            privateKey: vapidKeysJson.privateKey
        };
        logger.info('Loaded VAPID keys:', vapidKeysJson);
        return vapidKeys;
    } else {
        throw new Error('VAPID keys not found. Please generate them first.');
    }
}

function generateVapidKeys(): VapidKeys {
    const vapidKeys = webpush.generateVAPIDKeys();
    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
        throw new Error('Failed to generate VAPID keys');
    }
    const vapidKeysString = JSON.stringify(vapidKeys);
    logger.info('Generated new VAPID keys:', JSON.stringify(vapidKeys));
    writeVapidKeys(vapidKeysString);
    return vapidKeys;
}

function writeVapidKeys(vapidKeys: string): void {
    fs.writeFileSync(VAPID_PATH, vapidKeys);
    logger.info('Saved VAPID keys:', vapidKeys);
}

export { loadOrCreateVapidKeys }