var Bmob = require('../../dist/Bmob-1.6.1.min.js');
var that;
Page({


  data: {

  }, 

  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var userId = getApp().globalData.userId;
    wx.getImageInfo({
      src: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/11/f8659b8940b4306c80ed06bff3ea8691.png',
      success(topImg) {

        wx.getImageInfo({
          src: 'https://bmob-cdn-21786.bmobcloud.com/2019/03/11/07cf8be340b8fa88807da0073ba02f70.jpg',
          success(ourLogo) {
        
            var scene = userId;

            var path = 'pages/assist_B/assist_B';

            let qrData = { path: path, width: 430, interface: 'b', scene: scene, type: 1 }
            Bmob.generateCode(qrData).then(function (res) {
              console.log(res);
              var QRSrc = 'https://bmob-cdn-21786.bmobcloud.com' + res.url.slice(36)
              console.log('QRSrc' + QRSrc)
              wx.getImageInfo({
                src: QRSrc,
                success: function (QRCode) {


                  const ctx = wx.createCanvasContext('shareCanvas');

                  ctx.fillStyle = "white";
                  ctx.fillRect(0, 0, 357, 385);

                  ctx.drawImage(topImg.path, 5, 5, 347, 165);

                  ctx.drawImage(QRCode.path, 133, 186, 90, 90);


                  ctx.setFontSize(14)
                  ctx.fillStyle = '#8F8F8F';
                  ctx.setTextAlign('center')
                  ctx.fillText('长按识别小程序，查看详情', 179, 300);

                  ctx.setLineDash([3, 2]);
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = '#eeeeee';
                  ctx.beginPath();
                  ctx.moveTo(0, 313);
                  ctx.lineTo(400, 313);
                  ctx.stroke();


                  ctx.drawImage(ourLogo.path, 125, 322, 108, 28);

                  ctx.setFontSize(14)
                  ctx.fillStyle = '#8F8F8F';
                  ctx.setTextAlign('center')
                  ctx.fillText('校招实习租房一站式解决', 179, 373);
                  ctx.draw();
                  wx.hideLoading();
                }
              })
            }) 


          }
        })
      }
    })
   
  },

  savePoster: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log("666")
    wx.canvasToTempFilePath({
      destWidth: 1071,
      destHeight: 1155,
      canvasId: 'shareCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              hadSave: true
            });
          },
          fail: (err) => {
            wx.hideLoading();
            wx.showModal({
              title: '授权失败',
              content: '您之前误点了拒绝授权，请允许授权保存此图片至您的相册',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(settingdata) {
                      console.log(settingdata)
                      if (settingdata.authSetting.scope.writePhotosAlbum) {

                      } else {

                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    })


  }



})