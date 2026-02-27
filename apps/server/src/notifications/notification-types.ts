interface BaseNotification {
    userName: string;
    userId: string;
    channelName: string;
    channelId: string;
    content: string;
};

export interface MessageNotification extends BaseNotification {
};

export interface RemoteUserJoinedVoiceChannelNotification extends BaseNotification {
};