/**
 * 图片合成等操作
 */
import LogUtils from './../logUtils/index'

interface Resourse {
  content: string;
  left: number;
  top: number;
  needRound: boolean;
  type: string;
  fanmily?: string;
  color?: string;
  width?: number;
  maxWidth?: number;
  height?: number;
}

enum FontStyle {
  fanmily = '14px Arial',
  color = '#d4546f'
}

enum TextType {
  Text = 'text',
  Image = 'image'
}

export default class ImageUtils {
  /**
   * 设备像素比
   */
  private pr: number = window.devicePixelRatio

  /**
   * 基于当前屏幕的比例
   */
  public persent: number = 1

  /**
   * canvas的元素
   */
  private canvas: any = null

  /**
   * context canvas 上下文
   */
  private context: any = null

  /**
   * 合并的背景地址
   */
  private mainResource: string = ''

  /**
   * canvas的宽度  实际上数合并背景的宽度
   */
  private canvasWidth: number = 0

  /**
   * canvas的高度  实际上数合并背景的高度
   */
  private canvasHeight: number = 0

  public constructor (backgroud: string) {
    this.mainResource = backgroud
  }

  /**
   * 资源列表 
   */
  private resourceList: Resourse[] = []

  public addSourse (resourse: Resourse): ImageUtils {
    this.resourceList.push(resourse)
    return this
  }

  /**
   * 加载图片
   */
  private async loadResourse (src: string, resourse?: Resourse): Promise<any> {
    const image = new Image()
    image.src = src
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const result = resourse ? {
          ref: image,
          ...resourse
        } : image
        resolve(result)
      }

      image.onerror = () => {
        console.error('err')
        reject()
      }
    })
  }

  private composeMainResource (image: any) {
    console.log('composeMainResource', image)
    const radio = image.width / image.height
    this.canvasWidth = image.width * this.persent
    this.canvasHeight = this.canvasWidth / radio
    // 设置canvas的宽高
    this.canvas.width = this.canvasWidth
    this.canvas.height = this.canvasHeight
    console.log(image)
    console.log(this.context)
    this.context.drawImage(image,
                            0,
                            0,
                            this.canvasWidth,
                            this.canvasHeight)
    this.context.restore()
  }

  private renderResource (image: any) {
    const newImageInfo = {
      left: image.left * this.canvasWidth,
      top: image.top * this.canvasHeight,
      width: image.width * this.canvasWidth,
      height: image.height * this.canvasHeight,
    }
    this.context.save()
    if (image.needRound) {
      // 走圆形绘制图片 此时都视为正方形
      this.context.arc(newImageInfo.width / 2 + newImageInfo.left,
                        newImageInfo.width / 2 + newImageInfo.top,
                        newImageInfo.width / 2,
                        0,
                        Math.PI * 2,
                        false)
      this.context.clip()
      this.context.drawImage(image.ref,
                            newImageInfo.left,
                            newImageInfo.top,
                            newImageInfo.width,
                            newImageInfo.width)
      this.context.restore()
    } else {
      console.log('image.ref', image.ref)
      // 走正常绘制
      this.context.drawImage(image.ref,
                             newImageInfo.left,
                             newImageInfo.top,
                             newImageInfo.width,
                             newImageInfo.height)
      this.context.restore()
    }
  }

  /**
   * 初始化canvas的设置
   * @param { Element } canvas  canvas 元素
   * @return { Promise } 返回
   */
  public async compose (): Promise<any> {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    // 绘制canvas结合背景图片
    const image = new Image()
    image.crossOrigin = 'anonymous'
    this.context.save()
    this.context.scale(1 / this.pr, 1 / this.pr)

    const mainResource = await this.loadResourse(this.mainResource)
    this.composeMainResource(mainResource)

    LogUtils.logSuccess('composeMainResource 执行结束')
    // 开始执行
    const composeQueue: any[] = []
    const resourceL = this.resourceList.reduce((total: any[], item: Resourse, index: number): any[] => {
      if (item.type === TextType.Image) {
        console.log('this.loadResourse(item.content, item)')
        const data = this.loadResourse(item.content, item)
        total.push(data)
        console.log('total', total)
      } else {
        this.context.font = item.fanmily || FontStyle.fanmily
        this.context.fillStyle = item.color || FontStyle.color
        console.log(this.canvasWidth)
        this.context.fillText(item.content,
                              item.left * this.canvasWidth,
                              item.top * this.canvasHeight)
      }
      return total
    }, composeQueue)

    const resolveQueue: any = await Promise.all(resourceL)
    document.body.appendChild(this.canvas)
    LogUtils.logSuccess(this.resourceList)
    // 再次绘制
    await resolveQueue.forEach((item: Resourse) => {
      this.renderResource(item)
    })
  }

  /**
   * canvas合成操作
   * @param canvas
   */
  // printImage (imageInfo: ImageInfo) {
  //   const newImageInfo = {
  //     src: imageInfo.src,
  //     left: imageInfo.left * this.canvasWidth * this.pr,
  //     top: imageInfo.top * this.canvasHeight * this.pr,
  //     width: imageInfo.width * this.canvasWidth * this.pr,
  //     height: imageInfo.height * this.canvasHeight * this.pr,
  //     needRound: imageInfo.needRound,
  //     type: imageInfo.type || TextType.Image
  //   }
  //   // context
  //   const img = new Image()
  //   img.crossOrigin = 'anonymous'
  //   console.log(this.context)
  //   this.context.save()
  //   this.context.scale(1 / this.pr, 1 / this.pr)
  //   img.src = newImageInfo.src
  //   return new Promise ((resolve, reject) => {
  //     img.onload = () => {
  //       if (newImageInfo.needRound) {
  //         // 走圆形绘制图片 此时都视为正方形
  //         this.context.arc(newImageInfo.width / 2 + newImageInfo.left,
  //                     newImageInfo.width / 2 + newImageInfo.top,
  //                     newImageInfo.width / 2,
  //                     0,
  //                     Math.PI * 2,
  //                     false)
  //         this.context.clip()
  //         this.context.drawImage(img,
  //                           newImageInfo.left + this.pr / 2,
  //                           newImageInfo.top + this.pr / 2,
  //                           newImageInfo.width,
  //                           newImageInfo.width)
  //         this.context.restore()
  //       } else {
  //         // 走正常绘制
  //         this.context.drawImage(img, newImageInfo.left,
  //                                newImageInfo.top,
  //                                newImageInfo.width,
  //                                newImageInfo.height)
  //         this.context.restore()
  //       }
  //       resolve()
  //     }
  //     img.onerror = () => {
  //       console.error('err')
  //       reject()
  //     }
  //   })
  // }

  /**
   * @description canvase转换成图片
   * @return { Image } 返回一个new Image的实例
   * @param canvas 
   */
  public convertCanvasToImage (): any {
    const image = new Image()
    image.src = this.canvas.toDataURL('image/png', 1)
    return image
  }
}
