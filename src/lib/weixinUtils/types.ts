export interface IWeixinUtils {
  wx: any;
  plantSdkUrlIosOrAndorid (): void;
  wxSign (ticket: string): IWxSign;
  routerAuthorized (appId: string): void;
  initWxConfig (config: IWxConfig): void;
  wxShareToFriend (sharInfo: IWxShareToFriend): Promise<string>
  wxShareToFriendCircle (sharInfo: IWxShareToFriendsCircle): Promise<string>
  hideAllNonBaseMenuItem (): Promise<string | object>
  hideMenuItems (arr: string[]): Promise<string | object>
  wxShare (sharInfo: any): Promise<string>
}

export interface IWxSign {
  timestamp: any;
  nonceStr: string;
  signature: string;
}

export interface IWxConfig {
  debug?: boolean;
  appId: string;
  timestamp: string | number;
  nonceStr: string;
  signature: string;
  jsApiList: string[];
}

export interface IWxCallBackType {
  // 微信的方法的类型
  type: string;
  // 返回的参数数据
  data: any;
}

export interface IWxShareToFriend {
  title: string;
  desc: string;
  link: string;
  imgUrl: string;
  success: (res: IWxCallBackType) => void;
  cancel: (res: IWxCallBackType) => void;
}

export interface IWxShareToFriendsCircle {
  title: string;
  link: string;
  imgUrl: string;
  success: (res: IWxCallBackType) => void;
  cancel: (res: IWxCallBackType) => void;
}
